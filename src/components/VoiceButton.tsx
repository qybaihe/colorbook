import { Volume2, VolumeX } from 'lucide-react'

export function VoiceButton({
  enabled,
  playing,
  disabled = false,
  label,
  onToggle,
}: {
  enabled: boolean
  playing: boolean
  disabled?: boolean
  label: string
  onToggle: () => void
}) {
  const title = disabled ? '配音生成中' : enabled ? (playing ? '关闭当前配音' : '关闭自动配音') : label

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
      disabled={disabled}
      onClick={onToggle}
    >
      {enabled ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
    </button>
  )
}
