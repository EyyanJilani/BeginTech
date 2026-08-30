import { useEffect } from 'react'
import { getLenis } from './useSmoothScroll'

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const lenis = getLenis()
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth

    lenis?.stop()
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`

    return () => {
      lenis?.start()
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [locked])
}
