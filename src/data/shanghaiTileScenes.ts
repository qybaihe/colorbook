import type { TileSceneMeta } from './tileScenes'

const fallbackScene: TileSceneMeta = {
  sceneImage: '/assets/shanghai/tile-scenes-24/tile-01-doorplate-start.png',
  storyHint: '从画面里选择一个上海切片，再让角色把它压进本局唱片。',
  uploadTitle: '拍摄或上传现场照片',
  uploadHelp: '如果不方便拍照，也可以直接选择画面元素继续。',
  fallbackLabel: '不方便拍照，手选一个切片',
  roleBio: '角色会根据门牌、玻璃、街声、江面或夜色改变讲述重点。',
  sceneTone: '城市切片',
}

export const nodeSceneMeta: Record<string, TileSceneMeta> = {
  'node-doorplate': {
    sceneImage: '/assets/shanghai/tile-scenes-24/tile-01-doorplate-start.png',
    storyHint: '这一格从一块门牌开始。门牌、门洞、招牌和入口灯光，都能成为上海回声唱片的第一声。',
    uploadTitle: '拍一处门牌或入口',
    uploadHelp: '门牌、门洞、招牌、入口灯或街角标识都可以。',
    fallbackLabel: '手选一个入口元素',
    roleBio: '门牌递信人会把入口说成一枚唱针，让街区从这里开始发声。',
    sceneTone: '门牌',
  },
  'node-street-sound': {
    sceneImage: '/assets/shanghai/tile-scenes-24/tile-02-street-flow-sound.png',
    storyHint: '先听，再看。脚步、人声、店声、车声会成为本局唱片的底噪。',
    uploadTitle: '录或选择一段街声',
    uploadHelp: '不录音也可以手选脚步、人声、店声或车声。',
    fallbackLabel: '手选声音标签',
    roleBio: '街声录音师用短句捕捉现场，不拍陌生人，只收集城市边界。',
    sceneTone: '街声',
  },
  'node-bund-reflection': {
    sceneImage: '/assets/shanghai/tile-scenes-24/tile-05-river-reflection.png',
    storyHint: '江面、玻璃和金属会把上海折成好几层。找一个倒影，让远处和近处同框。',
    uploadTitle: '拍江面或玻璃倒影',
    uploadHelp: '水面、玻璃、金属、楼影和人群边缘都能成为构图线索。',
    fallbackLabel: '手选倒影元素',
    roleBio: '外滩摄影师会从边缘读构图，让江面把城市放慢。',
    sceneTone: '倒影',
  },
  'node-window': {
    sceneImage: '/assets/shanghai/tile-scenes-24/tile-03-window-inside-outside.png',
    storyHint: '橱窗同时展示里面和反射外面。选一处玻璃、灯光、陈列或街面反光。',
    uploadTitle: '拍一格橱窗剧场',
    uploadHelp: '只拍店外灯光、窗影或招牌边缘也可以。',
    fallbackLabel: '手选玻璃元素',
    roleBio: '橱窗布景师会把玻璃内外布成一个轻盈的街区舞台。',
    sceneTone: '橱窗',
  },
  'node-shikumen': {
    sceneImage: '/assets/shanghai/tile-scenes-24/tile-10-shikumen-texture.png',
    storyHint: '门环、砖缝、窗和路牌会比一大段讲解更耐听。选一处生活纹理。',
    uploadTitle: '拍石库门纹理',
    uploadHelp: '门、砖、窗、栏杆、门牌或路牌都可以。',
    fallbackLabel: '手选一处生活痕迹',
    roleBio: '石库门住客不讲长课，只把日子留在门环和砖缝里。',
    sceneTone: '石库门',
  },
  'node-finale': {
    sceneImage: '/assets/shanghai/tile-scenes-24/tile-24-nongtang-echo-finale.png',
    storyHint: '夜色把白天的门牌、街声、橱窗和江面收回唱片。选一个颜色，把本局收束。',
    uploadTitle: '拍夜色或选择唱片主色',
    uploadHelp: '夜灯、河面、桥影、霓虹、窗影或颜色都能进入终局。',
    fallbackLabel: '手选夜色主色',
    roleBio: '夜色放映员和城市剪辑师会把已得卡牌组织成终局唱片。',
    sceneTone: '霓虹唱片',
  },
}

export function getNodeSceneMeta(nodeId: string) {
  return nodeSceneMeta[nodeId] ?? fallbackScene
}
