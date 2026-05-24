import { ArrowRight, Dice6, Footprints, Sparkles, Trophy } from 'lucide-react'
import { type RouteNode, diceFaces, routeNodes } from '../data/beijingGame'
import { trackCells } from '../data/boardTrack'
import { getGameCards } from '../data/gameCards'
import type { BoardEvent, MoveResult } from '../data/randomEvents'
import { getNodeTaskPlan, taskKindLabels } from '../data/taskPlans'

const roleCardImages: Record<string, string> = {
  qianmen: '/assets/beijing/role-cards/role-qianmen-merchant.png',
  axis: '/assets/beijing/role-cards/role-axis-craftsman.png',
  'corner-tower': '/assets/beijing/role-cards/role-palace-painter.png',
  jingshan: '/assets/beijing/role-cards/role-city-historian.png',
  shichahai: '/assets/beijing/role-cards/role-hutong-resident.png',
}

export function CurrentTurnPanel({
  currentNode,
  currentTrackIndex,
  activeBoardEvent,
  lastMove,
  completedNodeIds,
  playerStamina,
  maxPlayerStamina,
  onOpenNode,
  onFinale,
}: {
  currentNode: RouteNode
  currentTrackIndex: number
  activeBoardEvent: BoardEvent | null
  lastMove: MoveResult | null
  completedNodeIds: string[]
  playerStamina: number
  maxPlayerStamina: number
  onOpenNode: () => void
  onFinale: () => void
}) {
  const taskPlan = getNodeTaskPlan(currentNode.id)
  const roleCardImage = roleCardImages[currentNode.id]
  const currentCell = trackCells[currentTrackIndex]
  const landedOnEvent = currentCell?.kind === 'event'
  const landingTitle = landedOnEvent ? currentCell.label : currentNode.title

  return (
    <aside className="turn-panel">
      <div className="turn-intro">
        <p className="eyebrow">当前回合 / {completedNodeIds.length + 1}</p>
        <h2>{currentNode.title}</h2>
        <p>{currentNode.place}</p>
      </div>

      <div className="turn-random-panel" aria-label="本局随机结果">
        <div className="turn-dice-result">
          <Dice6 size={18} aria-hidden="true" />
          <strong>{lastMove ? `${lastMove.roll} 点` : '起局'}</strong>
        </div>
        <div className="turn-random-copy">
          <span>{lastMove ? `落到 ${landingTitle}` : '从前门入口开始'}</span>
          <small>{activeBoardEvent ? activeBoardEvent.title : '主线地点'}</small>
        </div>
      </div>

      {activeBoardEvent && (
        <div className="turn-event-card" aria-label={`棋盘事件：${activeBoardEvent.title}`}>
          <p className="eyebrow">棋盘事件</p>
          <strong>{activeBoardEvent.title}</strong>
          <span>{activeBoardEvent.subtitle}</span>
          <small>{activeBoardEvent.description}</small>
        </div>
      )}

      {roleCardImage && (
        <figure className="turn-role-card" aria-label={`剧场角色：${currentNode.roleName}，${currentNode.roleTitle}`}>
          <img src={roleCardImage} alt="" draggable={false} />
        </figure>
      )}

      <div className="stamina-panel" aria-label={`你的体力 ${playerStamina}/${maxPlayerStamina}`}>
        <span className="stamina-avatar" aria-hidden="true">
          <span className="stamina-avatar-sprite" />
        </span>
        <div className="stamina-copy">
          <span>你的体力</span>
          <strong>{playerStamina}/{maxPlayerStamina}</strong>
        </div>
        <div className="stamina-hearts" aria-hidden="true">
          {Array.from({ length: maxPlayerStamina }, (_, index) => (
            <img
              key={index}
              src={
                index < playerStamina
                  ? '/assets/beijing/ui/stamina-heart-full.png'
                  : '/assets/beijing/ui/stamina-heart-empty.png'
              }
              alt=""
              draggable={false}
            />
          ))}
        </div>
      </div>

      <div className="dice-strip">
        {diceFaces.map((face) => {
          const Icon = face.icon
          return (
            <span key={face.id} title={face.name}>
              <Icon size={15} aria-hidden="true" />
            </span>
          )
        })}
      </div>

      {taskPlan && (
        <div className="turn-flow" aria-label="本回合任务触发牌">
          <p className="eyebrow">任务触发</p>
          {taskPlan.taskButtons.map((task) => (
            <div className="turn-flow-item" key={`${task.kind}-${task.label}`}>
              <strong>{taskKindLabels[task.kind]} / {task.label}</strong>
              <small>{getGameCards(task.triggerCardIds).map((card) => card.name).join('、')}</small>
            </div>
          ))}
        </div>
      )}

      {completedNodeIds.length === routeNodes.length ? (
        <button className="primary-action" type="button" onClick={onFinale}>
          <Trophy size={18} aria-hidden="true" />
          查看终局游记
        </button>
      ) : (
        <button className="primary-action" type="button" onClick={onOpenNode}>
          {activeBoardEvent ? <Sparkles size={18} aria-hidden="true" /> : <Footprints size={18} aria-hidden="true" />}
          {activeBoardEvent ? `处理「${activeBoardEvent.title}」` : `进入「${currentNode.title}」`}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}

    </aside>
  )
}
