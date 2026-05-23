export type TaskButtonKind = 'photo' | 'sound' | 'dice' | 'fate' | 'create' | 'echo'

export type TaskButtonPlan = {
  kind: TaskButtonKind
  label: string
  helper: string
  triggerCardIds: string[]
}

export type NodeTaskPlan = {
  nodeId: string
  summary: string
  taskButtons: TaskButtonPlan[]
}

export const taskKindLabels: Record<TaskButtonKind, string> = {
  photo: '拍照',
  sound: '市声',
  dice: '骰面',
  fate: '命运',
  create: '共创',
  echo: '回声',
}

export const nodeTaskPlans: Record<string, NodeTaskPlan> = {
  qianmen: {
    nodeId: 'qianmen',
    summary: '从城门、招牌、人流进入前门街面的买卖与消息。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍城门或招牌',
        helper: '让风物入局，确认前门的入口感。',
        triggerCardIds: ['object-event', 'photographer-eye', 'gate'],
      },
      {
        kind: 'sound',
        label: '听街面人声',
        helper: '把叫卖、人流和脚步变成市声证据。',
        triggerCardIds: ['sound-event', 'human-life'],
      },
      {
        kind: 'dice',
        label: '向掌柜追问',
        helper: '用来信或转折打开城门三问。',
        triggerCardIds: ['letter-event', 'gate-questions', 'qing-merchant'],
      },
    ],
  },
  axis: {
    nodeId: 'axis',
    summary: '用中线、左右平衡和远近层次证明一座城的方向。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍一条中线',
        helper: '让对称和方向感成为本回合线索。',
        triggerCardIds: ['object-event', 'symmetry', 'axis'],
      },
      {
        kind: 'dice',
        label: '掷出时辰',
        helper: '根据光线、人流切换中轴剧场语气。',
        triggerCardIds: ['time-event', 'city-craftsman'],
      },
      {
        kind: 'create',
        label: '展开长卷',
        helper: '把前后地点连成终局路线牌阵。',
        triggerCardIds: ['axis-scroll', 'time-traveler'],
      },
    ],
  },
  'corner-tower': {
    nodeId: 'corner-tower',
    summary: '用角楼、屋檐、水面和倒影把宫城收进一个画面。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍屋檐水影',
        helper: '让构图和倒影成为宫城的主证据。',
        triggerCardIds: ['photographer-eye', 'water-ripple', 'palace'],
      },
      {
        kind: 'fate',
        label: '处理天气人流',
        helper: '拥挤或天气差时切到安全替代观察。',
        triggerCardIds: ['weather-backup', 'safety', 'shadow'],
      },
      {
        kind: 'dice',
        label: '听画师讲光',
        helper: '让角色围绕画面边界生成回应。',
        triggerCardIds: ['letter-event', 'palace-painter'],
      },
    ],
  },
  jingshan: {
    nodeId: 'jingshan',
    summary: '从高处把近景、中景、远景和人的脚步读成城市长卷。',
    taskButtons: [
      {
        kind: 'photo',
        label: '拍三层城市',
        helper: '确认近处、中景和远处的层次。',
        triggerCardIds: ['photographer-eye', 'overlook'],
      },
      {
        kind: 'fate',
        label: '替代登高',
        helper: '无法登高时把错过写成支线。',
        triggerCardIds: ['missed-letter', 'shadow', 'time-boost'],
      },
      {
        kind: 'create',
        label: '整理路线长卷',
        helper: '把已完成节点收束成可回看的路线。',
        triggerCardIds: ['axis-scroll', 'city-historian', 'time-traveler'],
      },
    ],
  },
  shichahai: {
    nodeId: 'shichahai',
    summary: '让胡同、湖面、车铃和人声把中轴从秩序带回日常。',
    taskButtons: [
      {
        kind: 'sound',
        label: '录旧城声音',
        helper: '用车铃、人声、水声或脚步收束城市记忆。',
        triggerCardIds: ['sound-event', 'bell', 'night-watchman'],
      },
      {
        kind: 'photo',
        label: '拍生活细节',
        helper: '把仍在使用的日常放进终局游记。',
        triggerCardIds: ['human-life', 'life', 'old-city-evening'],
      },
      {
        kind: 'echo',
        label: '留下回声',
        helper: '把玩家的一句话绑定到最终游记。',
        triggerCardIds: ['echo-event', 'echo', 'hutong-resident'],
      },
    ],
  },
}

export function getNodeTaskPlan(nodeId: string) {
  return nodeTaskPlans[nodeId]
}
