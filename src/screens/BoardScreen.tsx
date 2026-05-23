import { BoardView } from '../components/BoardView'
import { CardHand } from '../components/CardHand'
import { CurrentTurnPanel } from '../components/CurrentTurnPanel'
import type { RouteNode } from '../data/beijingGame'

export function BoardScreen({
  currentNode,
  completedNodeIds,
  collectedCardIds,
  walkFromNodeId,
  playerStamina,
  maxPlayerStamina,
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
  onOpenNode: () => void
  onFinale: () => void
  onOpenCards: (cardId: string) => void
  onWalkComplete: () => void
}) {
  return (
    <section className="screen board-screen">
      <div className="board-title">
        <div>
          <p className="eyebrow">城市棋盘</p>
          <h1>北京《中轴入局》</h1>
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
        onOpenNode={onOpenNode}
        onFinale={onFinale}
      />

      <CardHand collectedCardIds={collectedCardIds} onSelect={onOpenCards} />
    </section>
  )
}
