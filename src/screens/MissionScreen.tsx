import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, ChevronLeft, Compass, Dice6, ImageUp, MessageSquareText, Mic2, Stamp } from 'lucide-react'
import { RewardCards } from '../components/CardHand'
import type { RouteNode } from '../data/beijingGame'
import { useCityPack } from '../data/cityPackRuntime'
import type { TaskButtonKind, TaskButtonPlan } from '../data/taskPlans'
import { buildShuffledTaskButtons } from '../utils/beijingTheater'

const taskKindIcons: Record<TaskButtonKind, LucideIcon> = {
  photo: ImageUp,
  sound: Mic2,
  dice: Dice6,
  fate: Compass,
  create: Stamp,
  echo: MessageSquareText,
}

export function MissionScreen({
  node,
  memoryLine,
  playthroughSeed,
  onBack,
  onMemoryChange,
  onComplete,
}: {
  node: RouteNode
  memoryLine: string
  playthroughSeed: string
  onBack: () => void
  onMemoryChange: (value: string) => void
  onComplete: () => void
}) {
  const cityPack = useCityPack()
  const scene = cityPack.scenes.getNodeSceneMeta(node.id)
  const taskPlan = cityPack.tasks.getNodeTaskPlan(node.id)
  const fallbackTasks: TaskButtonPlan[] = [
    { kind: 'photo', label: '拍照观察', helper: node.photoPrompt, triggerCardIds: node.rewardCardIds.slice(0, 2) },
    { kind: 'sound', label: '市声记录', helper: '可用 10 秒城市声音替代。', triggerCardIds: node.rewardCardIds.slice(0, 2) },
    { kind: 'echo', label: '留下回声', helper: `想交给${cityPack.chapter.city}的一句话。`, triggerCardIds: node.rewardCardIds.slice(0, 2) },
  ]
  const baseTaskButtons = taskPlan?.taskButtons ?? fallbackTasks
  const taskButtons = cityPack.id === 'beijing'
    ? buildShuffledTaskButtons(baseTaskButtons, playthroughSeed, node.id)
    : baseTaskButtons

  return (
    <section className="screen scene-mission-screen" style={{ '--scene-accent': node.accent } as CSSProperties}>
      <img className="scene-bg-image" src={scene.sceneImage} alt="" draggable={false} />
      <div className="scene-bg-shade mission" aria-hidden="true" />

      <header className="scene-page-header compact">
        <button className="back-button scene-back-button" type="button" onClick={onBack} aria-label="返回剧场">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <h1>现实任务</h1>
          <p>{node.title} / {scene.sceneTone}</p>
        </div>
      </header>

      <main className="scene-mission-main">
        <section className="scene-story-copy" aria-label={`${node.title}任务说明`}>
          <p className="eyebrow">任务目标</p>
          <h2>{node.mission}</h2>
          <p>{scene.storyHint}</p>
        </section>

        <section className="scene-mission-scroll" aria-label="现实任务卡阵">
          <div className="scene-mission-scroll-header">
            <p className="eyebrow">完成任意一项即可领牌 / {taskButtons.length} 项可选</p>
            <h2>{taskPlan?.summary ?? '现场证据回传'}</h2>
          </div>

          <div className="scene-task-cards">
            {taskButtons.map((task) => (
              <TaskCard
                icon={taskKindIcons[task.kind]}
                key={`${task.kind}-${task.label}`}
                title={`${cityPack.tasks.taskKindLabels[task.kind]} / ${task.label}`}
                text={task.helper}
                cards={cityPack.cards.getGameCards(task.triggerCardIds).map((card) => card.name)}
              />
            ))}
          </div>

          <label className="scene-echo-note" htmlFor="memoryLine">
            <div className="echo-note-header">
              <MessageSquareText size={15} />
              <span>回声纸笺 / 任务记录</span>
            </div>
            <textarea
              id="memoryLine"
              value={memoryLine}
              placeholder="请在此输入您的观察发现或心情感悟..."
              rows={4}
              onChange={(event) => onMemoryChange(event.target.value)}
            />
            <div className="echo-note-footer">
              <span>* 完成现实任务不仅能获得卡牌，还将影响结局</span>
            </div>
          </label>

          <button className="scene-complete-stamp" type="button" onClick={onComplete}>
            <CheckCircle2 size={20} aria-hidden="true" />
            提交任务并领取卡牌
          </button>
        </section>

        <aside className="scene-reward-rack">
          <div className="rack-heading">
            <p className="eyebrow">奖励预览</p>
            <h2>本格牌组</h2>
          </div>
          <div className="rack-slots">
            <RewardCards cardIds={node.rewardCardIds} />
          </div>
        </aside>
      </main>
    </section>
  )
}

function TaskCard({
  icon: Icon,
  title,
  text,
  cards,
}: {
  icon: LucideIcon
  title: string
  text: string
  cards: string[]
}) {
  return (
    <article className="task-card">
      <div className="task-card-icon">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="task-card-info">
        <strong>{title}</strong>
        <span>{text}</span>
        {cards.length > 0 && <em>{cards.join('、')}</em>}
      </div>
    </article>
  )
}
