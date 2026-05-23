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
import type { ElementMap, PhotoMap, Screen } from './types'
import { playUiSound, playUiSoundSequence, preloadUiSounds } from './utils/sound'

const maxPlayerStamina = 5

function App() {
  const [screen, setScreen] = useState<Screen>('entry')
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

  const startBoard = () => {
    setWalkFromNodeId(null)
    playUiSoundSequence(['cardShuffle', ['cardDraw', 420]])
    setScreen('board')
  }

  const selectElement = (nodeId: string, element: string) => {
    playUiSound('select')
    setSelectedElements((current) => {
      const existing = current[nodeId] ?? []
      const next = existing.includes(element)
        ? existing.filter((item) => item !== element)
        : [...existing, element]
      return { ...current, [nodeId]: next }
    })
  }

  const rollDice = () => {
    playUiSoundSequence(['dice', ['theater', 520]])
    const next = diceFaces[Math.floor(Math.random() * diceFaces.length)]
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
          activeChoice={activeChoice}
          onBack={() => navigate('photo')}
          onChoice={(choice) => {
            playUiSound('cardFlip')
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
          onReset={resetGame}
          onOpenCards={openCardAlbum}
        />
      )}
    </GameShell>
  )
}

export default App
