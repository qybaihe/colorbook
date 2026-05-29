import { ArrowRight, Footprints, Trophy } from 'lucide-react'
import { type RouteNode } from '../data/beijingGame'
import { useCityPack } from '../data/cityPackRuntime'

export function CurrentTurnPanel({
  currentNode,
  completedNodeIds,
  playerStamina,
  maxPlayerStamina,
  onOpenNode,
  onFinale,
}: {
  currentNode: RouteNode
  completedNodeIds: string[]
  playerStamina: number
  maxPlayerStamina: number
  onOpenNode: () => void
  onFinale: () => void
}) {
  const cityPack = useCityPack()
  const taskPlan = cityPack.tasks.getNodeTaskPlan(currentNode.id)
  const roleCardImage = cityPack.roleCardImages[currentNode.id]

  return (
    <aside className="turn-panel">
      <div className="turn-intro">
        <p className="eyebrow">当前回合</p>
        <h2>{currentNode.title}</h2>
        <p>{currentNode.place}</p>
      </div>

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
                  ? cityPack.assetUrl('staminaHeartFull')
                  : cityPack.assetUrl('staminaHeartEmpty')
              }
              alt=""
              draggable={false}
            />
          ))}
        </div>
      </div>

      <div className="dice-strip">
        {cityPack.diceFaces.map((face) => {
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
              <strong>{cityPack.tasks.taskKindLabels[task.kind]} / {task.label}</strong>
              <small>{cityPack.cards.getGameCards(task.triggerCardIds).map((card) => card.name).join('、')}</small>
            </div>
          ))}
        </div>
      )}

      {completedNodeIds.length === cityPack.routeNodes.length ? (
        <button className="primary-action" type="button" onClick={onFinale}>
          <Trophy size={18} aria-hidden="true" />
          查看终局游记
        </button>
      ) : (
        <button className="primary-action" type="button" onClick={onOpenNode}>
          <Footprints size={18} aria-hidden="true" />
          进入「{currentNode.title}」
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}

    </aside>
  )
}
