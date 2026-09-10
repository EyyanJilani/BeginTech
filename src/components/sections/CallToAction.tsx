import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealLines } from '../../animations/presets'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { ShardField } from '../visual/ShardField'
import { site } from '../../data/site'

export function CallToAction() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const title = el.querySelector('[data-cta-title]')
      if (title) revealLines(title, { stagger: 0.1, duration: 1.3 })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-line"
      aria-labelledby="cta-heading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-45">
          <ShardField density="sparse" rings={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/45 to-ink" />
        <div className="grid-lines absolute inset-0 opacity-30" />
      </div>

      <div className="shell relative py-28 md:py-40">
        <div className="max-w-4xl">
          <Reveal className="mb-9 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="eyebrow">Next step</span>
          </Reveal>

          <h2 id="cta-heading" data-cta-title className="display-lg text-bone">
            Have an idea?
            <br />
            <span className="accent-em">Let&apos;s</span> build it.
          </h2>

          <Reveal className="mt-10 max-w-xl" delay={0.1}>
            <p className="lede">
              Tell us what you are building. We will help turn the idea into a digital product people
              remember — starting with an honest conversation about whether we are the right studio
              for it.
            </p>
          </Reveal>

          <Reveal className="mt-11 flex flex-wrap items-center gap-3" delay={0.15}>
            <ButtonLink to="/contact">Start a Project</ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="outline" arrow={false}>
              {site.email}
            </ButtonLink>
          </Reveal>

          <Reveal className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-line pt-8 text-xs text-mute-dim" delay={0.2}>
            <span>Reply within one business day</span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" />
            <span>NDA on request</span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" />
            <span>{site.availability}</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
