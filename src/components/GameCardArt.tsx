import type { CSSProperties, ReactNode } from 'react'
import { useCityPack } from '../data/cityPackRuntime'
import type { GameCard } from '../data/gameCards'

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
  const cityPack = useCityPack()

  return (
    <div
      className={`asset-slot game-card-art ${className}`}
      style={
        {
          '--accent': card.color,
          '--asset-url': `url("${locked ? cityPack.assetUrl('cardLocked') : cityPack.cards.getGameCardImageUrl(card)}")`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
