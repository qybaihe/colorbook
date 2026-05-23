import type { LucideIcon } from 'lucide-react'
import {
  AudioLines,
  Clock3,
  Compass,
  Feather,
  MessageCircleQuestion,
  ScrollText,
} from 'lucide-react'
import { getGameCard } from './gameCards'
export { cultureCards, gameCards, getGameCard } from './gameCards'
export type { GameCard as CultureCard } from './gameCards'

export type DiceFace = {
  id: string
  name: string
  icon: LucideIcon
  meaning: string
}

export type DialogueChoice = {
  prompt: string
  reply: string
}

export type RouteNode = {
  id: string
  order: number
  title: string
  subtitle: string
  place: string
  estimatedMinutes: string
  roleName: string
  roleTitle: string
  roleTone: string
  stageLine: string
  photoPrompt: string
  photoTags: string[]
  manualElements: string[]
  mission: string
  fallback: string
  rewardCardIds: string[]
  optionalCardIds?: string[]
  choices: DialogueChoice[]
  imageKey: string
  accent: string
}

export const chapter = {
  city: '北京',
  title: '中轴入局',
  subtitle: '从前门走到旧城回声',
  positioning:
    '沿真实公共路线行走，用定位、照片、时空骰和角色对话进入一盘北京文化棋局。',
}

export const diceFaces: DiceFace[] = [
  {
    id: 'time',
    name: '时辰',
    icon: Clock3,
    meaning: '根据此刻光线、天气和人流，改变角色开场的氛围。',
  },
  {
    id: 'object',
    name: '风物',
    icon: Feather,
    meaning: '把照片里的屋檐、水面、城门或街声变成剧情道具。',
  },
  {
    id: 'letter',
    name: '来信',
    icon: ScrollText,
    meaning: '历史角色向你提出一个问题，等待你把答案带回今天。',
  },
  {
    id: 'sound',
    name: '市声',
    icon: AudioLines,
    meaning: '触发声音观察任务，记录北京当下的生活响动。',
  },
  {
    id: 'turn',
    name: '转折',
    icon: Compass,
    meaning: '出现一个历史处境选择，影响本局获得的卡牌。',
  },
  {
    id: 'echo',
    name: '回声',
    icon: MessageCircleQuestion,
    meaning: '让你给这座城留下一句话，成为终局游记的结尾。',
  },
]

export const routeNodes: RouteNode[] = [
  {
    id: 'qianmen',
    order: 1,
    title: '城门开市',
    subtitle: '前门 / 正阳门外',
    place: '前门大街、正阳门外侧、可安全停留的步行区域',
    estimatedMinutes: '10-12 分钟',
    roleName: '清末掌柜',
    roleTitle: '城门外最会听消息的人',
    roleTone: '精明、亲切，关心买卖、人流和城门开合。',
    stageLine:
      '你拍到的不是一条街，是城门外最会说话的地方。人从这里进城，货从这里换手，消息也从这里散开。',
    photoPrompt: '拍一处门楼、招牌、铺面、人流或老字号细节。',
    photoTags: ['城门', '招牌', '人流', '老字号', '街面'],
    manualElements: ['门楼', '招牌', '铺面', '排队人群'],
    mission: '找一个能体现“买卖发生过”的细节，拍照或录 10 秒街声。',
    fallback: '如果照片识别失败，手动选择你看到的元素，掌柜会继续开场。',
    rewardCardIds: ['trade', 'qing-merchant', 'gate-questions', 'human-life'],
    optionalCardIds: ['gate'],
    choices: [
      {
        prompt: '你每天最先看见什么人进城？',
        reply: '最早的是送货的人，最晚的是舍不得散场的人。城门看的是规矩，街面看的是日子。',
      },
      {
        prompt: '买卖和城门有什么关系？',
        reply: '城门定了进出的边界，买卖把边界变热闹。没有人来，门再高也只是墙。',
      },
      {
        prompt: '今天的人还像从前那样经过这里吗？',
        reply: '脚步变快了，手里的东西也变了。可人进城时那一点期待，倒没有怎么变。',
      },
    ],
    imageKey: 'stage-qianmen',
    accent: '#a33a2d',
  },
  {
    id: 'axis',
    order: 2,
    title: '中轴取景',
    subtitle: '中轴视线点',
    place: '天安门外围或可合法停留的中轴视线点',
    estimatedMinutes: '8-10 分钟',
    roleName: '营城匠师',
    roleTitle: '把方向画进城市的人',
    roleTone: '沉稳、讲尺度，常用线、方向、对称和远近来解释城市。',
    stageLine:
      '你把线拍直了。可真正难的不是画一条线，是让一座城愿意沿着这条线呼吸几百年。',
    photoPrompt: '拍出一张“中轴感”照片：正中线、左右平衡或远近层次。',
    photoTags: ['对称', '轴线', '广场', '远近', '天空'],
    manualElements: ['道路中线', '左右平衡', '远处城楼', '开阔天空'],
    mission: '拍一张画面中有明确方向感的照片，或完成中轴观察题。',
    fallback: '如果现场不便拍照，选择最能体现中轴秩序的元素继续游戏。',
    rewardCardIds: ['axis', 'city-craftsman', 'symmetry', 'axis-scroll'],
    choices: [
      {
        prompt: '为什么一座城需要一条中轴线？',
        reply: '因为人会迷路，权力也会迷路。线让空间有方向，也让每一次行走知道自己在什么位置。',
      },
      {
        prompt: '方向和权力有什么关系？',
        reply: '方向本来只是方位。可当所有重要的门、路和视线都朝向它，它就成了秩序。',
      },
      {
        prompt: '今天重新设计城市，还会画这条线吗？',
        reply: '也许线会变柔软，但城市仍需要一个让人彼此确认的方向。',
      },
    ],
    imageKey: 'stage-axis',
    accent: '#315d87',
  },
  {
    id: 'corner-tower',
    order: 3,
    title: '宫城水影',
    subtitle: '故宫角楼 / 筒子河',
    place: '故宫角楼、筒子河外侧、可拍摄角楼与水面的公共区域',
    estimatedMinutes: '12-15 分钟',
    roleName: '宫廷画师',
    roleTitle: '替宫城收住光影的人',
    roleTone: '克制、讲究构图，常用屋檐、水面、倒影和光线回应用户。',
    stageLine:
      '你拍到的不是一座楼，而是一种被安排好的秩序。水替它收住了倒影，屋檐替它收住了天空。',
    photoPrompt: '拍摄角楼、屋檐、水面、倒影或天空。',
    photoTags: ['角楼', '屋檐', '水面', '倒影', '天空'],
    manualElements: ['屋檐', '水面', '倒影', '树影'],
    mission: '拍一个“角楼与当下同框”的画面：古建筑加行人、树影、天空或城市生活。',
    fallback: '如果人流太多或天气差，选择画面中的一个元素，由画师生成短独白。',
    rewardCardIds: ['palace', 'palace-painter', 'water-ripple', 'photographer-eye'],
    choices: [
      {
        prompt: '你为什么要这样画宫城？',
        reply: '因为宫城不只靠墙站住，也靠人的目光站住。画要让人知道，哪里是中心，哪里是边界。',
      },
      {
        prompt: '空间真的会改变人的心吗？',
        reply: '会。窄处让人低声，开阔处让人抬头。你站在这里，其实已经被空间轻轻安排过一次。',
      },
      {
        prompt: '如果你看见今天的游客，会想画下什么？',
        reply: '我会画他们举起手机的手。那像一支新画笔，把旧时光重新框进今天。',
      },
    ],
    imageKey: 'stage-corner-tower',
    accent: '#7e3238',
  },
  {
    id: 'jingshan',
    order: 4,
    title: '登高观城',
    subtitle: '景山',
    place: '景山公园内可登高观城区域，或景山周边外侧替代点',
    estimatedMinutes: '15-20 分钟',
    roleName: '观城史官',
    roleTitle: '从高处读城市长卷的人',
    roleTone: '沉稳、纵深感强，连接空间、时间和普通人的行走。',
    stageLine:
      '站高一点，城市就不只是街道了。你会看见它把宫城、街巷、树影和人的脚步，都排进同一张长卷。',
    photoPrompt: '拍一张“城市层次”：近处树木或人，中景建筑，远处天空或轴线。',
    photoTags: ['俯瞰', '树影', '轴线', '天空', '远景'],
    manualElements: ['近处树木', '中景建筑', '远处天空', '一条方向线'],
    mission: '观察城市的三层画面：近处、中景、远处，并选择哪一层最像今天的北京。',
    fallback: '如果不能登高，触发“想象登高”剧场，选择一个方向继续。',
    rewardCardIds: ['overlook', 'city-historian', 'axis-scroll', 'time-traveler'],
    choices: [
      {
        prompt: '你从高处最先看见什么？',
        reply: '先看见秩序，后看见缝隙。真正的城市，总是在安排和自由之间活着。',
      },
      {
        prompt: '这座城的秩序和普通人的生活有什么关系？',
        reply: '秩序给人方向，生活给人理由。没有生活，方向只是一条冷线。',
      },
      {
        prompt: '如果看不见中轴线，它还存在吗？',
        reply: '存在。看不见的线，常常藏在人的路线、记忆和习惯里。',
      },
    ],
    imageKey: 'stage-jingshan',
    accent: '#3d705e',
  },
  {
    id: 'shichahai',
    order: 5,
    title: '旧城回声',
    subtitle: '鼓楼 / 什刹海',
    place: '鼓楼外侧、什刹海周边、胡同入口等可停留区域',
    estimatedMinutes: '12-15 分钟',
    roleName: '胡同居民',
    roleTitle: '把日子过成城市记忆的人',
    roleTone: '亲近、朴素，有生活气，关心声音、门牌、晚饭和人的去留。',
    stageLine:
      '城楼上的钟声远，胡同里的锅铲近。你走到这里，棋局就不只属于帝王，也属于晚饭前回家的人。',
    photoPrompt: '拍摄胡同、门牌、湖面、自行车、店铺或街声。',
    photoTags: ['胡同', '门牌', '湖面', '自行车', '街声'],
    manualElements: ['车铃', '人声', '水声', '脚步声'],
    mission: '录制 10 秒城市声音，或拍一处“仍在使用的生活细节”。',
    fallback: '如果不想录音，选择你听见的声音，系统会生成对应回声。',
    rewardCardIds: ['life', 'echo', 'hutong-resident', 'bell', 'old-city-evening'],
    choices: [
      {
        prompt: '你一天里最熟悉的声音是什么？',
        reply: '是门响、车铃、水声和锅铲。大历史走得很响，日子其实更会留人。',
      },
      {
        prompt: '旧城最怕失去什么？',
        reply: '不是只怕房子旧了，而是怕人不再认识回家的路，也不再记得谁在窗下说过话。',
      },
      {
        prompt: '我可以把哪句话带到未来？',
        reply: '就带一句：城市不是被参观完的，它是被人一遍遍生活出来的。',
      },
    ],
    imageKey: 'stage-shichahai',
    accent: '#8b5835',
  },
]

export function getCard(cardId: string) {
  return getGameCard(cardId)
}

export function createStoryTitle(cardIds: string[]) {
  const has = (id: string) => cardIds.includes(id)
  if (has('axis') && has('palace') && has('overlook')) {
    return '一座城如何把时间排成一条线'
  }
  if (has('trade') && has('life') && has('echo')) {
    return '我在北京看见秩序旁边的生活'
  }
  if (has('palace') && has('life')) {
    return '从宫城水影到胡同灯火'
  }
  if (has('gate') && has('axis')) {
    return '我从一座城门走进一条轴线'
  }
  return '我的北京时空游记'
}
