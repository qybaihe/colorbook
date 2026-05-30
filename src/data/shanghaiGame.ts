import {
  AudioLines,
  Camera,
  Clock3,
  Compass,
  Disc3,
  DoorOpen,
} from 'lucide-react'
import type { DiceFace, RouteNode } from './beijingGame'

export const chapter = {
  city: '上海',
  title: '弄堂回声',
  subtitle: '把门牌、橱窗和街声压成一张城市唱片',
  positioning:
    '沿人民广场、南京路、外滩、圆明园路、石库门与苏州河行走，把门牌、橱窗、街声、倒影和霓虹整理成一张弄堂回声唱片。',
}

export const diceFaces: DiceFace[] = [
  {
    id: 'doorplate',
    name: '门牌',
    icon: DoorOpen,
    meaning: '从门牌、门洞和招牌进入本局，确认今天要追踪的城市切片。',
  },
  {
    id: 'window',
    name: '橱窗',
    icon: Camera,
    meaning: '观察玻璃内外、灯光、陈列和街面倒影，让城市变成一格舞台。',
  },
  {
    id: 'sound',
    name: '街声',
    icon: AudioLines,
    meaning: '记录脚步、人声、店声或车声，把现场声音压进终局音轨。',
  },
  {
    id: 'reflection',
    name: '倒影',
    icon: Compass,
    meaning: '用江面、玻璃、金属和远近关系改变本回合叙事焦点。',
  },
  {
    id: 'neon',
    name: '霓虹',
    icon: Clock3,
    meaning: '选择夜色主色和终局情绪，让城市切片带上唱片封面感。',
  },
  {
    id: 'record',
    name: '唱片',
    icon: Disc3,
    meaning: '把已获得的门牌、街声、橱窗和江边卡整理成一张回声唱片。',
  },
]

export const routeNodes: RouteNode[] = [
  {
    id: 'node-doorplate',
    order: 1,
    title: '第一张门牌',
    subtitle: '人民广场 / 南京路入口',
    place: '人民广场、南京路入口、可安全停留的街角或门牌附近',
    estimatedMinutes: '8-10 分钟',
    roleName: '门牌递信人',
    roleTitle: '把街区入口递到玩家手里的人',
    roleTone: '亲切、敏锐，常用门牌、门洞和招牌提示下一步。',
    stageLine:
      '你不用先走很远。上海常常从一块门牌、一扇门洞和一盏招牌灯开始，把整条街悄悄递到你手里。',
    photoPrompt: '拍一处门牌、门洞、招牌、街角标识或入口灯光。',
    photoTags: ['门牌', '门洞', '招牌', '入口', '街角'],
    manualElements: ['门牌', '门洞', '招牌', '街角灯'],
    mission: '选择今天追踪门牌、橱窗、街声或霓虹，并记录第一个入口细节。',
    fallback: '如果现场不方便拍照，选择你最先注意到的门牌或招牌继续。',
    rewardCardIds: [
      'shanghai-doorplate',
      'nongtang-echo',
      'first-doorplate',
      'doorplate-clue',
      'doorplate-event',
      'doorplate-messenger',
      'light-hint',
    ],
    choices: [
      {
        prompt: '为什么上海要从门牌开始？',
        reply: '因为门牌像一枚小小的唱针，落下去，街区才开始发声。先看入口，再听这条路怎么把人带进去。',
      },
      {
        prompt: '门洞和招牌会告诉我什么？',
        reply: '门洞告诉你谁在这里生活，招牌告诉你这条街怎样营业。它们都不宏大，但都很诚实。',
      },
      {
        prompt: '如果我没拍到好照片呢？',
        reply: '那就选一个最像入口的元素。上海不怕你慢半拍，它会把第一张门牌先替你留住。',
      },
    ],
    imageKey: 'stage-doorplate',
    accent: '#0f6b70',
  },
  {
    id: 'node-street-sound',
    order: 2,
    title: '街口人流',
    subtitle: '南京路',
    place: '南京路步行街、商铺外侧、可停留的安全人行区域',
    estimatedMinutes: '8-12 分钟',
    roleName: '街声录音师',
    roleTitle: '把脚步和店声采进唱片的人',
    roleTone: '短句、敏锐，关心脚步、人声、店声和车声。',
    stageLine:
      '别急着说看见了什么，先听。脚步、人声、店门开合，都是这条街今天压进唱片的第一层底噪。',
    photoPrompt: '录或选择一段脚步、人声、店声、车声，也可拍一处人流边界。',
    photoTags: ['脚步', '人声', '店声', '车声', '人流'],
    manualElements: ['脚步声', '人声', '店声', '车声'],
    mission: '录 10 秒街声，或手选一种现场声音作为本局街声音轨。',
    fallback: '如果环境太吵或不想录音，选择你听见的声音标签继续。',
    rewardCardIds: [
      'street-sound-track',
      'crowd-event',
      'sound-sampler',
      'street-sound-recordist',
      'echo-event',
      'safe-crossing',
    ],
    choices: [
      {
        prompt: '一条街最重要的声音是什么？',
        reply: '不是最大的声音，是反复出现的声音。脚步、人声和店门声一层层叠起来，街才不是空布景。',
      },
      {
        prompt: '人太多的时候怎么办？',
        reply: '退到边上，听边界。别拍陌生人的脸，拍灯、路牌或地面的影子，也能把人流留下来。',
      },
      {
        prompt: '街声能进终局吗？',
        reply: '能。你给它贴一个情绪标签，终局唱片里就会多一条属于今天的底轨。',
      },
    ],
    imageKey: 'stage-street-sound',
    accent: '#2f6278',
  },
  {
    id: 'node-bund-reflection',
    order: 3,
    title: '外滩镜面',
    subtitle: '外滩 / 黄浦江边',
    place: '外滩公共观景区域、黄浦江边安全停留点',
    estimatedMinutes: '12-15 分钟',
    roleName: '外滩摄影师',
    roleTitle: '把江面和远近关系调成构图的人',
    roleTone: '克制、讲构图，常用倒影、江面、远近和天光回应玩家。',
    stageLine:
      '外滩最会把远处拉近。江面、玻璃、金属和人群的边缘，会把同一个上海折成好几层。',
    photoPrompt: '拍江面、建筑、玻璃、金属或人群边缘里的倒影关系。',
    photoTags: ['江面', '倒影', '远近', '玻璃', '建筑'],
    manualElements: ['江面', '倒影', '远处楼影', '人群边缘'],
    mission: '找一处能体现“江边同框”的画面，或选择现场倒影元素。',
    fallback: '如果天气或人流不适合拍照，手选江面、楼影或玻璃继续。',
    rewardCardIds: [
      'bund-reflection',
      'river-frame',
      'bund-photographer',
      'time-event',
      'quick-snapshot',
    ],
    choices: [
      {
        prompt: '外滩为什么适合拍倒影？',
        reply: '因为这里的远近关系很密。江面把建筑放慢，玻璃把人流拆开，一张照片里会出现两个时间。',
      },
      {
        prompt: '我应该先看哪里？',
        reply: '先看边缘。水和岸、玻璃和街、人群和空处，真正的构图常常从边缘开始。',
      },
      {
        prompt: '阴天会不会不好看？',
        reply: '阴天适合看层次。少一点亮光，反而能听见江面把城市压低后的声音。',
      },
    ],
    imageKey: 'stage-bund-reflection',
    accent: '#365f87',
  },
  {
    id: 'node-window',
    order: 4,
    title: '橱窗反光',
    subtitle: '圆明园路 / 北京东路',
    place: '圆明园路、北京东路、街角橱窗或可停留的店外区域',
    estimatedMinutes: '10-12 分钟',
    roleName: '橱窗布景师',
    roleTitle: '把玻璃内外布成一格剧场的人',
    roleTone: '轻盈、现代，关注玻璃、灯光、陈列和街面关系。',
    stageLine:
      '橱窗不是把里面展示给外面看，它也会把街面收进来。玻璃一亮，城市就有了前景和幕后。',
    photoPrompt: '拍一处能同时看见玻璃内外、灯光、陈列或招牌反光的画面。',
    photoTags: ['橱窗', '玻璃', '灯光', '陈列', '反光'],
    manualElements: ['玻璃', '灯光', '陈列', '街面反光'],
    mission: '从窗、灯、招牌、玻璃反光里选一个切片，让它进入本局橱窗音轨。',
    fallback: '如果不方便拍摄商业空间，选择窗外灯光或街面反光继续。',
    rewardCardIds: [
      'window-core',
      'window-event',
      'glass-observer',
      'glass-reflection-clue',
      'cafe-window-clue',
      'window-set-designer',
      'rain-window-fallback',
    ],
    choices: [
      {
        prompt: '橱窗里最该看什么？',
        reply: '看里面，也看外面。陈列是舞台，反光是观众，街面经过时，橱窗才真正开始表演。',
      },
      {
        prompt: '玻璃为什么会有城市感？',
        reply: '因为它不只透明，也会反射。透明让你看见展示，反射让展示被今天的街重新解释。',
      },
      {
        prompt: '如果不能拍店里呢？',
        reply: '别进店也没关系。只拍外侧灯光、窗边影子或招牌边缘，橱窗剧场仍然成立。',
      },
    ],
    imageKey: 'stage-window',
    accent: '#7b8a3c',
  },
  {
    id: 'node-shikumen',
    order: 5,
    title: '石库门转角',
    subtitle: '新天地 / 石库门街区',
    place: '新天地、石库门街区外侧、可停留的公共街角',
    estimatedMinutes: '12-15 分钟',
    roleName: '石库门住客',
    roleTitle: '在门环和砖缝里保存生活的人',
    roleTone: '温和、有生活感，常用门、砖、窗和日常痕迹说话。',
    stageLine:
      '这扇门不急着讲历史。你看门环、砖缝、窗边和路过的人，就能听见日子怎样在里面住过。',
    photoPrompt: '拍或选择砖、门、窗、栏杆、门牌、路牌或日常痕迹。',
    photoTags: ['石库门', '门环', '砖缝', '窗', '日常'],
    manualElements: ['门环', '砖缝', '窗', '路牌'],
    mission: '与石库门住客对话：一扇门如何保存生活，而不是只保存历史。',
    fallback: '如果不能停留，选择一处门、砖或窗的纹理继续。',
    rewardCardIds: [
      'shikumen-door-ring',
      'brick-gap-clue',
      'shikumen-resident',
      'corner-event',
      'corner-ticket',
      'family-sign-hunter',
    ],
    choices: [
      {
        prompt: '一扇门怎么保存生活？',
        reply: '门保存进出，砖保存靠过的手，窗保存看出去的习惯。生活不一定写在牌子上，常常留在边角。',
      },
      {
        prompt: '石库门最怕被误解成什么？',
        reply: '怕只被当成背景。它不只是拍照框，也曾经是饭点、门响、邻里说话和夜里等人回来的地方。',
      },
      {
        prompt: '我该把什么带走？',
        reply: '带走一个细节就够了。门环、砖缝或窗边影子，它们会比一大段讲解更耐听。',
      },
    ],
    imageKey: 'stage-shikumen',
    accent: '#8b473e',
  },
  {
    id: 'node-finale',
    order: 6,
    title: '霓虹唱片',
    subtitle: '苏州河 / 外滩夜景',
    place: '苏州河、外滩夜景或可安全停留的夜色公共区域',
    estimatedMinutes: '10-15 分钟',
    roleName: '夜色放映员',
    roleTitle: '把夜色和卡牌收束成唱片的人',
    roleTone: '低柔、精致、有收束感，适合夜景和终局情绪。',
    stageLine:
      '夜色把白天的门牌、街声、橱窗和江面都放回唱片里。现在只差你给这张唱片选一个主色。',
    photoPrompt: '拍夜灯、河面、桥影、霓虹、窗影或手选本局夜色主色。',
    photoTags: ['霓虹', '夜灯', '河面', '窗影', '唱片'],
    manualElements: ['蓝色夜光', '金色灯牌', '河面反光', '窗影'],
    mission: '选择终局封面元素：门牌、江面、霓虹或窗影，把本局压成弄堂回声唱片。',
    fallback: '如果夜景不可用，选择一个颜色和一句话完成终局。',
    rewardCardIds: [
      'neon-record',
      'night-sample',
      'neon-color-clue',
      'night-projectionist',
      'shopkeeper',
      'suzhou-creek-postman',
      'city-editor',
      'city-slice-collage',
      'undeveloped-photo',
    ],
    choices: [
      {
        prompt: '为什么终局是一张唱片？',
        reply: '因为上海这一局不是只看路线，而是收集切片。门牌是一声开场，街声是底噪，霓虹是最后落下的唱针。',
      },
      {
        prompt: '夜色应该选什么颜色？',
        reply: '选你真正记住的那一种。蓝色像河风，金色像灯牌，绿色像橱窗边缘，灰色也可以很上海。',
      },
      {
        prompt: '我可以把哪句话留给上海？',
        reply: '留一句不必宏大的话。只要它能把今天的门牌、玻璃和脚步重新叫回来，就够了。',
      },
    ],
    imageKey: 'stage-finale',
    accent: '#6c4f90',
  },
]

export function createStoryTitle(cardIds: string[]) {
  const has = (id: string) => cardIds.includes(id)
  if (has('shanghai-doorplate') && has('window-core') && has('neon-record')) {
    return '我在上海收集了一张夜色唱片'
  }
  if (has('bund-reflection') && has('street-sound-track') && has('shikumen-door-ring')) {
    return '从江边倒影到弄堂门口'
  }
  if (has('cafe-window-clue') && has('shopkeeper')) {
    return '我把上海的一盏小店灯带回来了'
  }
  return '我的上海弄堂回声'
}
