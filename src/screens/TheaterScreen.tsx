import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft, Dice6 } from 'lucide-react'
import { VoiceButton } from '../components/VoiceButton'
import type { DialogueChoice, DiceFace, RouteNode } from '../data/beijingGame'
import { useCityPack } from '../data/cityPackRuntime'
import { requestTheaterImage, requestTheaterTurn, requestTheaterVoice, type TheaterTurn } from '../utils/theaterAi'
import { buildBeijingEncounterContext } from '../utils/beijingTheater'
import { getVoiceLineSrc, playVoiceLine, preloadVoiceLines, stopVoiceLine } from '../utils/voice'

const voicePreferenceKey = 'time-chess-voice-enabled'

function TypewriterCopy({ text }: { text: string }) {
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    let index = 0

    const timer = window.setInterval(() => {
      index += 1
      setTypedText(text.slice(0, index))
      if (index >= text.length) window.clearInterval(timer)
    }, 18)

    return () => window.clearInterval(timer)
  }, [text])

  return (
    <div className="scene-typewriter-copy">
      {typedText.split('\n').map((line, index) => (
        <p key={`${index}-${line}`}>{line}</p>
      ))}
    </div>
  )
}

export function TheaterScreen({
  node,
  diceFace,
  selectedElements,
  activeChoice,
  memoryLine,
  playthroughSeed,
  onBack,
  onChoice,
  onMission,
}: {
  node: RouteNode
  diceFace: DiceFace
  selectedElements: string[]
  activeChoice: DialogueChoice | null
  memoryLine: string
  playthroughSeed: string
  onBack: () => void
  onChoice: (choice: DialogueChoice) => void
  onMission: () => void
}) {
  const cityPack = useCityPack()
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem(voicePreferenceKey) !== 'off'
  })
  const [voicePlaying, setVoicePlaying] = useState(false)
  const [theaterTurn, setTheaterTurn] = useState<TheaterTurn | null>(null)
  const [turnStatus, setTurnStatus] = useState<'idle' | 'loading' | 'ready' | 'fallback'>('idle')
  const [generatedVoiceSrc, setGeneratedVoiceSrc] = useState<string | null>(null)
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'loading' | 'ready' | 'fallback'>('idle')
  const [evidenceImageSrc, setEvidenceImageSrc] = useState<string | null>(null)
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'ready' | 'fallback'>('idle')
  const scene = cityPack.scenes.getNodeSceneMeta(node.id)
  const elementText = selectedElements.length > 0 ? selectedElements.join('、') : node.photoTags.slice(0, 3).join('、')
  const DiceIcon = diceFace.icon
  const voiceNodeId = node.voiceNodeId ?? node.id
  const aiTheaterEnabled = cityPack.id === 'beijing'
  const beijingEncounter = useMemo(
    () =>
      aiTheaterEnabled
        ? buildBeijingEncounterContext({
            node,
            diceFace,
            selectedElements,
            seed: playthroughSeed,
          })
        : null,
    [aiTheaterEnabled, diceFace, node, playthroughSeed, selectedElements],
  )
  const roleImage = cityPack.roleImages[node.id] ?? cityPack.roleImages[voiceNodeId] ?? ''
  const activeChoiceIndex = activeChoice
    ? node.choices.findIndex((choice) => choice.prompt === activeChoice.prompt)
    : -1
  const staticVoiceSrc = getVoiceLineSrc(
    cityPack.id,
    voiceNodeId,
    activeChoiceIndex >= 0 ? `choice-${activeChoiceIndex + 1}` : 'stage',
  )
  const activeVoiceSrc = aiTheaterEnabled && theaterTurn?.source === 'ai'
    ? generatedVoiceSrc
    : staticVoiceSrc
  const typedSource = useMemo(
    () => {
      if (theaterTurn) {
        const prefix = activeChoice ? `你问：「${activeChoice.prompt}」\n\n` : ''
        const encounterPrefix = beijingEncounter
          ? `本次遭遇：${beijingEncounter.encounterLabel}\n${beijingEncounter.encounterNote}\n\n`
          : ''
        return [
          `${prefix}${encounterPrefix}${theaterTurn.line}`,
          `现场证物：${theaterTurn.evidenceLabel} / ${theaterTurn.memoryTag}`,
        ].join('\n\n')
      }

      const encounterPrelude = beijingEncounter
        ? `本次遭遇：${beijingEncounter.encounterLabel}\n${beijingEncounter.encounterNote}\n${beijingEncounter.speechHint}\n\n`
        : ''
      const opening = `${node.stageLine}\n\n${scene.roleBio}\n\n${encounterPrelude}我从现场看见了 ${elementText}。这次骰面是「${diceFace.name}」，${diceFace.meaning}`

      if (!activeChoice) return opening

      return `你问：「${activeChoice.prompt}」\n\n${node.roleName}答：${activeChoice.reply}\n\n这句回应会写入这一格的现场记录，并影响后续现实任务的语气。`
    },
    [activeChoice, beijingEncounter, diceFace.meaning, diceFace.name, elementText, node.roleName, node.stageLine, scene.roleBio, theaterTurn],
  )

  useEffect(() => {
    preloadVoiceLines([
      getVoiceLineSrc(cityPack.id, voiceNodeId, 'stage'),
      ...node.choices.map((_, index) => getVoiceLineSrc(cityPack.id, voiceNodeId, `choice-${index + 1}`)),
    ])
  }, [cityPack.id, node.choices, voiceNodeId])

  useEffect(() => {
    window.localStorage.setItem(voicePreferenceKey, voiceEnabled ? 'on' : 'off')
  }, [voiceEnabled])

  useEffect(() => {
    if (!aiTheaterEnabled) {
      const resetTimer = window.setTimeout(() => {
        setTheaterTurn(null)
        setTurnStatus('idle')
        setGeneratedVoiceSrc(null)
        setVoiceStatus('idle')
        setEvidenceImageSrc(null)
        setImageStatus('idle')
      }, 0)
      return () => window.clearTimeout(resetTimer)
    }

    const controller = new AbortController()
    const mode = activeChoice ? 'reply' : 'opening'
    const loadingTimer = window.setTimeout(() => {
      if (controller.signal.aborted) return
      setTurnStatus('loading')
      setTheaterTurn(null)
      setGeneratedVoiceSrc(null)
      setVoiceStatus('idle')
      if (mode === 'opening') {
        setEvidenceImageSrc(null)
        setImageStatus('idle')
      }
    }, 0)

    void requestTheaterTurn({
      mode,
      cityId: cityPack.id,
      cityTitle: `${cityPack.chapter.city}${cityPack.chapter.title}`,
      node,
      diceFace,
      selectedElements,
      sceneRoleBio: scene.roleBio,
      sceneTone: scene.sceneTone,
      activeChoice,
      memoryLine,
      encounterLabel: beijingEncounter?.encounterLabel ?? '',
      encounterTitle: beijingEncounter?.encounterTitle ?? '',
      encounterNote: beijingEncounter?.encounterNote ?? '',
      speechHint: beijingEncounter?.speechHint ?? '',
      missionHint: beijingEncounter?.missionHint ?? '',
      fallbackHint: beijingEncounter?.fallbackHint ?? '',
      voiceHint: beijingEncounter?.voiceHint ?? '',
      playthroughSeed,
    }, controller.signal).then((turn) => {
      if (controller.signal.aborted) return
      setTheaterTurn(turn)
      setTurnStatus(turn?.source === 'ai' ? 'ready' : 'fallback')
    }).catch(() => {
      if (controller.signal.aborted) return
      setTheaterTurn(null)
      setTurnStatus('fallback')
    })

    return () => {
      window.clearTimeout(loadingTimer)
      controller.abort()
    }
  }, [
    activeChoice,
    aiTheaterEnabled,
    cityPack.chapter.city,
    cityPack.chapter.title,
    cityPack.id,
    diceFace,
    memoryLine,
    node,
    scene.roleBio,
    scene.sceneTone,
    selectedElements,
    beijingEncounter,
    playthroughSeed,
  ])

  useEffect(() => {
    if (!aiTheaterEnabled || !theaterTurn?.visualPrompt || activeChoice) return

    const controller = new AbortController()
    const loadingTimer = window.setTimeout(() => {
      if (!controller.signal.aborted) setImageStatus('loading')
    }, 0)

    void requestTheaterImage(theaterTurn.visualPrompt, controller.signal).then((src) => {
      if (controller.signal.aborted) return
      setEvidenceImageSrc(src)
      setImageStatus(src ? 'ready' : 'fallback')
    }).catch(() => {
      if (controller.signal.aborted) return
      setImageStatus('fallback')
    })

    return () => {
      window.clearTimeout(loadingTimer)
      controller.abort()
    }
  }, [activeChoice, aiTheaterEnabled, theaterTurn?.visualPrompt])

  useEffect(() => {
    if (!aiTheaterEnabled || theaterTurn?.source !== 'ai' || !theaterTurn.voiceText) {
      const resetTimer = window.setTimeout(() => {
        setGeneratedVoiceSrc(null)
        setVoiceStatus('idle')
      }, 0)
      return () => window.clearTimeout(resetTimer)
    }

    const controller = new AbortController()
    const loadingTimer = window.setTimeout(() => {
      if (controller.signal.aborted) return
      setVoiceStatus('loading')
      setGeneratedVoiceSrc(null)
    }, 0)

    void requestTheaterVoice(cityPack.id, voiceNodeId, theaterTurn.voiceText, controller.signal).then((src) => {
      if (controller.signal.aborted) return
      setGeneratedVoiceSrc(src)
      setVoiceStatus(src ? 'ready' : 'fallback')
    }).catch(() => {
      if (controller.signal.aborted) return
      setVoiceStatus('fallback')
    })

    return () => {
      window.clearTimeout(loadingTimer)
      controller.abort()
    }
  }, [aiTheaterEnabled, cityPack.id, theaterTurn?.source, theaterTurn?.voiceText, voiceNodeId])

  useEffect(() => {
    let cancelled = false

    stopVoiceLine()

    if (voiceEnabled && activeVoiceSrc) {
      void playVoiceLine(
        activeVoiceSrc,
        () => {
          if (!cancelled) setVoicePlaying(false)
        },
        () => {
          if (!cancelled) setVoicePlaying(true)
        },
      )
    }

    return () => {
      cancelled = true
      stopVoiceLine()
    }
  }, [activeVoiceSrc, voiceEnabled])

  const toggleVoice = () => {
    setVoiceEnabled((enabled) => {
      const nextEnabled = !enabled
      if (!nextEnabled) {
        stopVoiceLine()
        setVoicePlaying(false)
      }
      return nextEnabled
    })
  }

  return (
    <section className="screen scene-theater-screen" style={{ '--scene-accent': node.accent } as CSSProperties}>
      <img className="scene-bg-image" src={scene.sceneImage} alt="" draggable={false} />
      <div className="scene-bg-shade theater" aria-hidden="true" />

      <header className="scene-page-header compact">
        <button className="back-button scene-back-button" type="button" onClick={onBack} aria-label="返回拍照触发">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <h1>{node.title}</h1>
        </div>
      </header>

      <main className="scene-theater-main">
        <div className="scene-visual-stack">
          <figure className="scene-role-card">
            {roleImage && <img src={roleImage} alt="" draggable={false} />}
            <figcaption>
              <strong>{node.roleName}</strong>
              <span>{node.roleTitle}</span>
            </figcaption>
          </figure>
          <article className={`scene-evidence-card ${evidenceImageSrc ? 'with-image' : ''}`}>
            {evidenceImageSrc ? (
              <img src={evidenceImageSrc} alt="" draggable={false} />
            ) : (
              <div className="scene-evidence-mark" aria-hidden="true">
                <DiceIcon size={24} />
              </div>
            )}
            <div>
              <strong>{theaterTurn?.evidenceLabel ?? elementText.split('、')[0]}</strong>
              <span>
                {imageStatus === 'loading'
                  ? '证物整理中'
                  : theaterTurn?.memoryTag ?? scene.sceneTone}
              </span>
            </div>
          </article>
        </div>

        <article className="scene-dialogue-card" aria-label={`${node.roleName}台词`}>
          <div className="scene-dialogue-head">
            <div>
              <p className="eyebrow">
                {turnStatus === 'loading' ? '现场导演入场中' : theaterTurn?.mood ?? node.roleTone}
              </p>
              <h2>{node.roleName}</h2>
              <small>{voiceStatus === 'loading' ? '声线正在贴合角色' : node.roleTitle}</small>
            </div>
            <VoiceButton
              enabled={voiceEnabled}
              playing={voicePlaying}
              disabled={voiceStatus === 'loading' && theaterTurn?.source === 'ai'}
              label={`重新打开${node.roleName}自动配音`}
              onToggle={toggleVoice}
            />
          </div>
          <TypewriterCopy key={typedSource} text={typedSource} />
        </article>

        <aside className="scene-choice-panel">
            <div className="scene-dice-badge">
              <Dice6 size={18} aria-hidden="true" />
              <DiceIcon size={28} aria-hidden="true" />
              <strong>{diceFace.name}</strong>
              {beijingEncounter && <small>{beijingEncounter.encounterLabel}</small>}
            </div>

          <p className="eyebrow">玩家选择卡</p>
          {theaterTurn?.missionNudge && (
            <div className="scene-director-note">
              <strong>{theaterTurn.memoryTag}</strong>
              <span>{theaterTurn.missionNudge}</span>
            </div>
          )}
          {node.choices.map((choice) => (
            <button
              className={activeChoice?.prompt === choice.prompt ? 'selected' : ''}
              key={choice.prompt}
              type="button"
              onClick={() => onChoice(choice)}
            >
              <span>{choice.prompt}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
          <button className="scene-roll-action" type="button" onClick={onMission}>
            接受现实任务
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </aside>
      </main>
    </section>
  )
}
