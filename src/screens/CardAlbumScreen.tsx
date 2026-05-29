import type { CSSProperties } from 'react'
import { LockKeyhole, Sparkles } from 'lucide-react'
import { AssetSlot } from '../components/AssetSlot'
import { CardHand } from '../components/CardHand'
import { GameCardArt } from '../components/GameCardArt'
import { useCityPack } from '../data/cityPackRuntime'
import { playUiSound } from '../utils/sound'

export function CardAlbumScreen({
  collectedCardIds,
  selectedCardId,
  onSelectCard,
}: {
  collectedCardIds: string[]
  selectedCardId: string
  onSelectCard: (cardId: string) => void
}) {
  const cityPack = useCityPack()
  const selectedCard =
    cityPack.cards.getGameCard(selectedCardId) ??
    cityPack.cards.getGameCard(cityPack.cards.defaultSelectedCardId) ??
    cityPack.cards.gameCards[0]
  const earned = collectedCardIds.includes(selectedCard.id)
  const selectedMeta = cityPack.cards.cardCategoryMeta[selectedCard.category]

  // Calculate stats
  const totalCards = cityPack.cards.gameCards.length
  const earnedCount = collectedCardIds.length
  const progressPercent = Math.round((earnedCount / totalCards) * 100)

  return (
    <section className="screen event-screen album-screen">
      <AssetSlot assetKey="cardAlbumTable" accent="#28665b" className="screen-backdrop" />

      <div className="album-board binder-left">
        <header className="album-header">
          <div className="album-header-main">
            <p className="eyebrow">档案 · 此地有回声</p>
            <h1>{cityPack.chapter.title}<span>收藏手册</span></h1>
          </div>
          <div className="album-stats">
            <div className="stat-item">
              <small>收录进度</small>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="stat-item">
              <small>已获卡牌</small>
              <strong>{earnedCount}<span>/{totalCards}</span></strong>
            </div>
          </div>
        </header>

        <div className="album-sections archive-pages">
          {cityPack.cards.playableCardCategories.map((category) => {
            const meta = cityPack.cards.cardCategoryMeta[category]
            const categoryCards = cityPack.cards.getGameCardsByCategory(category)
            const categoryEarnedCount = categoryCards.filter(c => collectedCardIds.includes(c.id)).length

            return (
              <section className="album-category archive-section" key={category} style={{ '--card-color': meta.color } as CSSProperties}>
                <div className="album-category-heading archive-tag">
                  <div className="tag-label">
                    <span className="tag-dot"></span>
                    <strong>{meta.label}</strong>
                  </div>
                  <div className="tag-stats">
                    <span>{categoryEarnedCount} / {categoryCards.length}</span>
                  </div>
                </div>
                <div className="album-category-grid card-slots">
                  {categoryCards.map((card) => {
                    const cardEarned = collectedCardIds.includes(card.id)
                    return (
                      <button
                        className={`card-slot-btn ${selectedCard.id === card.id ? 'selected' : ''} ${cardEarned ? 'earned' : 'locked-fog'}`}
                        key={card.id}
                        type="button"
                        onClick={() => {
                          playUiSound(cardEarned ? 'cardFlip' : 'locked')
                          onSelectCard(card.id)
                        }}
                        style={{ '--card-color': card.color } as CSSProperties}
                      >
                        <div className="card-mini-art">
                          <GameCardArt card={card}>
                            {!cardEarned && (
                              <div className="fog-overlay">
                                <LockKeyhole size={14} aria-hidden="true" />
                              </div>
                            )}
                          </GameCardArt>
                        </div>
                        <div className="card-slot-info">
                          <strong className="card-name">{card.name}</strong>
                          <span className="card-status">{cardEarned ? '已归档' : '残篇'}</span>
                        </div>
                        {selectedCard.id === card.id && <div className="selection-glow" />}
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <aside className="card-detail display-stand" style={{ '--card-color': selectedCard.color } as CSSProperties}>
        <div className="detail-visual-area">
          <GameCardArt card={selectedCard} className="detail-card-art">
            {!earned && (
              <span className="detail-lock-seal">
                <LockKeyhole size={16} aria-hidden="true" />
                <span>待解密</span>
              </span>
            )}
          </GameCardArt>
          <div className="stand-base"></div>
        </div>

        <div className="detail-info-scroll">
          <header className="detail-title-block">
            <p className="status-label">{earned ? '已录入档案' : '绝密件'}</p>
            <h2>{selectedCard.name}</h2>
            <div className="detail-meta-row">
              <span className="meta-tag">{selectedMeta.label}</span>
              <span className="meta-divider"></span>
              <span className="meta-theme">{selectedCard.theme}</span>
            </div>
          </header>

          <div className="detail-content-blocks">
            <div className="info-block desc-block">
              <h3>典故 / 描述</h3>
              <p>{selectedCard.description}</p>
            </div>

            <div className="info-block unlock-block">
              <h3>解锁条件</h3>
              <p className="unlock-rule-text">{selectedCard.unlockRule}</p>
            </div>

            <div className="info-block effect-block" style={{ '--accent': selectedCard.color } as CSSProperties}>
              <div className="effect-header">
                <Sparkles size={16} aria-hidden="true" />
                <h3>档案效能</h3>
              </div>
              <p className="effect-text">{selectedCard.effect ?? selectedMeta.description}</p>
            </div>
          </div>

          <footer className="detail-footer">
            <div className="quick-hand-label">其他相关档案</div>
            <CardHand collectedCardIds={collectedCardIds} compact onSelect={onSelectCard} />
          </footer>
        </div>
      </aside>
    </section>
  )
}
