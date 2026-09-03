/**
 * BeginTech palette, sampled from the master logo artwork
 * (src/assets/img/logo.png) rather than eyeballed from the guideline PDF.
 *
 * Yellow and red appear only as guideline swatches — they are not present in
 * the logo, so those two are read from the guideline sheet.
 *
 * The CSS custom properties in index.css are the source of truth for anything
 * the browser paints. These constants exist for the places that need real hex
 * strings: WebGL materials and the generated SVG project artwork.
 */
export const brand = {
  blue: '#134e90',
  magenta: '#ad215e',
  green: '#409846',
  purple: '#461751',
  yellow: '#f2cb1d',
  red: '#e63329',
} as const

/**
 * Dark-theme tints. The primaries are mid-dark by design and sit near 2.2:1 on
 * the dark ground, so anything drawn over it uses these lifted variants.
 */
export const brandOnDark = {
  blue: '#5b93d6',
  magenta: '#e8629b',
  green: '#6cc274',
  purple: '#9a6bb0',
  yellow: '#f5d84f',
  red: '#f0645b',
} as const
