import type { DiceFace, RouteNode } from '../data/beijingGame'
import type { TaskButtonPlan } from '../data/taskPlans'

export type BeijingEncounterModeId = 'photo' | 'sound' | 'dice' | 'fate' | 'echo'

export type BeijingEncounterMode = {
  id: BeijingEncounterModeId
  label: string
  roleSuffix: string
  mood: string
  speechHint: string
  missionHint: string
  fallbackHint: string
  directorHint: string
}

export type BeijingEncounterContext = {
  mode: BeijingEncounterMode
  encounterLabel: string
  encounterTitle: string
  encounterNote: string
  speechHint: string
  missionHint: string
  fallbackHint: string
  voiceHint: string
}

const encounterModes: BeijingEncounterMode[] = [
  {
    id: 'photo',
    label: '取证',
    roleSuffix: '取证遭遇',
    mood: '细看、贴近、追着边角说话',
    speechHint: '先说你看见什么，再说它为什么重要。',
    missionHint: '让照片和证物说话，别只讲热闹。',
    fallbackHint: '不方便拍照时，也要抓住最像证据的那一处。',
    directorHint: '把镜头压低一点，先认清物件，再认清关系。',
  },
  {
    id: 'sound',
    label: '听城',
    roleSuffix: '听城遭遇',
    mood: '短句、节奏感、先听后说',
    speechHint: '先听街声，再把声音翻译成场景。',
    missionHint: '让声音成为这一格最先抵达的线索。',
    fallbackHint: '录不到音时，依然要写清你听见了什么。',
    directorHint: '让句子短一点，把节拍交给脚步、车铃和门响。',
  },
  {
    id: 'dice',
    label: '问路',
    roleSuffix: '问路遭遇',
    mood: '带一点悬念和追问',
    speechHint: '把问题抛给玩家，让他把答案带回现场。',
    missionHint: '用追问改变观察角度，不要把答案一次说完。',
    fallbackHint: '没有新线索时，就把问题留住，别急着结论。',
    directorHint: '多留问号，少替玩家做完所有判断。',
  },
  {
    id: 'fate',
    label: '转场',
    roleSuffix: '转场遭遇',
    mood: '判断、分叉、允许绕行',
    speechHint: '先确认边界，再决定往哪一段走。',
    missionHint: '让安全和路线都能被玩家看见。',
    fallbackHint: '如果现场不顺利，绕行本身就是剧情。',
    directorHint: '把语气收紧一点，让角色像在替玩家看路。',
  },
  {
    id: 'echo',
    label: '留声',
    roleSuffix: '留声遭遇',
    mood: '收束、回响、给未来留一句',
    speechHint: '把现场收成一句能被记住的话。',
    missionHint: '留下回声，后面的节点会接住它。',
    fallbackHint: '写短一点也没关系，关键是像真的说过。',
    directorHint: '别把尾音收太死，让余韵留在句末。',
  },
]

function hashString(input: string) {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function scoreItem(seed: string, itemKey: string) {
  return hashString(`${seed}:${itemKey}`)
}

export function shuffleBySeed<T>(
  items: readonly T[],
  seed: string,
  getKey: (item: T, index: number) => string = (item, index) => `${index}:${String(item)}`,
) {
  return [...items]
    .map((item, index) => ({
      item,
      score: scoreItem(seed, getKey(item, index)),
    }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item)
}

export function pickEncounterMode(nodeId: string, seed: string, diceFaceId = 'node') {
  const index = scoreItem(seed, `${nodeId}:${diceFaceId}`) % encounterModes.length
  return encounterModes[index]
}

export function buildBeijingEncounterContext({
  node,
  diceFace,
  selectedElements,
  seed,
}: {
  node: Pick<RouteNode, 'id' | 'title' | 'roleName' | 'roleTitle' | 'roleTone' | 'mission' | 'fallback'>
  diceFace?: Pick<DiceFace, 'id' | 'name' | 'meaning'>
  selectedElements: string[]
  seed: string
}): BeijingEncounterContext {
  const mode = pickEncounterMode(node.id, seed)
  const elementText = selectedElements.length > 0 ? selectedElements.join('、') : '现场里的线索'

  return {
    mode,
    encounterLabel: `${mode.label} / ${node.roleName}`,
    encounterTitle: `${node.roleName} · ${mode.label}`,
    encounterNote: `${mode.roleSuffix}会把这一格的说法换成${mode.mood}。`,
    speechHint: `${mode.speechHint} ${diceFace ? `骰面是「${diceFace.name}」，${diceFace.meaning}` : ''} 你当前看见的是${elementText}。`,
    missionHint: mode.missionHint,
    fallbackHint: mode.fallbackHint,
    voiceHint: mode.directorHint,
  }
}

export function buildShuffledTaskButtons<T extends TaskButtonPlan>(
  taskButtons: readonly T[],
  seed: string,
  nodeId: string,
) {
  return shuffleBySeed(taskButtons, `${seed}:${nodeId}`, (task, index) => `${task.kind}:${task.label}:${index}`)
}
