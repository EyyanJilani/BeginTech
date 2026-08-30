import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealLines } from '../../animations/presets'
import { ButtonLink } from '../ui/Button'
import { LazyScene } from '../three/LazyScene'
import { Marquee } from '../ui/Marquee'
import { capabilitiesSummary } from '../../data/site'
import { prefersReducedMotion } from '../../lib/utils'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const reduce = prefersReducedMotion()
      const q = gsap.utils.selector(el)

      if (reduce) {
        gsap.set(q('[data-hero]'), { opacity: 1, y: 0, clearProps: 'all' })
        return
      }

      // The headline drives the sequence; everything else is timed against it.
      const heading = el.querySelector('[data-hero-title]')
      if (heading) revealLines(heading, { delay: 0.45, stagger: 0.11, duration: 1.35, scroll: false })

      const tl = gsap.timeline({ defaults: { ease: 'bt' } })

      tl.fromTo('[data-hero-grid]', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0)
        .fromTo('[data-hero-eyebrow]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.3)
        .fromTo('[data-hero-lede]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1.05)
        .fromTo(
          '[data-hero-cta] > *',
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 },
          1.2,
        )
        .fromTo('[data-hero-scene]', { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.8 }, 0.5)
        .fromTo(
          '[data-hero-meta]',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          1.35,
        )
        .fromTo('[data-hero-rail]', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.5)

      // Parallax the copy out as the hero leaves.
      gsap.to('[data-hero-copy]', {
        yPercent: -16,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Ambient structure */}
      <div
        data-hero-grid
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-[0.55] mask-fade-b"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-18%] h-[70vh] w-[110vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-accent-glow),transparent_62%)] blur-3xl"
      />

      {/* WebGL stage sits behind the type on mobile, beside it on desktop */}
      <div
        data-hero-scene
        className="pointer-events-none absolute inset-0 lg:left-auto lg:right-[-6%] lg:w-[62%]"
      >
        <div className="h-full w-full opacity-35 md:opacity-50 lg:opacity-100">
          <LazyScene variant="hero" />
        </div>
      </div>

      <div className="hero-copy shell relative z-10 flex min-h-0 flex-1 flex-col justify-center pt-28">
        <div data-hero-copy className="w-full">
          <p data-hero data-hero-eyebrow className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Digital product &amp; technology studio
          </p>

          <h1 id="hero-title" data-hero data-hero-title className="display-xl text-bone [text-wrap:normal]" style={{ opacity: 0 }}>
            Building
            <br />
            the digital
            <br />
            <span className="text-mute-dim">future,</span>{' '}
            <span className="accent-serif text-bone">deliberately.</span>
          </h1>

          <p data-hero data-hero-lede className="lede mt-6 max-w-md">
            We are BeginTech — a senior team of strategists, designers and engineers building web
            platforms, mobile apps and applied AI for companies that intend to last.
          </p>

          <div data-hero data-hero-cta className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink to="/contact">Start a Project</ButtonLink>
            <ButtonLink to="/work" variant="outline" arrow={false}>
              Explore Our Work
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Base rail */}
      <div className="relative z-10 shrink-0">
        <div className="shell">
          <div className="flex flex-col gap-4 border-t border-line py-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <div data-hero data-hero-meta>
                <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim">
                  Operating since
                </p>
                <p className="mt-1 font-display text-lg tracking-tight text-bone">2016</p>
              </div>
              <div data-hero data-hero-meta>
                <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim">
                  Products shipped
                </p>
                <p className="mt-1 font-display text-lg tracking-tight text-bone">120+</p>
              </div>
              <div data-hero data-hero-meta className="hidden sm:block">
                <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim">Studios</p>
                <p className="mt-1 font-display text-lg tracking-tight text-bone">
                  Lisbon · London · Singapore
                </p>
              </div>
            </div>

            <div data-hero data-hero-meta className="flex items-center gap-3 text-xs text-mute-dim">
              <span className="hidden h-px w-10 bg-line-strong md:block" />
              <span className="uppercase tracking-[0.2em]">Scroll</span>
              <span aria-hidden="true" className="block h-8 w-px overflow-hidden bg-line">
                <span className="block h-3 w-px animate-[bt-scroll-hint_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-accent" />
              </span>
            </div>
          </div>
        </div>

        <div data-hero-rail className="hero-marquee border-t border-line py-3">
          <Marquee speed={38}>
            {capabilitiesSummary.concat(capabilitiesSummary).map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="flex items-center gap-6 pr-6 text-xs uppercase tracking-[0.22em] text-mute-dim"
              >
                {c}
                <span className="text-accent/50">/</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
