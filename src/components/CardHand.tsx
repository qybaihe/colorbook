import type { CSSProperties } from 'react'
import { LockKeyhole } from 'lucide-react'
import { useCityPack } from '../data/cityPackRuntime'
import { playUiSound } from '../utils/sound'
import { GameCardArt } from './GameCardArt'

export function CardHand({
  collectedCardIds,
  compact = false,
  onSelect,
}: {
  collectedCardIds: string[]
  compact?: boolean
  onSelect?: (cardId: string) => void
}) {
  const cityPack = useCityPack()
  const cards = compact
    ? collectedCardIds.length
      ? cityPack.cards.getGameCards(collectedCardIds)
      : cityPack.cards.cultureCards
    : cityPack.cards.getCardsForHand(collectedCardIds)

  return (
    <div className={compact ? 'card-hand compact' : 'card-hand'}>
      {cards.map((card) => {
        const earned = collectedCardIds.includes(card.id)
        return (
          <button
            className={earned ? 'hand-card earned' : 'hand-card'}
            key={card.id}
            type="button"
            onClick={() => {
              playUiSound(earned ? 'cardFlip' : 'locked')
              onSelect?.(card.id)
            }}
            style={{ '--card-color': card.color } as CSSProperties}
          >
            <GameCardArt card={card} locked={!earned}>
              {!earned && <LockKeyhole size={16} aria-hidden="true" />}
            </GameCardArt>
            <span>
              <strong>{card.name}</strong>
              <small>{earned ? cityPack.cards.cardCategoryMeta[card.category].shortLabel : '未解锁'}</small>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function RewardCards({ cardIds }: { cardIds: string[] }) {
  const cityPack = useCityPack()

  return (
    <div className="reward-cards">
      {cardIds.map((cardId) => {
        const card = cityPack.cards.getGameCard(cardId)
        if (!card) return null
        return (
          <article className="reward-card" key={card.id} style={{ '--card-color': card.color } as CSSProperties}>
            <GameCardArt card={card} />
            <strong>{card.name}</strong>
            <small>{cityPack.cards.cardCategoryMeta[card.category].shortLabel} / {card.theme}</small>
          </article>
        )
      })}
    </div>
  )
}
