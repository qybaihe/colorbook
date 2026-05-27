# 上海章节开发方案：《弄堂回声》

版本：v0.5 Codex-ready + AI Agent 方案版  
用途：在已有北京《中轴入局》项目基础上，新增上海《弄堂回声》章节。本文档面向产品、前端、内容、美术、AI 角色 Agent、语言 API 接入与 Codex，不要求从零开发项目，而是提供可被现有棋盘 / 卡牌 / 终局框架复用的章节方案。  
定位：上海章节不是景点打卡，而是“国际化都市里的街区切片收集游戏”。

---

## 0. 给开发者 / Codex 的阅读摘要

本文件的核心目标：**在不改变已有北京大富翁棋局框架的前提下，新增一个上海城市章节**。

开发时请优先遵守以下规则：

1. **复用北京章节已有能力**  
   已有北京项目已经具备棋盘、大富翁走格、任务触发、卡牌解锁、卡册、终局生成等基础能力。上海章节不需要重新造棋盘系统，只需要新增上海数据、上海卡牌、上海任务、上海终局文案、上海角色 Agent 配置和上海资源路径。

2. **上海章节仍然是大富翁式棋局，但棋盘不是全部**  
   玩家通过掷骰或步数推进，在棋盘格上移动。落到不同格子后触发不同交互：选择、拍照、声音、剧场、支线、兜底或终局。交互完成后解锁对应卡牌，卡牌进入卡册，并作为终局“弄堂回声唱片”的素材。棋盘格负责“触发和收集”，AI 角色 Agent 负责“回应和叙事”，终局模块负责“生成游记和唱片页”。

3. **卡牌名称保持本文档不变**  
   40 张卡牌以第 8 节为准。可以调整卡面视觉和文案，但不要随意改名，否则前端 cardId、资源名、卡册展示和终局读取容易错位。

4. **同一机制多张卡不是重复，而是闭环**  
   例如“橱窗卡”“橱窗事件卡”“玻璃观察者”“玻璃反光卡”“橱窗布景师”都属于橱窗机制，但分别代表：机制入口、事件触发、成就反馈、线索素材、角色引导。开发上应通过 `mechanism` 和 `category` 字段区分。

5. **图片不承载游戏逻辑**  
   卡面图片只负责展示。真正控制玩法的是数据字段，例如 `cardId`、`tileId`、`taskType`、`unlockCards`、`fallbackOptions`、`finaleTrack`。

6. **MVP 不依赖真实定位、图像识别、录音分析**  
   拍照可以用上传文件名 / 手选元素兜底；声音可以用手选“脚步 / 车声 / 店声 / 风声”兜底；天气、时间、商业空间限制都必须有替代玩法。

---

## 1. 章节结论

上海《弄堂回声》适合作为项目的第三个重点城市章节。北京承担“历史秩序”，天津承担“河流通信”，上海应该承担“现代都市切片”。它不应沿用北京、天津偏古典、手绘、怀旧的视觉风格，而应建立一种更国际化、更精致、更城市杂志感的卡牌体系。

推荐章节主概念：

> 玩家在上海收集门牌、橱窗、街声、霓虹、江面和转角，把它们整理成一张“弄堂回声唱片”。

核心机制：

- **门牌机制**：用门牌、门洞、招牌作为城市入口。
- **橱窗机制**：用玻璃、倒影、展示空间表现现代都市。
- **街声机制**：用人流、脚步、店铺声和江风建立现场感。
- **江面 / 倒影机制**：用外滩、黄浦江、苏州河、水面、玻璃和金属反光建立空间层次。
- **霓虹唱片机制**：终局生成一张“城市回声唱片”或“都市切片拼贴”。

推荐 MVP 形态：

- 6 个主节点。
- 24 个棋盘格任务池。
- 40 张卡牌。
- 一个上海专属终局模板。
- 先不依赖真实定位、图像识别和录音分析。
- 使用手选元素、上传照片文件名、文本输入和卡牌解锁即可跑通。

---

## 2. 与北京项目的关系

### 2.1 复用内容

上海章节应优先复用北京项目已经完成的能力：

- 城市章节入口。
- 大富翁棋盘走格。
- 骰子 / 步数推进。
- 棋格任务触发。
- 卡牌解锁与卡册展示。
- 节点进度。
- 角色剧场弹窗或对话框。
- 终局生成页。
- 分享图 / 游记文案框架。

### 2.2 上海新增内容

上海章节主要新增：

- `shanghaiChapter` 配置。
- 6 个上海主节点。
- 24 个上海棋盘任务。
- 40 张上海卡牌数据。
- 上海终局“弄堂回声唱片”。
- 上海专属美术资源路径。
- 上海文案、角色语气和兜底规则。

### 2.3 不建议做的事情

- 不要为上海重写棋盘系统。
- 不要把上海做成纯路线攻略。
- 不要强依赖真实地图定位。
- 不要强制用户拍陌生人正脸。
- 不要强制进入商业店铺或私人空间。
- 不要让图片里的文字成为唯一玩法信息。

---

## 3. 上海章节体验定位

### 3.1 核心一句话

上海《弄堂回声》是一场都市切片收集游戏：玩家在门牌、橱窗、江面、街声和夜色之间行走，把看见和听见的瞬间整理成一张属于自己的上海回声唱片。

### 3.2 与北京的差异

| 城市 | 章节 | 体验结构 | 关键词 |
| --- | --- | --- | --- |
| 北京 | 中轴入局 | 轴线、秩序、城门、俯瞰 | 历史结构 |
| 上海 | 弄堂回声 | 门牌、橱窗、街声、霓虹、切片 | 都市切片 |

北京强调“从城市结构进入历史秩序”。  
上海强调“从街区细节收集现代生活切片”。

### 3.3 上海不能做成什么

- 不能只是“外滩、南京路、新天地”的旅游攻略。
- 不能只是“老上海怀旧滤镜”。
- 不能每张图都是玻璃大厦和霓虹灯。
- 不能只靠景点名推进，要靠门牌、声音、橱窗、倒影、转角这些可观察元素推进。

---

## 4. 大富翁棋局玩法模型

### 4.1 单回合流程

上海章节沿用大富翁式棋局：

```txt
玩家掷骰 / 点击前进
  -> 棋子移动到某个 boardTile
  -> 读取该格子的 tileType 与 taskId
  -> 展示任务 / 剧场 / 选择 / 兜底
  -> 玩家完成交互
  -> 解锁一张或多张卡牌
  -> 卡牌进入卡册，并写入 finaleState
  -> 判断是否进入下一回合或终局
```

### 4.2 棋格类型

| tileType | 含义 | 常见交互 | 解锁内容 |
| --- | --- | --- | --- |
| `start` | 开局格 | 选择身份 / 选择追踪对象 | 核心卡、开局成就卡、角色卡 |
| `node` | 主节点格 | 完成节点任务 | 核心卡、成就卡、角色卡 |
| `photo` | 拍照观察格 | 上传照片 / 手选元素 | 观察线索卡、成就卡 |
| `sound` | 声音采样格 | 手选声音 / 文本描述 | 街声相关卡 |
| `choice` | 选择格 | 选择颜色、路线、观察对象 | 事件卡或线索卡 |
| `theater` | 角色剧场格 | 角色提问 / 玩家回答 | 角色卡、事件卡 |
| `branch` | 支线格 | 继续主路 / 支线 / 提前终局 | 转场卡、兜底卡 |
| `utility` | 兜底格 | 雨天、人流、限制拍摄替代 | 功能兜底卡 |
| `finale` | 终局格 | 选择唱片封面并生成终局 | 终局卡、城市剪辑师 |

### 4.3 boardTile 建议字段

```ts
export type ShanghaiTile = {
  id: string;
  order: number;
  name: string;
  tileType: 'start' | 'node' | 'photo' | 'sound' | 'choice' | 'theater' | 'branch' | 'utility' | 'finale';
  nodeId?: string;
  taskId: string;
  mechanism: 'doorplate' | 'window' | 'sound' | 'reflection' | 'neon' | 'branch' | 'fallback' | 'finale';
  prompt: string;
  interaction: 'select' | 'photo' | 'sound' | 'text' | 'theater' | 'auto';
  options?: string[];
  unlockCards: string[];
  fallbackCards?: string[];
  finaleTrack?: 'doorplate' | 'window' | 'river' | 'sound' | 'neon';
};
```

说明：这只是给 Codex / 开发者理解字段关系，不要求完全照抄类型名。若北京项目已有类型，应优先扩展现有类型，而不是另写一套。

### 4.4 棋盘、Agent 与游记的关系

上海章节不应被理解为“走到格子后弹一个固定任务”的简单任务系统，而应理解为三层结构：

```txt
第一层：大富翁棋盘
负责节奏、位置、触发、卡牌解锁。

第二层：AI 角色 Agent
负责根据玩家刚刚选择 / 上传 / 输入的现场元素进行回应、追问、提示和角色剧场。

第三层：游记 / 唱片生成
负责把本局收集到的门牌、橱窗、街声、江面、霓虹和卡牌，整理成最终游记、唱片页和分享文案。
```

开发时可以把棋盘格视为 `trigger`，把玩家输入视为 `observation`，把卡牌视为 `evidence`，把 Agent 回复和终局游记视为 `generatedContent`。

单回合增强流程：

```txt
玩家掷骰 / 前进
  -> 落到 boardTile
  -> 触发 task
  -> 玩家选择元素 / 上传照片 / 输入一句话 / 选择声音
  -> 写入 gameState.observations
  -> 如该格需要角色回应，则调用对应 roleAgent
  -> Agent 根据当前节点、已解锁卡、玩家输入和安全规则生成 60-90 字回应
  -> 解锁卡牌并写入 gameState.unlockedCards
  -> 将本回合摘要写入 gameState.travelNotes
  -> 进入下一回合或终局
```

### 4.5 AI 角色 Agent 接入范围

上海章节可以接入语言 API，但不要求每个格子都调用模型。建议只在以下场景调用：

| 场景 | 是否调用语言 API | 说明 |
| --- | --- | --- |
| 普通选择格 | 否 | 前端用固定文案即可 |
| 拍照 / 声音 / 文本输入后 | 可选 | 用于把玩家输入整理成一句“现场记录” |
| theater 剧场格 | 是 | 角色必须引用玩家刚刚选择的现场元素 |
| 主节点完成后 | 可选 | 生成一小段节点回声，写入游记素材 |
| 终局生成 | 是 | 生成 100-200 字游记、唱片页标题和分享文案 |
| 兜底任务 | 否 | 优先用固定安全提示，避免模型产生不可执行建议 |

建议将 Agent 能力做成可开关：

```ts
agentMode: 'off' | 'template' | 'api';
```

- `off`：完全使用固定模板，方便本地开发和无 API 环境。
- `template`：用规则模板拼接角色回复。
- `api`：接入语言 API，生成更自然的角色对话和游记。

### 4.6 上海角色 Agent 列表

角色 Agent 对应第 40 张卡牌中的剧场角色卡。角色卡既是卡册收藏，也是可被调用的对话人格。

| agentId | 对应卡牌 | 触发场景 | 角色职责 | 回复限制 |
| --- | --- | --- | --- | --- |
| `doorplateMessenger` | 门牌递信人 | 第一张门牌 / 门牌事件 | 引导玩家从门牌、门洞、招牌进入本局 | 必须引用门牌、门洞、招牌之一 |
| `bundPhotographer` | 外滩摄影师 | 外滩镜面 / 江边倒影 | 引导玩家观察远近、倒影、江面层次 | 必须引用倒影、江面或构图 |
| `windowSetDesigner` | 橱窗布景师 | 橱窗反光 / 橱窗剧场 | 引导玩家观察玻璃内外、灯光、陈列关系 | 必须引用玻璃、灯光或陈列 |
| `shikumenResident` | 石库门住客 | 石库门转角 / 门环问答 | 引导玩家从门、砖、窗、日常痕迹理解生活 | 不讲历史长课，只讲生活细节 |
| `streetSoundRecordist` | 街声录音师 | 街口人流 / 街声标签 | 引导玩家记录脚步、人声、店声、车声 | 必须引用一种声音 |
| `nightProjectionist` | 夜色放映员 | 夜色取样 / 霓虹唱片 | 引导玩家选择夜色主色和终局情绪 | 必须引用玩家选择的颜色 |
| `shopkeeper` | 小店掌柜 | 小店灯箱 / 招牌拼读 | 引导玩家观察小店、招牌、营业灯光 | 不要求进入店内 |
| `suzhouCreekPostman` | 苏州河邮差 | 苏州河风 / 转角车票 | 引导玩家把河风、水声、桥、交通变成转场素材 | 不要做成天津式“河流来信” |
| `cityEditor` | 城市剪辑师 | 回声拼贴 / 终局 | 把三张以上卡牌组织成终局段落 | 必须使用已解锁卡，不虚构 |

### 4.7 Agent 输入与输出数据

建议每次调用语言 API 时，传入结构化上下文，而不是只传一句 prompt。

```ts
export type ShanghaiAgentContext = {
  city: '上海';
  chapterTitle: '弄堂回声';
  currentNodeId: string;
  currentTileId: string;
  currentTaskId: string;
  agentId: string;
  playerIdentity?: '门牌收信人' | '橱窗观察者' | '街声采样员' | '夜色放映员';
  selectedPreference?: Record<string, string>;
  playerObservation?: {
    type: 'select' | 'photo' | 'sound' | 'text';
    value: string;
  };
  unlockedCards: string[];
  recentCards: string[];
  finaleTracks: Partial<Record<'doorplate' | 'window' | 'river' | 'sound' | 'neon', string>>;
  safetyMode: {
    avoidPrivateSpace: true;
    avoidStrangerFace: true;
    provideFallback: true;
  };
};

export type ShanghaiAgentResponse = {
  text: string;
  nextAction?: string;
  extractedNote?: string;
  suggestedFinaleTrack?: 'doorplate' | 'window' | 'river' | 'sound' | 'neon';
};
```

Agent 回复要求：

- 单次回复 60-90 字。
- 必须引用玩家刚刚输入或选择的一个现场元素。
- 每次最多给一个下一步行动。
- 不讲大段历史课。
- 不虚构玩家没有提供的现场元素。
- 涉及人流、过街、商业空间、拍摄限制时，必须给替代玩法。

### 4.8 游记生成与 `travelNotes`

为了支持最终游记，不应只在终局时临时读取卡牌，而应该在每回合记录轻量素材。

```ts
export type ShanghaiTravelNote = {
  turn: number;
  tileId: string;
  taskId: string;
  mechanism: 'doorplate' | 'window' | 'sound' | 'reflection' | 'neon' | 'branch' | 'fallback' | 'finale';
  observation: string;
  unlockedCards: string[];
  agentLine?: string;
  finaleTrack?: 'doorplate' | 'window' | 'river' | 'sound' | 'neon';
};
```

每完成一个任务，写入一条 `travelNotes`。终局生成时读取：

- 已解锁卡牌。
- 五条音轨素材。
- 玩家身份和偏好。
- 关键 Agent 回复。
- 玩家输入的一句话或声音标签。

终局输出建议包含：

1. 唱片标题。
2. 100-200 字游记。
3. 五条音轨摘要。
4. 本局卡牌牌阵。
5. 可复制分享文案。

### 4.9 终局生成 API 建议

终局可以调用语言 API，也可以先用模板兜底。

```ts
export type ShanghaiFinaleInput = {
  playerIdentity?: string;
  preferences: Record<string, string>;
  unlockedCards: string[];
  finaleTracks: {
    doorplate?: string;
    window?: string;
    river?: string;
    sound?: string;
    neon?: string;
  };
  travelNotes: ShanghaiTravelNote[];
  tone: '明亮' | '怀旧' | '冷静' | '热闹' | '孤独' | '轻盈';
};

export type ShanghaiFinaleOutput = {
  title: string;
  diary: string;
  tracks: { label: string; text: string }[];
  shareText: string;
};
```

终局生成规则：

- 必须使用玩家已经解锁或输入过的内容。
- 不要生成“北京”“中轴线”等旧章节硬编码。
- 不要编造玩家没有去过的真实地点。
- 若某条音轨为空，使用对应兜底文案，例如“这段声音被城市留白收走了”。
- 游记长度控制在 100-200 字。

### 4.10 给 Codex 的实现优先级

如开发时间有限，建议按以下顺序落地：

1. 先复用北京棋盘系统，跑通上海 6 节点、24 任务、40 卡。
2. 增加 `travelNotes`，每回合记录玩家选择和解锁卡。
3. 用模板实现角色回复和终局游记。
4. 再把 theater 格和 finale 格接入语言 API。
5. 最后再考虑让所有主节点都支持 Agent 动态回应。

这样即使语言 API 暂时不可用，上海章节也可以完整跑通；接入 API 后，只是增强对话和游记质量，不影响基础玩法。

---

## 5. 推荐路线与 6 个主节点

### 5.1 标准 90 分钟路线

人民广场 / 南京路入口 -> 南京路人流 -> 外滩 -> 圆明园路 / 北京东路街区 -> 石库门 / 新天地 -> 苏州河或外滩夜色终局。

### 5.2 60 分钟短线

南京东路 -> 外滩 -> 圆明园路 -> 苏州河终局。

### 5.3 150 分钟完整线

人民广场 -> 南京路 -> 外滩 -> 圆明园路 -> 新天地 / 石库门 -> 苏州河夜色。

### 5.4 6 个主节点

| 节点 ID | 顺序 | 节点 | 地点建议 | 类型 | 小玩法 | 奖励卡 |
| --- | ---: | --- | --- | --- | --- | --- |
| `node-doorplate` | 01 | 第一张门牌 | 人民广场 / 南京路入口 | start | 选择本局身份，收到一张门牌 | 上海门牌卡、第一张门牌、门牌递信人 |
| `node-street-sound` | 02 | 街口人流 | 南京路 | sound | 录或手选一段脚步、人声、店铺声 | 街声音轨卡、街声采样员、街声录音师 |
| `node-bund-reflection` | 03 | 外滩镜面 | 外滩 / 黄浦江边 | photo | 拍江面、建筑、玻璃或人群中的倒影关系 | 外滩倒影卡、江边同框、外滩摄影师 |
| `node-window` | 04 | 橱窗反光 | 圆明园路 / 北京东路 | photo | 从窗、灯、招牌、玻璃反光里选一个切片 | 橱窗卡、玻璃反光卡、橱窗布景师 |
| `node-shikumen` | 05 | 石库门转角 | 新天地 / 石库门街区 | theater | 与石库门住客对话：一扇门如何保存生活 | 石库门门环卡、石库门住客、门牌线索卡 |
| `node-finale` | 06 | 霓虹唱片 | 苏州河 / 外滩夜景 | finale | 把门牌、声音、橱窗和一句话压成回声唱片 | 霓虹唱片卡、夜色放映员、城市剪辑师 |

---

## 6. 24 个棋盘任务池

这些任务不要求一局全部出现。开发上可作为 `taskPool`，由棋格、节点、偏好和骰面抽取。若北京项目已有固定棋盘数组，可直接将以下内容映射为上海棋格。

| 序号 | taskId | 棋格 | 类型 | 任务 | 兜底 | 推荐解锁卡 |
| ---: | --- | --- | --- | --- | --- | --- |
| 01 | `task-doorplate-start` | 第一张门牌 | start | 选择今天追踪门牌、橱窗、街声或霓虹 | 默认门牌 | 上海门牌卡、第一张门牌 |
| 02 | `task-street-flow-sound` | 街口人流 | sound | 录或选择一段人流声 | 手选“脚步 / 车声 / 店声” | 街声音轨卡、街声采样员 |
| 03 | `task-window-inside-outside` | 橱窗反光 | photo | 拍一处能同时看到内外的玻璃 | 手选玻璃元素 | 橱窗卡、玻璃反光卡 |
| 04 | `task-bund-weather-tone` | 外滩风向 | choice | 根据天气和光线改变任务语气 | 默认黄昏语气 | 时辰事件卡 |
| 05 | `task-river-reflection` | 江边倒影 | photo | 找水面、玻璃或金属里的倒影 | 手选倒影 | 外滩倒影卡、江边同框 |
| 06 | `task-door-ring-theater` | 门环问答 | theater | 角色围绕门、门牌、门环发问 | 固定三问 | 石库门门环卡、石库门住客 |
| 07 | `task-lane-corner-branch` | 弄堂转角 | branch | 选择继续主路、进入支线或提前终局 | 继续主路 | 转角事件卡 |
| 08 | `task-neon-color-pick` | 霓虹取色 | choice | 选择本局夜色主色 | 默认蓝金 | 霓虹色卡、夜色取样 |
| 09 | `task-cafe-window-rest` | 咖啡窗边 | choice | 把休息点变成观察任务 | 记录一句话 | 咖啡窗边卡 |
| 10 | `task-shikumen-texture` | 石库门纹理 | photo | 选择砖、门、窗、栏杆或门牌 | 手选纹理 | 砖缝线索卡 |
| 11 | `task-sign-reading` | 招牌拼读 | choice | 找一个招牌，记录它的语气 | 手选“老 / 新 / 明亮 / 安静” | 亲子找招牌、小店掌柜 |
| 12 | `task-suzhou-creek-wind` | 苏州河风 | sound | 记录风、水、桥或远处交通声 | 手选声音 | 苏州河邮差 |
| 13 | `task-elevator-stairs` | 电梯与楼梯 | branch | 现实路径选择：上楼、下楼、绕行、停留 | 停留观察 | 转角车票卡 |
| 14 | `task-shop-lightbox` | 小店灯箱 | photo | 拍一处仍在营业的小店灯光 | 选择灯光颜色 | 小店掌柜、夜色取样 |
| 15 | `task-rain-window` | 雨天玻璃 | utility | 雨天时改玩水痕、伞面、玻璃反光 | 给雨窗兜底卡 | 雨窗兜底卡 |
| 16 | `task-footbridge-layer` | 人行天桥 | photo | 拍车流、行人和楼宇的层次 | 选择“车流 / 楼影 / 天空” | 玻璃观察者 |
| 17 | `task-missed-photo` | 老照片缺口 | utility | 错过的地点变成一张未显影照片 | 给未显影照片卡 | 未显影照片卡 |
| 18 | `task-city-palette` | 城市色卡 | choice | 从红、绿、金、蓝、灰中选本局颜色 | 默认深蓝 + 香槟金 | 霓虹色卡 |
| 19 | `task-night-dice` | 夜色骰 | choice | 决定终局语气：明亮、怀旧、冷静、热闹、孤独、轻盈 | 冷静 | 时辰事件卡、夜色取样 |
| 20 | `task-sound-label` | 街声标签 | sound | 给刚听到的声音贴一个情绪标签 | 手选标签 | 回声事件卡、街声采样员 |
| 21 | `task-window-theater` | 橱窗剧场 | theater | 橱窗里的人物向玩家提问 | 固定角色台词 | 橱窗事件卡、橱窗布景师 |
| 22 | `task-echo-collage` | 回声拼贴 | choice | 把三张已得卡合成城市切片 | 自动取前三张 | 城市切片拼贴 |
| 23 | `task-record-cover` | 唱片封面 | finale | 选择终局封面元素：门牌、江面、霓虹或窗影 | 默认门牌 | 霓虹唱片卡 |
| 24 | `task-nongtang-echo-finale` | 弄堂回声 | finale | 输出本局游记、唱片页和分享文案 | 固定模板 | 城市剪辑师 |

---

## 7. 偏好问题

偏好问题用于改变文案、任务权重、路线节奏，不要求 MVP 阶段影响真实地图。

| 问题 | 选项 | 对玩法的影响 |
| --- | --- | --- |
| 今天有多少时间 | 60 分钟 / 90 分钟 / 150 分钟 | 控制节点数量和支线开启 |
| 这次和谁一起 | 独自 / 朋友 / 亲子 / 情侣 | 改变提示语气、任务难度和终局文案 |
| 更想追哪种上海 | 街区生活 / 都市夜色 / 建筑细节 / 咖啡小店 | 改变卡牌奖励权重 |
| 今天想怎么走 | 快速取景 / 慢慢闲逛 / 夜色收束 | 改变路线节奏和终局模板 |

---

## 8. 40 张卡牌

### 8.1 卡牌机制闭环

| 机制 | 核心卡 | 事件卡 | 成就卡 | 线索卡 | 角色卡 | 终局用途 |
| --- | --- | --- | --- | --- | --- | --- |
| 门牌机制 | 上海门牌卡 | 门牌事件卡 | 第一张门牌 | 门牌线索卡 | 门牌递信人 | 门牌音轨 |
| 橱窗机制 | 橱窗卡 | 橱窗事件卡 | 玻璃观察者 | 玻璃反光卡、咖啡窗边卡 | 橱窗布景师 | 橱窗音轨 |
| 街声机制 | 街声音轨卡 | 回声事件卡 | 街声采样员 | 街声标签任务 | 街声录音师 | 街声音轨 |
| 江面 / 倒影机制 | 外滩倒影卡 | 时辰事件卡 | 江边同框 | 玻璃反光卡 | 外滩摄影师 | 江边音轨 |
| 夜色 / 霓虹机制 | 霓虹唱片卡 | 人流事件卡 | 夜色取样 | 霓虹色卡 | 夜色放映员 | 霓虹音轨 |
| 转场 / 兜底机制 | 弄堂回声卡 | 转角事件卡 | 城市切片拼贴 | 未显影照片卡等 | 苏州河邮差、城市剪辑师 | 终局拼贴 |

### 8.2 卡牌表

| 序号 | cardId | 卡牌 | 类别 | 机制 | 用途 | 推荐触发 |
| ---: | --- | --- | --- | --- | --- | --- |
| 01 | `shanghai-doorplate` | 上海门牌卡 | 文化核心卡 | doorplate | 开局入口 | 第一张门牌 / 开局格 |
| 02 | `nongtang-echo` | 弄堂回声卡 | 文化核心卡 | finale | 章节主题 | 章节选择后或首次完成节点 |
| 03 | `bund-reflection` | 外滩倒影卡 | 文化核心卡 | reflection | 江面、建筑、倒影 | 外滩镜面 / 江边倒影 |
| 04 | `shikumen-door-ring` | 石库门门环卡 | 文化核心卡 | doorplate | 门、居住、生活 | 石库门转角 / 门环问答 |
| 05 | `window-core` | 橱窗卡 | 文化核心卡 | window | 玻璃、展示、内外关系 | 橱窗反光 |
| 06 | `street-sound-track` | 街声音轨卡 | 文化核心卡 | sound | 声音证据 | 街口人流 |
| 07 | `neon-record` | 霓虹唱片卡 | 文化核心卡 | neon | 夜色终局 | 唱片封面 / 终局 |
| 08 | `time-event` | 时辰事件卡 | 事件卡 | neon | 晨午暮夜 | 外滩风向 / 夜色骰 |
| 09 | `crowd-event` | 人流事件卡 | 事件卡 | sound | 人群密度 | 街口人流 / 人流变化 |
| 10 | `doorplate-event` | 门牌事件卡 | 事件卡 | doorplate | 门牌提问 | 第一张门牌 / 门环问答 |
| 11 | `window-event` | 橱窗事件卡 | 事件卡 | window | 橱窗剧场 | 橱窗剧场 |
| 12 | `corner-event` | 转角事件卡 | 事件卡 | branch | 支线选择 | 弄堂转角 |
| 13 | `echo-event` | 回声事件卡 | 事件卡 | sound | 留下一句话 | 街声标签 / 回声拼贴 |
| 14 | `first-doorplate` | 第一张门牌 | 旅程成就卡 | doorplate | 开局确认 | 开局任务完成 |
| 15 | `river-frame` | 江边同框 | 旅程成就卡 | reflection | 外滩 / 苏州河拍照成就 | 外滩镜面 / 江边倒影 |
| 16 | `glass-observer` | 玻璃观察者 | 旅程成就卡 | window | 橱窗与反光任务 | 橱窗反光 / 人行天桥 |
| 17 | `sound-sampler` | 街声采样员 | 旅程成就卡 | sound | 声音任务 | 街口人流 / 街声标签 |
| 18 | `night-sample` | 夜色取样 | 旅程成就卡 | neon | 夜景或灯光任务 | 霓虹取色 / 小店灯箱 |
| 19 | `family-sign-hunter` | 亲子找招牌 | 旅程成就卡 | doorplate | 亲子观察 | 招牌拼读 |
| 20 | `city-slice-collage` | 城市切片拼贴 | 旅程成就卡 | finale | 中段合成 | 回声拼贴 |
| 21 | `doorplate-clue` | 门牌线索卡 | 观察线索卡 | doorplate | 门牌、贴纸、编号 | 石库门转角 / 门牌提问 |
| 22 | `glass-reflection-clue` | 玻璃反光卡 | 观察线索卡 | window | 内外、倒影、透明 | 橱窗反光 |
| 23 | `brick-gap-clue` | 砖缝线索卡 | 观察线索卡 | doorplate | 石库门纹理 | 石库门纹理 |
| 24 | `neon-color-clue` | 霓虹色卡 | 观察线索卡 | neon | 夜色主色 | 霓虹取色 / 城市色卡 |
| 25 | `cafe-window-clue` | 咖啡窗边卡 | 观察线索卡 | window | 休息点观察 | 咖啡窗边 |
| 26 | `undeveloped-photo` | 未显影照片卡 | 功能兜底卡 | fallback | 错过也成局 | 老照片缺口 |
| 27 | `safe-crossing` | 安全街口卡 | 功能兜底卡 | fallback | 过街、人流、拍摄限制 | 人多 / 过街 / 拍摄受限 |
| 28 | `light-hint` | 轻提示卡 | 功能兜底卡 | fallback | 可执行观察建议 | 任意任务失败 |
| 29 | `corner-ticket` | 转角车票卡 | 功能兜底卡 | branch | 路线切换 | 电梯与楼梯 / 弄堂转角 |
| 30 | `quick-snapshot` | 快速取景卡 | 功能兜底卡 | fallback | 时间压缩 | 时间不足 |
| 31 | `rain-window-fallback` | 雨窗兜底卡 | 功能兜底卡 | fallback | 雨天玻璃玩法 | 雨天玻璃 |
| 32 | `doorplate-messenger` | 门牌递信人 | 剧场角色卡 | doorplate | 开局引导 | 第一张门牌 |
| 33 | `bund-photographer` | 外滩摄影师 | 剧场角色卡 | reflection | 倒影、构图、江面 | 外滩镜面 |
| 34 | `window-set-designer` | 橱窗布景师 | 剧场角色卡 | window | 玻璃与展示 | 橱窗剧场 |
| 35 | `shikumen-resident` | 石库门住客 | 剧场角色卡 | doorplate | 门、生活、旧新关系 | 石库门转角 |
| 36 | `street-sound-recordist` | 街声录音师 | 剧场角色卡 | sound | 声音任务 | 街口人流 |
| 37 | `night-projectionist` | 夜色放映员 | 剧场角色卡 | neon | 霓虹终局 | 霓虹唱片 |
| 38 | `shopkeeper` | 小店掌柜 | 剧场角色卡 | doorplate | 招牌、小店、日常 | 招牌拼读 / 小店灯箱 |
| 39 | `suzhou-creek-postman` | 苏州河邮差 | 剧场角色卡 | reflection | 河流与转场 | 苏州河风 |
| 40 | `city-editor` | 城市剪辑师 | 剧场角色卡 | finale | 终局拼贴 | 弄堂回声终局 |

---

## 9. 同一机制多卡的创意区分

### 9.1 橱窗机制示例

橱窗机制允许出现多张卡，但每张必须有不同功能和画面：

| 卡牌 | 功能 | 画面方向 | 玩家感受 |
| --- | --- | --- | --- |
| 橱窗卡 | 机制入口 | 完整橱窗，内外同时可见 | “我获得一种观察方法” |
| 橱窗事件卡 | 事件触发 | 橱窗里出现提问角色、半透明剧场幕布 | “事件发生了” |
| 玻璃观察者 | 成就反馈 | 玩家手账 / 相机 / 反光照片完成记录 | “我完成了任务” |
| 玻璃反光卡 | 线索素材 | 局部玻璃、水痕、金属反光切片 | “我拿到终局素材” |
| 咖啡窗边卡 | 休息观察 | 杯子、窗边、街景反射 | “休息点也能继续玩” |
| 橱窗布景师 | 角色引导 | 一个现代橱窗布景角色 | “有人回应我的观察” |

### 9.2 门牌机制示例

| 卡牌 | 功能 | 区分方式 |
| --- | --- | --- |
| 上海门牌卡 | 开局入口 | 门牌像一张入场券 |
| 门牌事件卡 | 提问触发 | 门牌上出现问题或选择分叉 |
| 第一张门牌 | 成就反馈 | 玩家已经完成第一次选择 |
| 门牌线索卡 | 终局素材 | 记录编号、贴纸、门洞线索 |
| 门牌递信人 | 角色引导 | 用角色口吻提示下一步 |

### 9.3 街声机制示例

| 卡牌 | 功能 | 区分方式 |
| --- | --- | --- |
| 街声音轨卡 | 声音证据 | 声波、脚步、人流符号 |
| 回声事件卡 | 留下一句话 | 将声音转为短句 |
| 街声采样员 | 成就反馈 | 玩家完成一次声音采样 |
| 街声录音师 | 角色引导 | 用录音师口吻给下一步任务 |

---

## 10. 角色剧场

| 角色 | 语气 | 规则 |
| --- | --- | --- |
| 门牌递信人 | 亲切、敏锐 | 必须引用门牌、门洞、招牌之一 |
| 外滩摄影师 | 克制、讲构图 | 必须引用倒影、江面、远近关系 |
| 橱窗布景师 | 轻盈、现代 | 必须引用玻璃内外或灯光 |
| 石库门住客 | 温和、有生活感 | 必须引用门、砖、窗或日常痕迹 |
| 街声录音师 | 短句、敏锐 | 必须引用一种现场声音 |
| 夜色放映员 | 精致、收束 | 必须引用玩家选择的夜色主色 |
| 小店掌柜 | 日常、亲切 | 必须引用招牌、小店灯箱或门口元素 |
| 苏州河邮差 | 安静、转场感 | 必须引用风、水、桥或远处交通声 |
| 城市剪辑师 | 总结型 | 必须把三张卡组织成终局段落 |

剧场回复限制：

- 单次回复 60-90 字。
- 不讲大段历史课。
- 不虚构玩家没有选择的现场元素。
- 每次至少给一个下一步行动。
- 如任务涉及人流、过街、商业空间拍摄，要自动给替代玩法。

---

## 11. 终局设计

终局形态：**弄堂回声唱片**。

五条音轨：

1. 门牌音轨：我从哪张门牌进入。
2. 橱窗音轨：我在玻璃里看见什么。
3. 江边音轨：我在江边停留多久。
4. 街声音轨：我听见哪段人流。
5. 霓虹音轨：我把什么留给夜色。

### 11.1 finaleState 建议

```ts
export type ShanghaiFinaleState = {
  doorplate?: string;
  window?: string;
  river?: string;
  sound?: string;
  neon?: string;
  unlockedCardIds: string[];
  selectedColor?: string;
  selectedMood?: string;
};
```

### 11.2 终局标题规则

| 条件 | 标题 |
| --- | --- |
| 有门牌 + 橱窗 + 霓虹 | 我在上海收集了一张夜色唱片 |
| 有外滩 + 街声 + 石库门 | 从江边倒影到弄堂门口 |
| 有咖啡窗边 + 小店掌柜 | 我把上海的一盏小店灯带回来了 |
| 默认 | 我的上海弄堂回声 |

### 11.3 终局输出内容

- 标题。
- 100-200 字游记。
- 已解锁卡牌牌阵。
- 唱片封面视觉。
- 可复制分享文案。

---

## 12. 卡面美术风格

### 12.1 风格名称

推荐风格：**魔都国际化新装饰风**  
英文参考名：`Shanghai Deco Cosmopolitan Collage`

### 12.2 风格关键词

- Art Deco geometric framing
- glass reflection
- neon edge light
- editorial city poster
- metallic ink
- deep navy, jade green, champagne gold, burgundy, pearl gray
- layered paper collage
- cinematic street photography composition
- elegant Shanghai cosmopolitan atmosphere

### 12.3 色彩规范

主色：

- 深海军蓝 `#10243E`
- 香槟金 `#C9A45C`
- 玉石绿 `#2F7D73`
- 酒红 `#8E2F45`
- 珍珠灰 `#D8D3C7`

禁用倾向：

- 不要大面积土黄旧纸。
- 不要全画面咖啡棕。
- 不要过度赛博紫蓝。
- 不要廉价霓虹招牌堆满画面。
- 不要所有卡都画玻璃大厦。

### 12.4 卡牌构图规范

每张卡必须包含：

- 一个清晰主物件：门牌、橱窗、江面、唱片、门环、霓虹等。
- 一个上海城市线索：外滩轮廓、石库门砖、玻璃反光、街角灯箱等。
- 一个精致边框：细线 Art Deco 几何边框。
- 留出上方标题区和下方说明区。
- 画面中心不能被文字占满。

---

## 13. 数据文件建议

若北京项目已有类似文件，优先沿用现有命名和类型；以下仅作为上海章节建议。

```txt
time-chess-react/src/data/chapters/shanghai.ts
time-chess-react/src/data/shanghaiGameCards.ts
time-chess-react/src/data/shanghaiTasks.ts
time-chess-react/src/data/shanghaiFinale.ts
time-chess-react/public/assets/shanghai/deck/
time-chess-react/public/assets/shanghai/tile-scenes/
```

### 13.1 ChapterConfig 建议字段

```ts
export const shanghaiChapter = {
  id: 'shanghai',
  city: '上海',
  title: '弄堂回声',
  subtitle: '把门牌、橱窗和街声压成一张城市唱片',
  assetBasePath: '/assets/shanghai',
  boardLayout: 'slice',
  defaultSelectedCardId: 'shanghai-doorplate',
  preferenceQuestions,
  diceFaces,
  routeNodes,
  boardTiles,
  taskPool,
  cards: shanghaiGameCards,
  finale,
  createStoryTitle,
};
```

### 13.2 GameCard 建议字段

```ts
export type ShanghaiGameCard = {
  id: string;
  number: number;
  title: string;
  category: 'culture' | 'event' | 'achievement' | 'clue' | 'fallback' | 'character';
  mechanism: 'doorplate' | 'window' | 'sound' | 'reflection' | 'neon' | 'branch' | 'fallback' | 'theater' | 'finale';
  usage: string;
  asset: string;
  unlockBy: string[];
  finaleTrack?: 'doorplate' | 'window' | 'river' | 'sound' | 'neon';
  fallbackOptions?: string[];
  shortText: string;
};
```

---

## 14. 资产命名规范

卡牌图片建议：

```txt
public/assets/shanghai/deck/01_shanghai_doorplate.png
public/assets/shanghai/deck/02_nongtang_echo.png
public/assets/shanghai/deck/03_bund_reflection.png
...
public/assets/shanghai/deck/40_city_editor.png
```

棋格场景图建议：

```txt
public/assets/shanghai/tile-scenes/node_01_doorplate.png
public/assets/shanghai/tile-scenes/node_02_street_sound.png
public/assets/shanghai/tile-scenes/node_03_bund_reflection.png
public/assets/shanghai/tile-scenes/node_04_window.png
public/assets/shanghai/tile-scenes/node_05_shikumen.png
public/assets/shanghai/tile-scenes/node_06_neon_record.png
```

图片规格建议：

- 卡牌：统一竖版比例，建议 5:7。
- 卡牌透明 PNG，卡牌外轮廓之外为 alpha 透明。
- 单张文件尽量压缩，避免过大影响加载。
- 场景图可为 16:9，不要求透明背景。

---

## 15. MVP 验收标准

上海 MVP 可上线前必须满足：

- 能从城市入口选择上海章节。
- 能进入上海棋盘。
- 至少 6 个主节点能走通。
- 24 个任务池至少可被固定棋格或随机格调用。
- 每个节点至少有 3 个手选兜底元素。
- 完成任务后能解锁对应卡牌。
- 卡牌解锁不引用不存在的 cardId。
- 卡册能展示上海 40 张卡牌。
- 终局能读取已解锁卡牌并生成“弄堂回声唱片”。
- 不依赖真实上海图片也能完整跑通。
- 不强制用户拍摄陌生人正脸。
- 不强制进入商业店铺或私人空间。
- 终局文案不出现“北京”“中轴线”等旧硬编码。

---

## 16. 风险与修正

| 风险 | 表现 | 修正 |
| --- | --- | --- |
| 太像旅游攻略 | 只介绍景点 | 任务必须从门牌、橱窗、声音、颜色入手 |
| 太复古 | 变成老上海怀旧滤镜 | 加入玻璃、霓虹、现代街区和国际化构图 |
| 太商业 | 像商场宣传页 | 保留生活切片、小店、门牌、街声 |
| 任务不可执行 | 必须拍特定建筑 | 提供手选元素和替代任务 |
| 风格不统一 | 卡牌像不同项目 | 使用统一色彩、边框、构图和负向提示词 |
| 机制同质化 | 橱窗、门牌、街声多次出现但功能相同 | 用 category 区分入口、事件、成就、线索、角色、终局 |
| 开发误解为重写 | 重新做棋盘系统 | 明确复用北京项目，只新增上海配置和数据 |

---

## 17. 给 Codex 的开发提示

将本文档交给 Codex 时，建议提示：

```txt
你正在一个已有北京章节的 React / TypeScript 大富翁城市探索游戏项目中新增上海章节。
请不要重写现有棋盘、卡牌、卡册和终局系统。
请阅读 SHANGHAI_NONGTANG_ECHO_CHAPTER_DESIGN.md，根据其中的 6 个主节点、24 个棋盘任务、40 张卡牌、AI 角色 Agent、travelNotes、终局游记规则，新增上海章节配置与数据文件。
优先复用北京章节已有类型和组件；如现有类型缺少字段，可做兼容扩展。
确保 cardId、taskId、nodeId、asset path 一致。
MVP 阶段不接真实定位、图像识别或录音分析，使用手选元素和文本兜底跑通完整流程。
```

Codex 实施顺序建议：

1. 找到北京章节的数据文件、卡牌文件、棋盘任务文件和终局文件。
2. 复制结构，新增上海对应数据。
3. 将城市选择入口接入 `shanghaiChapter`。
4. 用上海的 `boardTiles`、`taskPool`、`shanghaiGameCards` 替换硬编码北京内容。
5. 跑通：进入上海 -> 掷骰走格 -> 触发任务 -> 记录 travelNotes -> 可选调用角色 Agent -> 解锁卡牌 -> 卡册展示 -> 终局游记生成。
6. 清理所有北京硬编码文案。
7. 暂时使用占位图或已生成上海卡牌图，后续替换正式资源。

---

## 18. 提交前检查清单

- [ ] 文件名保持为 `SHANGHAI_NONGTANG_ECHO_CHAPTER_DESIGN.md`。
- [ ] 40 张卡牌名称未被随意改动。
- [ ] 每张卡都有稳定 cardId。
- [ ] 每个 taskId 至少能解锁一张卡或触发一个可见反馈。
- [ ] 所有 fallback 都能在不拍照、不录音、不定位时完成。
- [ ] 上海终局读取五条音轨：门牌、橱窗、江边、街声、霓虹。
- [ ] theater 格可以调用对应角色 Agent，API 不可用时能用模板兜底。
- [ ] 每回合可以写入 `travelNotes`，终局游记能读取本局真实记录。
- [ ] 不出现“北京”“中轴线”等旧章节硬编码。
- [ ] 橱窗、门牌、街声等重复机制已通过 category / mechanism 区分功能层级。
