import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/utils'

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

/**
 * Premium inertia scrolling, wired into GSAP's ticker so ScrollTrigger and
 * Lenis share a single RAF loop (no double-render, no scroll jitter).
 * Disabled entirely when the user asks for reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      lerp: 0.1,
      autoRaf: false,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
