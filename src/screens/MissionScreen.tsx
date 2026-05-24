import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, ChevronLeft, ImageUp, MessageSquareText, Mic2 } from 'lucide-react'
import { RewardCards } from '../components/CardHand'
import type { RouteNode } from '../data/beijingGame'
import type { BoardEvent } from '../data/randomEvents'
import { getTurnSceneMeta } from '../data/tileScenes'

export function MissionScreen({
  node,
  trackIndex,
  boardEvent,
  memoryLine,
  onBack,
  onMemoryChange,
  onComplete,
}: {
  node: RouteNode
  trackIndex: number
  boardEvent: BoardEvent | null
  memoryLine: string
  onBack: () => void
  onMemoryChange: (value: string) => void
  onComplete: () => void
}) {
  const scene = getTurnSceneMeta(node.id, trackIndex, boardEvent)
  const rewardCardIds = Array.from(new Set([...node.rewardCardIds, ...(boardEvent?.rewardCardIds ?? [])])).slice(0, 6)

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
          {boardEvent && <small>{boardEvent.storyHook}</small>}
        </section>

        <section className="scene-mission-scroll" aria-label="现实任务卡阵">
          <div className="scene-mission-scroll-header">
            <p className="eyebrow">完成任意一项即可领牌</p>
            <h2>现场证据回传</h2>
          </div>

          <div className="scene-task-cards">
            <TaskCard icon={ImageUp} title="拍照观察" text={boardEvent?.taskDirective ?? node.photoPrompt} />
            <TaskCard icon={Mic2} title="市声记录" text={boardEvent?.tone === 'sound' ? boardEvent.taskDirective : '可用 10 秒城市声音替代。'} />
            <TaskCard icon={MessageSquareText} title="留下回声" text="想交给北京的一句话。" />
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
            <RewardCards cardIds={rewardCardIds} />
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
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <article className="task-card">
      <div className="task-card-icon">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="task-card-info">
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </article>
  )
}
