import type { AssetKey } from './beijingAssets'

export type WalkDirection = 'up' | 'down' | 'left' | 'right'

export type BoardEventTone = 'start' | 'dice' | 'photo' | 'sound' | 'fate' | 'echo' | 'create' | 'finale'

export type TrackCell =
  | {
      kind: 'node'
      nodeId: string
      column: string
      row: string
    }
  | {
      kind: 'event'
      label: string
      helper: string
      column: string
      row: string
      tone: BoardEventTone
      assetKey?: AssetKey
    }

export const trackCells: TrackCell[] = [
  { kind: 'event', label: '前门入城', helper: '起局', column: '1', row: '8', tone: 'start', assetKey: 'eventFinale' },
  { kind: 'node', nodeId: 'qianmen', column: '2', row: '8' },
  { kind: 'event', label: '拍照任务', helper: '取证', column: '3', row: '8', tone: 'photo', assetKey: 'eventPhoto' },
  { kind: 'node', nodeId: 'axis', column: '4', row: '8' },
  { kind: 'event', label: '时空骰', helper: '掷骰', column: '5', row: '8', tone: 'dice', assetKey: 'eventDice' },
  { kind: 'event', label: '市声任务', helper: '听见', column: '6', row: '8', tone: 'sound', assetKey: 'eventSound' },
  { kind: 'event', label: '命运格', helper: '转折', column: '6', row: '7', tone: 'fate', assetKey: 'eventFate' },
  { kind: 'event', label: '回声卡', helper: '留言', column: '6', row: '6', tone: 'echo', assetKey: 'eventEcho' },
  { kind: 'node', nodeId: 'corner-tower', column: '6', row: '5' },
  { kind: 'event', label: '隐藏支线', helper: '发现', column: '6', row: '4', tone: 'fate', assetKey: 'eventHidden' },
  { kind: 'event', label: '共创格', helper: '生成', column: '6', row: '3', tone: 'create', assetKey: 'eventCreate' },
  { kind: 'event', label: '命运格', helper: '转场', column: '6', row: '2', tone: 'fate', assetKey: 'eventFate' },
  { kind: 'event', label: '时空游记', helper: '终局', column: '6', row: '1', tone: 'finale', assetKey: 'eventFinale' },
  { kind: 'event', label: '回声格', helper: '记录', column: '5', row: '1', tone: 'echo', assetKey: 'eventEcho' },
  { kind: 'node', nodeId: 'jingshan', column: '4', row: '1' },
  { kind: 'event', label: '拍照任务', helper: '构图', column: '3', row: '1', tone: 'photo', assetKey: 'eventPhoto' },
  { kind: 'event', label: '时空骰', helper: '来信', column: '2', row: '1', tone: 'dice', assetKey: 'eventDice' },
  { kind: 'node', nodeId: 'shichahai', column: '1', row: '1' },
  { kind: 'event', label: '旧城短笺', helper: '回应', column: '1', row: '2', tone: 'echo', assetKey: 'eventEcho' },
  { kind: 'event', label: '市声任务', helper: '街声', column: '1', row: '3', tone: 'sound', assetKey: 'eventSound' },
  { kind: 'event', label: '共创格', helper: '卡牌', column: '1', row: '4', tone: 'create', assetKey: 'eventCreate' },
  { kind: 'event', label: '时空骰', helper: '选择', column: '1', row: '5', tone: 'dice', assetKey: 'eventDice' },
  { kind: 'event', label: '命运格', helper: '错过', column: '1', row: '6', tone: 'fate', assetKey: 'eventFate' },
  { kind: 'event', label: '回声格', helper: '返场', column: '1', row: '7', tone: 'echo', assetKey: 'eventEcho' },
]

export const tileButtonImages = [
  '/assets/beijing/tile-buttons/button-01-start-qianmen-entry.png',
  '/assets/beijing/tile-buttons/button-02-landmark-gate-market.png',
  '/assets/beijing/tile-buttons/button-03-photo-gate-market.png',
  '/assets/beijing/tile-buttons/button-04-landmark-axis-view.png',
  '/assets/beijing/tile-buttons/button-05-dice-first-event.png',
  '/assets/beijing/tile-buttons/button-06-sound-street.png',
  '/assets/beijing/tile-buttons/button-07-fate-first-turn.png',
  '/assets/beijing/tile-buttons/button-08-echo-card-unlock.png',
  '/assets/beijing/tile-buttons/button-09-landmark-corner-tower.png',
  '/assets/beijing/tile-buttons/button-10-hidden-missed-letter.png',
  '/assets/beijing/tile-buttons/button-11-cocreate-city-seal.png',
  '/assets/beijing/tile-buttons/button-12-fate-route-choice.png',
  '/assets/beijing/tile-buttons/button-13-travelogue-midpoint.png',
  '/assets/beijing/tile-buttons/button-14-echo-overlook-note.png',
  '/assets/beijing/tile-buttons/button-15-landmark-jingshan.png',
  '/assets/beijing/tile-buttons/button-16-photo-transition.png',
  '/assets/beijing/tile-buttons/button-17-dice-mood-shift.png',
  '/assets/beijing/tile-buttons/button-18-drum-bell-night-watch.png',
  '/assets/beijing/tile-buttons/button-19-old-city-letter.png',
  '/assets/beijing/tile-buttons/button-20-sound-bell-footsteps.png',
  '/assets/beijing/tile-buttons/button-21-cocreate-route-sticker.png',
  '/assets/beijing/tile-buttons/button-22-dice-finale-tone.png',
  '/assets/beijing/tile-buttons/button-23-fate-reality-check.png',
  '/assets/beijing/tile-buttons/button-24-echo-return-line.png',
] as const

export const boardLayout = {
  columns: 6,
  rows: 8,
  outerCells: trackCells.length,
  locationCells: trackCells.filter((cell) => cell.kind === 'node').length,
  taskCells: trackCells.filter((cell) => cell.kind === 'event').length,
  centerColumns: 4,
  centerRows: 6,
} as const

export function getTrackCellIndexByNodeId(nodeId: string) {
  return trackCells.findIndex((cell) => cell.kind === 'node' && cell.nodeId === nodeId)
}

export function getTrackCellLabel(index: number) {
  const cell = trackCells[index]
  if (!cell) return '未知格'
  if (cell.kind === 'node') return cell.nodeId
  return `${cell.label} / ${cell.helper}`
}

export function getTrackWalkIndexes(startIndex: number, targetIndex: number) {
  const total = trackCells.length
  if (startIndex === targetIndex) return [targetIndex]

  const forwardSteps = (targetIndex - startIndex + total) % total
  const backwardSteps = (startIndex - targetIndex + total) % total
  const step = forwardSteps <= backwardSteps ? 1 : -1
  const stepCount = Math.min(forwardSteps, backwardSteps)

  return Array.from({ length: stepCount + 1 }, (_, index) => {
    return (startIndex + step * index + total) % total
  })
}

export function getTrackStepDirection(fromIndex: number, toIndex: number): WalkDirection {
  const fromCell = trackCells[fromIndex]
  const toCell = trackCells[toIndex]
  const fromColumn = Number(fromCell.column)
  const toColumn = Number(toCell.column)
  const fromRow = Number(fromCell.row)
  const toRow = Number(toCell.row)

  if (toColumn > fromColumn) return 'right'
  if (toColumn < fromColumn) return 'left'
  if (toRow > fromRow) return 'down'
  return 'up'
}
