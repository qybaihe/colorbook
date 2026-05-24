import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft, Dice6 } from 'lucide-react'
import type { DialogueChoice, DiceFace, RouteNode } from '../data/beijingGame'
import { nodeRoleAssets } from '../data/beijingAssets'
import { assetUrl } from '../data/beijingAssets'
import type { BoardEvent } from '../data/randomEvents'
import { getTurnSceneMeta } from '../data/tileScenes'
import type { AiEndpointConfig, GameMode, JourneyEvent } from '../types'
import { createTheaterMessages } from '../utils/aiPrompts'
import { requestOpenAiText } from '../utils/openAiCompatible'

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
  trackIndex,
  boardEvent,
  diceFace,
  selectedElements,
  photoName,
  activeChoice,
  gameMode,
  aiConfig,
  journeyLog,
  onBack,
  onChoice,
  onMission,
}: {
  node: RouteNode
  trackIndex: number
  boardEvent: BoardEvent | null
  diceFace: DiceFace
  selectedElements: string[]
  photoName?: string
  activeChoice: DialogueChoice | null
  gameMode: GameMode
  aiConfig?: AiEndpointConfig
  journeyLog: JourneyEvent[]
  onBack: () => void
  onChoice: (choice: DialogueChoice) => void
  onMission: () => void
}) {
  const scene = getTurnSceneMeta(node.id, trackIndex, boardEvent)
  const selectedElementKey = selectedElements.join('|')
  const promptElements = useMemo(
    () => (selectedElementKey ? selectedElementKey.split('|') : []),
    [selectedElementKey],
  )
  const elementText = promptElements.length > 0 ? promptElements.join('、') : node.photoTags.slice(0, 3).join('、')
  const DiceIcon = diceFace.icon
  const roleImage = nodeRoleAssets[node.id] ? assetUrl(nodeRoleAssets[node.id]) : ''
  const [aiState, setAiState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    text: string
    error?: string
  }>({ status: 'idle', text: '' })
  const localTypedSource = useMemo(
    () => {
      const eventLine = boardEvent
        ? `\n\n你这回不是按固定路线走来，而是落在「${boardEvent.title}」。${boardEvent.storyHook}`
        : ''
      const opening = `${node.stageLine}${eventLine}\n\n${scene.roleBio}\n\n我从现场看见了 ${elementText}。这次骰面是「${diceFace.name}」，${diceFace.meaning}`

      if (!activeChoice) return opening

      return `你问：「${activeChoice.prompt}」\n\n${node.roleName}答：${activeChoice.reply}\n\n这句回应会写入这一格的现场记录，并影响后续现实任务的语气。`
    },
    [activeChoice, boardEvent, diceFace.meaning, diceFace.name, elementText, node.roleName, node.stageLine, scene.roleBio],
  )
  const typedSource = gameMode === 'ai' && aiState.status === 'success' ? aiState.text : localTypedSource

  useEffect(() => {
    if (gameMode !== 'ai' || !aiConfig) {
      return undefined
    }

    const controller = new AbortController()
    const loadingTimer = window.setTimeout(() => {
      setAiState({ status: 'loading', text: '' })
    }, 0)

    requestOpenAiText({
      config: aiConfig,
      signal: controller.signal,
      maxTokens: activeChoice ? 360 : 520,
      messages: createTheaterMessages({
        node,
        diceFace,
        selectedElements: promptElements,
        photoName,
        roleBio: scene.roleBio,
        activeChoice,
        boardEvent,
        journeyLog,
      }),
    })
      .then((text) => {
        setAiState({ status: 'success', text })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'AI 暂时没有返回'
        setAiState({ status: 'error', text: '', error: message })
      })

    return () => {
      window.clearTimeout(loadingTimer)
      controller.abort()
    }
  }, [
    activeChoice,
    aiConfig,
    boardEvent,
    diceFace,
    gameMode,
    journeyLog,
    node,
    photoName,
    promptElements,
    scene.roleBio,
    selectedElementKey,
  ])

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
          <p className="eyebrow">{node.roleTone}</p>
          <h2>{node.roleName}</h2>
          <small>{node.roleTitle}</small>
          {gameMode === 'ai' && (
            <p className={`ai-live-status ${aiState.status}`}>
              {aiState.status === 'loading' && 'AI 正在根据你的现场行为重写对白...'}
              {aiState.status === 'success' && `AI Mode · ${aiConfig?.model}`}
              {aiState.status === 'error' && `AI 暂未接通，已使用本地兜底：${aiState.error}`}
              {aiState.status === 'idle' && 'AI Mode 已准备'}
            </p>
          )}
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
