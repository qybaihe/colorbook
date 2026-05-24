import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { GameShell } from './components/GameShell'
import {
  createStoryTitle,
  diceFaces,
  routeNodes,
  type DialogueChoice,
} from './data/beijingGame'
import { defaultSelectedCardId } from './data/gameCards'
import { BoardScreen } from './screens/BoardScreen'
import { CardAlbumScreen } from './screens/CardAlbumScreen'
import { EntryScreen } from './screens/EntryScreen'
import { FinaleScreen } from './screens/FinaleScreen'
import { MissionScreen } from './screens/MissionScreen'
import { PhotoTriggerScreen } from './screens/PhotoTriggerScreen'
import { TheaterScreen } from './screens/TheaterScreen'
import type { AiEndpointConfig, ElementMap, GameMode, GameSetup, JourneyEvent, JourneyEventType, PhotoMap, Screen } from './types'
import { playUiSound, playUiSoundSequence, preloadUiSounds } from './utils/sound'

const maxPlayerStamina = 5

function createJourneyEvent({
  type,
  nodeId,
  label,
  detail,
}: {
  type: JourneyEventType
  nodeId?: string
  label: string
  detail?: string
}): JourneyEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    at: new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date()),
    type,
    nodeId,
    label,
    detail,
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>('entry')
  const [gameMode, setGameMode] = useState<GameMode>('local')
  const [aiConfig, setAiConfig] = useState<AiEndpointConfig | undefined>()
  const [journeyLog, setJourneyLog] = useState<JourneyEvent[]>([])
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([])
  const [collectedCardIds, setCollectedCardIds] = useState<string[]>([])
  const [selectedElements, setSelectedElements] = useState<ElementMap>({})
  const [photoNames, setPhotoNames] = useState<PhotoMap>({})
  const [activeDiceId, setActiveDiceId] = useState(diceFaces[1].id)
  const [activeChoice, setActiveChoice] = useState<DialogueChoice | null>(null)
  const [selectedCardId, setSelectedCardId] = useState(defaultSelectedCardId)
  const [memoryLine, setMemoryLine] = useState('我把今天的脚步留在北京的轴线上。')
  const [walkFromNodeId, setWalkFromNodeId] = useState<string | null>(null)
  const [playerStamina, setPlayerStamina] = useState(maxPlayerStamina)

  const currentNode = routeNodes[currentNodeIndex]
  const activeDice = diceFaces.find((face) => face.id === activeDiceId) ?? diceFaces[1]
  const storyTitle = createStoryTitle(collectedCardIds)

  useEffect(() => {
    preloadUiSounds()
  }, [])

  const appendJourneyEvent = useCallback((event: Omit<JourneyEvent, 'id' | 'at'>) => {
    setJourneyLog((current) => [...current, createJourneyEvent(event)].slice(-80))
  }, [])

  const navigate = (nextScreen: Screen) => {
    if (nextScreen === 'photo') {
      playUiSound('cardDraw')
    } else if (nextScreen === 'mission') {
      playUiSound('cardDraw')
    } else if (nextScreen === 'album') {
      playUiSound('cardFlip')
    } else if (nextScreen === 'theater') {
      playUiSound('theater')
    } else if (nextScreen === 'finale') {
      playUiSound('finale')
    } else {
      playUiSound('nav')
    }
    setScreen(nextScreen)
  }

  const startBoard = (setup: GameSetup) => {
    setGameMode(setup.mode)
    setAiConfig(setup.mode === 'ai' ? setup.aiConfig : undefined)
    setJourneyLog([
      createJourneyEvent({
        type: 'mode',
        label: setup.mode === 'ai' ? '选择 AI Mode 开局' : '选择 Local Only 开局',
        detail: setup.mode === 'ai' ? `模型：${setup.aiConfig?.model ?? '未填写'}` : '全程使用本地文案，不调用外部模型',
      }),
    ])
    setWalkFromNodeId(null)
    playUiSoundSequence(['cardShuffle', ['cardDraw', 420]])
    setScreen('board')
  }

  const selectElement = (nodeId: string, element: string) => {
    playUiSound('select')
    setSelectedElements((current) => {
      const existing = current[nodeId] ?? []
      const willSelect = !existing.includes(element)
      const next = existing.includes(element)
        ? existing.filter((item) => item !== element)
        : [...existing, element]
      appendJourneyEvent({
        type: 'element',
        nodeId,
        label: willSelect ? `选择现场元素：${element}` : `取消现场元素：${element}`,
        detail: `当前元素：${next.join('、') || '无'}`,
      })
      return { ...current, [nodeId]: next }
    })
  }

  const rollDice = () => {
    playUiSoundSequence(['dice', ['theater', 520]])
    const next = diceFaces[Math.floor(Math.random() * diceFaces.length)]
    appendJourneyEvent({
      type: 'dice',
      nodeId: currentNode.id,
      label: `掷出时空骰：${next.name}`,
      detail: next.meaning,
    })
    setActiveDiceId(next.id)
    setActiveChoice(null)
    setScreen('theater')
  }

  const completeMission = () => {
    playUiSoundSequence(['mission', ['reward', 170], ['cardUnlock', 360]])
    const nodeElements = selectedElements[currentNode.id] ?? []
    const rewardIds = [...currentNode.rewardCardIds]

    if (
      currentNode.optionalCardIds?.includes('gate') &&
      nodeElements.some((element) => ['门楼', '城门'].includes(element))
    ) {
      rewardIds.push('gate')
    }

    appendJourneyEvent({
      type: 'mission',
      nodeId: currentNode.id,
      label: `提交现实任务：${currentNode.title}`,
      detail: `现场元素：${nodeElements.join('、') || '未选择'}；回声：${memoryLine}`,
    })
    appendJourneyEvent({
      type: 'reward',
      nodeId: currentNode.id,
      label: `领取本格牌组：${currentNode.rewardCardIds.length} 张`,
      detail: rewardIds.join('、'),
    })
    setCollectedCardIds((current) => Array.from(new Set([...current, ...rewardIds])))
    setCompletedNodeIds((current) => Array.from(new Set([...current, currentNode.id])))

    if (currentNodeIndex >= routeNodes.length - 1) {
      window.setTimeout(() => playUiSound('finale'), 620)
      setScreen('finale')
      return
    }

    setWalkFromNodeId(currentNode.id)
    setPlayerStamina((value) => Math.max(0, value - 1))
    setCurrentNodeIndex((index) => index + 1)
    setScreen('board')
  }

  const completeBoardWalk = useCallback(() => {
    setWalkFromNodeId(null)
  }, [])

  const openCardAlbum = (cardId: string) => {
    setSelectedCardId(cardId)
    setScreen('album')
  }

  const resetGame = () => {
    playUiSound('reset')
    window.sessionStorage.removeItem('beijingFinalePlayerName')
    window.sessionStorage.removeItem('beijingFinaleIntroSeen')
    setScreen('entry')
    setGameMode('local')
    setAiConfig(undefined)
    setJourneyLog([])
    setCurrentNodeIndex(0)
    setCompletedNodeIds([])
    setCollectedCardIds([])
    setSelectedElements({})
    setPhotoNames({})
    setActiveDiceId(diceFaces[1].id)
    setActiveChoice(null)
    setSelectedCardId(defaultSelectedCardId)
    setMemoryLine('我把今天的脚步留在北京的轴线上。')
    setWalkFromNodeId(null)
    setPlayerStamina(maxPlayerStamina)
  }

  return (
    <GameShell screen={screen} onNavigate={navigate} onReset={resetGame}>
      {screen === 'entry' && <EntryScreen onStart={startBoard} />}
      {screen === 'board' && (
        <BoardScreen
          currentNode={currentNode}
          completedNodeIds={completedNodeIds}
          collectedCardIds={collectedCardIds}
          walkFromNodeId={walkFromNodeId}
          playerStamina={playerStamina}
          maxPlayerStamina={maxPlayerStamina}
          onOpenNode={() => navigate('photo')}
          onFinale={() => navigate('finale')}
          onOpenCards={openCardAlbum}
          onWalkComplete={completeBoardWalk}
        />
      )}
      {screen === 'photo' && (
        <PhotoTriggerScreen
          node={currentNode}
          selectedElements={selectedElements[currentNode.id] ?? []}
          photoName={photoNames[currentNode.id]}
          onBack={() => navigate('board')}
          onPhoto={(fileName) => {
            playUiSound('cardDraw')
            setPhotoNames((current) => ({ ...current, [currentNode.id]: fileName }))
            appendJourneyEvent({
              type: 'photo',
              nodeId: currentNode.id,
              label: `上传现场照片：${currentNode.title}`,
              detail: fileName,
            })
          }}
          onSelectElement={(element) => selectElement(currentNode.id, element)}
          onRoll={rollDice}
        />
      )}
      {screen === 'theater' && (
        <TheaterScreen
          node={currentNode}
          diceFace={activeDice}
          selectedElements={selectedElements[currentNode.id] ?? []}
          photoName={photoNames[currentNode.id]}
          activeChoice={activeChoice}
          gameMode={gameMode}
          aiConfig={aiConfig}
          journeyLog={journeyLog}
          onBack={() => navigate('photo')}
          onChoice={(choice) => {
            playUiSound('cardFlip')
            appendJourneyEvent({
              type: 'choice',
              nodeId: currentNode.id,
              label: `追问${currentNode.roleName}`,
              detail: choice.prompt,
            })
            setActiveChoice(choice)
          }}
          onMission={() => navigate('mission')}
        />
      )}
      {screen === 'mission' && (
        <MissionScreen
          node={currentNode}
          memoryLine={memoryLine}
          onBack={() => navigate('theater')}
          onMemoryChange={setMemoryLine}
          onComplete={completeMission}
        />
      )}
      {screen === 'album' && (
        <CardAlbumScreen
          collectedCardIds={collectedCardIds}
          selectedCardId={selectedCardId}
          onSelectCard={setSelectedCardId}
        />
      )}
      {screen === 'finale' && (
        <FinaleScreen
          title={storyTitle}
          memoryLine={memoryLine}
          collectedCardIds={collectedCardIds}
          completedNodeIds={completedNodeIds}
          gameMode={gameMode}
          aiConfig={aiConfig}
          journeyLog={journeyLog}
          onReset={resetGame}
          onOpenCards={openCardAlbum}
        />
      )}
    </GameShell>
  )
}

export default App
