import { useState } from 'react'
import { ArrowRight, Map, MapPinned, Sparkles } from 'lucide-react'
import { chapter } from '../data/beijingGame'

const cityChapters = [
  {
    id: 'beijing',
    city: '北京',
    title: chapter.title,
    background: '/assets/city-select/beijing-map.png',
    Icon: MapPinned,
  },
  {
    id: 'tianjin',
    city: '天津',
    title: '海河来信',
    background: '/assets/city-select/tianjin-map.png',
    Icon: Map,
  },
  {
    id: 'future',
    city: '新城',
    title: '敬请期待',
    background: undefined,
    Icon: Map,
  },
] as const

type CityId = (typeof cityChapters)[number]['id']

export function EntryScreen({ onStart }: { onStart: () => void }) {
  const [selectedCity, setSelectedCity] = useState<CityId>('beijing')
  const isBeijing = selectedCity === 'beijing'

  return (
    <section className={`screen entry-screen city-${selectedCity}`}>
      <div className="city-background-stack" aria-hidden="true">
        {cityChapters.map((city) => (
          <div
            className={`city-background-layer city-layer-${city.id} ${city.id === selectedCity ? 'active' : ''}`}
            key={city.id}
            style={city.background ? { backgroundImage: `url("${city.background}")` } : undefined}
          />
        ))}
      </div>
      <div className="entry-brand-lockup" aria-label="此地有回声">
        <img
          alt=""
          aria-hidden="true"
          className="entry-app-icon"
          src="/assets/app-icon/colorbook-app-icon-1024.png"
        />
        <img
          alt="此地有回声"
          className="entry-title-art"
          src="/assets/city-select/echo-title-calligraphy.png"
        />
      </div>

      <div className="city-choice-panel" aria-label="城市章节选择">
        <div className="chapter-cards" aria-label="城市章节">
          {cityChapters.map((city) => {
            const Icon = city.Icon
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
            className={`primary-action ${isBeijing ? '' : 'unavailable'}`}
            type="button"
            onClick={isBeijing ? onStart : undefined}
            disabled={!isBeijing}
          >
            <Sparkles size={18} aria-hidden="true" />
            {isBeijing ? '开始游戏' : '敬请期待'}
            {isBeijing && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  )
}
