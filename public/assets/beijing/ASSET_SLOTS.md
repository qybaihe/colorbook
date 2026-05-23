# 北京横屏棋盘版资产槽位

目标目录：`public/assets/beijing/`

所有长文案、按钮、卡牌说明和页面标题都由 React/CSS 渲染。图片只承担背景、插画、角色、卡面、图标和桌游组件，不把长文字画死在图里。

## backgrounds/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | `entry-board-box.webp` | 16:9 | 入口页棋盘盒与桌游桌面主视觉 | 已生成 |
| P0 | `photo-trigger-table.webp` | 16:9 | 拍照触发页弱化棋盘背景 | 已生成 |
| P0 | `theater-table.webp` | 16:9 | AI 剧场页弱化棋盘与剧场桌面 | 已生成 |
| P0 | `finale-storybook.webp` | 16:9 | 终局故事书与完成棋盘背景 | 已生成 |
| P1 | `card-album-table.webp` | 16:9 | 卡牌册页桌面与册页背景 | 已生成 |
| P1 | `mission-table.webp` | 16:9 | 现实任务页桌面背景 | 已生成 |

## board/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | `main-board-map.webp` | 1:1 | 主棋盘完整底图，外圈走格子和中心地图 | 已生成 |
| P0 | `axis-center-map.webp` | 14:9 | 中心北京中轴线地图插画 | 已生成 |
| P1 | `route-preview-strip.webp` | 16:9 | 入局问答页小路线预览 | 已生成 |
| P1 | `board-empty-tile.webp` | 1:1 | 可复用空棋格纹理 | 已生成 |

## landmarks/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | `tile-qianmen.webp` | 1:1 | 前门 / 城门开市景点格 | 已生成 |
| P0 | `tile-axis.webp` | 1:1 | 中轴取景景点格 | 已生成 |
| P0 | `tile-corner-tower.webp` | 1:1 | 故宫角楼 / 宫城水影景点格 | 已生成 |
| P0 | `tile-jingshan.webp` | 1:1 | 景山 / 登高观城景点格 | 已生成 |
| P0 | `tile-drum-tower.webp` | 1:1 | 鼓楼景点格 | 已生成 |
| P0 | `tile-shichahai.webp` | 1:1 | 什刹海 / 胡同生活景点格 | 已生成 |
| P1 | `event-photo.webp` | 1:1 | 拍照任务格 | 已生成 |
| P1 | `event-dice.webp` | 1:1 | 时空骰格 | 已生成 |
| P1 | `event-fate.webp` | 1:1 | 命运格 | 已生成 |
| P1 | `event-sound.webp` | 1:1 | 市声任务格 | 已生成 |
| P1 | `event-echo.webp` | 1:1 | 回声格 | 已生成 |
| P1 | `event-finale.webp` | 1:1 | 终局格 | 已生成 |

## roles/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | `qing-merchant.webp` | 3:4 | 清末掌柜角色立绘 | 已生成 |
| P0 | `city-craftsman.webp` | 3:4 | 营城匠师角色立绘 | 已生成 |
| P0 | `palace-painter.webp` | 3:4 | 宫廷画师角色立绘 | 已生成 |
| P0 | `city-historian.webp` | 3:4 | 观城史官角色立绘 | 已生成 |
| P0 | `hutong-resident.webp` | 3:4 | 胡同居民角色立绘 | 已生成 |

## cards/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | `card-gate.webp` | 2:3 | 城门卡正面 | 已生成 |
| P0 | `card-trade.webp` | 2:3 | 商贸卡正面 | 已生成 |
| P0 | `card-axis.webp` | 2:3 | 秩序卡正面 | 已生成 |
| P0 | `card-palace.webp` | 2:3 | 宫城卡正面 | 已生成 |
| P0 | `card-overlook.webp` | 2:3 | 俯瞰卡正面 | 已生成 |
| P0 | `card-life.webp` | 2:3 | 烟火卡正面 | 已生成 |
| P0 | `card-echo.webp` | 2:3 | 回声卡正面 | 已生成 |
| P0 | `card-back.webp` | 2:3 | 卡牌背面 | 已生成 |
| P1 | `card-locked.webp` | 2:3 | 未解锁卡牌剪影 | 已生成 |

## sprites/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | `sheet-board-events-source.webp` | 1:1 | 16 个棋盘事件图标绿幕源图 | 已生成 |
| P0 | `sheet-board-events.png` | 1:1 | 抠绿后的透明组件总图 | 已抠图并切分 |
| P0 | `sheet-table-props-source.webp` | 1:1 | 12 个棋子、骰子、卡牌堆、印章等绿幕源图 | 已生成 |
| P0 | `sheet-table-props.png` | 1:1 | 抠绿后的透明组件总图 | 已抠图并切分 |
| P1 | `sheet-landmark-mini-source.webp` | 1:1 | 8 个景点小插画绿幕源图 | 已生成 |
| P1 | `sheet-landmark-mini.png` | 1:1 | 抠绿后的透明组件总图 | 已抠图并切分 |
| P1 | `sheet-ui-decor-source.webp` | 1:1 | 16 个 UI 装饰组件绿幕源图 | 已生成 |
| P1 | `sheet-ui-decor.png` | 1:1 | 抠绿后的透明组件总图 | 已抠图并切分 |

## ui/

| 优先级 | 文件名 | 比例 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| P1 | `upload-frame.webp` | 4:3 | 拍照上传框装饰 | 已生成 |
| P1 | `choice-card.webp` | 3:2 | 玩家选择卡背景 | 已生成 |
| P1 | `dialogue-frame.webp` | 16:9 | 剧场对话框背景 | 已生成 |
| P1 | `reward-glow.webp` | 1:1 | 卡牌获得光效 | 已生成 |
| P1 | `completion-stamp.webp` | 1:1 | 完成印章 | 已生成 |
| P1 | `poster-template-a.webp` | 3:4 | 分享海报模板 A | 已生成 |
| P1 | `poster-template-b.webp` | 3:4 | 分享海报模板 B | 已生成 |
