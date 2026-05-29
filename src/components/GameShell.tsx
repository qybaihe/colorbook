import { BookOpen, Expand, Layers3, MapPinned, Minimize2, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useCityPack } from '../data/cityPackRuntime'
import type { Screen } from '../types'
import { playUiSound } from '../utils/sound'

const bgmVolume = 0.56
const duckedBgmVolume = 0.22

export function GameShell({
  screen,
  children,
  bgmSrc,
  onNavigate,
  onReset,
}: {
  screen: Screen
  children: ReactNode
  bgmSrc: string
  onNavigate: (screen: Screen) => void
  onReset: () => void
}) {
  const cityPack = useCityPack()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [fullscreenOn, setFullscreenOn] = useState(false)

  useEffect(() => {
    const syncFullscreenState = () => {
      setFullscreenOn(Boolean(document.fullscreenElement))
    }

    syncFullscreenState()
    document.addEventListener('fullscreenchange', syncFullscreenState)
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState)
  }, [])

  useEffect(() => {
    const duckBgm = () => {
      const audio = audioRef.current
      if (audio && musicOn) audio.volume = duckedBgmVolume
    }
    const restoreBgm = () => {
      const audio = audioRef.current
      if (audio && musicOn) audio.volume = bgmVolume
    }

    window.addEventListener('voice-line-start', duckBgm)
    window.addEventListener('voice-line-stop', restoreBgm)
    return () => {
      window.removeEventListener('voice-line-start', duckBgm)
      window.removeEventListener('voice-line-stop', restoreBgm)
    }
  }, [musicOn])

  const toggleMusic = async () => {
    playUiSound('select')
    const audio = audioRef.current
    if (!audio) return
    audio.volume = bgmVolume

    if (musicOn) {
      audio.pause()
      setMusicOn(false)
      return
    }

    try {
      await audio.play()
      setMusicOn(true)
    } catch {
      setMusicOn(false)
    }
  }

  const toggleFullscreen = async () => {
    playUiSound('select')

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      await document.documentElement.requestFullscreen({ navigationUI: 'hide' })
    } catch {
      setFullscreenOn(Boolean(document.fullscreenElement))
    }
  }

  return (
    <div
      className={`game-shell active-city-${cityPack.id}`}
      style={
        {
          '--player-down-url': `url("${cityPack.assetUrl('playerDown')}")`,
          '--player-up-url': `url("${cityPack.assetUrl('playerUp')}")`,
          '--player-left-url': `url("${cityPack.assetUrl('playerLeft')}")`,
          '--player-right-url': `url("${cityPack.assetUrl('playerRight')}")`,
          '--completion-stamp-url': `url("${cityPack.assetUrl('completionStamp')}")`,
        } as CSSProperties
      }
    >
      <audio ref={audioRef} src={bgmSrc} loop preload="auto" />
      <main className="game-stage">{children}</main>
      <footer className="game-dock">
        <nav className="top-nav" aria-label="原型页面">
          <button
            className={screen === 'board' ? 'top-nav-button active' : 'top-nav-button'}
            type="button"
            onClick={() => onNavigate('board')}
          >
            <MapPinned size={17} aria-hidden="true" />
            棋盘
          </button>
          <button
            className={screen === 'album' ? 'top-nav-button active' : 'top-nav-button'}
            type="button"
            onClick={() => onNavigate('album')}
          >
            <Layers3 size={17} aria-hidden="true" />
            卡册
          </button>
          <button
            className={screen === 'finale' ? 'top-nav-button active' : 'top-nav-button'}
            type="button"
            onClick={() => onNavigate('finale')}
          >
            <BookOpen size={17} aria-hidden="true" />
            游记
          </button>
          <button
            className={musicOn ? 'top-nav-button active' : 'top-nav-button'}
            type="button"
            onClick={toggleMusic}
          >
            {musicOn ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
            BGM
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={onReset}
            aria-label="重新开局"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>
          <button
            className={fullscreenOn ? 'icon-button active' : 'icon-button'}
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreenOn ? '退出全屏' : '进入全屏'}
            title={fullscreenOn ? '退出全屏' : '进入全屏'}
          >
            {fullscreenOn ? <Minimize2 size={18} aria-hidden="true" /> : <Expand size={18} aria-hidden="true" />}
          </button>
        </nav>
      </footer>
    </div>
  )
}
