import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { SectionHeading } from '../ui/SectionHeading'
import { technologies, techGroups } from '../../data/site'
import { cn, prefersReducedMotion } from '../../lib/utils'

/**
 * Technology ecosystem as floating typography rather than a logo grid.
 * Names drift on a slow scroll-linked parallax and dim when a filter is active,
 * which reads as an ecosystem instead of a badge wall.
 */
export function TechEcosystem() {
  const root = useRef<HTMLElement>(null)
  const [focus, setFocus] = useState<string | null>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-tech]')

      // Entry animates opacity/blur only — y and x belong to the drift below,
      // and two tweens fighting over the same transform reads as jitter.
      gsap.fromTo(
        items,
        { opacity: 0, filter: 'blur(8px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: { each: 0.02, from: 'random' },
          ease: 'bt',
          clearProps: 'filter',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      )

      // Alternating drift keeps the cloud alive without a permanently running ticker.
      items.forEach((item, i) => {
        gsap.to(item, {
          y: i % 2 === 0 ? -34 : 26,
          x: i % 3 === 0 ? 14 : -10,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden border-t border-line py-24 md:py-32" aria-labelledby="tech-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,var(--color-accent-glow),transparent_65%)] opacity-60 blur-3xl"
      />

      <div className="shell relative">
        <SectionHeading
          index="/ 04"
          eyebrow="Technology"
          title={<span id="tech-heading">The stack behind the work</span>}
          description="We are not religious about tools. We are deliberate about them — chosen for the problem, the team who will maintain it, and the decade it has to survive."
        />

        <div className="mt-14 flex flex-wrap gap-2" role="group" aria-label="Filter technologies">
          <button
            type="button"
            onClick={() => setFocus(null)}
            aria-pressed={focus === null}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs transition-colors duration-400',
              focus === null
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line text-mute hover:text-bone',
            )}
          >
            Everything
          </button>
          {techGroups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFocus(focus === g ? null : g)}
              aria-pressed={focus === g}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs transition-colors duration-400',
                focus === g
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-mute hover:text-bone',
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <ul className="mt-16 flex flex-wrap items-baseline justify-center gap-x-8 gap-y-6 md:mt-24 md:gap-x-14 md:gap-y-10">
          {technologies.map((tech, i) => {
            const dim = focus !== null && tech.group !== focus
            return (
              <li
                key={tech.name}
                data-tech
                className={cn(
                  'font-display tracking-tight transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  i % 5 === 0
                    ? 'text-[clamp(1.75rem,5vw,4rem)]'
                    : i % 3 === 0
                      ? 'text-[clamp(1.35rem,3.4vw,2.75rem)]'
                      : 'text-[clamp(1.05rem,2.4vw,1.9rem)]',
                  dim ? 'text-mute-dim/25 blur-[1.5px]' : 'text-bone/85 hover:text-accent',
                )}
              >
                {tech.name}
              </li>
            )
          })}
        </ul>

        <p className="mt-20 text-center text-xs uppercase tracking-[0.22em] text-mute-dim">
          + whatever your existing platform already runs on
        </p>
      </div>
    </section>
  )
}
