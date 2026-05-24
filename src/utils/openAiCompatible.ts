import type { AiEndpointConfig } from '../types'

type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  role: ChatRole
  content: string
}

type RequestTextOptions = {
  config: AiEndpointConfig
  messages: ChatMessage[]
  signal?: AbortSignal
  maxTokens?: number
  temperature?: number
}

function normalizeEndpointUrl(input: string) {
  const trimmed = input.trim().replace(/\/+$/, '')
  if (!trimmed) return ''
  if (/\/chat\/completions$/i.test(trimmed)) return trimmed
  return `${trimmed}/chat/completions`
}

export async function requestOpenAiText({
  config,
  messages,
  signal,
  maxTokens = 700,
  temperature = 0.78,
}: RequestTextOptions) {
  const endpoint = normalizeEndpointUrl(config.endpointUrl)

  if (!endpoint || !config.apiKey.trim() || !config.model.trim()) {
    throw new Error('AI Mode 需要 URL、API Key 和模型名')
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model.trim(),
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(errorText || `AI 请求失败：${response.status}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text

    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('AI 没有返回可用文本')
    }

    return content.trim()
  } catch (error) {
    if (signal?.aborted) throw error
    if (error instanceof Error) throw error
    throw new Error('AI 请求失败', { cause: error })
  }
}
