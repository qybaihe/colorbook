export type TileSceneMeta = {
  sceneImage: string
  storyHint: string
  uploadTitle: string
  uploadHelp: string
  fallbackLabel: string
  roleBio: string
  sceneTone: string
}

const fallbackScene: TileSceneMeta = {
  sceneImage: '/assets/beijing/tile-scenes-24/tile-02-gate-market-shopkeeper-theater.png',
  storyHint: '从现场画面里选出这一格的证据，再让角色把它接进棋局。',
  uploadTitle: '拍摄或上传现场照片',
  uploadHelp: '如果不方便拍照，也可以直接选择画面元素继续。',
  fallbackLabel: '不方便拍照，直接继续',
  roleBio: '角色会根据你选择的现场元素改变讲述重点，把这一格从普通地点变成可完成的城市事件。',
  sceneTone: '城市事件牌',
}

export const nodeSceneMeta: Record<string, TileSceneMeta> = {
  qianmen: {
    sceneImage: '/assets/beijing/tile-scenes-24/tile-02-gate-market-shopkeeper-theater.png',
    storyHint: '城门看的是规矩，街面看的是日子。先从一张照片或几个现场元素里，把前门的买卖、人流和消息请上桌。',
    uploadTitle: '拍一处城门外的证据',
    uploadHelp: '门楼、招牌、铺面、人流或老字号细节都可以成为这一格的线索。',
    fallbackLabel: '不方便拍照，手选元素继续',
    roleBio: '他守着门外的铺面和往来的脚步，熟悉谁赶早进城、谁带着货来、哪条街最先热闹起来。',
    sceneTone: '市声',
  },
  axis: {
    sceneImage: '/assets/beijing/tile-scenes-24/tile-04-axis-symmetry-photo.png',
    storyHint: '这一格不要求玩家拍得漂亮，而是让画面里的中线、左右平衡和远近关系成为城市秩序的证据。',
    uploadTitle: '拍一张有方向感的照片',
    uploadHelp: '道路中线、左右平衡、远处城楼和开阔天空都能触发中轴线索。',
    fallbackLabel: '现场不便停留，手选中轴元素',
    roleBio: '他不急着讲年代，先看线、门、路和人的站位；在他眼里，方向就是城市和人互相确认的方式。',
    sceneTone: '时辰',
  },
  'corner-tower': {
    sceneImage: '/assets/beijing/tile-scenes-24/tile-09-corner-tower-reflection-painter.png',
    storyHint: '场景里已经有屋檐和水面，上传框只需要轻轻浮在前景，让倒影、树影和天空成为画师的线索。',
    uploadTitle: '拍屋檐、水面或倒影',
    uploadHelp: '古建筑加行人、树影、天空或城市生活，都能让画师回应这一刻。',
    fallbackLabel: '人流太多，改用手选元素',
    roleBio: '他关心边界、构图和倒影，也关心今天的人如何把旧建筑重新框进自己的画面。',
    sceneTone: '风物',
  },
  jingshan: {
    sceneImage: '/assets/beijing/tile-scenes-24/tile-15-jingshan-three-layer-view.png',
    storyHint: '站高一点，城市就变成一张长卷。玩家需要从近景、中景和远景里选出今天的北京。',
    uploadTitle: '拍一张城市三层画面',
    uploadHelp: '近处树木或人、中景建筑、远处天空或方向线，都可以组成登高观察。',
    fallbackLabel: '不能登高，想象一个方向继续',
    roleBio: '他从高处读城市，既看宫城和轴线，也看街巷、树影和普通人的脚步怎样排进同一张长卷。',
    sceneTone: '长卷',
  },
  shichahai: {
    sceneImage: '/assets/beijing/tile-scenes-24/tile-19-old-city-echo-finale-note.png',
    storyHint: '旧城把前面的线索收束成一段旁白，让胡同、湖面、车铃和人声把中轴从秩序带回日常。',
    uploadTitle: '拍生活细节或记录声音',
    uploadHelp: '胡同、门牌、湖面、自行车、店铺或街声，都能进入终局回声。',
    fallbackLabel: '不录音，选择一个听见的声音',
    roleBio: '他把日子过成城市记忆，关心声音、门牌、晚饭和人的去留，也关心玩家最后会把哪句话带走。',
    sceneTone: '回声',
  },
}

export function getNodeSceneMeta(nodeId: string) {
  return nodeSceneMeta[nodeId] ?? fallbackScene
}
