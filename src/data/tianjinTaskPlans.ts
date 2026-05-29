import type { NodeTaskPlan } from './taskPlans'

export const nodeTaskPlans: Record<string, NodeTaskPlan> = {
  'jiefang-bridge': {
    nodeId: 'jiefang-bridge',
    summary: '从桥影、河岸、路牌和人流进入第一封海河来信。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍桥影或河岸',
        helper: '让风物入局，确认海河的出发感。',
        triggerCardIds: ['object-event', 'photographer-eye', 'haihe'],
      },
      {
        kind: 'sound',
        label: '听桥边人声',
        helper: '把河风、人流和脚步变成市声证据。',
        triggerCardIds: ['sound-event', 'dock-life'],
      },
      {
        kind: 'dice',
        label: '向邮差追问',
        helper: '用来信或转折打开海河三问。',
        triggerCardIds: ['letter-event', 'haihe-questions', 'haihe-postman'],
      },
    ],
  },
  'italian-quarter': {
    nodeId: 'italian-quarter',
    summary: '用门窗、街灯、立面和转角证明一座城市的混合语法。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍一处拱窗',
        helper: '让建筑细节成为本回合线索。',
        triggerCardIds: ['object-event', 'architecture', 'concession'],
      },
      {
        kind: 'dice',
        label: '掷出时辰',
        helper: '根据光线、人流切换街角剧场语气。',
        triggerCardIds: ['time-event', 'architecture-translator'],
      },
      {
        kind: 'create',
        label: '展开开埠长卷',
        helper: '把前后地点连成终局路线牌阵。',
        triggerCardIds: ['opening-scroll', 'time-traveler'],
      },
    ],
  },
  'ancient-culture-street': {
    nodeId: 'ancient-culture-street',
    summary: '用年画、匾额、摊铺和香火把民俗愿望收进一个画面。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍年画匾额',
        helper: '让纹样和颜色成为民俗主证据。',
        triggerCardIds: ['photographer-eye', 'tianhou', 'new-year-print-vendor'],
      },
      {
        kind: 'fate',
        label: '处理人流天气',
        helper: '拥挤或天气差时切到安全替代观察。',
        triggerCardIds: ['weather-backup', 'safety', 'shadow'],
      },
      {
        kind: 'dice',
        label: '听摊主讲愿望',
        helper: '让角色围绕颜色、匾额和愿望生成回应。',
        triggerCardIds: ['letter-event', 'human-life'],
      },
    ],
  },
  wudadao: {
    nodeId: 'wudadao',
    summary: '从慢行中把门窗、院墙、街树和人的脚步读成城市长卷。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍洋楼三层',
        helper: '确认近处、中景和远处的层次。',
        triggerCardIds: ['photographer-eye', 'wudadao'],
      },
      {
        kind: 'fate',
        label: '替代慢行',
        helper: '无法停留时把错过写成支线。',
        triggerCardIds: ['missed-letter', 'shadow', 'time-boost'],
      },
      {
        kind: 'create',
        label: '整理街区长卷',
        helper: '把已完成节点收束成可回看的路线。',
        triggerCardIds: ['opening-scroll', 'wudadao-housekeeper', 'time-traveler'],
      },
    ],
  },
  'tianjin-eye': {
    nodeId: 'tianjin-eye',
    summary: '让夜灯、河面、船声和桥影把海河路线收成一封回信。',
    taskButtons: [
      {
        kind: 'sound',
        label: '录河边声音',
        helper: '用河风、船声、脚步或远处人声收束城市记忆。',
        triggerCardIds: ['sound-event', 'quyi-sound', 'night-watchman'],
      },
      {
        kind: 'photo',
        label: '拍夜色细节',
        helper: '把仍在使用的夜色放进终局游记。',
        triggerCardIds: ['water-ripple', 'reply', 'night-letter'],
      },
      {
        kind: 'echo',
        label: '留下回信',
        helper: '把玩家的一句话绑定到最终游记。',
        triggerCardIds: ['echo-event', 'reply', 'night-boat-captain'],
      },
    ],
  },
}

export function getNodeTaskPlan(nodeId: string) {
  return nodeTaskPlans[nodeId]
}
