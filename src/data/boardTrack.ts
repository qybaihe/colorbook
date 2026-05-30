import type { AssetKey } from './beijingAssets'

export type WalkDirection = 'up' | 'down' | 'left' | 'right'

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
      tone: 'start' | 'dice' | 'photo' | 'sound' | 'fate' | 'echo' | 'create' | 'finale'
      assetKey?: AssetKey
    }

export const trackCells: TrackCell[] = [
  { kind: 'node', nodeId: 'qianmen-entry', column: '1', row: '8' },
  { kind: 'node', nodeId: 'qianmen', column: '2', row: '8' },
  { kind: 'node', nodeId: 'qianmen-photo', column: '3', row: '8' },
  { kind: 'node', nodeId: 'axis', column: '4', row: '8' },
  { kind: 'node', nodeId: 'first-dice-event', column: '5', row: '8' },
  { kind: 'node', nodeId: 'street-sound', column: '6', row: '8' },
  { kind: 'node', nodeId: 'fate-first-turn', column: '6', row: '7' },
  { kind: 'node', nodeId: 'echo-card-unlock', column: '6', row: '6' },
  { kind: 'node', nodeId: 'corner-tower', column: '6', row: '5' },
  { kind: 'node', nodeId: 'hidden-missed-letter', column: '6', row: '4' },
  { kind: 'node', nodeId: 'cocreate-city-seal', column: '6', row: '3' },
  { kind: 'node', nodeId: 'fate-route-choice', column: '6', row: '2' },
  { kind: 'node', nodeId: 'travelogue-midpoint', column: '6', row: '1' },
  { kind: 'node', nodeId: 'echo-overlook-note', column: '5', row: '1' },
  { kind: 'node', nodeId: 'jingshan', column: '4', row: '1' },
  { kind: 'node', nodeId: 'photo-transition', column: '3', row: '1' },
  { kind: 'node', nodeId: 'dice-letter-mood', column: '2', row: '1' },
  { kind: 'node', nodeId: 'shichahai', column: '1', row: '1' },
  { kind: 'node', nodeId: 'old-city-letter', column: '1', row: '2' },
  { kind: 'node', nodeId: 'bell-footsteps', column: '1', row: '3' },
  { kind: 'node', nodeId: 'cocreate-route-sticker', column: '1', row: '4' },
  { kind: 'node', nodeId: 'dice-finale-tone', column: '1', row: '5' },
  { kind: 'node', nodeId: 'reality-check', column: '1', row: '6' },
  { kind: 'node', nodeId: 'echo-return-line', column: '1', row: '7' },
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
