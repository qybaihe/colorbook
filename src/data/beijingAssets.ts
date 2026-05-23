export const assetPaths = {
  entryBoardBox: 'backgrounds/entry-board-box.webp',
  photoTriggerTable: 'backgrounds/photo-trigger-table.webp',
  theaterTable: 'backgrounds/theater-table.webp',
  finaleStorybook: 'backgrounds/finale-storybook.webp',
  finaleCinematicIntro: 'backgrounds/finale-cinematic-intro.png',
  cardAlbumTable: 'backgrounds/card-album-table.webp',
  missionTable: 'backgrounds/mission-table.webp',
  mainBoardMap: 'board/main-board-map.webp',
  axisCenterMap: 'board/axis-center-map.webp',
  routePreviewStrip: 'board/route-preview-strip.webp',
  qianmenTile: 'landmarks/tile-qianmen.webp',
  axisTile: 'landmarks/tile-axis.webp',
  cornerTowerTile: 'landmarks/tile-corner-tower.webp',
  jingshanTile: 'landmarks/tile-jingshan.webp',
  shichahaiTile: 'landmarks/tile-shichahai.webp',
  eventPhoto: 'landmarks/event-photo.webp',
  eventDice: 'landmarks/event-dice.webp',
  eventFate: 'landmarks/event-fate.webp',
  eventSound: 'landmarks/event-sound.webp',
  eventCreate: 'landmarks/event-create.webp',
  eventHidden: 'landmarks/event-hidden.webp',
  eventEcho: 'landmarks/event-echo.webp',
  eventFinale: 'landmarks/event-finale.webp',
  qingMerchant: 'roles/qing-merchant.webp',
  cityCraftsman: 'roles/city-craftsman.webp',
  palacePainter: 'roles/palace-painter.webp',
  cityHistorian: 'roles/city-historian.webp',
  hutongResident: 'roles/hutong-resident.webp',
  cardGate: 'cards/card-gate.webp',
  cardTrade: 'cards/card-trade.webp',
  cardAxis: 'cards/card-axis.webp',
  cardPalace: 'cards/card-palace.webp',
  cardOverlook: 'cards/card-overlook.webp',
  cardLife: 'cards/card-life.webp',
  cardEcho: 'cards/card-echo.webp',
  cardBack: 'cards/card-back.webp',
  cardLocked: 'cards/card-locked.webp',
  uploadFrame: 'ui/upload-frame.webp',
  choiceCard: 'ui/choice-card.webp',
  dialogueFrame: 'ui/dialogue-frame.webp',
  rewardGlow: 'ui/reward-glow.webp',
  completionStamp: 'ui/completion-stamp.webp',
  posterTemplateA: 'ui/poster-template-a.webp',
  posterTemplateB: 'ui/poster-template-b.webp',
} as const

export type AssetKey = keyof typeof assetPaths

export const assetUrl = (key: AssetKey) => `/assets/beijing/${assetPaths[key]}`

export const nodeLandmarkAssets: Record<string, AssetKey> = {
  qianmen: 'qianmenTile',
  axis: 'axisTile',
  'corner-tower': 'cornerTowerTile',
  jingshan: 'jingshanTile',
  shichahai: 'shichahaiTile',
}

export const nodeRoleAssets: Record<string, AssetKey> = {
  qianmen: 'qingMerchant',
  axis: 'cityCraftsman',
  'corner-tower': 'palacePainter',
  jingshan: 'cityHistorian',
  shichahai: 'hutongResident',
}

export const cardAssets: Record<string, AssetKey> = {
  gate: 'cardGate',
  trade: 'cardTrade',
  axis: 'cardAxis',
  palace: 'cardPalace',
  overlook: 'cardOverlook',
  life: 'cardLife',
  echo: 'cardEcho',
}
