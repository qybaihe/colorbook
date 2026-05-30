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

const baseNodeTaskPlans: Record<string, NodeTaskPlan> = {
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
  'qianmen-entry': {
    nodeId: 'qianmen-entry',
    summary: '确认入城第一眼，把入口、门楼和人流方向变成开局证据。',
    taskButtons: [
      { kind: 'photo', label: '拍入口线索', helper: '确认本局从哪里进北京。', triggerCardIds: ['gate', 'object-event'] },
      { kind: 'dice', label: '定开局问法', helper: '用第一枚骰面决定观察角度。', triggerCardIds: ['time-event', 'turn-event'] },
      { kind: 'echo', label: '留第一印象', helper: '写下本局第一眼北京。', triggerCardIds: ['echo-event', 'letter'] },
    ],
  },
  'qianmen-photo': {
    nodeId: 'qianmen-photo',
    summary: '让照片任务不只是上传，而是变成买卖发生过的证据。',
    taskButtons: [
      { kind: 'photo', label: '拍买卖证据', helper: '招牌、门框、影子都能入局。', triggerCardIds: ['photographer-eye', 'trade'] },
      { kind: 'fate', label: '避开人流', helper: '不拍陌生人正脸，改拍物件边角。', triggerCardIds: ['safety', 'shadow'] },
      { kind: 'dice', label: '让证据开口', helper: '让掌柜围绕照片细节回应。', triggerCardIds: ['object-event', 'qing-merchant'] },
    ],
  },
  'first-dice-event': {
    nodeId: 'first-dice-event',
    summary: '用随机骰面改变本回合的观察重点。',
    taskButtons: [
      { kind: 'dice', label: '掷第一骰', helper: '随机抽取时辰、风物或来信。', triggerCardIds: ['time-event', 'letter-event'] },
      { kind: 'photo', label: '看骰面证据', helper: '把现场元素绑定到骰面。', triggerCardIds: ['object-event', 'photographer-eye'] },
      { kind: 'fate', label: '接受随机', helper: '把不可控写成路线变化。', triggerCardIds: ['turn-event', 'rewind'] },
    ],
  },
  'street-sound': {
    nodeId: 'street-sound',
    summary: '把街面声音做成当前回合的底噪。',
    taskButtons: [
      { kind: 'sound', label: '录街面声音', helper: '脚步、车铃、店门声都可以。', triggerCardIds: ['sound-event', 'bell'] },
      { kind: 'photo', label: '拍声音来源', helper: '不录音时拍一个暗示声音的物件。', triggerCardIds: ['object-event', 'human-life'] },
      { kind: 'echo', label: '标记情绪', helper: '把声音写成一个情绪词。', triggerCardIds: ['echo-event', 'old-city-evening'] },
    ],
  },
  'fate-first-turn': {
    nodeId: 'fate-first-turn',
    summary: '根据人流和安全边界做第一次路线取舍。',
    taskButtons: [
      { kind: 'fate', label: '选路线分叉', helper: '继续、绕行或停留观察。', triggerCardIds: ['turn-event', 'safety'] },
      { kind: 'photo', label: '拍路口证据', helper: '路牌、人流方向或边界都可以。', triggerCardIds: ['photographer-eye', 'shadow'] },
      { kind: 'echo', label: '记录取舍', helper: '把为什么改道写清楚。', triggerCardIds: ['missed-letter', 'letter'] },
    ],
  },
  'echo-card-unlock': {
    nodeId: 'echo-card-unlock',
    summary: '把玩家第一句现场感受收入卡册。',
    taskButtons: [
      { kind: 'echo', label: '写第一回声', helper: '终局会引用这句话。', triggerCardIds: ['echo-event', 'echo'] },
      { kind: 'photo', label: '拍安静细节', helper: '灯影、纸条、街角都能承载留言。', triggerCardIds: ['object-event', 'letter'] },
      { kind: 'create', label: '生成回声卡', helper: '把一句话转为卡册记忆。', triggerCardIds: ['hint', 'time-traveler'] },
    ],
  },
  'hidden-missed-letter': {
    nodeId: 'hidden-missed-letter',
    summary: '把错过、绕行或天气阻碍写成隐藏支线。',
    taskButtons: [
      { kind: 'fate', label: '说明错过原因', helper: '拥挤、天气、绕行都可以。', triggerCardIds: ['missed-letter', 'weather-backup'] },
      { kind: 'photo', label: '拍远景边界', helper: '远景和路牌也能证明到达。', triggerCardIds: ['photographer-eye', 'safety'] },
      { kind: 'echo', label: '写支线来信', helper: '把错过变成一封短信。', triggerCardIds: ['letter-event', 'shadow'] },
    ],
  },
  'cocreate-city-seal': {
    nodeId: 'cocreate-city-seal',
    summary: '把前段路线压成一枚可回看的城印。',
    taskButtons: [
      { kind: 'create', label: '选城印关键词', helper: '门、线、声、影任选其一。', triggerCardIds: ['axis-scroll', 'hint'] },
      { kind: 'photo', label: '绑定现场证物', helper: '让城印有现实来源。', triggerCardIds: ['object-event', 'photographer-eye'] },
      { kind: 'dice', label: '决定后续偏向', helper: '后续角色会引用这枚城印。', triggerCardIds: ['turn-event', 'time-boost'] },
    ],
  },
  'fate-route-choice': {
    nodeId: 'fate-route-choice',
    summary: '从中轴转向水影、高处或旧城生活段。',
    taskButtons: [
      { kind: 'fate', label: '选转场方向', helper: '水边、高处、屋檐或绕行。', triggerCardIds: ['turn-event', 'rewind'] },
      { kind: 'photo', label: '拍转场线索', helper: '路牌、桥、水面或方向线。', triggerCardIds: ['photographer-eye', 'object-event'] },
      { kind: 'echo', label: '写转场理由', helper: '说明为什么换景。', triggerCardIds: ['letter', 'time-boost'] },
    ],
  },
  'travelogue-midpoint': {
    nodeId: 'travelogue-midpoint',
    summary: '中途整理关键词，让后半局有叙事方向。',
    taskButtons: [
      { kind: 'create', label: '整理前半局', helper: '选一张卡或一个关键词。', triggerCardIds: ['axis-scroll', 'time-traveler'] },
      { kind: 'echo', label: '写中段草稿', helper: '把散点整理成段落。', triggerCardIds: ['letter', 'echo-event'] },
      { kind: 'dice', label: '决定后半调性', helper: '随机改变后半段任务语气。', triggerCardIds: ['time-event', 'turn-event'] },
    ],
  },
  'echo-overlook-note': {
    nodeId: 'echo-overlook-note',
    summary: '在登高前先写一张回望路线的短笺。',
    taskButtons: [
      { kind: 'echo', label: '写高处短笺', helper: '给后面的自己留一句话。', triggerCardIds: ['echo-event', 'overlook'] },
      { kind: 'photo', label: '拍回望方向', helper: '天空、远景或方向线都可以。', triggerCardIds: ['photographer-eye', 'shadow'] },
      { kind: 'create', label: '预生成长卷', helper: '把前路排成一条线。', triggerCardIds: ['axis-scroll', 'city-historian'] },
    ],
  },
  'photo-transition': {
    nodeId: 'photo-transition',
    summary: '用一张过渡构图连接高处秩序和地面日常。',
    taskButtons: [
      { kind: 'photo', label: '拍三层过渡', helper: '近处、中景、远处同时成立。', triggerCardIds: ['photographer-eye', 'symmetry'] },
      { kind: 'fate', label: '处理遮挡', helper: '看不见远景时选一层继续。', triggerCardIds: ['weather-backup', 'safety'] },
      { kind: 'create', label: '连接旧城段', helper: '把构图转成下一段提示。', triggerCardIds: ['human-life', 'old-city-evening'] },
    ],
  },
  'dice-letter-mood': {
    nodeId: 'dice-letter-mood',
    summary: '把现场元素拆成下一位角色的追问。',
    taskButtons: [
      { kind: 'dice', label: '抽来信语气', helper: '让问题带着随机情绪出现。', triggerCardIds: ['letter-event', 'time-event'] },
      { kind: 'echo', label: '选择追问', helper: '决定角色下一句问什么。', triggerCardIds: ['gate-questions', 'letter'] },
      { kind: 'photo', label: '绑定来信物件', helper: '门、水、声、影都可入信。', triggerCardIds: ['object-event', 'shadow'] },
    ],
  },
  'old-city-letter': {
    nodeId: 'old-city-letter',
    summary: '把门牌、车铃、灯影写成旧城短笺。',
    taskButtons: [
      { kind: 'photo', label: '拍生活细节', helper: '门牌、胡同口、灯影都可以。', triggerCardIds: ['human-life', 'old-city-evening'] },
      { kind: 'echo', label: '写旧城短笺', helper: '留下一句生活现场。', triggerCardIds: ['letter', 'echo-event'] },
      { kind: 'sound', label: '听门口声音', helper: '车铃、人声、水声任选。', triggerCardIds: ['sound-event', 'bell'] },
    ],
  },
  'bell-footsteps': {
    nodeId: 'bell-footsteps',
    summary: '让钟声、脚步和车铃成为终局声轨。',
    taskButtons: [
      { kind: 'sound', label: '选旧城声音', helper: '钟声远，脚步近。', triggerCardIds: ['bell', 'sound-event'] },
      { kind: 'photo', label: '拍声音物件', helper: '车、门、湖面都能暗示声音。', triggerCardIds: ['object-event', 'human-life'] },
      { kind: 'echo', label: '写声音记忆', helper: '把声音变成终局底轨。', triggerCardIds: ['night-watchman', 'echo'] },
    ],
  },
  'cocreate-route-sticker': {
    nodeId: 'cocreate-route-sticker',
    summary: '为本局路线生成一枚可收藏贴纸。',
    taskButtons: [
      { kind: 'create', label: '选贴纸主题', helper: '城门、中轴、水影或钟声。', triggerCardIds: ['axis-scroll', 'hint'] },
      { kind: 'photo', label: '绑定贴纸图案', helper: '选择一张卡或一个现场元素。', triggerCardIds: ['photographer-eye', 'object-event'] },
      { kind: 'echo', label: '写贴纸标题', helper: '用短句概括这段路线。', triggerCardIds: ['echo-event', 'time-traveler'] },
    ],
  },
  'dice-finale-tone': {
    nodeId: 'dice-finale-tone',
    summary: '进入终局前确定游记的情绪和语气。',
    taskButtons: [
      { kind: 'dice', label: '定终局语气', helper: '热闹、沉稳、怀旧或轻快。', triggerCardIds: ['time-event', 'echo'] },
      { kind: 'echo', label: '写收束句', helper: '让结尾有明确落点。', triggerCardIds: ['echo-event', 'letter'] },
      { kind: 'create', label: '整理终局牌阵', helper: '把已得卡收成一组。', triggerCardIds: ['axis-scroll', 'time-traveler'] },
    ],
  },
  'reality-check': {
    nodeId: 'reality-check',
    summary: '终局前确认安全、体力和真实路线边界。',
    taskButtons: [
      { kind: 'fate', label: '做安全判断', helper: '继续、休息、绕行或跳过。', triggerCardIds: ['safety', 'stamina-supply'] },
      { kind: 'photo', label: '记录替代点', helper: '无法继续时拍安全替代证据。', triggerCardIds: ['weather-backup', 'missed-letter'] },
      { kind: 'echo', label: '写现实选择', helper: '把安全选择写进游记。', triggerCardIds: ['rule-keeper', 'shadow'] },
    ],
  },
  'echo-return-line': {
    nodeId: 'echo-return-line',
    summary: '把整局路线落成最终回声，进入完整游记。',
    taskButtons: [
      { kind: 'echo', label: '留下最终落款', helper: '终局游记会引用。', triggerCardIds: ['echo', 'echo-event'] },
      { kind: 'photo', label: '拍返程画面', helper: '灯影、路口或安静细节。', triggerCardIds: ['old-city-evening', 'photographer-eye'] },
      { kind: 'create', label: '生成完整游记', helper: '把 24 格收成一篇故事。', triggerCardIds: ['axis-scroll', 'time-traveler'] },
    ],
  },
}

const supplementalTaskCopy: Record<TaskButtonKind, Omit<TaskButtonPlan, 'kind' | 'triggerCardIds'>> = {
  photo: {
    label: '补一张证据照',
    helper: '换一个角度，把本格现场再确认一次。',
  },
  sound: {
    label: '听一层现场声',
    helper: '用脚步、人声、风声或门响补足氛围。',
  },
  dice: {
    label: '换骰面追问',
    helper: '让骰面把这一格改成新的问法。',
  },
  fate: {
    label: '处理现场变数',
    helper: '把天气、人流、体力或绕行写进路线。',
  },
  create: {
    label: '共创本格标记',
    helper: '把照片、声音和一句话收成可收藏的小标记。',
  },
  echo: {
    label: '留一句回声',
    helper: '给这一格留下一句会被后面接住的话。',
  },
}

const supplementalCardIds: Record<TaskButtonKind, string[]> = {
  photo: ['photographer-eye', 'object-event', 'shadow'],
  sound: ['sound-event', 'bell', 'human-life'],
  dice: ['time-event', 'letter-event', 'turn-event'],
  fate: ['turn-event', 'safety', 'weather-backup'],
  create: ['axis-scroll', 'hint', 'time-traveler'],
  echo: ['echo-event', 'echo', 'letter'],
}

const taskKindOrder: TaskButtonKind[] = ['photo', 'sound', 'dice', 'fate', 'create', 'echo']

function uniqueCardIds(...groups: string[][]) {
  return Array.from(new Set(groups.flat())).slice(0, 3)
}

function completeTaskPlan(plan: NodeTaskPlan): NodeTaskPlan {
  if (plan.taskButtons.length >= 5) return plan

  const existingKinds = new Set(plan.taskButtons.map((task) => task.kind))
  const existingCards = plan.taskButtons.flatMap((task) => task.triggerCardIds)
  const missingTasks = taskKindOrder
    .filter((kind) => !existingKinds.has(kind))
    .map((kind) => ({
      kind,
      ...supplementalTaskCopy[kind],
      triggerCardIds: uniqueCardIds(supplementalCardIds[kind], existingCards),
    }))

  return {
    ...plan,
    taskButtons: [...plan.taskButtons, ...missingTasks].slice(0, 5),
  }
}

export const nodeTaskPlans: Record<string, NodeTaskPlan> = Object.fromEntries(
  Object.entries(baseNodeTaskPlans).map(([nodeId, plan]) => [nodeId, completeTaskPlan(plan)]),
)

export function getNodeTaskPlan(nodeId: string) {
  return nodeTaskPlans[nodeId]
}
