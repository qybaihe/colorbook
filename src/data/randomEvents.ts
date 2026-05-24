import type { BoardEventTone, TrackCell } from './boardTrack'
import { routeNodes } from './beijingGame'

export type BoardEvent = {
  id: string
  tone: BoardEventTone
  title: string
  subtitle: string
  description: string
  taskDirective: string
  storyHook: string
  rewardCardIds: string[]
  nodeAffinity?: string[]
}

export type MoveResult = {
  roll: number
  fromIndex: number
  toIndex: number
  landingLabel: string
}

const boardEventDeck: Record<BoardEventTone, BoardEvent[]> = {
  start: [
    {
      id: 'start-first-footprint',
      tone: 'start',
      title: '第一枚脚印',
      subtitle: '从入口把自己放进棋盘',
      description: '这一格不急着解释历史，先确认玩家从哪里进入北京、愿意把哪一种目光带上路。',
      taskDirective: '拍或选择一个“入口感”的元素：门、路、人流、牌匾都可以。',
      storyHook: '开局的第一枚脚印会决定终局游记的第一句话。',
      rewardCardIds: ['gate', 'rule-keeper'],
      nodeAffinity: ['qianmen', 'axis'],
    },
  ],
  photo: [
    {
      id: 'photo-close-evidence',
      tone: 'photo',
      title: '近证格',
      subtitle: '把城市缩到一个细节里',
      description: '骰子把你推到一处需要近看的地方。别急着拍全景，一个门钉、一块招牌、一段水纹都足够入局。',
      taskDirective: '优先拍一个细节，或手选一个最能代表现场的元素。',
      storyHook: '这一格会让角色少讲宏大，多讲你刚刚看见的具体物。',
      rewardCardIds: ['object-event', 'photographer-eye'],
    },
    {
      id: 'photo-frame-line',
      tone: 'photo',
      title: '取景线',
      subtitle: '让画面自己指出方向',
      description: '这一格要求你在画面里找一条线：道路、屋檐、河岸、队伍或视线都算。',
      taskDirective: '拍出方向感，或者选择“线、边界、远近”相关元素。',
      storyHook: '终局会把这条线写成你理解北京的方式。',
      rewardCardIds: ['symmetry', 'axis-scroll'],
      nodeAffinity: ['axis', 'jingshan'],
    },
  ],
  sound: [
    {
      id: 'sound-living-noise',
      tone: 'sound',
      title: '市声格',
      subtitle: '让看不见的东西入局',
      description: '这一格不只看照片。车铃、脚步、叫卖、风声和人群的停顿，都能成为城市证据。',
      taskDirective: '记录或选择一种声音，让角色围绕这段声音回应。',
      storyHook: '声音会把宏大的中轴拉回人的日常。',
      rewardCardIds: ['sound-event', 'human-life'],
      nodeAffinity: ['qianmen', 'shichahai'],
    },
    {
      id: 'sound-time-bell',
      tone: 'sound',
      title: '钟鼓余音',
      subtitle: '听见时间从高处落下',
      description: '这一格让城市带上时间感。即使没有钟声，也可以用脚步、风声或水声替代。',
      taskDirective: '选择一种你能听见的节奏：车铃、人声、水声、脚步或风声。',
      storyHook: '这一格会让终局多一段“北京怎样被听见”的文字。',
      rewardCardIds: ['bell', 'night-watchman'],
      nodeAffinity: ['jingshan', 'shichahai'],
    },
  ],
  dice: [
    {
      id: 'dice-role-shift',
      tone: 'dice',
      title: '换声格',
      subtitle: '同一地点换一个问法',
      description: '你落到骰面格，角色会改变说话方式：可能像来信，可能像提醒，也可能像一道选择题。',
      taskDirective: '进入剧场后先追问角色，再决定现实任务怎么完成。',
      storyHook: '骰面会改变这段对白在终局里留下的语气。',
      rewardCardIds: ['letter-event', 'time-traveler'],
    },
    {
      id: 'dice-object-fate',
      tone: 'dice',
      title: '风物骰',
      subtitle: '让一个物件改变剧情',
      description: '这一格会把现场元素变成道具。你选什么，角色就从什么开始说。',
      taskDirective: '至少选择一个现场元素，再掷时空骰进入剧场。',
      storyHook: '被选中的元素会成为本局故事的小暗号。',
      rewardCardIds: ['object-event', 'letter'],
    },
  ],
  fate: [
    {
      id: 'fate-safe-detour',
      tone: 'fate',
      title: '改道格',
      subtitle: '现实路线也会参与叙事',
      description: '拥挤、天气、封路或时间不够，都不是失败。这一格把“没按原计划走”写进棋局。',
      taskDirective: '选择一个替代观察点，或用手选元素完成这一站。',
      storyHook: '终局会承认这一次改道，并把它写成路线的转折。',
      rewardCardIds: ['turn-event', 'safety', 'shadow'],
    },
    {
      id: 'fate-missed-letter',
      tone: 'fate',
      title: '未拆的信',
      subtitle: '错过也能变成线索',
      description: '这一格允许你把来不及停留的地点变成一封未拆的信，留到终局再打开。',
      taskDirective: '写下你错过了什么，或者选择最想补看的一个元素。',
      storyHook: '错过会在终局里变成一段更轻、更私人的旁白。',
      rewardCardIds: ['missed-letter', 'time-boost'],
    },
  ],
  echo: [
    {
      id: 'echo-one-line',
      tone: 'echo',
      title: '回声格',
      subtitle: '给北京留下一句话',
      description: '这一格会把你的话钉进终局。它不要求准确，只要求像今天的你。',
      taskDirective: '在任务纸笺里写一句给北京的话。',
      storyHook: '这句话会成为终局游记的落款。',
      rewardCardIds: ['echo-event', 'echo'],
    },
    {
      id: 'echo-return-question',
      tone: 'echo',
      title: '反问格',
      subtitle: '城市把问题交还给你',
      description: '角色不会只回答你，也会反问你：你希望后来的人怎样经过这里？',
      taskDirective: '选择一个追问，再把答案写进回声纸笺。',
      storyHook: '终局会把这次反问写成你与北京之间的短笺。',
      rewardCardIds: ['letter', 'echo-event'],
    },
  ],
  create: [
    {
      id: 'create-route-seal',
      tone: 'create',
      title: '共创格',
      subtitle: '把走过的格子盖成章',
      description: '这一格会整理你已经走过的路线，把地点、事件和卡牌压成一枚本局印章。',
      taskDirective: '选一个最能代表本局的元素，让它成为路线印章。',
      storyHook: '路线印章会让终局更像一份真正属于你的档案。',
      rewardCardIds: ['axis-scroll', 'family-detective'],
    },
    {
      id: 'create-card-sticker',
      tone: 'create',
      title: '卡贴格',
      subtitle: '给故事补一张自己的牌',
      description: '你可以把今天看到的一件小事，贴成一张临时卡。它不在卡册编号里，却会进入游记。',
      taskDirective: '在回声纸笺写下一个“我今天看见了……”的句子。',
      storyHook: '这张临时卡会让终局多一点现场的温度。',
      rewardCardIds: ['human-life', 'hint'],
    },
  ],
  finale: [
    {
      id: 'finale-draft',
      tone: 'finale',
      title: '游记草稿',
      subtitle: '先把结尾放在路中间',
      description: '终局并不一定最后才出现。你可以提前看见一个草稿，再继续让它变厚。',
      taskDirective: '完成当前站后，终局会读取这次草稿事件，写出更像“走出来”的结尾。',
      storyHook: '这一格会让最终游记有一种回望感。',
      rewardCardIds: ['axis-scroll', 'echo-event'],
    },
  ],
}

const nodeIds = routeNodes.map((node) => node.id)

export function drawBoardEvent(tone: BoardEventTone, completedNodeIds: string[]) {
  const deck = boardEventDeck[tone] ?? boardEventDeck.fate
  const unfinishedCount = Math.max(1, nodeIds.length - completedNodeIds.length)
  const index = Math.floor(Math.random() * deck.length * unfinishedCount) % deck.length
  return deck[index]
}

export function resolveNodeForLanding({
  cell,
  boardEvent,
  completedNodeIds,
  previousNodeId,
}: {
  cell: TrackCell
  boardEvent: BoardEvent | null
  completedNodeIds: string[]
  previousNodeId: string
}) {
  const completed = new Set(completedNodeIds)

  if (cell.kind === 'node' && !completed.has(cell.nodeId)) {
    return cell.nodeId
  }

  const affinity = boardEvent?.nodeAffinity?.filter((nodeId) => !completed.has(nodeId)) ?? []
  if (affinity.length) {
    return affinity[Math.floor(Math.random() * affinity.length)]
  }

  const unfinished = nodeIds.filter((nodeId) => !completed.has(nodeId))
  if (unfinished.length) {
    return unfinished[Math.floor(Math.random() * unfinished.length)]
  }

  if (cell.kind === 'node') return cell.nodeId
  return previousNodeId
}

export function getEventCardIdsForDice(diceFaceId: string) {
  const eventCardByDice: Record<string, string> = {
    time: 'time-event',
    object: 'object-event',
    letter: 'letter-event',
    sound: 'sound-event',
    turn: 'turn-event',
    echo: 'echo-event',
  }

  return eventCardByDice[diceFaceId] ? [eventCardByDice[diceFaceId]] : []
}

export function getClueCardIdsForElements(elements: string[], photoName?: string) {
  const normalized = elements.join('、')
  const cardIds = new Set<string>()

  if (photoName || elements.length >= 2) cardIds.add('photographer-eye')
  if (/道路中线|左右平衡|对称|方向线/.test(normalized)) cardIds.add('symmetry')
  if (/水面|倒影|湖面|水声/.test(normalized)) cardIds.add('water-ripple')
  if (/钟声|车铃|人声|脚步声|街声/.test(normalized)) cardIds.add('bell')
  if (/招牌|铺面|排队人群|人流|门牌|自行车/.test(normalized)) cardIds.add('human-life')

  return Array.from(cardIds)
}
