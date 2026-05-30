import { BoardView } from '../components/BoardView'
import { CardHand } from '../components/CardHand'
import { CurrentTurnPanel } from '../components/CurrentTurnPanel'
import type { RouteNode } from '../data/beijingGame'
import { useCityPack } from '../data/cityPackRuntime'

export function BoardScreen({
  currentNode,
  completedNodeIds,
  collectedCardIds,
  walkFromNodeId,
  playerStamina,
  maxPlayerStamina,
  playthroughSeed,
  onOpenNode,
  onFinale,
  onOpenCards,
  onWalkComplete,
}: {
  currentNode: RouteNode
  completedNodeIds: string[]
  collectedCardIds: string[]
  walkFromNodeId: string | null
  playerStamina: number
  maxPlayerStamina: number
  playthroughSeed: string
  onOpenNode: () => void
  onFinale: () => void
  onOpenCards: (cardId: string) => void
  onWalkComplete: () => void
}) {
  const cityPack = useCityPack()

  return (
    <section className="screen board-screen">
      <div className="board-title">
        <div>
          <p className="eyebrow">城市棋盘</p>
          <h1>{cityPack.chapter.city}《{cityPack.chapter.title}》</h1>
        </div>
      </div>

      <BoardView
        currentNode={currentNode}
        completedNodeIds={completedNodeIds}
        walkFromNodeId={walkFromNodeId}
        onOpenNode={onOpenNode}
        onWalkComplete={onWalkComplete}
      />

      <CurrentTurnPanel
        currentNode={currentNode}
        completedNodeIds={completedNodeIds}
        playerStamina={playerStamina}
        maxPlayerStamina={maxPlayerStamina}
        playthroughSeed={playthroughSeed}
        onOpenNode={onOpenNode}
        onFinale={onFinale}
      />

      <CardHand collectedCardIds={collectedCardIds} onSelect={onOpenCards} />
    </section>
  )
}
