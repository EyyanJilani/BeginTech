import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealLines } from '../../animations/presets'
import { ButtonLink } from '../ui/Button'
import { prefersReducedMotion } from '../../lib/utils'
import heroVideo from '../../assets/video/home.mp4'
import heroPoster from '../../assets/img/hero-video-poster.jpg'

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

      tl.fromTo('[data-hero-scrim]', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0)
        .fromTo('[data-hero-eyebrow]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.3)
        .fromTo('[data-hero-lede]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1.05)
        .fromTo(
          '[data-hero-cta] > *',
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 },
          1.2,
        )
        .fromTo(
          '[data-hero-meta]',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          1.35,
        )

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
      {/* Full-bleed looping footage behind the copy. Muted, autoplaying and
          decorative, so it stays out of the accessibility tree. */}
      <video
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* A fixed dark scrim, independent of the light/dark token — video
          footage doesn't invert with the theme, so the overlay and hero type
          stay constant white-on-dark regardless of which theme is active. */}
      <div
        data-hero-scrim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05070c]/75 via-[#05070c]/55 to-[#05070c]/85"
      />

      <div className="hero-copy shell relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center pt-28 text-center">
        <div data-hero-copy className="flex w-full flex-col items-center">
          <p
            data-hero
            data-hero-eyebrow
            className="mb-5 flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/70"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Website design &amp; social media marketing agency — Karachi, Pakistan
          </p>

          {/* No inline opacity:0 here — the line-mask reveal in revealLines()
              hides its own split lines, so the heading never depends on JS
              running successfully just to become visible in the first place. */}
          <h1
            id="hero-title"
            data-hero
            data-hero-title
            className="display-xl text-white [text-wrap:normal]"
          >
            Websites and
            <br />
            digital products,
            <br />
            <span className="accent-em">built properly.</span>
          </h1>

          <p data-hero data-hero-lede className="lede mt-6 max-w-md text-white/75">
            BeginTech is a small studio in Karachi. We design and build websites, online stores
            and product interfaces for businesses that care how their work looks and runs.
          </p>

          <div data-hero data-hero-cta className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="/contact">Start a Project</ButtonLink>
            <ButtonLink to="/work" variant="outline" arrow={false} className="border-white/30 text-white">
              Explore Our Work
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Base rail — the hero closes on real facts, not a scrolling buzzword ticker. */}
      <div className="relative z-10 shrink-0 border-t border-white/15">
        <div className="shell">
          <div className="flex flex-col items-center gap-4 py-5 sm:flex-row sm:justify-center sm:gap-10 md:gap-14">
            <div data-hero data-hero-meta className="text-center sm:text-left">
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-white/50">
                Operating since
              </p>
              <p className="mt-1 font-display text-lg tracking-tight text-white">2016</p>
            </div>
            <div data-hero data-hero-meta className="text-center sm:text-left">
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-white/50">
                Live projects
              </p>
              <p className="mt-1 font-display text-lg tracking-tight text-white">8</p>
            </div>
            <div data-hero data-hero-meta className="hidden text-left sm:block">
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-white/50">Studio</p>
              <p className="mt-1 font-display text-lg tracking-tight text-white">
                Karachi, Pakistan
              </p>
            </div>
            <div data-hero data-hero-meta className="flex items-center gap-3 text-xs text-white/50">
              <span className="hidden h-px w-10 bg-white/20 md:block" />
              <span className="uppercase tracking-[0.2em]">Scroll</span>
              <span aria-hidden="true" className="block h-8 w-px overflow-hidden bg-white/15">
                <span className="block h-3 w-px animate-[bt-scroll-hint_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-accent" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
