export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

/** Rough device tier used to scale down WebGL work on weak hardware. */
export function deviceTier(): 'low' | 'mid' | 'high' {
  if (typeof window === 'undefined') return 'mid'
  const cores = navigator.hardwareConcurrency ?? 4
  const narrow = window.innerWidth < 768
  if (narrow || cores <= 4) return 'low'
  if (cores <= 8) return 'mid'
  return 'high'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}
