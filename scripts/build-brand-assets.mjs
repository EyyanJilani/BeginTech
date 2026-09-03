/**
 * Derives the web logo + favicon set from the master artwork.
 *
 * The master is 8462x2555 (~350kB) — fine as a source of truth, far too heavy
 * for a 40px navbar. Run this whenever src/assets/img/logo.png changes:
 *   node scripts/build-brand-assets.mjs
 */
import sharp from 'sharp'

const SRC = 'src/assets/img/logo.png'
const IMG = 'src/assets/img'

/** Columns that contain no opaque pixels — used to find the gap before the wordmark. */
async function emptyColumns(buf, from, to) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const gaps = []
  for (let x = from; x < Math.min(to, width); x++) {
    let opaque = 0
    for (let y = 0; y < height; y++) {
      const a = channels === 4 ? data[(y * width + x) * channels + 3] : 255
      if (a > 12) opaque++
    }
    if (opaque === 0) gaps.push(x)
  }
  return { gaps, width, height }
}

// 1. Trim transparent margin off the master so every derived asset is tight.
const trimmed = await sharp(SRC).trim({ threshold: 8 }).png().toBuffer()
const tm = await sharp(trimmed).metadata()
console.log(`trimmed lockup: ${tm.width}x${tm.height} (ratio ${(tm.width / tm.height).toFixed(2)})`)

// 2. Full lockup for the site — 960w covers a 48px render at 3x DPR.
// Flat-colour art quantises extremely well, so a palette PNG beats WebP here.
await sharp(trimmed)
  .resize({ width: 960 })
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(`${IMG}/logo-lockup.png`)

// 3. Isolate the sprinter mark: scan the middle for the blank gutter that
//    separates the figure from the wordmark, and cut there.
const searchFrom = Math.round(tm.width * 0.3)
const searchTo = Math.round(tm.width * 0.48)
const { gaps } = await emptyColumns(trimmed, searchFrom, searchTo)
const cut = gaps.length ? gaps[Math.floor(gaps.length / 2)] : Math.round(tm.width * 0.36)
console.log(`figure/wordmark gutter: ${gaps.length} blank cols in ${searchFrom}-${searchTo}, cutting at ${cut}`)

const markRaw = await sharp(trimmed)
  .extract({ left: 0, top: 0, width: cut, height: tm.height })
  .trim({ threshold: 8 })
  .png()
  .toBuffer()
const mm = await sharp(markRaw).metadata()
console.log(`mark: ${mm.width}x${mm.height}`)

// 4. Square the mark on transparency with a little breathing room.
const side = Math.round(Math.max(mm.width, mm.height) * 1.02)
const squared = await sharp({
  create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: markRaw, gravity: 'center' }])
  .png()
  .toBuffer()

await sharp(squared).resize(512, 512).png({ compressionLevel: 9 }).toFile(`${IMG}/logo-mark.png`)

// 5. Favicons. The mark's own colours are mid-dark, so it needs a light
//    ground — on near-black the navy torso disappears.
//    composite() only accepts buffers/paths, never a Sharp instance.
async function tile(size, out) {
  const inner = await sharp(squared)
    .resize(Math.round(size * 0.94), Math.round(size * 0.94), {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: inner, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(out)
}

await tile(32, 'public/favicon-32.png')
await tile(180, 'public/apple-touch-icon.png')
await tile(512, 'public/favicon-512.png')

// 6. Open Graph card. Light ground to match the default theme.
const ogBg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
     <rect width="1200" height="630" fill="#f6f7f9"/>
     <rect x="0" y="0" width="1200" height="6" fill="#134e90"/>
     <rect x="0" y="624" width="1200" height="6" fill="#ad215e"/>
     <text x="80" y="470" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#134e90">Building the digital future,</text>
     <text x="80" y="524" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="400" fill="#ad215e">deliberately.</text>
     <text x="80" y="576" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#55585f">Digital Product &amp; Technology Studio  ·  Karachi, Pakistan</text>
   </svg>`,
)
await sharp(ogBg)
  .composite([{ input: await sharp(trimmed).resize({ width: 620 }).png().toBuffer(), top: 120, left: 80 }])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png')

console.log('\nwrote:')
for (const f of [
  `${IMG}/logo-lockup.png`,
  `${IMG}/logo-mark.png`,
  'public/favicon-32.png',
  'public/apple-touch-icon.png',
  'public/favicon-512.png',
  'public/og.png',
]) {
  const { size } = await import('node:fs').then((m) => m.promises.stat(f))
  console.log(`  ${f}  ${(size / 1024).toFixed(1)} kB`)
}
