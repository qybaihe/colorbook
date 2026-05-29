import type { TileSceneMeta } from './tileScenes'

const fallbackScene: TileSceneMeta = {
  sceneImage: '/assets/tianjin/tile-scenes-haihe/tile-01-century-clock-letter.jpg',
  storyHint: '从现场画面里选出这一格的证据，再让角色把它接进海河来信。',
  uploadTitle: '拍摄或上传现场照片',
  uploadHelp: '如果不方便拍照，也可以直接选择画面元素继续。',
  fallbackLabel: '不方便拍照，直接继续',
  roleBio: '角色会根据你选择的现场元素改变讲述重点，把这一格从普通地点变成可完成的城市事件。',
  sceneTone: '城市事件牌',
}

export const nodeSceneMeta: Record<string, TileSceneMeta> = {
  'jiefang-bridge': {
    sceneImage: '/assets/tianjin/tile-scenes-haihe/tile-06-jiefang-bridge-photo.jpg',
    storyHint: '海河像一条慢慢展开的路。先从桥影、河岸、人流或路牌里，把第一封来信请上桌。',
    uploadTitle: '拍一处桥边来信',
    uploadHelp: '桥栏、河水、路牌、倒影或往来人流都可以成为这一格的线索。',
    fallbackLabel: '不方便拍照，手选桥边元素',
    roleBio: '他熟悉桥边的脚步和信封的折痕，知道哪阵风会把城市消息送到今天。',
    sceneTone: '来信',
  },
  'italian-quarter': {
    sceneImage: '/assets/tianjin/tile-scenes-haihe/tile-08-jiefang-road-facade.jpg',
    storyHint: '这一格不要求拍得宏大，而是让画面里的门窗、街灯、尺度和转角成为城市混合语法的证据。',
    uploadTitle: '拍一处街角建筑语法',
    uploadHelp: '拱窗、街灯、转角、旧立面和桥边视线都能触发建筑线索。',
    fallbackLabel: '现场不便停留，手选建筑元素',
    roleBio: '他先看比例、门窗和街角的转身方式；在他眼里，建筑风格最终都会被人的日常重新翻译。',
    sceneTone: '风物',
  },
  'ancient-culture-street': {
    sceneImage: '/assets/tianjin/tile-scenes-haihe/tile-10-ancient-culture-street.jpg',
    storyHint: '场景里已经有匾额、摊铺和颜色，上传框只需要轻轻浮在前景，让纹样和香火成为摊主的线索。',
    uploadTitle: '拍民俗纹样或街巷细节',
    uploadHelp: '年画、匾额、摊铺、门脸、香火或手作细节都能让摊主回应这一刻。',
    fallbackLabel: '人流太多，改用手选元素',
    roleBio: '他关心颜色、愿望和生意，也关心今天的人如何把旧民俗重新带回自己的日子。',
    sceneTone: '市声',
  },
  wudadao: {
    sceneImage: '/assets/tianjin/tile-scenes-haihe/tile-16-five-avenues-courtyard.jpg',
    storyHint: '走慢一点，街区就变成一张层次清楚的画。玩家需要从门窗、院墙、街树和远处天空里选出今天的五大道。',
    uploadTitle: '拍一张洋楼三层画面',
    uploadHelp: '近处街树、中景洋楼、远处天空或路牌，都可以组成慢行观察。',
    fallbackLabel: '不能停留，想象一个街角继续',
    roleBio: '他从分寸里读城市，既看门窗和院墙，也看街树、路牌和普通人的脚步怎样保持距离。',
    sceneTone: '长卷',
  },
  'tianjin-eye': {
    sceneImage: '/assets/tianjin/tile-scenes-haihe/tile-24-haihe-finale.jpg',
    storyHint: '夜色把前面的线索收束成一封回信，让灯、船、河风和脚步把海河从路线带回记忆。',
    uploadTitle: '拍夜色细节或记录声音',
    uploadHelp: '天津之眼、河面、夜灯、桥影、船或路人剪影，都能进入终局回信。',
    fallbackLabel: '不录音，选择一个夜色元素',
    roleBio: '他把夜航变成城市记忆，关心灯、风、船声和人的去留，也关心玩家最后会把哪句话带走。',
    sceneTone: '回声',
  },
}

export function getNodeSceneMeta(nodeId: string) {
  return nodeSceneMeta[nodeId] ?? fallbackScene
}
