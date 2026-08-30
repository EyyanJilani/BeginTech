import type { CSSProperties } from 'react'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/*
  Grain has to darken on paper and lift on ink, so both the blend mode and the
  strength are driven by theme variables rather than fixed here. The casts
  exist only because CSSProperties types these as literal unions, not `var()`.
*/
const style = {
  backgroundImage: GRAIN,
  mixBlendMode: 'var(--bt-grain-blend)',
  opacity: 'var(--bt-grain-opacity)',
} as unknown as CSSProperties

/** Film-grain overlay. SVG turbulence keeps it asset-free and crisp at any DPR. */
export function Noise() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]" style={style} />
}
