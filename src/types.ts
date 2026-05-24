export type Screen =
  | 'entry'
  | 'board'
  | 'photo'
  | 'theater'
  | 'mission'
  | 'album'
  | 'finale'

export type GameMode = 'local' | 'ai'

export type AiEndpointConfig = {
  endpointUrl: string
  apiKey: string
  model: string
}

export type GameSetup = {
  mode: GameMode
  aiConfig?: AiEndpointConfig
}

export type JourneyEventType =
  | 'mode'
  | 'photo'
  | 'element'
  | 'dice'
  | 'choice'
  | 'mission'
  | 'reward'

export type JourneyEvent = {
  id: string
  at: string
  type: JourneyEventType
  nodeId?: string
  label: string
  detail?: string
}

export type ElementMap = Record<string, string[]>
export type PhotoMap = Record<string, string>
