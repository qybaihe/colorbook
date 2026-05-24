import type { CSSProperties } from 'react'
import { ArrowRight, Camera, ChevronLeft, Dice6, ImageUp } from 'lucide-react'
import type { RouteNode } from '../data/beijingGame'
import type { BoardEvent } from '../data/randomEvents'
import { getTurnSceneMeta } from '../data/tileScenes'

export function PhotoTriggerScreen({
  node,
  trackIndex,
  boardEvent,
  selectedElements,
  photoName,
  onBack,
  onPhoto,
  onSelectElement,
  onRoll,
}: {
  node: RouteNode
  trackIndex: number
  boardEvent: BoardEvent | null
  selectedElements: string[]
  photoName?: string
  onBack: () => void
  onPhoto: (fileName: string) => void
  onSelectElement: (element: string) => void
  onRoll: () => void
}) {
  const scene = getTurnSceneMeta(node.id, trackIndex, boardEvent)

  return (
    <section className="screen scene-photo-screen" style={{ '--scene-accent': node.accent } as CSSProperties}>
      <img className="scene-bg-image" src={scene.sceneImage} alt="" draggable={false} />
      <div className="scene-bg-shade" aria-hidden="true" />

      <header className="scene-page-header">
        <button className="back-button scene-back-button" type="button" onClick={onBack} aria-label="返回棋盘">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <h1>{node.title}</h1>
        </div>
      </header>

      <main className="scene-photo-main">
        <section className="scene-story-copy" aria-label={`${node.title}说明`}>
          <p className="eyebrow">{scene.sceneTone} / {node.roleName}</p>
          <h2>{scene.uploadTitle}</h2>
          <p>{scene.storyHint}</p>
          {boardEvent && <small>{boardEvent.storyHook}</small>}
        </section>

        <section className="scene-upload-card" aria-label="上传现场照片">
          <div className="scene-upload-card-title">
            <span>
              <Camera size={18} aria-hidden="true" />
            </span>
            <div>
              <strong>{scene.uploadTitle}</strong>
              <small>{scene.uploadHelp}</small>
            </div>
          </div>

          <label className="scene-upload-dropzone">
            <ImageUp size={30} aria-hidden="true" />
            <strong>{photoName || '拍摄或上传现场照片'}</strong>
            <span>{node.photoPrompt}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onPhoto(file.name)
              }}
            />
          </label>

          <div className="scene-element-panel">
            <div>
              <Camera size={17} aria-hidden="true" />
              <strong>现场元素</strong>
            </div>
            <div className="scene-tag-grid">
              {node.manualElements.map((element) => (
                <button
                  className={selectedElements.includes(element) ? 'selected' : ''}
                  key={element}
                  type="button"
                  onClick={() => onSelectElement(element)}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>

          <div className="scene-action-bar">
            <button className="scene-fallback-action" type="button" onClick={onRoll}>
              {scene.fallbackLabel}
            </button>
            <button className="scene-roll-action" type="button" onClick={onRoll}>
              <Dice6 size={18} aria-hidden="true" />
              掷时空骰
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
    </section>
  )
}
