const seedStoragePrefix = 'time-chess-playthrough-seed:'

export function createPlaythroughSeed(cityId: string) {
  const randomPart = createRandomPart()
  return `${cityId}-${randomPart}`
}

function createRandomPart() {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  }

  return Math.random().toString(36).slice(2, 14)
}

export function getPlaythroughSeed(cityId: string) {
  if (typeof window === 'undefined') return `${cityId}-static-seed`

  const storageKey = `${seedStoragePrefix}${cityId}`
  const existing = window.sessionStorage.getItem(storageKey)
  if (existing) return existing

  const next = createPlaythroughSeed(cityId)
  window.sessionStorage.setItem(storageKey, next)
  return next
}

export function setPlaythroughSeed(cityId: string, seed?: string) {
  if (typeof window === 'undefined') return seed ?? `${cityId}-static-seed`

  const storageKey = `${seedStoragePrefix}${cityId}`
  const next = seed ?? createPlaythroughSeed(cityId)
  window.sessionStorage.setItem(storageKey, next)
  return next
}
