import type { DiceFace, RouteNode } from './beijingGame'
import {
  AudioLines,
  Clock3,
  Compass,
  Feather,
  MessageCircleQuestion,
  ScrollText,
} from 'lucide-react'

export const chapter = {
  city: '天津',
  title: '海河来信',
  subtitle: '从桥影走到夜航回声',
  positioning:
    '沿海河与街巷公共路线行走，用照片、市声、时空骰和角色对话，收集一封写给天津的城市回信。',
}

export const diceFaces: DiceFace[] = [
  {
    id: 'time',
    name: '时辰',
    icon: Clock3,
    meaning: '根据此刻光线、桥影和人流，改变角色开场的氛围。',
  },
  {
    id: 'object',
    name: '风物',
    icon: Feather,
    meaning: '把照片里的桥、窗、匾额、水纹或街声变成剧情道具。',
  },
  {
    id: 'letter',
    name: '来信',
    icon: ScrollText,
    meaning: '城市角色向你提出一个问题，等待你把答案带回海河边。',
  },
  {
    id: 'sound',
    name: '市声',
    icon: AudioLines,
    meaning: '触发声音观察任务，记录天津当下的河风、脚步和街巷响动。',
  },
  {
    id: 'turn',
    name: '转折',
    icon: Compass,
    meaning: '出现一次路线选择，让桥、街巷和夜航决定下一段语气。',
  },
  {
    id: 'echo',
    name: '回声',
    icon: MessageCircleQuestion,
    meaning: '让你给天津留下一句话，成为终局游记的落款。',
  },
]

export const routeNodes: RouteNode[] = [
  {
    id: 'jiefang-bridge',
    order: 1,
    title: '海河启程',
    subtitle: '解放桥 / 津湾广场',
    place: '解放桥、津湾广场与海河两岸可安全停留的步行区域',
    estimatedMinutes: '10-12 分钟',
    roleName: '海河邮差',
    roleTitle: '把城市消息沿河送到今天的人',
    roleTone: '亲切、机敏，常用桥、水线、邮戳和往来脚步解释城市。',
    stageLine:
      '你站在桥边，河水把城市折成两行字。一行写着来处，一行写着今天。',
    photoPrompt: '拍一处桥、河岸、路牌、倒影或往来人流。',
    photoTags: ['桥影', '河岸', '路牌', '人流', '邮戳'],
    manualElements: ['桥栏', '河水', '路牌', '往来人流'],
    mission: '拍一处桥、河岸、路牌或人流，让第一封海河来信落到棋盘上。',
    fallback: '如果不便拍照，选择桥边看到的元素，由邮差继续开场。',
    rewardCardIds: ['haihe', 'haihe-postman', 'haihe-questions', 'bridge-shadow'],
    choices: [
      {
        prompt: '海河为什么像一条路？',
        reply: '因为它不急着指挥城市，只是把桥、街、码头和人的日常慢慢串起来。',
      },
      {
        prompt: '你把信送给谁？',
        reply: '送给赶路的人，也送给愿意停一下的人。城市消息最怕没人拆开看。',
      },
      {
        prompt: '今天的人还会读城市来信吗？',
        reply: '会。只是信不一定写在纸上，也可能写在一张照片、一阵风和一句随口说出的话里。',
      },
    ],
    imageKey: 'stage-jiefang-bridge',
    accent: '#2e7182',
  },
  {
    id: 'italian-quarter',
    order: 2,
    title: '万国街巷',
    subtitle: '意式风情区 / 北安桥',
    place: '意式风情区、北安桥周边与可步行停留的街角空间',
    estimatedMinutes: '10-12 分钟',
    roleName: '建筑译员',
    roleTitle: '把不同立面翻译成城市语法的人',
    roleTone: '沉稳、敏锐，常用门窗、尺度、街角和混合风格解释城市。',
    stageLine:
      '你看到的不只是一栋楼，而是一段被翻译过的城市句子。拱窗、街灯和转角正在互相接话。',
    photoPrompt: '拍一处中西混合的门窗、立面、街角、街灯或桥边视线。',
    photoTags: ['拱窗', '立面', '街灯', '街角', '混合风格'],
    manualElements: ['拱窗', '街灯', '转角', '旧立面'],
    mission: '拍一张能体现“城市混合语法”的照片，或完成街角观察题。',
    fallback: '如果人流太多，选择一个建筑细节，让译员解释这段街巷。',
    rewardCardIds: ['architecture', 'architecture-translator', 'opening-scroll', 'street-corner-sound'],
    choices: [
      {
        prompt: '什么叫城市语法？',
        reply: '就是门窗怎么排、街角怎么转、人在什么尺度里愿意慢下来。风格只是表面，使用才是语法。',
      },
      {
        prompt: '这些建筑是外来的，为什么又像天津？',
        reply: '因为它们被天津的风、话音和日常重新使用过。被生活改写以后，建筑就不只属于来处。',
      },
      {
        prompt: '我应该先看哪里？',
        reply: '先看转角。城市最诚实的地方，常常在两条路刚刚碰面的那一瞬。',
      },
    ],
    imageKey: 'stage-italian-quarter',
    accent: '#8d5a2b',
  },
  {
    id: 'ancient-culture-street',
    order: 3,
    title: '津门香火',
    subtitle: '古文化街 / 天后宫',
    place: '古文化街、天后宫周边与可合法停留的民俗街区',
    estimatedMinutes: '12-15 分钟',
    roleName: '年画摊主',
    roleTitle: '把民俗纹样摊开给今天的人看',
    roleTone: '热络、细致，喜欢从匾额、纹样、摊铺和香火生活里找故事。',
    stageLine:
      '摊子一摆开，颜色先说话。门额、年画、香火和人声，把旧日子折成一张新的明信片。',
    photoPrompt: '拍民俗纹样、匾额、摊铺、门脸、香火或手作细节。',
    photoTags: ['年画', '匾额', '摊铺', '纹样', '香火'],
    manualElements: ['年画', '匾额', '摊铺', '纹样'],
    mission: '找一处仍在被使用的民俗细节，拍照或写下它给你的第一印象。',
    fallback: '如果现场不便拍照，选择一个民俗元素，让摊主讲成一段小戏。',
    rewardCardIds: ['tianhou', 'new-year-print-vendor', 'human-life', 'letter'],
    choices: [
      {
        prompt: '年画为什么要这么热闹？',
        reply: '热闹不是乱，是把愿望画得人人看得见。人盼平安、盼团圆，颜色就替人先开口。',
      },
      {
        prompt: '香火和市井有什么关系？',
        reply: '香火把心愿聚起来，市井把日子摊开来。天津的老街，常常是这两件事一起发生。',
      },
      {
        prompt: '今天还能从这些纹样里读到什么？',
        reply: '读到人愿意把好日子留下来。图案会旧，但愿望总是新的。',
      },
    ],
    imageKey: 'stage-ancient-culture-street',
    accent: '#a64532',
  },
  {
    id: 'wudadao',
    order: 4,
    title: '洋楼慢行',
    subtitle: '五大道',
    place: '五大道街区、民园广场周边与可步行观察的小洋楼街段',
    estimatedMinutes: '15-20 分钟',
    roleName: '洋楼管家',
    roleTitle: '替院墙、门窗和街树保管分寸的人',
    roleTone: '克制、优雅，讲究距离、秩序、树影和慢行的节奏。',
    stageLine:
      '到了五大道，脚步会自动放轻。门窗在看街，树影在看人，院墙把故事留在刚好能想象的位置。',
    photoPrompt: '观察一栋小洋楼的门、窗、院墙、街树或路牌。',
    photoTags: ['洋楼', '门窗', '院墙', '街树', '路牌'],
    manualElements: ['门窗', '院墙', '街树', '路牌'],
    mission: '拍一张“近景、中景、远景”都有层次的五大道画面。',
    fallback: '如果不能停留，选择一个慢行细节，让管家把它写进路线记录。',
    rewardCardIds: ['wudadao', 'wudadao-housekeeper', 'photographer-eye', 'time-traveler'],
    choices: [
      {
        prompt: '为什么这里适合慢慢走？',
        reply: '因为楼不急着解释自己。你慢一点，门窗、树影、院墙和路牌才会按顺序出现。',
      },
      {
        prompt: '院墙把故事藏住了吗？',
        reply: '也藏，也留。城市有时不把全部讲完，才让人愿意多走一段。',
      },
      {
        prompt: '今天的人该怎样看这些洋楼？',
        reply: '先看它们怎样被街道继续使用。建筑活着，不是因为年代久，而是因为仍在和人保持距离。',
      },
    ],
    imageKey: 'stage-wudadao',
    accent: '#4f6f55',
  },
  {
    id: 'tianjin-eye',
    order: 5,
    title: '海河回信',
    subtitle: '天津之眼 / 三岔河口',
    place: '天津之眼、三岔河口、海河夜景周边可停留区域',
    estimatedMinutes: '12-15 分钟',
    roleName: '夜航船长',
    roleTitle: '在夜色里替城市收束回声的人',
    roleTone: '温柔、开阔，常用灯、船、风、水面和远处人声收束故事。',
    stageLine:
      '白天的桥都退后了，夜色把河面打开。你走到这里，城市开始回信。',
    photoPrompt: '拍天津之眼、河面、夜灯、桥影、船或路人剪影。',
    photoTags: ['夜灯', '河面', '天津之眼', '桥影', '船声'],
    manualElements: ['夜灯', '河风', '船声', '桥影'],
    mission: '录 10 秒河边声音，或拍一处“夜色仍在使用的城市细节”。',
    fallback: '如果不录音，选择你听见或看见的夜色元素，船长会完成回信。',
    rewardCardIds: ['reply', 'night-letter', 'night-boat-captain', 'water-ripple', 'dock-life'],
    choices: [
      {
        prompt: '城市为什么要在夜里回信？',
        reply: '白天负责赶路，夜里负责想清楚。灯亮起来以后，河面会把没说完的话慢慢送回来。',
      },
      {
        prompt: '我该把哪句话留给天津？',
        reply: '留一句你真的听见的话。不必宏大，只要能被河风带走，再被未来的人捡到。',
      },
      {
        prompt: '这局棋走完了吗？',
        reply: '棋盘走完了，路还在。只要你记得哪座桥、哪盏灯和哪阵风，天津就还在回信。',
      },
    ],
    imageKey: 'stage-tianjin-eye',
    accent: '#344f8a',
  },
]

export function createStoryTitle(cardIds: string[]) {
  const has = (id: string) => cardIds.includes(id)
  if (has('haihe') && has('architecture') && has('wudadao')) {
    return '一条海河如何把城市写成回信'
  }
  if (has('tianhou') && has('dock-life') && has('reply')) {
    return '我在天津读到市井、香火和夜航'
  }
  if (has('architecture') && has('wudadao')) {
    return '从万国街巷到洋楼树影'
  }
  if (has('haihe') && has('reply')) {
    return '我沿海河拆开一封城市来信'
  }
  return '我的天津海河游记'
}
