// Poor-man's prerendering: boots a local preview server against the real
// `dist/` build, drives a headless Chromium through every known route, and
// writes the fully-rendered DOM back to disk as that route's index.html.
//
// Why: the app is a 100% client-rendered SPA (createRoot, not hydrateRoot),
// so every route's *raw* HTML — the only thing a crawler sees if it doesn't
// execute JavaScript — was the same empty <div id="root"></div> shell, with
// the homepage's canonical/title/meta regardless of which route it was.
// A crawl audit confirmed this in production: 19 of 20 pages showed up as
// orphaned, missing H1, and carrying the wrong canonical. This script makes
// each route's on-disk HTML the real, rendered page instead.
//
// This list mirrors public/sitemap.xml — keep the two in sync when routes
// are added or removed.
import { preview } from 'vite'
import puppeteer from 'puppeteer'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROUTES = [
  '/',
  '/about',
  '/work',
  '/contact',
  '/services/web-development',
  '/services/mobile-development',
  '/services/ui-ux-design',
  '/services/ai-development',
  '/services/software-development',
  '/services/branding',
  '/services/ecommerce',
  '/services/digital-marketing',
  '/work/brooklyn-bites',
  '/work/siyaab-lawn-hub',
  '/work/dip-n-eat',
  '/work/cake-craft',
  '/work/insight-electrical',
  '/work/backflow-testing-co',
  '/work/solidification-solutions',
  '/work/signatures-plus',
]

const OUT_DIR = path.resolve(import.meta.dirname, '..', 'dist')

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: false } })
  const base = server.resolvedUrls.local[0].replace(/\/$/, '')

  const browser = await puppeteer.launch({ headless: true })

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage()
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30_000 })

      // The lazy-loaded route chunks and useEffect-driven title/meta/JSON-LD
      // all settle within a frame or two of network-idle; this just gives
      // React one more tick to flush before we snapshot the DOM.
      await new Promise((resolve) => setTimeout(resolve, 300))

      const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)
      await page.close()

      const outPath =
        route === '/'
          ? path.join(OUT_DIR, 'index.html')
          : path.join(OUT_DIR, route, 'index.html')

      await mkdir(path.dirname(outPath), { recursive: true })
      await writeFile(outPath, html, 'utf8')
      console.log(`prerendered ${route} -> ${path.relative(OUT_DIR, outPath)}`)
    }
  } finally {
    await browser.close()
    await new Promise((resolve, reject) =>
      server.httpServer.close((err) => (err ? reject(err) : resolve())),
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
