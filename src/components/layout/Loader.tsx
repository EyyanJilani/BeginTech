import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { LogoMark } from '../ui/Logo'
import { markIntroSeen } from './intro'

/**
 * Opening curtain. It tracks real readiness (fonts + window load) rather than
 * running a fixed timer, caps itself at 2.2s, and never appears twice in a
 * session — a loader that delays a cached page is just a cost.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const counter = { v: 0 }
    let finished = false
    let completed = false
    let ceiling = 0
    let bail = 0

    const complete = () => {
      if (completed) return
      completed = true
      markIntroSeen()
      onDone()
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-intro-item]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'bt' },
      )

      // Creep toward 90 while we wait, then snap to 100 once genuinely ready.
      const creep = gsap.to(counter, {
        v: 90,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => setPct(Math.round(counter.v)),
      })

      const finish = () => {
        if (finished) return
        finished = true
        creep.kill()

        gsap
          .timeline({
            defaults: { ease: 'bt' },
            onComplete: complete,
          })
          .to(counter, {
            v: 100,
            duration: 0.55,
            ease: 'power2.inOut',
            onUpdate: () => setPct(Math.round(counter.v)),
          })
          .to('[data-intro-item]', { y: -18, opacity: 0, duration: 0.5, stagger: 0.05 }, '+=0.12')
          .to('[data-intro-bar]', { scaleX: 1, duration: 0.5 }, '<')
          .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'bt-inout' }, '-=0.2')
      }

      const ready = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise<void>((res) => window.addEventListener('load', () => res(), { once: true })),
      ])

      ready.then(finish)
      // Hard ceiling on a real timer, not the GSAP ticker: if the tab is
      // backgrounded mid-load the ticker stops and the curtain would never lift.
      ceiling = window.setTimeout(finish, 2200)
      // Last-resort escape hatch: if the exit timeline itself never runs
      // (no animation frames at all), reveal the site anyway.
      bail = window.setTimeout(complete, 5000)
    }, el)

    return () => {
      window.clearTimeout(ceiling)
      window.clearTimeout(bail)
      ctx.revert()
    }
  }, [onDone])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-6 py-8 md:px-12 md:py-12"
      role="status"
      aria-live="polite"
      aria-label="Loading BeginTech"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />

      <div data-intro-item className="relative flex items-center gap-3 text-bone">
        <LogoMark className="h-8 w-8" />
        <span className="font-display text-sm font-semibold tracking-[0.2em]">BEGINTECH</span>
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <p data-intro-item className="max-w-xs text-xs leading-relaxed text-mute-dim md:text-sm">
          Digital product &amp; technology studio.
          <br />
          Lisbon · London · Singapore
        </p>
        <span
          data-intro-item
          className="font-display text-[clamp(3.5rem,16vw,11rem)] leading-[0.8] tracking-tighter tabular-nums text-bone"
        >
          {pct.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="relative mt-8 h-px w-full bg-line">
        <div
          data-intro-bar
          className="h-px origin-left bg-accent transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
    </div>
  )
}
