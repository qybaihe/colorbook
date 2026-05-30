import * as beijingGame from './beijingGame'
import * as beijingBoard from './boardTrack'
import * as beijingScenes from './tileScenes'
import * as beijingTasks from './taskPlans'
import {
  cardCategoryMeta,
  gameCards as beijingCards,
  type GameCard,
  type GameCardCategory,
} from './gameCards'
import { assetPaths, type AssetKey } from './beijingAssets'
import * as tianjinGame from './tianjinGame'
import * as tianjinBoard from './tianjinBoardTrack'
import * as tianjinScenes from './tianjinTileScenes'
import * as tianjinTasks from './tianjinTaskPlans'
import { tianjinGameCards } from './tianjinCards'
import * as shanghaiGame from './shanghaiGame'
import * as shanghaiBoard from './shanghaiBoardTrack'
import * as shanghaiScenes from './shanghaiTileScenes'
import * as shanghaiTasks from './shanghaiTaskPlans'
import { shanghaiGameCards } from './shanghaiCards'
import type { RouteNode } from './beijingGame'
import type { TrackCell } from './boardTrack'
import type { TileSceneMeta } from './tileScenes'
import type { NodeTaskPlan, TaskButtonKind } from './taskPlans'

export type CityId = 'beijing' | 'tianjin' | 'shanghai'

export type FinaleNodeCopy = {
  routeLine: string
  stamp: string
  sensory: string
  realization: string
  future: string
}

type TravelogueInput = {
  title: string
  playerName: string
  memoryLine: string
  completedNodes: RouteNode[]
  earnedCards: GameCard[]
}

type TravelogueOutput = {
  typedStory: string
  saveText: string
  truth: string
}

export type CityPack = {
  id: CityId
  assetBase: string
  accent: string
  chapter: typeof beijingGame.chapter
  bgmSrc: string
  defaultMemoryLine: string
  routeNodes: RouteNode[]
  diceFaces: typeof beijingGame.diceFaces
  createStoryTitle: (cardIds: string[]) => string
  assetPaths: typeof assetPaths
  assetUrl: (key: AssetKey) => string
  roleImages: Record<string, string>
  roleCardImages: Record<string, string>
  board: {
    trackCells: TrackCell[]
    tileButtonImages: readonly string[]
    layout: typeof beijingBoard.boardLayout
  }
  scenes: {
    nodeSceneMeta: Record<string, TileSceneMeta>
    getNodeSceneMeta: (nodeId: string) => TileSceneMeta
  }
  tasks: {
    taskKindLabels: Record<TaskButtonKind, string>
    nodeTaskPlans: Record<string, NodeTaskPlan>
    getNodeTaskPlan: (nodeId: string) => NodeTaskPlan | undefined
  }
  cards: {
    cardCategoryMeta: typeof cardCategoryMeta
    playableCardCategories: GameCardCategory[]
    gameCards: GameCard[]
    cultureCards: GameCard[]
    defaultSelectedCardId: string
    getGameCard: (cardId: string) => GameCard | undefined
    getGameCards: (cardIds: string[]) => GameCard[]
    getGameCardsByCategory: (category: GameCardCategory) => GameCard[]
    getCardsForHand: (collectedCardIds: string[]) => GameCard[]
    getGameCardImageUrl: (card: GameCard) => string
  }
  finale: {
    playerNameStorageKey: string
    introSeenStorageKey: string
    ariaLabel: string
    eyebrow: string
    cinematicTitle: string
    emptyCards: string
    writingStatus: string
    defaultSaveTitle: string
    nodeCopy: Record<string, FinaleNodeCopy>
    createTravelogue: (input: TravelogueInput) => TravelogueOutput
  }
}

function createCardApi(gameCards: GameCard[], assetBase: string): CityPack['cards'] {
  const cultureCards = gameCards.filter((card) => card.category === 'culture')
  const playableCardCategories: GameCardCategory[] = ['culture', 'event', 'achievement', 'clue', 'utility', 'role']

  const getGameCard = (cardId: string) => gameCards.find((card) => card.id === cardId)
  const getGameCards = (cardIds: string[]) =>
    cardIds.map((cardId) => getGameCard(cardId)).filter((card): card is GameCard => Boolean(card))
  const getGameCardsByCategory = (category: GameCardCategory) => gameCards.filter((card) => card.category === category)
  const getCardsForHand = (collectedCardIds: string[]) => {
    const collected = getGameCards(collectedCardIds)
    const additions = collected.filter((card) => card.category !== 'culture')
    return Array.from(new Map([...cultureCards, ...additions].map((card) => [card.id, card])).values())
  }

  return {
    cardCategoryMeta,
    playableCardCategories,
    gameCards,
    cultureCards,
    defaultSelectedCardId: gameCards[0].id,
    getGameCard,
    getGameCards,
    getGameCardsByCategory,
    getCardsForHand,
    getGameCardImageUrl: (card) => `/assets/${assetBase}/${card.image}`,
  }
}

function getNodeCards(node: RouteNode, cards: GameCard[]) {
  const nodeCardIds = new Set([...node.rewardCardIds, ...(node.optionalCardIds ?? [])])
  return cards
    .filter((card) => nodeCardIds.has(card.id) || card.nodeAffinity?.includes(node.id))
    .slice(0, 4)
}

const beijingFinaleNodeCopy: Record<string, FinaleNodeCopy> = {
  qianmen: {
    routeLine: '我去了前门',
    stamp: '入城',
    sensory: '招牌、人流、铺面的吆喝和城门的影子一起涌来',
    realization: '清末掌柜把柜台一拍，城门的规矩便落成街面的热气。我懂得，北京的历史会藏进招牌、找零声、南来北往的眼神里。',
    future: '把“人为什么愿意来到这里”这个问题留给未来。',
  },
  axis: {
    routeLine: '我沿着中轴取景',
    stamp: '定向',
    sensory: '道路、天空和左右平衡把视线轻轻拉直',
    realization: '营城匠师用手指比出一条线，门、路、天光、人的站位都被它轻轻安放。所谓中轴，是城市给行人递来的定盘星。',
    future: '把“方向也会成为记忆”这件事留给未来。',
  },
  'corner-tower': {
    routeLine: '我看见宫城水影',
    stamp: '照影',
    sensory: '屋檐、水面、倒影和今天举起手机的手落进同一个画面',
    realization: '宫廷画师说，水能替宫城保管另一重天光。屋檐入水，旧日便有了回身的姿态；我举起今天的眼睛，同它隔着水纹相认。',
    future: '把“旧时光也需要新的目光”留给未来。',
  },
  jingshan: {
    routeLine: '我登上景山观城',
    stamp: '观城',
    sensory: '树影、宫城、远天和一条若隐若现的中轴展开成城市长卷',
    realization: '观城史官把风翻成一卷：先有宫城的脊背，再铺开树影、屋顶、人群和远天。站到高处，我看见秩序生出缝隙，缝隙里住着生活。',
    future: '把“看不见的线仍会牵引人”留给未来。',
  },
  shichahai: {
    routeLine: '我走到鼓楼 / 什刹海 / 胡同回声',
    stamp: '回声',
    sensory: '钟声、水声、车铃、门响和晚饭前的说话声都近了',
    realization: '胡同居民把话说进暮色：门响、车铃、水声和锅铲声，各自守着一户人家的时间。大历史走得很响，日子更会留人。',
    future: '把“城市最后要回到人间烟火”留给未来。',
  },
}

const tianjinFinaleNodeCopy: Record<string, FinaleNodeCopy> = {
  'jiefang-bridge': {
    routeLine: '我从解放桥拆开来信',
    stamp: '启程',
    sensory: '桥影、河水、路牌和往来人流一起涌来',
    realization: '海河邮差把第一枚邮戳按在纸上，桥不再只是过河的结构，而是城市把消息递给今天的手。我懂得，天津的路常常沿水展开。',
    future: '把“河为什么像一条路”这个问题留给未来。',
  },
  'italian-quarter': {
    routeLine: '我在万国街巷读建筑语法',
    stamp: '翻译',
    sensory: '拱窗、街灯、旧立面和转角把视线轻轻放慢',
    realization: '建筑译员说，风格只是来处，使用才是语法。门窗被天津的风和人声重新读过以后，建筑就成了城市自己的句子。',
    future: '把“外来的风格如何变成本地日常”留给未来。',
  },
  'ancient-culture-street': {
    routeLine: '我走进古文化街的香火',
    stamp: '愿望',
    sensory: '年画、匾额、摊铺、颜色和人声挤在一起',
    realization: '年画摊主把颜色摊开，愿望先于文字亮起来。香火把心愿聚在一起，市井把日子摊在眼前，老街因此不是布景，而是仍在使用的生活。',
    future: '把“愿望为什么总要画出来”留给未来。',
  },
  wudadao: {
    routeLine: '我在五大道慢行',
    stamp: '分寸',
    sensory: '门窗、院墙、街树和远处天空一层层展开',
    realization: '洋楼管家提醒我慢一点。城市有时不把故事讲完，只把门窗、树影和院墙放在刚好的距离里，让路过的人自己补上后半句。',
    future: '把“慢行也是一种阅读”留给未来。',
  },
  'tianjin-eye': {
    routeLine: '我抵达天津之眼的夜航回信',
    stamp: '回信',
    sensory: '夜灯、河面、桥影、船声和远处人群都近了',
    realization: '夜航船长让船声慢慢压低，白天的桥退到身后，河面开始替城市回信。我终于明白，棋盘走完了，路还在水光里继续。',
    future: '把“城市会在夜里回信”留给未来。',
  },
}

const shanghaiFinaleNodeCopy: Record<string, FinaleNodeCopy> = {
  'node-doorplate': {
    routeLine: '我从第一张门牌进入上海',
    stamp: '门牌',
    sensory: '门牌、门洞、招牌和入口灯光先亮了起来',
    realization: '门牌递信人把第一枚唱针放下。上海不是从远处的天际线开始，而是从一块能被看见的门牌、一处可停留的入口和一盏还在营业的灯开始。',
    future: '把“城市入口也会发声”留给未来。',
  },
  'node-street-sound': {
    routeLine: '我在街口采了一段人流',
    stamp: '街声',
    sensory: '脚步、人声、店门开合和车流边缘叠成底噪',
    realization: '街声录音师提醒我先听再看。人群不是必须被拍下的画面，也可以成为一段不冒犯任何人的声音边界。',
    future: '把“热闹也可以被温柔记录”留给未来。',
  },
  'node-bund-reflection': {
    routeLine: '我在外滩看见江面倒影',
    stamp: '倒影',
    sensory: '江面、楼影、玻璃和远近关系把空间折成几层',
    realization: '外滩摄影师把构图压低到水面上。江面让建筑慢下来，玻璃让人流被重新分层，于是一张照片里出现了两个时间。',
    future: '把“倒影会替城市保存另一面”留给未来。',
  },
  'node-window': {
    routeLine: '我在橱窗里看见街面反光',
    stamp: '橱窗',
    sensory: '玻璃、灯光、陈列和路过的影子互相接话',
    realization: '橱窗布景师说，橱窗不是只给外面看里面，它也把外面的街收进来。透明和反射一起工作，城市就有了前景和幕后。',
    future: '把“玻璃也会剪辑生活”留给未来。',
  },
  'node-shikumen': {
    routeLine: '我在石库门转角停了一会儿',
    stamp: '门环',
    sensory: '门环、砖缝、窗边和路牌把日常留在边角',
    realization: '石库门住客没有讲长课，只指给我看门、砖、窗和靠过的手。原来生活不是被陈列出来的，它一直藏在进出和等待里。',
    future: '把“一扇门保存的不只年代”留给未来。',
  },
  'node-finale': {
    routeLine: '我把夜色压成弄堂回声唱片',
    stamp: '唱片',
    sensory: '霓虹、河面、窗影和已获得的卡牌回到同一张封面',
    realization: '夜色放映员把白天的线索收回唱片，城市剪辑师只保留最亮的切片。门牌是开场，街声是底噪，橱窗是前景，江面是转场，霓虹是最后落下的唱针。',
    future: '把“今天也可以成为一张唱片”留给未来。',
  },
}

function createBeijingTravelogue({
  title,
  playerName,
  memoryLine,
  completedNodes,
  earnedCards,
}: TravelogueInput): TravelogueOutput {
  const storyNodes = completedNodes.length ? completedNodes : beijingGame.routeNodes.slice(0, 1)
  const roleNames = storyNodes.map((node) => node.roleName).join('、')
  const cardNames = earnedCards.map((card) => card.name)
  const intro = completedNodes.length
    ? `亲爱的北京：我是${playerName}。我把这一局棋收进纸页。格子退到身后，${storyNodes.map((node) => node.subtitle).join('、')}次第亮起，像一串沿中轴落下的朱印。`
    : `亲爱的北京：我是${playerName}。这封短笺尚未写完。我刚把棋子放到中轴线上，纸页已经等着第一阵脚步声。`

  const nodeParagraphs = storyNodes.map((node) => {
    const copy = beijingFinaleNodeCopy[node.id]
    const nodeCards = getNodeCards(node, earnedCards)
    const cardLine = nodeCards.length
      ? `我把${nodeCards.map((card) => `《${card.name}》`).join('、')}夹进这一页，像把一枚枚小小的城印按在旅途中。`
      : '这一页先留出空白，等下一次脚步把它点亮。'

    return `${copy.routeLine}。我在那里遇见${node.roleName}，${copy.sensory}。${copy.realization}${cardLine}`
  })

  const cardSummary = cardNames.length
    ? `卡册里的${cardNames.slice(0, 6).join('、')}${cardNames.length > 6 ? `等 ${cardNames.length} 张牌` : ''}，替我保存了这一程的暗号：门、线、水影、高处、钟声，以及人间日常。`
    : '卡册还没有真正亮起来，但路线已经把门、线、水影、高处和人的日常摆在了我面前。'

  const truth = storyNodes.length >= 5
    ? '这一局的真相是：北京中轴有礼制的骨，也有买卖的热、宫墙的影、高处的风、晚饭前的灯。它把宏大的城市递回具体的人。'
    : '这一局还在途中，但我已经听见一个答案：中轴写在地图上，也落在行人的脚步里。'

  const ending = `如果要把什么留给未来，我会留下这句话：“${memoryLine}” 也留下我遇见的${roleNames || '陌生人'}、我听见的城市回声，以及一个很小的愿望：后来的人再走到这里时，眼前有景，耳边有声，心里有一条能回家的北京。`
  const typedStory = [intro, ...nodeParagraphs, cardSummary, truth, ending].join('\n\n')
  const saveText = [
    `《${title}》`,
    '',
    `署名：${playerName}`,
    `路线：${storyNodes.map((node) => `${beijingFinaleNodeCopy[node.id].routeLine}（${node.subtitle}）`).join(' -> ')}`,
    `遇见：${roleNames || '尚未遇见'}`,
    `卡牌：${cardNames.join('、') || '尚未点亮的卡牌'}`,
    `回声：${memoryLine}`,
    '',
    typedStory,
  ].join('\n')

  return { typedStory, saveText, truth }
}

function createTianjinTravelogue({
  title,
  playerName,
  memoryLine,
  completedNodes,
  earnedCards,
}: TravelogueInput): TravelogueOutput {
  const storyNodes = completedNodes.length ? completedNodes : tianjinGame.routeNodes.slice(0, 1)
  const roleNames = storyNodes.map((node) => node.roleName).join('、')
  const cardNames = earnedCards.map((card) => card.name)
  const intro = completedNodes.length
    ? `亲爱的天津：我是${playerName}。我把这一封海河来信收进纸页。格子退到身后，${storyNodes.map((node) => node.subtitle).join('、')}次第亮起，像一串沿河落下的蓝色邮戳。`
    : `亲爱的天津：我是${playerName}。这封回信尚未写完。我刚把棋子放到海河边，纸页已经等着第一阵桥风。`

  const nodeParagraphs = storyNodes.map((node) => {
    const copy = tianjinFinaleNodeCopy[node.id]
    const nodeCards = getNodeCards(node, earnedCards)
    const cardLine = nodeCards.length
      ? `我把${nodeCards.map((card) => `《${card.name}》`).join('、')}夹进这一页，像把一枚枚小小的河岸印章按在旅途中。`
      : '这一页先留出空白，等下一次脚步把它点亮。'

    return `${copy.routeLine}。我在那里遇见${node.roleName}，${copy.sensory}。${copy.realization}${cardLine}`
  })

  const cardSummary = cardNames.length
    ? `卡册里的${cardNames.slice(0, 6).join('、')}${cardNames.length > 6 ? `等 ${cardNames.length} 张牌` : ''}，替我保存了这一程的暗号：桥、窗、香火、树影、夜灯，以及河岸日常。`
    : '卡册还没有真正亮起来，但路线已经把桥、窗、香火、树影和夜灯摆在了我面前。'

  const truth = storyNodes.length >= 5
    ? '这一局的真相是：天津不是只靠一处地标被记住，而是靠海河的流动、街巷的翻译、香火的愿望、洋楼的分寸和夜航的回声，把城市递回具体的人。'
    : '这一局还在途中，但我已经听见一个答案：海河写在地图上，也落在行人的脚步和河风里。'

  const ending = `如果要把什么留给未来，我会留下这句话：“${memoryLine}” 也留下我遇见的${roleNames || '陌生人'}、我听见的海河回声，以及一个很小的愿望：后来的人再走到这里时，眼前有桥，耳边有风，心里有一封能寄回天津的信。`
  const typedStory = [intro, ...nodeParagraphs, cardSummary, truth, ending].join('\n\n')
  const saveText = [
    `《${title}》`,
    '',
    `署名：${playerName}`,
    `路线：${storyNodes.map((node) => `${tianjinFinaleNodeCopy[node.id].routeLine}（${node.subtitle}）`).join(' -> ')}`,
    `遇见：${roleNames || '尚未遇见'}`,
    `卡牌：${cardNames.join('、') || '尚未点亮的卡牌'}`,
    `回声：${memoryLine}`,
    '',
    typedStory,
  ].join('\n')

  return { typedStory, saveText, truth }
}

function createShanghaiTravelogue({
  title,
  playerName,
  memoryLine,
  completedNodes,
  earnedCards,
}: TravelogueInput): TravelogueOutput {
  const storyNodes = completedNodes.length ? completedNodes : shanghaiGame.routeNodes.slice(0, 1)
  const roleNames = storyNodes.map((node) => node.roleName).join('、')
  const cardNames = earnedCards.map((card) => card.name)
  const intro = completedNodes.length
    ? `亲爱的上海：我是${playerName}。我把这一局弄堂回声收进唱片页。格子退到身后，${storyNodes.map((node) => node.subtitle).join('、')}次第亮起，像一串沿街落下的海派音轨。`
    : `亲爱的上海：我是${playerName}。这张唱片尚未开始旋转。我刚把棋子放到第一张门牌前，街区已经等着第一声脚步。`

  const nodeParagraphs = storyNodes.map((node) => {
    const copy = shanghaiFinaleNodeCopy[node.id]
    const nodeCards = getNodeCards(node, earnedCards)
    const cardLine = nodeCards.length
      ? `我把${nodeCards.map((card) => `《${card.name}》`).join('、')}夹进这一轨，像把几枚城市切片压进唱片纹路里。`
      : '这一轨先留出一点空白，等下一次门牌、玻璃或街声把它补上。'

    return `${copy.routeLine}。我在那里遇见${node.roleName}，${copy.sensory}。${copy.realization}${cardLine}`
  })

  const cardSummary = cardNames.length
    ? `卡册里的${cardNames.slice(0, 7).join('、')}${cardNames.length > 7 ? `等 ${cardNames.length} 张牌` : ''}，替我保存了这一局的五条音轨：门牌、橱窗、江边、街声和霓虹。`
    : '卡册还没有真正亮起来，但门牌、橱窗、江边、街声和霓虹已经在唱片边缘排好了位置。'

  const completeEnough = storyNodes.length >= shanghaiGame.routeNodes.length
  const truth = completeEnough
    ? '这一局的真相是：上海不只靠地标被记住，也靠一块门牌、一面玻璃、一阵街声、一层倒影和一盏夜灯，把国际化都市递回具体的人。'
    : '这一局还在途中，但我已经听见一个答案：上海的现代感不只在高楼里，也在门洞、窗边和路过的脚步里。'

  const ending = `如果要把什么留给未来，我会留下这句话：“${memoryLine}” 也留下我遇见的${roleNames || '陌生人'}、我听见的街声和夜色，以及一个很小的愿望：后来的人再走到这里时，眼前有门牌，耳边有脚步，心里有一张能重新播放上海的唱片。`
  const typedStory = [intro, ...nodeParagraphs, cardSummary, truth, ending].join('\n\n')
  const saveText = [
    `《${title}》`,
    '',
    `署名：${playerName}`,
    `路线：${storyNodes.map((node) => `${shanghaiFinaleNodeCopy[node.id].routeLine}（${node.subtitle}）`).join(' -> ')}`,
    `遇见：${roleNames || '尚未遇见'}`,
    `卡牌：${cardNames.join('、') || '尚未点亮的卡牌'}`,
    `回声：${memoryLine}`,
    '',
    typedStory,
  ].join('\n')

  return { typedStory, saveText, truth }
}

function makeAssetUrl(assetBase: string) {
  return (key: AssetKey) => `/assets/${assetBase}/${assetPaths[key]}`
}

export const cityPacks: Record<CityId, CityPack> = {
  beijing: {
    id: 'beijing',
    assetBase: 'beijing',
    accent: '#96342e',
    chapter: beijingGame.chapter,
    bgmSrc: '/audio/beijing-axis-bgm.wav',
    defaultMemoryLine: '我把今天的脚步留在北京的轴线上。',
    routeNodes: beijingGame.routeNodes,
    diceFaces: beijingGame.diceFaces,
    createStoryTitle: beijingGame.createStoryTitle,
    assetPaths,
    assetUrl: makeAssetUrl('beijing'),
    roleImages: {
      qianmen: '/assets/beijing/roles/qing-merchant.webp',
      axis: '/assets/beijing/roles/city-craftsman.webp',
      'corner-tower': '/assets/beijing/roles/palace-painter.webp',
      jingshan: '/assets/beijing/roles/city-historian.webp',
      shichahai: '/assets/beijing/roles/hutong-resident.webp',
    },
    roleCardImages: {
      qianmen: '/assets/beijing/role-cards/role-qianmen-merchant.png',
      axis: '/assets/beijing/role-cards/role-axis-craftsman.png',
      'corner-tower': '/assets/beijing/role-cards/role-palace-painter.png',
      jingshan: '/assets/beijing/role-cards/role-city-historian.png',
      shichahai: '/assets/beijing/role-cards/role-hutong-resident.png',
    },
    board: {
      trackCells: beijingBoard.trackCells,
      tileButtonImages: beijingBoard.tileButtonImages,
      layout: beijingBoard.boardLayout,
    },
    scenes: {
      nodeSceneMeta: beijingScenes.nodeSceneMeta,
      getNodeSceneMeta: beijingScenes.getNodeSceneMeta,
    },
    tasks: {
      taskKindLabels: beijingTasks.taskKindLabels,
      nodeTaskPlans: beijingTasks.nodeTaskPlans,
      getNodeTaskPlan: beijingTasks.getNodeTaskPlan,
    },
    cards: createCardApi(beijingCards, 'beijing'),
    finale: {
      playerNameStorageKey: 'beijingFinalePlayerName',
      introSeenStorageKey: 'beijingFinaleIntroSeen',
      ariaLabel: '我的北京时空游记',
      eyebrow: '我的北京时空游记',
      cinematicTitle: '你走过了北京的中轴线',
      emptyCards: '还没有获得卡牌，先回到棋盘完成一站。',
      writingStatus: '游记正在书写，卡牌与回声会依次落到纸上。',
      defaultSaveTitle: '我的北京时空游记',
      nodeCopy: beijingFinaleNodeCopy,
      createTravelogue: createBeijingTravelogue,
    },
  },
  tianjin: {
    id: 'tianjin',
    assetBase: 'tianjin',
    accent: '#2e7182',
    chapter: tianjinGame.chapter,
    bgmSrc: '/audio/tianjin-haihe-bgm.wav',
    defaultMemoryLine: '我把今天的脚步留在海河的风里。',
    routeNodes: tianjinGame.routeNodes,
    diceFaces: tianjinGame.diceFaces,
    createStoryTitle: tianjinGame.createStoryTitle,
    assetPaths,
    assetUrl: makeAssetUrl('tianjin'),
    roleImages: {
      'jiefang-bridge': '/assets/tianjin/roles/haihe-postman.webp',
      'italian-quarter': '/assets/tianjin/roles/architecture-translator.webp',
      'ancient-culture-street': '/assets/tianjin/roles/new-year-print-vendor.webp',
      wudadao: '/assets/tianjin/roles/wudadao-housekeeper.webp',
      'tianjin-eye': '/assets/tianjin/roles/night-boat-captain.webp',
    },
    roleCardImages: {
      'jiefang-bridge': '/assets/tianjin/role-cards/role-haihe-postman.png',
      'italian-quarter': '/assets/tianjin/role-cards/role-architecture-translator.png',
      'ancient-culture-street': '/assets/tianjin/role-cards/role-new-year-print-vendor.png',
      wudadao: '/assets/tianjin/role-cards/role-wudadao-housekeeper.png',
      'tianjin-eye': '/assets/tianjin/role-cards/role-night-boat-captain.png',
    },
    board: {
      trackCells: tianjinBoard.trackCells,
      tileButtonImages: tianjinBoard.tileButtonImages,
      layout: beijingBoard.boardLayout,
    },
    scenes: {
      nodeSceneMeta: tianjinScenes.nodeSceneMeta,
      getNodeSceneMeta: tianjinScenes.getNodeSceneMeta,
    },
    tasks: {
      taskKindLabels: beijingTasks.taskKindLabels,
      nodeTaskPlans: tianjinTasks.nodeTaskPlans,
      getNodeTaskPlan: tianjinTasks.getNodeTaskPlan,
    },
    cards: createCardApi(tianjinGameCards, 'tianjin'),
    finale: {
      playerNameStorageKey: 'tianjinFinalePlayerName',
      introSeenStorageKey: 'tianjinFinaleIntroSeen',
      ariaLabel: '我的天津海河游记',
      eyebrow: '我的天津海河游记',
      cinematicTitle: '你走过了天津的海河来信',
      emptyCards: '还没有获得卡牌，先回到棋盘完成一站。',
      writingStatus: '游记正在书写，卡牌与回信会依次落到纸上。',
      defaultSaveTitle: '我的天津海河游记',
      nodeCopy: tianjinFinaleNodeCopy,
      createTravelogue: createTianjinTravelogue,
    },
  },
  shanghai: {
    id: 'shanghai',
    assetBase: 'shanghai',
    accent: '#0f6b70',
    chapter: shanghaiGame.chapter,
    bgmSrc: '/audio/shanghai-nongtang-bgm.wav',
    defaultMemoryLine: '我把今天的门牌、街声和夜色压进一张上海唱片。',
    routeNodes: shanghaiGame.routeNodes,
    diceFaces: shanghaiGame.diceFaces,
    createStoryTitle: shanghaiGame.createStoryTitle,
    assetPaths,
    assetUrl: makeAssetUrl('shanghai'),
    roleImages: {
      'node-doorplate': '/assets/shanghai/roles/doorplate-messenger.webp',
      'node-street-sound': '/assets/shanghai/roles/street-sound-recordist.webp',
      'node-bund-reflection': '/assets/shanghai/roles/bund-photographer.webp',
      'node-window': '/assets/shanghai/roles/window-set-designer.webp',
      'node-shikumen': '/assets/shanghai/roles/shikumen-resident.webp',
      'node-finale': '/assets/shanghai/roles/night-projectionist.webp',
    },
    roleCardImages: {
      'node-doorplate': '/assets/shanghai/role-cards/role-doorplate-messenger.png',
      'node-street-sound': '/assets/shanghai/role-cards/role-street-sound-recordist.png',
      'node-bund-reflection': '/assets/shanghai/role-cards/role-bund-photographer.png',
      'node-window': '/assets/shanghai/role-cards/role-window-set-designer.png',
      'node-shikumen': '/assets/shanghai/role-cards/role-shikumen-resident.png',
      'node-finale': '/assets/shanghai/role-cards/role-night-projectionist.png',
    },
    board: {
      trackCells: shanghaiBoard.trackCells,
      tileButtonImages: shanghaiBoard.tileButtonImages,
      layout: beijingBoard.boardLayout,
    },
    scenes: {
      nodeSceneMeta: shanghaiScenes.nodeSceneMeta,
      getNodeSceneMeta: shanghaiScenes.getNodeSceneMeta,
    },
    tasks: {
      taskKindLabels: shanghaiTasks.taskKindLabels,
      nodeTaskPlans: shanghaiTasks.nodeTaskPlans,
      getNodeTaskPlan: shanghaiTasks.getNodeTaskPlan,
    },
    cards: createCardApi(shanghaiGameCards, 'shanghai'),
    finale: {
      playerNameStorageKey: 'shanghaiFinalePlayerName',
      introSeenStorageKey: 'shanghaiFinaleIntroSeen',
      ariaLabel: '我的上海弄堂回声',
      eyebrow: '我的上海弄堂回声',
      cinematicTitle: '你走过了上海的弄堂回声',
      emptyCards: '还没有获得卡牌，先回到棋盘完成一站。',
      writingStatus: '唱片正在显影，门牌、街声与夜色会依次落到纸上。',
      defaultSaveTitle: '我的上海弄堂回声',
      nodeCopy: shanghaiFinaleNodeCopy,
      createTravelogue: createShanghaiTravelogue,
    },
  },
}

export const cityChoices = [
  {
    id: 'beijing',
    city: '北京',
    title: cityPacks.beijing.chapter.title,
    background: '/assets/city-select/beijing-map.png',
  },
  {
    id: 'tianjin',
    city: '天津',
    title: cityPacks.tianjin.chapter.title,
    background: '/assets/city-select/tianjin-map.png',
  },
  {
    id: 'shanghai',
    city: '上海',
    title: cityPacks.shanghai.chapter.title,
    background: '/assets/city-select/shanghai-map.png',
  },
] satisfies Array<{
  id: CityId
  city: string
  title: string
  background: string
}>
