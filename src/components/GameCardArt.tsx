import type { CSSProperties, ReactNode } from 'react'
import { assetUrl } from '../data/beijingAssets'
import { getGameCardImageUrl, type GameCard } from '../data/gameCards'

export function GameCardArt({
  card,
  locked = false,
  className = '',
  children,
}: {
  card: GameCard
  locked?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={`asset-slot game-card-art ${className}`}
      style={
        {
          '--accent': card.color,
          '--asset-url': `url("${locked ? assetUrl('cardLocked') : getGameCardImageUrl(card)}")`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
