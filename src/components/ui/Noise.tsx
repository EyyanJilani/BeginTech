import type { CSSProperties } from 'react'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/*
  No mix-blend-mode here on purpose. A full-screen fixed layer with a blend
  mode forces the whole page through an extra compositing pass on every scroll
  frame, and at 2% opacity the visual difference does not pay for it.
*/
const style = {
  backgroundImage: GRAIN,
  opacity: 'var(--bt-grain-opacity)',
} as unknown as CSSProperties

/** Film-grain overlay. SVG turbulence keeps it asset-free and crisp at any DPR. */
export function Noise() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]" style={style} />
}
