import { useState } from 'react'
import { ArrowRight, Bot, BrainCircuit, KeyRound, Link2, Map, MapPinned, Monitor, Sparkles } from 'lucide-react'
import { chapter } from '../data/beijingGame'
import type { GameMode, GameSetup } from '../types'

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

const AI_CONFIG_STORAGE_KEY = 'beijingAiEndpointConfig'
const AI_KEY_STORAGE_KEY = 'beijingAiEndpointApiKey'

function getStoredAiConfig() {
  if (typeof window === 'undefined') {
    return { endpointUrl: '', apiKey: '', model: '' }
  }

  try {
    const stored = window.localStorage.getItem(AI_CONFIG_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) as Partial<GameSetup['aiConfig']> : undefined

    return {
      endpointUrl: parsed?.endpointUrl ?? '',
      apiKey: window.sessionStorage.getItem(AI_KEY_STORAGE_KEY) ?? '',
      model: parsed?.model ?? '',
    }
  } catch {
    return { endpointUrl: '', apiKey: '', model: '' }
  }
}

export function EntryScreen({ onStart }: { onStart: (setup: GameSetup) => void }) {
  const [selectedCity, setSelectedCity] = useState<CityId>('beijing')
  const [gameMode, setGameMode] = useState<GameMode>('local')
  const [aiConfig, setAiConfig] = useState(getStoredAiConfig)
  const isBeijing = selectedCity === 'beijing'
  const hasAiConfig = Boolean(
    aiConfig.endpointUrl.trim() &&
    aiConfig.apiKey.trim() &&
    aiConfig.model.trim(),
  )
  const canStart = isBeijing && (gameMode === 'local' || hasAiConfig)

  const startGame = () => {
    if (!canStart) return

    if (gameMode === 'ai') {
      const cleanConfig = {
        endpointUrl: aiConfig.endpointUrl.trim(),
        apiKey: aiConfig.apiKey.trim(),
        model: aiConfig.model.trim(),
      }
      window.localStorage.setItem(
        AI_CONFIG_STORAGE_KEY,
        JSON.stringify({ endpointUrl: cleanConfig.endpointUrl, model: cleanConfig.model }),
      )
      window.sessionStorage.setItem(AI_KEY_STORAGE_KEY, cleanConfig.apiKey)
      onStart({ mode: 'ai', aiConfig: cleanConfig })
      return
    }

    onStart({ mode: 'local' })
  }

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

      <div className="entry-mode-panel" aria-label="体验模式">
        <div className="entry-mode-heading">
          <span>体验模式</span>
          <strong>{gameMode === 'ai' ? 'AI Mode' : 'Local Only'}</strong>
        </div>

        <div className="entry-mode-options" role="group" aria-label="选择游戏模式">
          <button
            aria-pressed={gameMode === 'local'}
            className={gameMode === 'local' ? 'entry-mode-option active' : 'entry-mode-option'}
            type="button"
            onClick={() => setGameMode('local')}
          >
            <Monitor size={18} aria-hidden="true" />
            <span>
              <strong>Local Only</strong>
              <small>离线固定剧本</small>
            </span>
          </button>
          <button
            aria-pressed={gameMode === 'ai'}
            className={gameMode === 'ai' ? 'entry-mode-option active ai' : 'entry-mode-option ai'}
            type="button"
            onClick={() => setGameMode('ai')}
          >
            <Bot size={18} aria-hidden="true" />
            <span>
              <strong>AI Mode</strong>
              <small>实时生成对白与游记</small>
            </span>
          </button>
        </div>

        {gameMode === 'ai' && (
          <div className="entry-ai-config" aria-label="OpenAI 兼容端点配置">
            <label>
              <span>
                <Link2 size={14} aria-hidden="true" />
                URL
              </span>
              <input
                inputMode="url"
                placeholder="https://your-endpoint.example/v1"
                value={aiConfig.endpointUrl}
                onChange={(event) => setAiConfig((current) => ({ ...current, endpointUrl: event.target.value }))}
              />
            </label>
            <label>
              <span>
                <KeyRound size={14} aria-hidden="true" />
                API Key
              </span>
              <input
                autoComplete="off"
                placeholder="sk-..."
                type="password"
                value={aiConfig.apiKey}
                onChange={(event) => setAiConfig((current) => ({ ...current, apiKey: event.target.value }))}
              />
            </label>
            <label>
              <span>
                <BrainCircuit size={14} aria-hidden="true" />
                模型
              </span>
              <input
                placeholder="填写你的模型名"
                value={aiConfig.model}
                onChange={(event) => setAiConfig((current) => ({ ...current, model: event.target.value }))}
              />
            </label>
            <p>URL 可填基础地址或 /chat/completions 完整地址；端点需允许浏览器访问，Key 仅保存在当前会话。</p>
          </div>
        )}
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
            className={`primary-action ${canStart ? '' : 'unavailable'}`}
            type="button"
            onClick={startGame}
            disabled={!canStart}
          >
            <Sparkles size={18} aria-hidden="true" />
            {isBeijing ? (gameMode === 'ai' ? '启用 AI Mode' : 'Local Only 开始') : '敬请期待'}
            {canStart && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  )
}
