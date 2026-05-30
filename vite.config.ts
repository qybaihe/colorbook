import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import { promises as fs } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

type TheaterTurnMode = 'opening' | 'reply'

type TheaterChoicePayload = {
  prompt: string
  reply: string
}

type TheaterNodePayload = {
  id: string
  title: string
  subtitle: string
  place: string
  roleName: string
  roleTitle: string
  roleTone: string
  stageLine: string
  mission: string
  fallback: string
  choices: TheaterChoicePayload[]
}

type TheaterDicePayload = {
  id: string
  name: string
  meaning: string
}

type TheaterTurnRequest = {
  mode: TheaterTurnMode
  cityId: string
  cityTitle: string
  node: TheaterNodePayload
  diceFace: TheaterDicePayload
  selectedElements: string[]
  sceneRoleBio: string
  sceneTone: string
  activeChoice: TheaterChoicePayload | null
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

type TheaterTurn = {
  source: 'ai' | 'fallback'
  line: string
  voiceText: string
  memoryTag: string
  evidenceLabel: string
  missionNudge: string
  mood: string
  visualPrompt: string
}

type ChatResponse = {
  choices?: Array<{
    message?: {
      content?: string
      reasoning_content?: string
    }
    finish_reason?: string
  }>
  error?: {
    message?: string
  }
  message?: string
}

const cacheRoot = path.resolve(process.cwd(), '.cache/theater')
const generatedRoot = path.resolve(process.cwd(), 'public/generated/theater')
const generatedUrlRoot = '/generated/theater'
const theaterCacheVersion = 'beijing-theater-v1'

function createHash(input: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 24)
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function readBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk: string) => {
      body += chunk
      if (body.length > 96_000) {
        reject(new Error('Request body is too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}') as T)
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

async function readJsonCache<T>(cachePath: string) {
  try {
    return JSON.parse(await fs.readFile(cachePath, 'utf8')) as T
  } catch {
    return null
  }
}

async function writeJsonCache(cachePath: string, payload: unknown) {
  await fs.mkdir(path.dirname(cachePath), { recursive: true })
  await fs.writeFile(cachePath, JSON.stringify(payload, null, 2))
}

function cleanJsonText(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  return start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed
}

function parseLooseJson<T>(text: string) {
  const cleaned = cleanJsonText(text)
  try {
    return JSON.parse(cleaned) as T
  } catch {
    return JSON.parse(cleaned.replace(/,\s*([}\]])/g, '$1')) as T
  }
}

function compactText(text: string, maxLength: number) {
  return text.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function createFallbackTurn(input: TheaterTurnRequest): TheaterTurn {
  const elementText = input.selectedElements.length
    ? input.selectedElements.join('、')
    : '现场里的线索'
  const choice = input.activeChoice
  const line = choice
    ? `${input.node.roleName}答：${choice.reply}`
    : `${input.node.stageLine} ${input.encounterNote} 我从现场看见了${elementText}，这次骰面是「${input.diceFace.name}」。${input.diceFace.meaning}`

  return {
    source: 'fallback',
    line,
    voiceText: line,
    memoryTag: compactText(input.encounterLabel || input.node.title, 8),
    evidenceLabel: elementText.split('、')[0] ?? input.node.title,
    missionNudge: input.missionHint || input.node.mission,
    mood: input.sceneTone,
    visualPrompt: [
      'Premium Beijing cultural board-game evidence card, no readable text.',
      `Scene: ${input.node.title}, ${input.node.subtitle}.`,
      `Elements: ${elementText}.`,
      `Encounter: ${input.encounterTitle}.`,
      'Warm rice-paper texture, cinnabar red, ink teal, muted gold, cinematic but elegant.',
    ].join(' '),
  }
}

function buildTheaterMessages(input: TheaterTurnRequest) {
  const elementText = input.selectedElements.length
    ? input.selectedElements.join('、')
    : '玩家暂未拍照，使用现场替代元素'
  const choiceLine = input.activeChoice
    ? `玩家刚刚选择的问题：「${input.activeChoice.prompt}」。预写回复只作为参考：「${input.activeChoice.reply}」。`
    : '玩家还没有选择追问。'
  const modeHint = input.mode === 'opening'
    ? '生成角色进入剧场时的第一段现场回应。'
    : '生成角色回答玩家追问的一段回应。'

  const system = [
    '你是《北京中轴入局》的 AI 剧场导演，只为游戏内北京篇生成可朗读的角色台词。',
    '你必须严格保持角色人设、地点主题和现实任务，不要泛泛讲历史，不要离开玩家现场观察。',
    '当前遭遇模式会影响语言：取证要贴近细节，听城要短句有节拍，问路要多追问，转场要强调边界与分叉，留声要更温柔更收束。',
    '输出必须是单个 JSON 对象，不要 Markdown，不要解释，不要额外文字。',
    'JSON 字段：line, voiceText, memoryTag, evidenceLabel, missionNudge, mood, visualPrompt。',
    'line 是屏幕正文，中文 80-150 字；voiceText 是适合 TTS 的口语文本，可略加停顿但不要加括号说明。',
    'memoryTag 不超过 8 个汉字，evidenceLabel 不超过 6 个汉字，missionNudge 不超过 24 个汉字，mood 不超过 8 个汉字。',
    'visualPrompt 用英文写给生图模型，要求是北京文化游戏证物卡或舞台小插画，不要任何可读文字。',
  ].join('\n')

  const user = [
    modeHint,
    `城市：${input.cityTitle}`,
    `节点：${input.node.title} / ${input.node.subtitle}`,
    `地点：${input.node.place}`,
    `角色：${input.node.roleName}，${input.node.roleTitle}`,
    `角色语气：${input.node.roleTone}`,
    `角色背景：${input.sceneRoleBio}`,
    `当前遭遇：${input.encounterTitle}`,
    `遭遇说明：${input.encounterNote}`,
    `语言提示：${input.speechHint}`,
    `骰面：${input.diceFace.name}，${input.diceFace.meaning}`,
    `现场元素：${elementText}`,
    choiceLine,
    `现实任务：${input.missionHint || input.node.mission}`,
    `兜底提示：${input.fallbackHint || input.node.fallback}`,
    `语音提示：${input.voiceHint}`,
    `玩家终局记忆句：${input.memoryLine}`,
    '要求：像真人角色在现场对玩家说话，有北京气息；可以有轻微京味儿，但不要硬堆儿化音。',
  ].join('\n')

  return { system, user }
}

async function fetchWithTimeout(url: string, options: Parameters<typeof fetch>[1], timeoutMs: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function generateTheaterTurn(input: TheaterTurnRequest): Promise<TheaterTurn> {
  const cacheKey = createHash({ type: 'turn', theaterCacheVersion, input })
  const cachePath = path.join(cacheRoot, 'text', `${cacheKey}.json`)
  const cached = await readJsonCache<TheaterTurn>(cachePath)
  if (cached) return cached

  const apiKey = process.env.MIMO_API_KEY
  if (!apiKey) return createFallbackTurn(input)

  const baseUrl = process.env.MIMO_BASE_URL ?? 'https://token-plan-cn.xiaomimimo.com/v1'
  const model = process.env.MIMO_MODEL ?? 'mimo-v2.5-pro'
  const messages = buildTheaterMessages(input)
  const response = await fetchWithTimeout(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: messages.system },
        { role: 'user', content: messages.user },
      ],
      temperature: 0.74,
      max_tokens: 1800,
    }),
  }, Number(process.env.MIMO_TIMEOUT_MS ?? 90_000))
  const data = await response.json() as ChatResponse
  const content = data.choices?.[0]?.message?.content
  if (!response.ok || !content) {
    throw new Error(data.error?.message ?? data.message ?? 'Mimo theater text request failed')
  }

  const parsed = parseLooseJson<Partial<TheaterTurn>>(content)
  const fallback = createFallbackTurn(input)
  const turn: TheaterTurn = {
    source: 'ai',
    line: compactText(parsed.line ?? fallback.line, 220),
    voiceText: compactText(parsed.voiceText ?? parsed.line ?? fallback.voiceText, 220),
    memoryTag: compactText(parsed.memoryTag ?? fallback.memoryTag, 8),
    evidenceLabel: compactText(parsed.evidenceLabel ?? fallback.evidenceLabel, 6),
    missionNudge: compactText(parsed.missionNudge ?? fallback.missionNudge, 24),
    mood: compactText(parsed.mood ?? fallback.mood, 8),
    visualPrompt: compactText(parsed.visualPrompt ?? fallback.visualPrompt, 1200),
  }
  await writeJsonCache(cachePath, turn)
  return turn
}

async function generateTheaterImage(prompt: string) {
  const apiKey = process.env.IMAGE_API_KEY ?? process.env.THEATER_IMAGE_API_KEY
  if (!apiKey) throw new Error('Image API key is not configured')

  const baseUrl = process.env.IMAGE_BASE_URL ?? 'https://api.classby.cn'
  const model = process.env.IMAGE_MODEL ?? 'NanoBanana-2'
  const cacheKey = createHash({ type: 'image', theaterCacheVersion, model, prompt })
  const outPath = path.join(generatedRoot, 'images', `${cacheKey}.png`)
  const outUrl = `${generatedUrlRoot}/images/${cacheKey}.png`
  try {
    await fs.access(outPath)
    return { src: outUrl, cached: true }
  } catch {
    // Generate below.
  }

  const response = await fetchWithTimeout(`${baseUrl.replace(/\/$/, '')}/v1/images/generations`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: process.env.IMAGE_SIZE ?? '1024x1024',
      response_format: 'b64_json',
    }),
  }, Number(process.env.IMAGE_TIMEOUT_MS ?? 75_000))
  const data = await response.json() as {
    data?: Array<{ b64_json?: string; url?: string; image_url?: string }>
    error?: { message?: string }
    message?: string
  }
  if (!response.ok) throw new Error(data.error?.message ?? data.message ?? 'Image generation failed')

  const first = data.data?.[0]
  let bytes: Buffer | null = null
  if (first?.b64_json) {
    bytes = Buffer.from(first.b64_json, 'base64')
  } else if (first?.url || first?.image_url) {
    const imageResponse = await fetchWithTimeout(first.url ?? first.image_url ?? '', {}, 60_000)
    if (!imageResponse.ok) throw new Error('Generated image download failed')
    bytes = Buffer.from(await imageResponse.arrayBuffer())
  }
  if (!bytes) throw new Error('Image endpoint returned no image data')

  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, bytes)
  return { src: outUrl, cached: false }
}

function runProcess(command: string, args: string[], timeoutMs: number) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stderr = ''
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error('Dynamic TTS timed out'))
    }, timeoutMs)

    child.stdout.on('data', () => undefined)
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('exit', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else reject(new Error(stderr || `Process exited with ${code}`))
    })
  })
}

async function generateTheaterVoice(input: { cityId: string; nodeId: string; text: string }) {
  const cacheKey = createHash({ type: 'voice', theaterCacheVersion, input })
  const outPath = path.join(generatedRoot, 'voice', input.cityId, input.nodeId, `${cacheKey}.mp3`)
  const outUrl = `${generatedUrlRoot}/voice/${input.cityId}/${input.nodeId}/${cacheKey}.mp3`
  try {
    await fs.access(outPath)
    return { src: outUrl, cached: true }
  } catch {
    // Synthesize below.
  }

  if (process.env.VOXCPM_DYNAMIC_TTS !== '1') throw new Error('Dynamic TTS is disabled')
  const modelPath = process.env.VOXCPM_MODEL_PATH
  if (!modelPath) throw new Error('VOXCPM_MODEL_PATH is not configured')

  await fs.mkdir(path.dirname(outPath), { recursive: true })
  const python = process.env.VOXCPM_PYTHON
    ?? '/Users/baihe/Documents/bohack/tts-lab/voxcpm2-runtime/.venv/bin/python'
  const script = path.resolve(process.cwd(), 'scripts/synthesize_theater_line.py')
  await runProcess(python, [
    script,
    '--model', modelPath,
    '--city', input.cityId,
    '--node', input.nodeId,
    '--text', input.text,
    '--out', outPath,
    '--line-id', cacheKey,
  ], Number(process.env.VOXCPM_TIMEOUT_MS ?? 240_000))
  return { src: outUrl, cached: false }
}

function theaterAiPlugin(): Plugin {
  return {
    name: 'local-theater-ai',
    configureServer(server) {
      server.middlewares.use('/api/theater/turn', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: 'Method not allowed' })
          return
        }
        let input: TheaterTurnRequest | null = null
        try {
          input = await readBody<TheaterTurnRequest>(req)
          const turn = await generateTheaterTurn(input)
          sendJson(res, 200, { ok: true, turn })
        } catch (error) {
          sendJson(res, 200, {
            ok: false,
            turn: input ? createFallbackTurn(input) : null,
            error: error instanceof Error ? error.message : 'Theater generation failed',
          })
        }
      })

      server.middlewares.use('/api/theater/image', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: 'Method not allowed' })
          return
        }
        try {
          const input = await readBody<{ prompt: string }>(req)
          const image = await generateTheaterImage(input.prompt)
          sendJson(res, 200, { ok: true, image })
        } catch (error) {
          sendJson(res, 200, {
            ok: false,
            error: error instanceof Error ? error.message : 'Image generation failed',
          })
        }
      })

      server.middlewares.use('/api/theater/voice', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: 'Method not allowed' })
          return
        }
        try {
          const input = await readBody<{ cityId: string; nodeId: string; text: string }>(req)
          const voice = await generateTheaterVoice(input)
          sendJson(res, 200, { ok: true, voice })
        } catch (error) {
          sendJson(res, 200, {
            ok: false,
            error: error instanceof Error ? error.message : 'Voice generation failed',
          })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), theaterAiPlugin()],
})
