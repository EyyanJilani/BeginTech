import { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { gsap } from '../../lib/gsap'
import { isTouchDevice, prefersReducedMotion } from '../../lib/utils'

type Props = {
  children: ReactElement
  strength?: number
  radius?: number
  className?: string
}

/**
 * Wraps a single child in a magnetic hover field. The wrapper translates,
 * the child counter-translates slightly, which reads as depth rather than drift.
 */
export function Magnetic({ children, strength = 0.35, radius = 90, className }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || isTouchDevice() || prefersReducedMotion()) return

    const inner = el.firstElementChild as HTMLElement | null
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'bt' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'bt' })
    const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'bt' }) : null
    const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'bt' }) : null

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const falloff = Math.max(0, 1 - dist / (Math.max(r.width, r.height) / 2 + radius))
      xTo(dx * strength * falloff)
      yTo(dy * strength * falloff)
      ixTo?.(dx * strength * 0.35 * falloff)
      iyTo?.(dy * strength * 0.35 * falloff)
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
      ixTo?.(0)
      iyTo?.(0)
    }

    const zone = el.parentElement ?? el
    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerleave', onLeave)
    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', onLeave)
    }
  }, [strength, radius])

  return (
    <span ref={wrapRef} className={className ?? 'inline-block will-change-transform'}>
      {children}
    </span>
  )
}
