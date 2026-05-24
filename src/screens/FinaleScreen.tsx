import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { BookOpen, Download, Layers3, MapPinned, RotateCcw, Share2, Sparkles } from 'lucide-react'
import { AssetSlot } from '../components/AssetSlot'
import { GameCardArt } from '../components/GameCardArt'
import { routeNodes, type RouteNode } from '../data/beijingGame'
import {
  defaultSelectedCardId,
  getGameCards,
  type GameCard,
} from '../data/gameCards'
import type { AiEndpointConfig, GameMode, JourneyEvent } from '../types'
import { createFinaleMessages, parseFinaleResponse } from '../utils/aiPrompts'
import { requestOpenAiText } from '../utils/openAiCompatible'
import { playUiSound } from '../utils/sound'

type FinaleNodeCopy = {
  routeLine: string
  stamp: string
  sensory: string
  realization: string
  future: string
}

type FinalePhase = 'name' | 'cinematic' | 'story'

const PLAYER_NAME_STORAGE_KEY = 'beijingFinalePlayerName'
const FINALE_INTRO_SEEN_STORAGE_KEY = 'beijingFinaleIntroSeen'

const nodeFinaleCopy: Record<string, FinaleNodeCopy> = {
  qianmen: {
    routeLine: '我去了前门',
    stamp: '入城',
    sensory: '招牌、人流、铺面的吆喝和城门的影子一起涌来',
    realization: '清末掌柜把柜台一拍，城门的规矩便落成街面的热气。我懂得，北京的历史会藏进招牌、找零声、南来北往的眼神里。',
    future: '把“人为什么愿意来到这里”这个问题留给未来。',
  },
  axis: {
    routeLine: '我沿着中轴取景',
    stamp: '定向',
    sensory: '道路、天空和左右平衡把视线轻轻拉直',
    realization: '营城匠师用手指比出一条线，门、路、天光、人的站位都被它轻轻安放。所谓中轴，是城市给行人递来的定盘星。',
    future: '把“方向也会成为记忆”这件事留给未来。',
  },
  'corner-tower': {
    routeLine: '我看见宫城水影',
    stamp: '照影',
    sensory: '屋檐、水面、倒影和今天举起手机的手落进同一个画面',
    realization: '宫廷画师说，水能替宫城保管另一重天光。屋檐入水，旧日便有了回身的姿态；我举起今天的眼睛，同它隔着水纹相认。',
    future: '把“旧时光也需要新的目光”留给未来。',
  },
  jingshan: {
    routeLine: '我登上景山观城',
    stamp: '观城',
    sensory: '树影、宫城、远天和一条若隐若现的中轴展开成城市长卷',
    realization: '观城史官把风翻成一卷：先有宫城的脊背，再铺开树影、屋顶、人群和远天。站到高处，我看见秩序生出缝隙，缝隙里住着生活。',
    future: '把“看不见的线仍会牵引人”留给未来。',
  },
  shichahai: {
    routeLine: '我走到鼓楼 / 什刹海 / 胡同回声',
    stamp: '回声',
    sensory: '钟声、水声、车铃、门响和晚饭前的说话声都近了',
    realization: '胡同居民把话说进暮色：门响、车铃、水声和锅铲声，各自守着一户人家的时间。大历史走得很响，日子更会留人。',
    future: '把“城市最后要回到人间烟火”留给未来。',
  },
}

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
      const emptyTimer = window.setTimeout(() => {
        setDisplayedLength(0)
        setIsDone(true)
      }, 0)
      return () => {
        window.clearTimeout(emptyTimer)
        clearTimer()
      }
    }

    let index = 0
    const resetTimer = window.setTimeout(() => {
      setDisplayedLength(0)
      setIsDone(false)
    }, 0)
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

    return () => {
      window.clearTimeout(resetTimer)
      clearTimer()
    }
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

function getNodeCards(node: RouteNode, cards: GameCard[]) {
  const nodeCardIds = new Set([...node.rewardCardIds, ...(node.optionalCardIds ?? [])])
  return cards
    .filter((card) => nodeCardIds.has(card.id) || card.nodeAffinity?.includes(node.id))
    .slice(0, 4)
}

function createTravelogue({
  title,
  playerName,
  memoryLine,
  completedNodes,
  earnedCards,
  journeyLog,
}: {
  title: string
  playerName: string
  memoryLine: string
  completedNodes: RouteNode[]
  earnedCards: GameCard[]
  journeyLog: JourneyEvent[]
}) {
  const storyNodes = completedNodes.length ? completedNodes : routeNodes.slice(0, 1)
  const roleNames = storyNodes.map((node) => node.roleName).join('、')
  const cardNames = earnedCards.map((card) => card.name)
  const moveEvents = journeyLog.filter((event) => event.type === 'move' || event.type === 'event').slice(-10)
  const diceTrail = moveEvents.length
    ? `这一局不是照着一条固定线走完的。骰子把路线打散：${moveEvents.map((event) => event.label.replace(/^触发棋盘事件：/, '')).join('，')}。这些转折像临时盖下的章，让每一站都带着一点偶然。`
    : '这一局从前门轻轻起步，路线还没有完全展开，但棋盘已经把偶然留在纸页边上。'
  const intro = completedNodes.length
    ? `亲爱的北京：我是${playerName}。我把这一局棋收进纸页。格子退到身后，${storyNodes.map((node) => node.subtitle).join('、')}次第亮起，像一串沿中轴落下的朱印。`
    : `亲爱的北京：我是${playerName}。这封短笺尚未写完。我刚把棋子放到中轴线上，纸页已经等着第一阵脚步声。`

  const nodeParagraphs = storyNodes.map((node, index) => {
    const copy = nodeFinaleCopy[node.id]
    const nodeCards = getNodeCards(node, earnedCards)
    const cardLine = nodeCards.length
      ? `我把${nodeCards.map((card) => `《${card.name}》`).join('、')}夹进这一页，像把一枚枚小小的城印按在旅途中。`
      : '这一页先留出空白，等下一次脚步把它点亮。'

    const eventEcho = moveEvents[index]?.detail ? `这一段还带着一枚事件的背面：${moveEvents[index].detail}。` : ''

    return `${copy.routeLine}。我在那里遇见${node.roleName}，${copy.sensory}。${copy.realization}${eventEcho}${cardLine}`
  })

  const cardSummary = cardNames.length
    ? `卡册里的${cardNames.slice(0, 6).join('、')}${cardNames.length > 6 ? `等 ${cardNames.length} 张牌` : ''}，替我保存了这一程的暗号：门、线、水影、高处、钟声，以及人间日常。`
    : '卡册还没有真正亮起来，但路线已经把门、线、水影、高处和人的日常摆在了我面前。'

  const truth = storyNodes.length >= 5
    ? '这一局的真相是：北京中轴有礼制的骨，也有买卖的热、宫墙的影、高处的风、晚饭前的灯。它把宏大的城市递回具体的人。'
    : '这一局还在途中，但我已经听见一个答案：中轴写在地图上，也落在行人的脚步里。'

  const ending = `如果要把什么留给未来，我会留下这句话：“${memoryLine}” 也留下我遇见的${roleNames || '陌生人'}、我听见的城市回声，以及一个很小的愿望：后来的人再走到这里时，眼前有景，耳边有声，心里有一条能回家的北京。`

  const typedStory = [intro, diceTrail, ...nodeParagraphs, cardSummary, truth, ending].join('\n\n')
  const saveText = createSaveText({
    title,
    playerName,
    memoryLine,
    completedNodes: storyNodes,
    earnedCards,
    typedStory,
  })

  return { typedStory, saveText, truth }
}

function createSaveText({
  title,
  playerName,
  memoryLine,
  completedNodes,
  earnedCards,
  typedStory,
}: {
  title: string
  playerName: string
  memoryLine: string
  completedNodes: RouteNode[]
  earnedCards: GameCard[]
  typedStory: string
}) {
  const storyNodes = completedNodes.length ? completedNodes : routeNodes.slice(0, 1)
  const roleNames = storyNodes.map((node) => node.roleName).join('、')
  const cardNames = earnedCards.map((card) => card.name)

  return [
    `《${title}》`,
    '',
    `署名：${playerName}`,
    `路线：${storyNodes.map((node) => `${nodeFinaleCopy[node.id].routeLine}（${node.subtitle}）`).join(' -> ')}`,
    `遇见：${roleNames || '尚未遇见'}`,
    `卡牌：${cardNames.join('、') || '尚未点亮的卡牌'}`,
    `回声：${memoryLine}`,
    '',
    typedStory,
  ].join('\n')
}

export function FinaleScreen({
  title,
  memoryLine,
  collectedCardIds,
  completedNodeIds,
  gameMode,
  aiConfig,
  journeyLog,
  onReset,
  onOpenCards,
}: {
  title: string
  memoryLine: string
  collectedCardIds: string[]
  completedNodeIds: string[]
  gameMode: GameMode
  aiConfig?: AiEndpointConfig
  journeyLog: JourneyEvent[]
  onReset: () => void
  onOpenCards: (cardId: string) => void
}) {
  const [shareStatus, setShareStatus] = useState('')
  const [aiFinaleState, setAiFinaleState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    error?: string
  }>({ status: 'idle' })
  const [aiTravelogue, setAiTravelogue] = useState<{
    typedStory: string
    saveText: string
    truth: string
  } | null>(null)
  const [finaleTime] = useState(formatFinaleTime)
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.sessionStorage.getItem(PLAYER_NAME_STORAGE_KEY) ?? ''
  })
  const [phase, setPhase] = useState<FinalePhase>(() => {
    if (typeof window === 'undefined') return 'name'
    return window.sessionStorage.getItem(FINALE_INTRO_SEEN_STORAGE_KEY) === 'true' ? 'story' : 'name'
  })
  const [cinematicReady, setCinematicReady] = useState(false)
  const finaleAudioRef = useRef<HTMLAudioElement | null>(null)
  const earnedCards = useMemo(() => getGameCards(collectedCardIds), [collectedCardIds])
  const completedNodes = useMemo(
    () => routeNodes.filter((node) => completedNodeIds.includes(node.id)),
    [completedNodeIds],
  )
  const displayName = playerName.trim() || '时空旅人'
  const localTravelogue = useMemo(
    () => createTravelogue({ title, playerName: displayName, memoryLine, completedNodes, earnedCards, journeyLog }),
    [completedNodes, displayName, earnedCards, journeyLog, memoryLine, title],
  )
  const travelogue = gameMode === 'ai' && aiTravelogue ? aiTravelogue : localTravelogue
  const { displayedText, finish, isDone } = useTypewriter(phase === 'story' ? travelogue.typedStory : '')
  const typedParagraphs = displayedText.split('\n\n')
  const isFullRoute = completedNodes.length >= routeNodes.length
  const firstCardId = earnedCards[0]?.id ?? defaultSelectedCardId

  const startFinaleBgm = useCallback(() => {
    const audio = finaleAudioRef.current
    if (!audio) return
    audio.volume = 0.36
    void audio.play().catch(() => undefined)
  }, [])

  const continueToStory = useCallback(() => {
    window.sessionStorage.setItem(FINALE_INTRO_SEEN_STORAGE_KEY, 'true')
    playUiSound('finale')
    setPhase('story')
  }, [])

  useEffect(() => {
    if (phase !== 'story' || gameMode !== 'ai' || !aiConfig) {
      return undefined
    }

    const controller = new AbortController()
    const loadingTimer = window.setTimeout(() => {
      setAiTravelogue(null)
      setAiFinaleState({ status: 'loading' })
    }, 0)

    requestOpenAiText({
      config: aiConfig,
      signal: controller.signal,
      maxTokens: 1400,
      temperature: 0.82,
      messages: createFinaleMessages({
        title,
        playerName: displayName,
        memoryLine,
        completedNodes,
        earnedCards,
        journeyLog,
      }),
    })
      .then((rawText) => {
        let nextCopy
        try {
          nextCopy = parseFinaleResponse(rawText)
        } catch {
          nextCopy = {
            typedStory: rawText.trim(),
            truth: 'AI 已根据你的路线、卡牌和回声写下这一局：北京不是被看完的，是被你一步步走出来的。',
          }
        }

        setAiTravelogue({
          ...nextCopy,
          saveText: createSaveText({
            title,
            playerName: displayName,
            memoryLine,
            completedNodes,
            earnedCards,
            typedStory: nextCopy.typedStory,
          }),
        })
        setAiFinaleState({ status: 'success' })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'AI 游记暂时没有返回'
        setAiFinaleState({ status: 'error', error: message })
      })

    return () => {
      window.clearTimeout(loadingTimer)
      controller.abort()
    }
  }, [aiConfig, completedNodes, displayName, earnedCards, gameMode, journeyLog, memoryLine, phase, title])

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
    window.sessionStorage.setItem(PLAYER_NAME_STORAGE_KEY, nextName)
    window.sessionStorage.removeItem(FINALE_INTRO_SEEN_STORAGE_KEY)
    playUiSound('finale')
    startFinaleBgm()
    setPhase('cinematic')
  }

  const saveStory = () => {
    playUiSound('reward')
    const blob = new Blob([travelogue.saveText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeTitle = title.replace(/[\\/:*?"<>|]/g, ' ').trim() || '我的北京时空游记'
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
    <section className="screen finale-screen" aria-label="我的北京时空游记">
      <audio ref={finaleAudioRef} src="/audio/beijing-axis-bgm.wav" loop preload="auto" />
      <AssetSlot assetKey="finaleStorybook" accent="#96342e" className="screen-backdrop finale-backdrop" />

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
              <h2>你走过了北京的中轴线</h2>
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
            <p className="eyebrow">我的北京时空游记</p>
            <h1>《{title}》</h1>
          </div>
          <div className="finale-ledger" aria-label="游记摘要">
            <span>
              <MapPinned size={16} aria-hidden="true" />
              {completedNodes.length}/{routeNodes.length} 站
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
              {routeNodes.map((node) => {
                const copy = nodeFinaleCopy[node.id]
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
              <span>{gameMode === 'ai' ? 'AI Mode 写给城市的一封信' : '写给城市的一封信'}</span>
              {!isDone && <button type="button" onClick={finish}>跳过书写</button>}
            </div>
            <p className={`ai-finale-status ${aiFinaleState.status}`}>
              {gameMode === 'ai' && aiFinaleState.status === 'loading' && 'AI 正在根据你的选择、卡牌和回声重写终局游记...'}
              {gameMode === 'ai' && aiFinaleState.status === 'success' && `AI Mode · ${aiConfig?.model} 已入册`}
              {gameMode === 'ai' && aiFinaleState.status === 'error' && `AI 暂未接通，已保留本地游记：${aiFinaleState.error}`}
              {gameMode === 'ai' && aiFinaleState.status === 'idle' && 'AI Mode 等待终局入册'}
              {gameMode === 'local' && 'Local Only · 使用本地剧本生成'}
            </p>
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
                <p className="finale-empty">还没有获得卡牌，先回到棋盘完成一站。</p>
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
            <span className="finale-writing-status">游记正在书写，卡牌与回声会依次落到纸上。</span>
          )}
          {shareStatus && <p className="share-status">{shareStatus}</p>}
        </footer>
      </div>
      )}
    </section>
  )
}
