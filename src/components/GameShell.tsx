import { BookOpen, Expand, Layers3, MapPinned, Minimize2, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Screen } from '../types'
import { playUiSound } from '../utils/sound'

export function GameShell({
  screen,
  children,
  onNavigate,
  onReset,
}: {
  screen: Screen
  children: ReactNode
  onNavigate: (screen: Screen) => void
  onReset: () => void
}) {
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

  const toggleMusic = async () => {
    playUiSound('select')
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.56

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
    <div className="game-shell">
      <audio ref={audioRef} src="/audio/beijing-axis-bgm.wav" loop preload="auto" />
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
