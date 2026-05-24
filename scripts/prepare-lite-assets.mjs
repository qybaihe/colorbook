import { readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = process.argv.includes('--root')
  ? process.argv[process.argv.indexOf('--root') + 1]
  : 'public'

const publicRoot = path.resolve(process.cwd(), root)
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp'])

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(filePath))
    } else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(filePath)
    }
  }
  return files
}

function getProfile(filePath) {
  const normalized = filePath.split(path.sep).join('/')

  if (normalized.includes('/deck/')) return { maxWidth: 640, pngQuality: 70, colors: 160 }
  if (normalized.includes('/tile-scenes-24/')) return { maxWidth: 1280, pngQuality: 68, colors: 192 }
  if (normalized.includes('/tile-buttons/')) return { maxWidth: 360, pngQuality: 72, colors: 160 }
  if (normalized.includes('/tile-button-sheets/')) return { maxWidth: 960, pngQuality: 70, colors: 160 }
  if (normalized.includes('/role-cards/')) return { maxWidth: 720, pngQuality: 70, colors: 176 }
  if (normalized.includes('/city-select/')) return { maxWidth: 1440, pngQuality: 72, colors: 192 }
  if (normalized.includes('/app-icon/')) return { maxWidth: 512, pngQuality: 78, colors: 192 }
  if (normalized.includes('/backgrounds/')) return { maxWidth: 1280, pngQuality: 70, colors: 192 }
  if (normalized.includes('/sprites/')) return { maxWidth: 1024, pngQuality: 72, colors: 176 }
  if (normalized.includes('/ui/')) return { maxWidth: 1024, pngQuality: 76, colors: 192 }

  return { maxWidth: 1280, pngQuality: 72, colors: 192 }
}

async function optimizeImage(filePath) {
  const before = statSync(filePath).size
  const ext = path.extname(filePath).toLowerCase()
  const profile = getProfile(filePath)
  const image = sharp(filePath, { animated: false })
  const metadata = await image.metadata()
  const width = metadata.width ?? profile.maxWidth
  const resizeWidth = width > profile.maxWidth ? profile.maxWidth : width

  let pipeline = image.rotate()

  if (resizeWidth !== width) {
    pipeline = pipeline.resize({ width: resizeWidth, withoutEnlargement: true })
  }

  let output
  if (ext === '.webp') {
    output = await pipeline.webp({ quality: 68, effort: 6 }).toBuffer()
  } else if (ext === '.jpg' || ext === '.jpeg') {
    output = await pipeline.jpeg({ quality: 70, mozjpeg: true }).toBuffer()
  } else {
    output = await pipeline
      .png({
        palette: true,
        quality: profile.pngQuality,
        colors: profile.colors,
        compressionLevel: 9,
        effort: 10,
        adaptiveFiltering: true,
      })
      .toBuffer()
  }

  if (output.length < before) {
    writeFileSync(filePath, output)
  }

  return {
    filePath,
    before,
    after: Math.min(before, output.length),
  }
}

const files = walk(publicRoot)
let beforeTotal = 0
let afterTotal = 0
let optimized = 0

for (const file of files) {
  const result = await optimizeImage(file)
  beforeTotal += result.before
  afterTotal += result.after
  if (result.after < result.before) optimized += 1
}

const saved = beforeTotal - afterTotal
const percent = beforeTotal > 0 ? ((saved / beforeTotal) * 100).toFixed(1) : '0.0'

console.log(`Lite assets: optimized ${optimized}/${files.length} images`)
console.log(`Lite assets: ${(beforeTotal / 1024 / 1024).toFixed(1)} MB -> ${(afterTotal / 1024 / 1024).toFixed(1)} MB, saved ${(saved / 1024 / 1024).toFixed(1)} MB (${percent}%)`)
