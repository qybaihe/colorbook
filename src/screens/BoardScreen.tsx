import { BoardView } from '../components/BoardView'
import { CardHand } from '../components/CardHand'
import { CurrentTurnPanel } from '../components/CurrentTurnPanel'
import type { RouteNode } from '../data/beijingGame'
import type { BoardEvent, MoveResult } from '../data/randomEvents'

export function BoardScreen({
  currentNode,
  currentTrackIndex,
  activeBoardEvent,
  lastMove,
  completedNodeIds,
  collectedCardIds,
  walkFromTrackIndex,
  playerStamina,
  maxPlayerStamina,
  onOpenNode,
  onFinale,
  onOpenCards,
  onWalkComplete,
}: {
  currentNode: RouteNode
  currentTrackIndex: number
  activeBoardEvent: BoardEvent | null
  lastMove: MoveResult | null
  completedNodeIds: string[]
  collectedCardIds: string[]
  walkFromTrackIndex: number | null
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
        currentTrackIndex={currentTrackIndex}
        completedNodeIds={completedNodeIds}
        walkFromTrackIndex={walkFromTrackIndex}
        onOpenNode={onOpenNode}
        onWalkComplete={onWalkComplete}
      />

      <CurrentTurnPanel
        currentNode={currentNode}
        currentTrackIndex={currentTrackIndex}
        activeBoardEvent={activeBoardEvent}
        lastMove={lastMove}
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
