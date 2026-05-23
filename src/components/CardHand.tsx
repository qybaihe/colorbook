import type { CSSProperties } from 'react'
import { LockKeyhole } from 'lucide-react'
import {
  cardCategoryMeta,
  cultureCards,
  getCardsForHand,
  getGameCard,
  getGameCards,
} from '../data/gameCards'
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
  const cards = compact
    ? collectedCardIds.length
      ? getGameCards(collectedCardIds)
      : cultureCards
    : getCardsForHand(collectedCardIds)

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
              <small>{earned ? cardCategoryMeta[card.category].shortLabel : '未解锁'}</small>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function RewardCards({ cardIds }: { cardIds: string[] }) {
  return (
    <div className="reward-cards">
      {cardIds.map((cardId) => {
        const card = getGameCard(cardId)
        if (!card) return null
        return (
          <article className="reward-card" key={card.id} style={{ '--card-color': card.color } as CSSProperties}>
            <GameCardArt card={card} />
            <strong>{card.name}</strong>
            <small>{cardCategoryMeta[card.category].shortLabel} / {card.theme}</small>
          </article>
        )
      })}
    </div>
  )
}
