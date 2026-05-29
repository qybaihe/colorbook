import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { BookOpen, Download, Layers3, MapPinned, RotateCcw, Share2, Sparkles } from 'lucide-react'
import { AssetSlot } from '../components/AssetSlot'
import { GameCardArt } from '../components/GameCardArt'
import { useCityPack } from '../data/cityPackRuntime'
import { playUiSound } from '../utils/sound'

type FinalePhase = 'name' | 'cinematic' | 'story'

function formatFinaleTime() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

function useTypewriter(text: string, speed = 34) {
  const [displayedLength, setDisplayedLength] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current === null) return
    window.clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  useEffect(() => {
    clearTimer()

    if (!text) {
      window.setTimeout(() => setIsDone(true), 0)
      return clearTimer
    }

    let index = 0
    intervalRef.current = window.setInterval(() => {
      index = Math.min(text.length, index + 1)
      setDisplayedLength(index)
      if (index === 1) setIsDone(false)

      const latestChar = text[index - 1]
      if (latestChar?.trim() && index % 7 === 0) {
        playUiSound('typewriter')
      }

      if (index >= text.length) {
        clearTimer()
        setIsDone(true)
        window.setTimeout(() => playUiSound('reward'), 120)
      }
    }, speed)

    return clearTimer
  }, [clearTimer, speed, text])

  const finish = useCallback(() => {
    clearTimer()
    setDisplayedLength(text.length)
    setIsDone(true)
    playUiSound('select')
  }, [clearTimer, text.length])

  return {
    displayedText: text.slice(0, displayedLength),
    finish,
    isDone,
  }
}

export function FinaleScreen({
  title,
  memoryLine,
  collectedCardIds,
  completedNodeIds,
  onReset,
  onOpenCards,
}: {
  title: string
  memoryLine: string
  collectedCardIds: string[]
  completedNodeIds: string[]
  onReset: () => void
  onOpenCards: (cardId: string) => void
}) {
  const cityPack = useCityPack()
  const [shareStatus, setShareStatus] = useState('')
  const [finaleTime] = useState(formatFinaleTime)
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.sessionStorage.getItem(cityPack.finale.playerNameStorageKey) ?? ''
  })
  const [phase, setPhase] = useState<FinalePhase>(() => {
    if (typeof window === 'undefined') return 'name'
    return window.sessionStorage.getItem(cityPack.finale.introSeenStorageKey) === 'true' ? 'story' : 'name'
  })
  const [cinematicReady, setCinematicReady] = useState(false)
  const finaleAudioRef = useRef<HTMLAudioElement | null>(null)
  const earnedCards = useMemo(
    () => cityPack.cards.getGameCards(collectedCardIds),
    [cityPack.cards, collectedCardIds],
  )
  const completedNodes = useMemo(
    () => cityPack.routeNodes.filter((node) => completedNodeIds.includes(node.id)),
    [cityPack.routeNodes, completedNodeIds],
  )
  const displayName = playerName.trim() || '时空旅人'
  const travelogue = useMemo(
    () => cityPack.finale.createTravelogue({ title, playerName: displayName, memoryLine, completedNodes, earnedCards }),
    [cityPack.finale, completedNodes, displayName, earnedCards, memoryLine, title],
  )
  const { displayedText, finish, isDone } = useTypewriter(phase === 'story' ? travelogue.typedStory : '')
  const typedParagraphs = displayedText.split('\n\n')
  const isFullRoute = completedNodes.length >= cityPack.routeNodes.length
  const firstCardId = earnedCards[0]?.id ?? cityPack.cards.defaultSelectedCardId

  const startFinaleBgm = useCallback(() => {
    const audio = finaleAudioRef.current
    if (!audio) return
    audio.volume = 0.36
    void audio.play().catch(() => undefined)
  }, [])

  const continueToStory = useCallback(() => {
    window.sessionStorage.setItem(cityPack.finale.introSeenStorageKey, 'true')
    playUiSound('finale')
    setPhase('story')
  }, [cityPack.finale.introSeenStorageKey])

  useEffect(() => {
    const audio = finaleAudioRef.current
    return () => {
      if (audio) audio.pause()
    }
  }, [])

  useEffect(() => {
    if (phase !== 'cinematic') return undefined

    const theaterTimer = window.setTimeout(() => playUiSound('theater'), 900)
    const readyTimer = window.setTimeout(() => setCinematicReady(true), 2600)
    const storyTimer = window.setTimeout(() => continueToStory(), 5400)

    return () => {
      window.clearTimeout(theaterTimer)
      window.clearTimeout(readyTimer)
      window.clearTimeout(storyTimer)
    }
  }, [continueToStory, phase])

  const submitName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextName = displayName
    setPlayerName(nextName)
    setCinematicReady(false)
    window.sessionStorage.setItem(cityPack.finale.playerNameStorageKey, nextName)
    window.sessionStorage.removeItem(cityPack.finale.introSeenStorageKey)
    playUiSound('finale')
    startFinaleBgm()
    setPhase('cinematic')
  }

  const saveStory = () => {
    playUiSound('reward')
    const blob = new Blob([travelogue.saveText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeTitle = title.replace(/[\\/:*?"<>|]/g, ' ').trim() || cityPack.finale.defaultSaveTitle
    link.href = url
    link.download = `${safeTitle}.txt`
    link.click()
    URL.revokeObjectURL(url)
    setShareStatus('游记已保存')
  }

  const shareStory = async () => {
    playUiSound('select')

    try {
      if (navigator.share) {
        await navigator.share({ title: `此地有回声：${title}`, text: travelogue.saveText })
        setShareStatus('已打开分享面板')
        return
      }

      await navigator.clipboard?.writeText(travelogue.saveText)
      setShareStatus('游记文案已复制')
    } catch {
      setShareStatus('分享被取消，游记仍在这里')
    }
  }

  const openAlbum = () => {
    playUiSound('cardFlip')
    onOpenCards(firstCardId)
  }

  return (
    <section className="screen finale-screen" aria-label={cityPack.finale.ariaLabel}>
      <audio ref={finaleAudioRef} src={cityPack.bgmSrc} loop preload="auto" />
      <AssetSlot assetKey="finaleStorybook" accent={cityPack.accent} className="screen-backdrop finale-backdrop" />

      {phase !== 'story' && (
        <div className="finale-intro-overlay" aria-label="终局署名与开场">
          <AssetSlot assetKey="finaleCinematicIntro" accent="#050505" className="finale-cinematic-backdrop" />

          {phase === 'name' ? (
            <form className="finale-name-card" onSubmit={submitName}>
              <p>这篇游记将写给你</p>
              <h2>你是？</h2>
              <input
                aria-label="你的昵称"
                autoFocus
                maxLength={12}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="写下你的昵称"
                value={playerName}
              />
              <button className="primary-action" type="submit">
                署名入册
              </button>
            </form>
          ) : (
            <div className={cinematicReady ? 'finale-cinematic-copy ready' : 'finale-cinematic-copy'}>
              <span>你是</span>
              <strong>{displayName}</strong>
              <p>在 {finaleTime}</p>
              <h2>{cityPack.finale.cinematicTitle}</h2>
              <small>{completedNodes.length} 次相遇，{earnedCards.length} 张卡牌，一句留给未来的话。</small>
              {cinematicReady && (
                <button className="secondary-action" type="button" onClick={continueToStory}>
                  翻开游记
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {phase === 'story' && (
        <div className="finale-archive">
          <header className="finale-header">
            <div>
              <p className="eyebrow">{cityPack.finale.eyebrow}</p>
              <h1>《{title}》</h1>
            </div>
            <div className="finale-ledger" aria-label="游记摘要">
              <span>
                <MapPinned size={16} aria-hidden="true" />
                {completedNodes.length}/{cityPack.routeNodes.length} 站
              </span>
              <span>
                <Layers3 size={16} aria-hidden="true" />
                {earnedCards.length} 张牌
              </span>
              <span>
                <Sparkles size={16} aria-hidden="true" />
                {isFullRoute ? '路线已收束' : '游记草稿'}
              </span>
            </div>
          </header>

          <div className="finale-grid">
            <aside className="finale-route-panel" aria-label="路线印章">
              <div className="finale-panel-heading">
                <BookOpen size={17} aria-hidden="true" />
                <span>路线印章</span>
              </div>
              <div className="finale-route-stamps">
                {cityPack.routeNodes.map((node) => {
                  const copy = cityPack.finale.nodeCopy[node.id]
                  const done = completedNodeIds.includes(node.id)
                  return (
                    <article
                      className={done ? 'finale-route-stamp done' : 'finale-route-stamp'}
                      key={node.id}
                      style={{ '--node-color': node.accent } as CSSProperties}
                    >
                      <i>{copy.stamp}</i>
                      <span>
                        <strong>{copy.routeLine}</strong>
                        <small>{node.roleName} · {done ? copy.future : '等待入册'}</small>
                      </span>
                    </article>
                  )
                })}
              </div>
              <blockquote className="finale-memory-note">{memoryLine}</blockquote>
            </aside>

            <article className="finale-paper" aria-label="逐字生成的游记正文">
              <div className="paper-ribbon">
                <span>写给城市的一封信</span>
                {!isDone && <button type="button" onClick={finish}>跳过书写</button>}
              </div>
              <div className="typewriter-copy">
                {typedParagraphs.map((paragraph, index) => {
                  const isActive = index === typedParagraphs.length - 1 && !isDone
                  return (
                    <p className={isActive ? 'typing' : ''} key={index}>
                      {paragraph}
                    </p>
                  )
                })}
              </div>
              <p className="finale-truth">{travelogue.truth}</p>
            </article>

            <aside className="finale-card-panel" aria-label="本局收集卡牌">
              <div className="finale-panel-heading">
                <Layers3 size={17} aria-hidden="true" />
                <span>获得卡牌 · {earnedCards.length} 张</span>
              </div>
              <div className="finale-card-film" aria-label="获得卡牌列表">
                {earnedCards.length ? (
                  earnedCards.map((card) => (
                    <button
                      className="finale-film-card"
                      key={card.id}
                      type="button"
                      onClick={() => {
                        playUiSound('cardFlip')
                        onOpenCards(card.id)
                      }}
                      style={{ '--card-color': card.color } as CSSProperties}
                      title={card.name}
                    >
                      <GameCardArt card={card} />
                      <span>{card.name}</span>
                    </button>
                  ))
                ) : (
                  <p className="finale-empty">{cityPack.finale.emptyCards}</p>
                )}
              </div>
            </aside>
          </div>

          <footer className={isDone ? 'finale-actions ready' : 'finale-actions'}>
            {isDone ? (
              <>
                <button className="secondary-action" type="button" onClick={saveStory}>
                  <Download size={18} aria-hidden="true" />
                  保存游记
                </button>
                <button className="secondary-action" type="button" onClick={shareStory}>
                  <Share2 size={18} aria-hidden="true" />
                  分享文字
                </button>
                <button className="secondary-action" type="button" onClick={openAlbum}>
                  <Layers3 size={18} aria-hidden="true" />
                  查看卡册
                </button>
                <button className="primary-action" type="button" onClick={onReset}>
                  <RotateCcw size={18} aria-hidden="true" />
                  重新开局
                </button>
              </>
            ) : (
              <span className="finale-writing-status">{cityPack.finale.writingStatus}</span>
            )}
            {shareStatus && <p className="share-status">{shareStatus}</p>}
          </footer>
        </div>
      )}
    </section>
  )
}
