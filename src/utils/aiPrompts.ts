import type { DiceFace, DialogueChoice, RouteNode } from '../data/beijingGame'
import type { GameCard } from '../data/gameCards'
import type { JourneyEvent } from '../types'

type TheaterPromptOptions = {
  node: RouteNode
  diceFace: DiceFace
  selectedElements: string[]
  photoName?: string
  roleBio: string
  activeChoice: DialogueChoice | null
  journeyLog: JourneyEvent[]
}

type FinalePromptOptions = {
  title: string
  playerName: string
  memoryLine: string
  completedNodes: RouteNode[]
  earnedCards: GameCard[]
  journeyLog: JourneyEvent[]
}

export type AiFinaleCopy = {
  typedStory: string
  truth: string
}

function formatJourneyLog(events: JourneyEvent[], limit = 18) {
  const recentEvents = events.slice(-limit)
  if (!recentEvents.length) return '暂无玩家行为记录。'

  return recentEvents
    .map((event, index) => {
      const detail = event.detail ? `：${event.detail}` : ''
      return `${index + 1}. [${event.at}] ${event.label}${detail}`
    })
    .join('\n')
}

export function createTheaterMessages({
  node,
  diceFace,
  selectedElements,
  photoName,
  roleBio,
  activeChoice,
  journeyLog,
}: TheaterPromptOptions) {
  const elements = selectedElements.length ? selectedElements.join('、') : node.photoTags.slice(0, 3).join('、')
  const task = activeChoice
    ? `玩家刚问：「${activeChoice.prompt}」。请以「${node.roleName}」身份直接回答。`
    : `玩家刚进入这一幕。请以「${node.roleName}」身份生成一段开场独白。`

  return [
    {
      role: 'system' as const,
      content:
        '你是中文城市文化游戏《此地有回声》的实时叙事引擎。只写游戏内角色对白，不要提到模型、接口、AI、提示词或系统。文风要像北京中轴线纸上剧场：有现场感、有人味、克制但有画面。不要编造玩家没有做过的事实。',
    },
    {
      role: 'user' as const,
      content: [
        `地点：${node.title}（${node.subtitle}）`,
        `角色：${node.roleName}，${node.roleTitle}`,
        `角色口吻：${node.roleTone}`,
        `角色补充：${roleBio}`,
        `固定舞台线索：${node.stageLine}`,
        `现场元素：${elements}`,
        `照片记录：${photoName || '玩家尚未上传文件名，可能使用了手选现场元素继续。'}`,
        `骰面：${diceFace.name}。${diceFace.meaning}`,
        `近期玩家行为：\n${formatJourneyLog(journeyLog)}`,
        task,
        activeChoice
          ? '输出要求：90 到 150 个汉字，分 2 段。第一段回答问题，第二段把回答落到现实任务或现场观察上。'
          : '输出要求：140 到 220 个汉字，分 2 到 3 段。最后一句自然引向玩家可以继续追问。',
      ].join('\n'),
    },
  ]
}

export function createFinaleMessages({
  title,
  playerName,
  memoryLine,
  completedNodes,
  earnedCards,
  journeyLog,
}: FinalePromptOptions) {
  const routeSummary = completedNodes.length
    ? completedNodes
        .map((node, index) => `${index + 1}. ${node.title} / ${node.subtitle} / 遇见${node.roleName} / 任务：${node.mission}`)
        .join('\n')
    : '玩家尚未完成完整路线，只有开局记录。'
  const cards = earnedCards.length
    ? earnedCards.map((card) => `《${card.name}》${card.description ? `：${card.description}` : ''}`).join('\n')
    : '暂无已获得卡牌。'

  return [
    {
      role: 'system' as const,
      content:
        '你是《此地有回声》北京中轴线终局游记作者。你要把玩家的路线、选择、卡牌和一句回声写成一篇中文游记。只输出严格 JSON，不要 Markdown，不要代码块。',
    },
    {
      role: 'user' as const,
      content: [
        `游记标题：${title}`,
        `署名：${playerName}`,
        `玩家留下的回声：${memoryLine}`,
        `完成路线：\n${routeSummary}`,
        `获得卡牌：\n${cards}`,
        `玩家行为时间线：\n${formatJourneyLog(journeyLog, 40)}`,
        '写作要求：',
        '1. typedStory 写 650 到 950 个汉字，分 5 到 7 段，段落用两个换行符分隔。',
        '2. 每一段都要能看到玩家行为对文本的影响：现场元素、骰面、追问、任务留言、卡牌都要尽量进入故事。',
        '3. 不要写成景点介绍，要像一封写给北京的私人游记。',
        '4. truth 写 45 到 80 个汉字，像终局真相牌上的一句话。',
        '5. 返回格式必须是：{"typedStory":"...","truth":"..."}',
      ].join('\n'),
    },
  ]
}

export function parseFinaleResponse(rawText: string): AiFinaleCopy {
  const cleaned = rawText.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  const parsed = JSON.parse(cleaned) as Partial<AiFinaleCopy>
  const typedStory = typeof parsed.typedStory === 'string' ? parsed.typedStory.trim() : ''
  const truth = typeof parsed.truth === 'string' ? parsed.truth.trim() : ''

  if (!typedStory || !truth) {
    throw new Error('AI 游记格式不完整')
  }

  return { typedStory, truth }
}
