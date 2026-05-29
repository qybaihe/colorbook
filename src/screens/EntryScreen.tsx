import { useState } from 'react'
import { ArrowRight, Map, MapPinned, Sparkles } from 'lucide-react'
import { cityChoices, type CityId } from '../data/cityPacks'

const cityIcons = {
  beijing: MapPinned,
  tianjin: Map,
} as const

export function EntryScreen({
  activeCityId,
  onStart,
}: {
  activeCityId: CityId
  onStart: (cityId: CityId) => void
}) {
  const [selectedCity, setSelectedCity] = useState<CityId>(activeCityId)

  return (
    <section className={`screen entry-screen city-${selectedCity}`}>
      <div className="city-background-stack" aria-hidden="true">
        {cityChoices.map((city) => (
          <div
            className={`city-background-layer city-layer-${city.id} ${city.id === selectedCity ? 'active' : ''}`}
            key={city.id}
            style={{ backgroundImage: `url("${city.background}")` }}
          />
        ))}
      </div>
      <img
        alt="此地有回声"
        className="entry-title-art"
        src="/assets/city-select/echo-title-calligraphy.png"
      />

      <div className="city-choice-panel" aria-label="城市章节选择">
        <div className="chapter-cards" aria-label="城市章节">
          {cityChoices.map((city) => {
            const Icon = cityIcons[city.id]
            const isActive = city.id === selectedCity

            return (
              <button
                aria-pressed={isActive}
                className={`chapter-card ${isActive ? 'active' : ''}`}
              key={city.id}
              type="button"
              onClick={() => setSelectedCity(city.id)}
            >
                <Icon size={20} aria-hidden="true" />
                <span>
                  <strong>
                    {city.city}《{city.title}》
                  </strong>
                </span>
              </button>
            )
          })}
        </div>

        <div className="entry-actions">
          <button
            className="primary-action"
            type="button"
            onClick={() => onStart(selectedCity)}
          >
            <Sparkles size={18} aria-hidden="true" />
            开始游戏
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
