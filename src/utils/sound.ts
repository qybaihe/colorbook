export type SoundKind =
  | 'nav'
  | 'select'
  | 'dice'
  | 'reward'
  | 'reset'
  | 'cardDraw'
  | 'cardFlip'
  | 'cardShuffle'
  | 'cardUnlock'
  | 'locked'
  | 'theater'
  | 'mission'
  | 'finale'
  | 'step'
  | 'typewriter'

type ToneConfig = {
  frequency: number
  duration: number
  type: OscillatorType
}

type SampleConfig = {
  src: string
  volume: number
}

const sampleMap: Record<SoundKind, SampleConfig> = {
  nav: { src: '/audio/sfx/ui-nav.mp3', volume: 0.2 },
  select: { src: '/audio/sfx/ui-select.mp3', volume: 0.18 },
  dice: { src: '/audio/sfx/dice-roll.mp3', volume: 0.28 },
  reward: { src: '/audio/sfx/reward-collect.mp3', volume: 0.32 },
  reset: { src: '/audio/sfx/ui-reset.mp3', volume: 0.22 },
  cardDraw: { src: '/audio/sfx/card-draw.mp3', volume: 0.24 },
  cardFlip: { src: '/audio/sfx/card-flip.mp3', volume: 0.26 },
  cardShuffle: { src: '/audio/sfx/card-shuffle.mp3', volume: 0.18 },
  cardUnlock: { src: '/audio/sfx/card-unlock-sparkle.mp3', volume: 0.34 },
  locked: { src: '/audio/sfx/ui-locked.mp3', volume: 0.22 },
  theater: { src: '/audio/sfx/theater-open.mp3', volume: 0.24 },
  mission: { src: '/audio/sfx/mission-complete.mp3', volume: 0.3 },
  finale: { src: '/audio/sfx/finale-open.mp3', volume: 0.28 },
  step: { src: '/audio/sfx/walk-step.mp3', volume: 0.22 },
  typewriter: { src: '/audio/sfx/ui-select.mp3', volume: 0.045 },
}

const toneMap: Record<SoundKind, ToneConfig> = {
  nav: { frequency: 440, duration: 0.055, type: 'sine' },
  select: { frequency: 620, duration: 0.06, type: 'triangle' },
  dice: { frequency: 180, duration: 0.11, type: 'square' },
  reward: { frequency: 740, duration: 0.14, type: 'triangle' },
  reset: { frequency: 260, duration: 0.08, type: 'sine' },
  cardDraw: { frequency: 520, duration: 0.07, type: 'triangle' },
  cardFlip: { frequency: 580, duration: 0.06, type: 'triangle' },
  cardShuffle: { frequency: 320, duration: 0.12, type: 'sawtooth' },
  cardUnlock: { frequency: 820, duration: 0.13, type: 'triangle' },
  locked: { frequency: 210, duration: 0.07, type: 'square' },
  theater: { frequency: 360, duration: 0.09, type: 'sine' },
  mission: { frequency: 700, duration: 0.12, type: 'triangle' },
  finale: { frequency: 520, duration: 0.16, type: 'sine' },
  step: { frequency: 110, duration: 0.07, type: 'triangle' },
  typewriter: { frequency: 760, duration: 0.035, type: 'square' },
}

const audioCache = new Map<SoundKind, HTMLAudioElement>()
let audioContext: AudioContext | null = null

export function preloadUiSounds() {
  if (typeof window === 'undefined') return

  Object.entries(sampleMap).forEach(([kind, config]) => {
    const audio = new Audio(config.src)
    audio.preload = 'auto'
    audio.volume = config.volume
    audioCache.set(kind as SoundKind, audio)
  })
}

export function playUiSound(kind: SoundKind) {
  if (typeof window === 'undefined') return

  const played = playSample(kind)
  if (!played) playTone(kind)
}

export function playUiSoundSequence(sequence: Array<SoundKind | [SoundKind, number]>) {
  if (typeof window === 'undefined') return

  sequence.forEach((item) => {
    const [kind, delay] = Array.isArray(item) ? item : [item, 0]
    if (delay > 0) {
      window.setTimeout(() => playUiSound(kind), delay)
      return
    }

    playUiSound(kind)
  })
}

function playSample(kind: SoundKind) {
  const config = sampleMap[kind]
  const cached = audioCache.get(kind) ?? new Audio(config.src)
  audioCache.set(kind, cached)

  const audio = cached.cloneNode() as HTMLAudioElement
  audio.volume = config.volume
  audio.currentTime = 0

  void audio.play().catch(() => {
    playTone(kind)
  })

  return true
}

function playTone(kind: SoundKind) {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextConstructor) return

  audioContext ??= new AudioContextConstructor()
  const context = audioContext
  const { frequency, duration, type } = toneMap[kind]
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, now)
  if (kind === 'reward' || kind === 'cardUnlock' || kind === 'mission') {
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.45, now + duration)
  }
  if (kind === 'dice') oscillator.frequency.exponentialRampToValueAtTime(95, now + duration)
  if (kind === 'step') oscillator.frequency.exponentialRampToValueAtTime(70, now + duration)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.025)
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
