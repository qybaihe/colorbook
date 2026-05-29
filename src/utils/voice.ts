import type { CityId } from '../data/cityPacks'

export type VoiceLineId = 'stage' | `choice-${number}`

let activeVoice: HTMLAudioElement | null = null
const prefetchedVoiceSrcs = new Set<string>()
const voiceStartEvent = 'voice-line-start'
const voiceStopEvent = 'voice-line-stop'

export function getVoiceLineSrc(cityId: CityId, nodeId: string, lineId: VoiceLineId) {
  return `/audio/voice/${cityId}/${nodeId}/${lineId}.mp3`
}

export function preloadVoiceLines(srcs: string[]) {
  if (typeof window === 'undefined') return

  srcs.forEach((src) => {
    if (prefetchedVoiceSrcs.has(src)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'audio'
    link.href = src
    document.head.appendChild(link)
    prefetchedVoiceSrcs.add(src)
  })
}

export function stopVoiceLine() {
  if (!activeVoice) return

  activeVoice.pause()
  activeVoice.currentTime = 0
  activeVoice = null
  window.dispatchEvent(new Event(voiceStopEvent))
}

export function playVoiceLine(src: string, onEnded?: () => void, onStarted?: () => void) {
  if (typeof window === 'undefined') return Promise.resolve(false)

  stopVoiceLine()

  const audio = new Audio(src)
  audio.preload = 'auto'
  audio.volume = 1
  activeVoice = audio

  audio.addEventListener('ended', () => {
    if (activeVoice === audio) activeVoice = null
    window.dispatchEvent(new Event(voiceStopEvent))
    onEnded?.()
  }, { once: true })

  audio.addEventListener('error', () => {
    if (activeVoice === audio) activeVoice = null
    window.dispatchEvent(new Event(voiceStopEvent))
    onEnded?.()
  }, { once: true })

  return audio.play().then(() => {
    if (activeVoice === audio) {
      window.dispatchEvent(new Event(voiceStartEvent))
      onStarted?.()
    }
    return true
  }).catch(() => {
    if (activeVoice === audio) activeVoice = null
    window.dispatchEvent(new Event(voiceStopEvent))
    onEnded?.()
    return false
  })
}
