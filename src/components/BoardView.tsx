import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  boardLayout,
  getTrackStepDirection,
  getTrackWalkIndexes,
  tileButtonImages,
  trackCells,
  type WalkDirection,
} from '../data/boardTrack'
import { routeNodes } from '../data/beijingGame'
import { playUiSound } from '../utils/sound'
import { AssetSlot } from './AssetSlot'

export function BoardView({
  currentTrackIndex,
  completedNodeIds,
  walkFromTrackIndex,
  onOpenNode,
  onWalkComplete,
}: {
  currentTrackIndex: number
  completedNodeIds: string[]
  walkFromTrackIndex: number | null
  onOpenNode: () => void
  onWalkComplete: () => void
}) {
  const targetIndex = currentTrackIndex
  const startIndex = walkFromTrackIndex ?? targetIndex
  const [walkerIndex, setWalkerIndex] = useState(startIndex)
  const [walkDirection, setWalkDirection] = useState<WalkDirection>('down')
  const [isWalking, setIsWalking] = useState(false)
  const [walkerPoint, setWalkerPoint] = useState<{ x: number; y: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const walkerCell = trackCells[walkerIndex] ?? trackCells[targetIndex]

  const measureCellCenter = useCallback((cell: (typeof trackCells)[number]) => {
    const board = boardRef.current
    if (!board) return null

    const styles = window.getComputedStyle(board)
    const paddingLeft = Number.parseFloat(styles.paddingLeft)
    const paddingRight = Number.parseFloat(styles.paddingRight)
    const paddingTop = Number.parseFloat(styles.paddingTop)
    const paddingBottom = Number.parseFloat(styles.paddingBottom)
    const columnGap = Number.parseFloat(styles.columnGap)
    const rowGap = Number.parseFloat(styles.rowGap)
    const contentWidth = board.clientWidth - paddingLeft - paddingRight
    const contentHeight = board.clientHeight - paddingTop - paddingBottom
    const cellWidth = (contentWidth - columnGap * (boardLayout.columns - 1)) / boardLayout.columns
    const cellHeight = (contentHeight - rowGap * (boardLayout.rows - 1)) / boardLayout.rows
    const column = Number(cell.column) - 1
    const row = Number(cell.row) - 1

    return {
      x: paddingLeft + column * (cellWidth + columnGap) + cellWidth / 2,
      y: paddingTop + row * (cellHeight + rowGap) + cellHeight / 2,
    }
  }, [])

  useEffect(() => {
    const walkIndexes = getTrackWalkIndexes(startIndex, targetIndex)
    const timers: number[] = []

    const startTimer = window.setTimeout(() => {
      setWalkerIndex(walkIndexes[0] ?? targetIndex)

      if (walkIndexes.length <= 1) {
        setIsWalking(false)
        if (walkFromTrackIndex !== null) onWalkComplete()
        return
      }

      setIsWalking(true)
      walkIndexes.slice(1).forEach((nextIndex, stepIndex) => {
        const previousIndex = walkIndexes[stepIndex]
        const timer = window.setTimeout(() => {
          setWalkDirection(getTrackStepDirection(previousIndex, nextIndex))
          setWalkerIndex(nextIndex)
          playUiSound('step')

          if (stepIndex === walkIndexes.length - 2) {
            const doneTimer = window.setTimeout(() => {
              setIsWalking(false)
              onWalkComplete()
            }, 240)
            timers.push(doneTimer)
          }
        }, 160 + stepIndex * 330)
        timers.push(timer)
      })
    }, 0)

    timers.push(startTimer)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [onWalkComplete, startIndex, targetIndex, walkFromTrackIndex])

  useEffect(() => {
    let frame = 0

    const updateWalkerPoint = () => {
      const point = measureCellCenter(walkerCell)
      if (point) setWalkerPoint(point)
    }

    frame = window.requestAnimationFrame(updateWalkerPoint)
    window.addEventListener('resize', updateWalkerPoint)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateWalkerPoint)
    }
  }, [measureCellCenter, walkerCell])

  return (
    <div className="board-view" aria-label="北京中轴入局棋盘" ref={boardRef}>
      <div className="board-map-panel">
        <AssetSlot assetKey="axisCenterMap" accent="#96342e" className="board-map-art" />
      </div>

      {trackCells.map((cell, index) => {
        const tileImage = tileButtonImages[index]
        const occupied = index === walkerIndex

        if (cell.kind === 'node') {
          const node = routeNodes.find((item) => item.id === cell.nodeId)
          if (!node) return null
          const active = index === currentTrackIndex
          const completed = completedNodeIds.includes(node.id)
          return (
            <button
              className={`board-cell image-cell node-cell ${active ? 'active' : ''} ${completed ? 'completed' : ''} ${
                occupied ? 'occupied' : ''
              }`}
              key={node.id}
              type="button"
            aria-label={`${node.title}，${node.subtitle}`}
            aria-disabled={!active}
            onClick={active ? onOpenNode : undefined}
              style={{ gridColumn: cell.column, gridRow: cell.row, '--accent': node.accent } as CSSProperties}
            >
              <img className="board-cell-image" src={tileImage} alt="" draggable={false} />
            </button>
          )
        }

        return (
          <button
            className={`board-cell image-cell event-cell ${cell.tone} ${
              index === currentTrackIndex ? 'active' : ''
            } ${occupied ? 'occupied' : ''}`}
            key={`${cell.label}-${index}`}
            type="button"
            aria-label={`${cell.label}，${cell.helper}`}
            aria-disabled={index === currentTrackIndex ? undefined : 'true'}
            onClick={index === currentTrackIndex ? onOpenNode : undefined}
            style={{ gridColumn: cell.column, gridRow: cell.row } as CSSProperties}
          >
            <img className="board-cell-image" src={tileImage} alt="" draggable={false} />
          </button>
        )
      })}

      <div
        className={`board-walker ${isWalking ? 'walking' : 'idle'} ${walkDirection}`}
        aria-label="当前小人棋子"
        style={
          walkerPoint
            ? ({ left: `${walkerPoint.x}px`, top: `${walkerPoint.y}px` } as CSSProperties)
            : ({ opacity: 0 } as CSSProperties)
        }
      >
        <span className="walker-shadow" aria-hidden="true" />
        <span className="walker-sprite" aria-hidden="true" />
      </div>
    </div>
  )
}
