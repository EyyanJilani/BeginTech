import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { isTouchDevice, prefersReducedMotion } from '../../lib/utils'

/**
 * Two-part cursor: a hard dot that tracks 1:1 and a soft ring that lags behind.
 * Interactive elements opt in via [data-cursor="..."]; everything with a
 * pointer role gets the expanded state automatically.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    // Read live so the ring follows a theme switch without remounting.
    const ringColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--bt-cursor-ring').trim() ||
      'rgba(255,255,255,0.35)'
    gsap.set(ring, { borderColor: ringColor() })

    document.documentElement.dataset.cursor = 'custom'

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

    let visible = false

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 })
    }

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor]'

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null
      if (!target) return
      const mode = target.dataset.cursor ?? 'hover'
      const text = target.dataset.cursorLabel ?? ''

      label.textContent = text
      gsap.to(ring, {
        scale: text ? 3.1 : mode === 'drag' ? 2.4 : 1.9,
        borderColor: 'rgba(124,140,255,0.9)',
        backgroundColor: text ? 'rgba(124,140,255,0.14)' : 'rgba(124,140,255,0.06)',
        duration: 0.45,
        ease: 'bt',
      })
      gsap.to(dot, { scale: text ? 0 : 0.45, duration: 0.4, ease: 'bt' })
      gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.3 })
    }

    const onOut = (e: PointerEvent) => {
      const from = (e.target as Element | null)?.closest?.(INTERACTIVE)
      if (!from) return
      const to = (e.relatedTarget as Element | null)?.closest?.(INTERACTIVE)
      if (to) return
      gsap.to(ring, {
        scale: 1,
        borderColor: ringColor(),
        backgroundColor: 'transparent',
        duration: 0.45,
        ease: 'bt',
      })
      gsap.to(dot, { scale: 1, duration: 0.4, ease: 'bt' })
      gsap.to(label, { autoAlpha: 0, duration: 0.2 })
    }

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      delete document.documentElement.dataset.cursor
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute -left-5 -top-5 h-10 w-10 rounded-full border opacity-0 will-change-transform"
      >
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center text-[3.2px] font-medium uppercase tracking-[0.18em] text-bone opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-bone opacity-0 will-change-transform"
      />
    </div>
  )
}
