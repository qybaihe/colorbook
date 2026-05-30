import type { DialogueChoice, DiceFace, RouteNode } from '../data/beijingGame'

export type TheaterTurnMode = 'opening' | 'reply'

export type TheaterTurn = {
  source: 'ai' | 'fallback'
  line: string
  voiceText: string
  memoryTag: string
  evidenceLabel: string
  missionNudge: string
  mood: string
  visualPrompt: string
}

export type TheaterTurnRequest = {
  mode: TheaterTurnMode
  cityId: string
  cityTitle: string
  node: Pick<
    RouteNode,
    | 'id'
    | 'title'
    | 'subtitle'
    | 'place'
    | 'roleName'
    | 'roleTitle'
    | 'roleTone'
    | 'stageLine'
    | 'mission'
    | 'fallback'
    | 'choices'
  >
  diceFace: Pick<DiceFace, 'id' | 'name' | 'meaning'>
  selectedElements: string[]
  sceneRoleBio: string
  sceneTone: string
  activeChoice: DialogueChoice | null
  memoryLine: string
  encounterLabel: string
  encounterTitle: string
  encounterNote: string
  speechHint: string
  missionHint: string
  fallbackHint: string
  voiceHint: string
  playthroughSeed: string
}

type TheaterTurnResponse = {
  ok: boolean
  turn: TheaterTurn | null
}

type TheaterAssetResponse = {
  ok: boolean
  image?: { src: string; cached: boolean }
  voice?: { src: string; cached: boolean }
}

const turnCache = new Map<string, TheaterTurn | null>()
const turnInFlight = new Map<string, Promise<TheaterTurn | null>>()
const imageCache = new Map<string, string>()
const imageInFlight = new Map<string, Promise<string | null>>()
const voiceCache = new Map<string, string>()
const voiceInFlight = new Map<string, Promise<string | null>>()

function createClientCacheKey(prefix: string, body: unknown) {
  return `${prefix}:${JSON.stringify(body)}`
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  return await response.json() as T
}

export async function requestTheaterTurn(input: TheaterTurnRequest, signal?: AbortSignal) {
  void signal
  const cacheKey = createClientCacheKey('turn', input)
  if (turnCache.has(cacheKey)) return turnCache.get(cacheKey) ?? null

  const existing = turnInFlight.get(cacheKey)
  if (existing) return existing

  const pending = postJson<TheaterTurnResponse>('/api/theater/turn', input).then((response) => {
    const turn = response.turn ?? null
    turnCache.set(cacheKey, turn)
    return turn
  }).finally(() => {
    turnInFlight.delete(cacheKey)
  })
  turnInFlight.set(cacheKey, pending)
  return pending
}

export async function requestTheaterImage(prompt: string, signal?: AbortSignal) {
  void signal
  const cacheKey = createClientCacheKey('image', { prompt })
  const cached = imageCache.get(cacheKey)
  if (cached) return cached

  const existing = imageInFlight.get(cacheKey)
  if (existing) return existing

  const pending = postJson<TheaterAssetResponse>('/api/theater/image', { prompt }).then((response) => {
    const src = response.ok ? response.image?.src ?? null : null
    if (src) imageCache.set(cacheKey, src)
    return src
  }).finally(() => {
    imageInFlight.delete(cacheKey)
  })
  imageInFlight.set(cacheKey, pending)
  return pending
}

export async function requestTheaterVoice(
  cityId: string,
  nodeId: string,
  text: string,
  signal?: AbortSignal,
) {
  void signal
  const body = { cityId, nodeId, text }
  const cacheKey = createClientCacheKey('voice', body)
  const cached = voiceCache.get(cacheKey)
  if (cached) return cached

  const existing = voiceInFlight.get(cacheKey)
  if (existing) return existing

  const pending = postJson<TheaterAssetResponse>('/api/theater/voice', body).then((response) => {
    const src = response.ok ? response.voice?.src ?? null : null
    if (src) voiceCache.set(cacheKey, src)
    return src
  }).finally(() => {
    voiceInFlight.delete(cacheKey)
  })
  voiceInFlight.set(cacheKey, pending)
  return pending
}
