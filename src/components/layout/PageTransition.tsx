import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../hooks/useSmoothScroll'
import { prefersReducedMotion } from '../../lib/utils'

type Props = { children: (location: Location) => ReactNode }

/**
 * Curtain route transition.
 *
 * The outgoing page stays mounted until the curtain covers the viewport, so
 * there is never a flash of an empty document. Scroll position and every
 * ScrollTrigger are reset while hidden, then the curtain lifts.
 */
export function PageTransition({ children }: Props) {
  const location = useLocation()
  const [shown, setShown] = useState(location)
  const curtain = useRef<HTMLDivElement>(null)
  const animating = useRef(false)

  useEffect(() => {
    if (location.pathname === shown.pathname && location.search === shown.search) return

    const el = curtain.current

    const swap = () => {
      getLenis()?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
      setShown(location)
    }

    if (!el || prefersReducedMotion()) {
      swap()
      return
    }

    animating.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false
        ScrollTrigger.refresh()
      },
    })

    tl.set(el, { pointerEvents: 'auto', transformOrigin: 'bottom' })
      .fromTo(
        el,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.42, ease: 'bt-inout' },
      )
      .add(() => {
        swap()
        ScrollTrigger.refresh()
      })
      .set(el, { transformOrigin: 'top' })
      .to(el, { scaleY: 0, duration: 0.55, ease: 'bt-inout' }, '+=0.06')
      .set(el, { pointerEvents: 'none' })

    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <>
      {children(shown)}
      {/*
        The collapsed state is an inline transform, deliberately NOT Tailwind's
        `scale-y-0`: in v4 that compiles to the CSS `scale` property, which
        composes *on top of* the `transform` GSAP animates. The two multiply and
        the curtain can never become visible.
      */}
      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[150] bg-ink"
        style={{ transform: 'scaleY(0)', transformOrigin: 'bottom' }}
      >
        <div className="grid-lines absolute inset-0 opacity-30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>
    </>
  )
}
