import type { NodeTaskPlan, TaskButtonKind } from './taskPlans'

export const taskKindLabels: Record<TaskButtonKind, string> = {
  photo: '拍照',
  sound: '街声',
  dice: '骰面',
  fate: '转角',
  create: '拼贴',
  echo: '回声',
}

export const nodeTaskPlans: Record<string, NodeTaskPlan> = {
  'node-doorplate': {
    nodeId: 'node-doorplate',
    summary: '从门牌、门洞和招牌进入上海，把第一张城市切片拿在手里。',
    taskButtons: [
      { kind: 'photo', label: '拍门牌入口', helper: '让门牌成为本局唱针。', triggerCardIds: ['shanghai-doorplate', 'first-doorplate'] },
      { kind: 'dice', label: '选择追踪对象', helper: '门牌、橱窗、街声或霓虹。', triggerCardIds: ['doorplate-event', 'doorplate-clue'] },
      { kind: 'echo', label: '递出第一封信', helper: '让角色替你确认开局。', triggerCardIds: ['doorplate-messenger'] },
    ],
  },
  'node-street-sound': {
    nodeId: 'node-street-sound',
    summary: '把脚步、人声、店声和车声采成街声音轨。',
    taskButtons: [
      { kind: 'sound', label: '录街口人流', helper: '收集本局第一层底噪。', triggerCardIds: ['street-sound-track', 'sound-sampler'] },
      { kind: 'fate', label: '避开人流', helper: '不拍人脸，只拍边界。', triggerCardIds: ['safe-crossing', 'crowd-event'] },
      { kind: 'echo', label: '贴声音标签', helper: '给声音一个情绪词。', triggerCardIds: ['echo-event', 'street-sound-recordist'] },
    ],
  },
  'node-bund-reflection': {
    nodeId: 'node-bund-reflection',
    summary: '用江面、玻璃、金属和远近关系把外滩折成多层画面。',
    taskButtons: [
      { kind: 'photo', label: '拍江边倒影', helper: '水面、玻璃或金属都可。', triggerCardIds: ['bund-reflection', 'river-frame'] },
      { kind: 'dice', label: '切换天气语气', helper: '阴晴晨暮改变构图。', triggerCardIds: ['time-event', 'quick-snapshot'] },
      { kind: 'create', label: '整理远近关系', helper: '让摄影师读出层次。', triggerCardIds: ['bund-photographer'] },
    ],
  },
  'node-window': {
    nodeId: 'node-window',
    summary: '从玻璃内外、灯光、陈列和街面反光里选一格橱窗剧场。',
    taskButtons: [
      { kind: 'photo', label: '拍橱窗内外', helper: '玻璃既透明也反射。', triggerCardIds: ['window-core', 'glass-reflection-clue'] },
      { kind: 'create', label: '打开橱窗剧场', helper: '让布景师提出问题。', triggerCardIds: ['window-event', 'window-set-designer'] },
      { kind: 'fate', label: '雨窗兜底', helper: '雨天改看水痕和伞面。', triggerCardIds: ['rain-window-fallback', 'cafe-window-clue'] },
    ],
  },
  'node-shikumen': {
    nodeId: 'node-shikumen',
    summary: '门环、砖缝、窗和路牌把石库门从历史带回日常。',
    taskButtons: [
      { kind: 'photo', label: '拍石库门纹理', helper: '门、砖、窗、栏杆都可。', triggerCardIds: ['shikumen-door-ring', 'brick-gap-clue'] },
      { kind: 'dice', label: '听门环问答', helper: '不讲长课，只讲生活。', triggerCardIds: ['shikumen-resident', 'family-sign-hunter'] },
      { kind: 'fate', label: '弄堂转角', helper: '继续主路或停留观察。', triggerCardIds: ['corner-event', 'corner-ticket'] },
    ],
  },
  'node-finale': {
    nodeId: 'node-finale',
    summary: '把门牌、街声、橱窗、江面和夜色压成一张弄堂回声唱片。',
    taskButtons: [
      { kind: 'dice', label: '选夜色主色', helper: '蓝、金、绿、灰都成立。', triggerCardIds: ['neon-color-clue', 'night-sample'] },
      { kind: 'sound', label: '听苏州河风', helper: '把桥、水和交通当转场。', triggerCardIds: ['suzhou-creek-postman', 'neon-record'] },
      { kind: 'create', label: '合成唱片封面', helper: '用三张卡做城市切片。', triggerCardIds: ['city-slice-collage', 'city-editor'] },
    ],
  },
}

export function getNodeTaskPlan(nodeId: string) {
  return nodeTaskPlans[nodeId]
}
