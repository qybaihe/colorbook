import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft, Dice6 } from 'lucide-react'
import { VoiceButton } from '../components/VoiceButton'
import type { DialogueChoice, DiceFace, RouteNode } from '../data/beijingGame'
import { useCityPack } from '../data/cityPackRuntime'
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
  onBack,
  onChoice,
  onMission,
}: {
  node: RouteNode
  diceFace: DiceFace
  selectedElements: string[]
  activeChoice: DialogueChoice | null
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
  const scene = cityPack.scenes.getNodeSceneMeta(node.id)
  const elementText = selectedElements.length > 0 ? selectedElements.join('、') : node.photoTags.slice(0, 3).join('、')
  const DiceIcon = diceFace.icon
  const roleImage = cityPack.roleImages[node.id] ?? ''
  const activeChoiceIndex = activeChoice
    ? node.choices.findIndex((choice) => choice.prompt === activeChoice.prompt)
    : -1
  const activeVoiceSrc = getVoiceLineSrc(
    cityPack.id,
    node.id,
    activeChoiceIndex >= 0 ? `choice-${activeChoiceIndex + 1}` : 'stage',
  )
  const typedSource = useMemo(
    () => {
      const opening = `${node.stageLine}\n\n${scene.roleBio}\n\n我从现场看见了 ${elementText}。这次骰面是「${diceFace.name}」，${diceFace.meaning}`

      if (!activeChoice) return opening

      return `你问：「${activeChoice.prompt}」\n\n${node.roleName}答：${activeChoice.reply}\n\n这句回应会写入这一格的现场记录，并影响后续现实任务的语气。`
    },
    [activeChoice, diceFace.meaning, diceFace.name, elementText, node.roleName, node.stageLine, scene.roleBio],
  )

  useEffect(() => {
    preloadVoiceLines([
      getVoiceLineSrc(cityPack.id, node.id, 'stage'),
      ...node.choices.map((_, index) => getVoiceLineSrc(cityPack.id, node.id, `choice-${index + 1}`)),
    ])
  }, [cityPack.id, node.choices, node.id])

  useEffect(() => {
    window.localStorage.setItem(voicePreferenceKey, voiceEnabled ? 'on' : 'off')
  }, [voiceEnabled])

  useEffect(() => {
    let cancelled = false

    stopVoiceLine()

    if (voiceEnabled) {
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
        <figure className="scene-role-card">
          {roleImage && <img src={roleImage} alt="" draggable={false} />}
          <figcaption>
            <strong>{node.roleName}</strong>
            <span>{node.roleTitle}</span>
          </figcaption>
        </figure>

        <article className="scene-dialogue-card" aria-label={`${node.roleName}台词`}>
          <div className="scene-dialogue-head">
            <div>
              <p className="eyebrow">{node.roleTone}</p>
              <h2>{node.roleName}</h2>
              <small>{node.roleTitle}</small>
            </div>
            <VoiceButton
              enabled={voiceEnabled}
              playing={voicePlaying}
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
          </div>

          <p className="eyebrow">玩家选择卡</p>
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
