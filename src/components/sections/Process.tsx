import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { SectionHeading } from '../ui/SectionHeading'
import { process } from '../../data/site'
import { cn } from '../../lib/utils'

/**
 * Scroll-linked process stepper. A sticky panel tracks the active phase while
 * the steps scroll past; the progress rail is scrubbed against the whole list.
 */
export function Process() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]')

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })

      gsap.fromTo(
        '[data-rail-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-steps]',
            start: 'top 62%',
            end: 'bottom 68%',
            scrub: 0.4,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const current = process[active]

  return (
    <section ref={root} className="relative border-t border-line py-24 md:py-32" aria-labelledby="process-heading">
      <div className="shell">
        <SectionHeading
          index="/ 03"
          eyebrow="How we work"
          title={<span id="process-heading">A process you can audit</span>}
          description="Six phases, each with a defined output and a decision point. You always know what is happening, what it costs, and what happens next."
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Sticky status panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="relative overflow-hidden rounded-xl border border-line bg-surface/60 p-8 lg:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,var(--color-accent-glow),transparent_65%)] blur-2xl"
                />

                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-tighter tabular-nums text-bone">
                    {current.index}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-accent">
                    {current.duration}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl tracking-tight text-bone md:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-mute">{current.body}</p>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {current.outputs.map((o) => (
                    <li
                      key={o}
                      className="rounded-full border border-line px-3 py-1 text-[0.6875rem] text-mute"
                    >
                      {o}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex gap-1.5" role="presentation">
                  {process.map((p, i) => (
                    <span
                      key={p.index}
                      className={cn(
                        'h-0.5 flex-1 rounded-full transition-colors duration-500',
                        i <= active ? 'bg-accent' : 'bg-line',
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol data-steps className="relative lg:col-span-7">
            <div aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line md:left-1">
              <div data-rail-fill className="h-full w-px origin-top bg-accent" />
            </div>

            {process.map((step, i) => (
              <li
                key={step.index}
                data-step
                className="relative pb-14 pl-8 last:pb-0 md:pl-14"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-0 top-2 -ml-[3.5px] block h-2 w-2 rounded-full transition-all duration-500 md:left-1',
                    i <= active ? 'scale-125 bg-accent' : 'bg-mute-dim',
                  )}
                />
                <div
                  className={cn(
                    'transition-colors duration-500',
                    i === active ? 'text-bone' : 'text-mute-dim',
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-xs tabular-nums text-accent">{step.index}</span>
                    <h4 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight">
                      {step.title}
                    </h4>
                  </div>
                  <p
                    className={cn(
                      'mt-3 max-w-lg text-sm leading-relaxed transition-colors duration-500',
                      i === active ? 'text-mute' : 'text-mute-dim/70',
                    )}
                  >
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
