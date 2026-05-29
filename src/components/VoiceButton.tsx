import { Volume2, VolumeX } from 'lucide-react'

export function VoiceButton({
  enabled,
  playing,
  label,
  onToggle,
}: {
  enabled: boolean
  playing: boolean
  label: string
  onToggle: () => void
}) {
  const title = enabled ? (playing ? '关闭当前配音' : '关闭自动配音') : label

  return (
    <button
      className={[
        'voice-button',
        enabled ? 'active' : 'muted',
        playing ? 'playing' : '',
      ].filter(Boolean).join(' ')}
      type="button"
      title={title}
      aria-label={title}
      onClick={onToggle}
    >
      {enabled ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
    </button>
  )
}
