/**
 * Derives optimised portfolio thumbnails from the raw screenshots dropped in
 * src/assets/img/. Sources run 200kB-3.2MB (some are full-page screenshots
 * thousands of pixels tall); this crops each to its top section — the
 * designed hero, which is what a card actually needs to show — and encodes
 * it as a compact progressive JPEG.
 *
 * Run whenever a new screenshot is added: node scripts/build-work-assets.mjs
 */
import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync } from 'node:fs'

const SRC_DIR = 'src/assets/img'
const OUT_DIR = 'src/assets/img/work'
const TARGET_WIDTH = 1400

/** slug -> source filename in src/assets/img/ */
const SOURCES = {
  'brooklyn-bites': 'Brooklyn-Bites.png',
  'cake-craft': 'Cake-Craft-USA.png',
  'dip-n-eat': 'Dip-N-Eat-—-Burgers-premium-dips-signature-en-Guadeloupe.png',
  'siyaab-lawn-hub': 'Siyaab-Lawn-Hub.png',
  'solidification-solutions': 'image_original.png',
  'backflow-testing-co': '1image_original.png',
  'insight-electrical': '2image_original.png',
  'signatures-plus': '3image_original.png',
}

mkdirSync(OUT_DIR, { recursive: true })

for (const [slug, file] of Object.entries(SOURCES)) {
  const src = `${SRC_DIR}/${file}`
  const meta = await sharp(src).metadata()

  // Full-page screenshots are far taller than any card needs; the four
  // "_original" files are already pre-composed hero collages near a 2:3
  // portrait, so only the true full-page captures get cropped.
  const cropHeight = Math.min(meta.height, Math.round(meta.width * 1.35))

  const pipeline = sharp(src).extract({
    left: 0,
    top: 0,
    width: meta.width,
    height: cropHeight,
  })

  const out = `${OUT_DIR}/${slug}.jpg`
  await pipeline
    .resize({ width: Math.min(TARGET_WIDTH, meta.width) })
    .flatten({ background: '#ffffff' }) // some sources carry alpha; JPEG has none
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(out)

  const before = statSync(src).size
  const after = statSync(out).size
  console.log(
    `${slug.padEnd(26)} ${meta.width}x${meta.height} -> ${(before / 1024).toFixed(0)}kB => ${(after / 1024).toFixed(0)}kB`,
  )
}

const unused = readdirSync(SRC_DIR).filter(
  (f) => f.endsWith('.png') && !Object.values(SOURCES).includes(f) && !f.startsWith('logo'),
)
if (unused.length) console.log('\nSource files not mapped to a project:', unused)
