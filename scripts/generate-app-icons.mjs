import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const root = process.cwd()
const sourceIcon = path.join(root, 'assets/app-icon/colorbook-app-icon-1024.png')
const publicIcon = path.join(root, 'public/assets/app-icon/colorbook-app-icon-1024.png')
const buildDir = path.join(root, 'build')
const iconsetDir = path.join(buildDir, 'icon.iconset')
const icoDir = path.join(buildDir, 'ico-sizes')

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

async function resizePng(input, output, size, options = {}) {
  await sharp(input)
    .resize(size, size, {
      fit: options.fit ?? 'cover',
      background: options.background ?? { r: 18, g: 23, b: 21, alpha: 1 },
    })
    .png()
    .toFile(output)
}

ensureDir(path.dirname(publicIcon))
ensureDir(buildDir)

const normalizedIcon = await sharp(sourceIcon)
  .trim({ background: '#000000', threshold: 18 })
  .resize(1024, 1024, {
    fit: 'contain',
    background: { r: 18, g: 23, b: 21, alpha: 1 },
  })
  .png()
  .toBuffer()

writeFileSync(publicIcon, normalizedIcon)
writeFileSync(path.join(buildDir, 'icon.png'), normalizedIcon)

rmSync(iconsetDir, { recursive: true, force: true })
ensureDir(iconsetDir)

const icnsSizes = [
  [16, 'icon_16x16.png'],
  [32, 'icon_16x16@2x.png'],
  [32, 'icon_32x32.png'],
  [64, 'icon_32x32@2x.png'],
  [128, 'icon_128x128.png'],
  [256, 'icon_128x128@2x.png'],
  [256, 'icon_256x256.png'],
  [512, 'icon_256x256@2x.png'],
  [512, 'icon_512x512.png'],
  [1024, 'icon_512x512@2x.png'],
]

for (const [size, filename] of icnsSizes) {
  await resizePng(Buffer.from(normalizedIcon), path.join(iconsetDir, filename), size)
}

execFileSync('iconutil', ['-c', 'icns', iconsetDir, '-o', path.join(buildDir, 'icon.icns')])

rmSync(icoDir, { recursive: true, force: true })
ensureDir(icoDir)

const icoPngs = []
for (const size of [16, 24, 32, 48, 64, 128, 256]) {
  const output = path.join(icoDir, `icon-${size}.png`)
  await resizePng(Buffer.from(normalizedIcon), output, size)
  icoPngs.push(output)
}

const ico = await pngToIco(icoPngs)
writeFileSync(path.join(buildDir, 'icon.ico'), ico)

const androidSizes = [
  ['mipmap-mdpi', 48, 108],
  ['mipmap-hdpi', 72, 162],
  ['mipmap-xhdpi', 96, 216],
  ['mipmap-xxhdpi', 144, 324],
  ['mipmap-xxxhdpi', 192, 432],
]

for (const [folder, iconSize, foregroundSize] of androidSizes) {
  const dir = path.join(root, `android/app/src/main/res/${folder}`)
  ensureDir(dir)
  await resizePng(Buffer.from(normalizedIcon), path.join(dir, 'ic_launcher.png'), iconSize)
  await resizePng(Buffer.from(normalizedIcon), path.join(dir, 'ic_launcher_round.png'), iconSize)
  await resizePng(Buffer.from(normalizedIcon), path.join(dir, 'ic_launcher_foreground.png'), foregroundSize, {
    fit: 'contain',
    background: { r: 18, g: 23, b: 21, alpha: 1 },
  })
}

await resizePng(
  Buffer.from(normalizedIcon),
  path.join(root, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'),
  1024,
)
