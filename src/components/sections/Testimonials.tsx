import { useState } from 'react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { testimonials } from '../../data/site'
import { cn } from '../../lib/utils'

/**
 * Manually advanced, never auto-rotating. A quote that moves while someone is
 * reading it is an anti-feature; the controls stay visible instead.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0)
  const active = testimonials[index]

  return (
    <section className="relative border-t border-line py-24 md:py-32" aria-labelledby="clients-heading">
      <div className="shell">
        <SectionHeading
          index="/ 05"
          eyebrow="Clients"
          title={<span id="clients-heading">What partners say</span>}
          description="We work with a small number of clients at a time. These are the people who have lived through an engagement with us."
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-8">
            <figure>
              <blockquote>
                <p
                  key={active.name}
                  className="font-display text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.18] tracking-tight text-bone"
                  style={{ animation: 'bt-quote-in 0.7s cubic-bezier(0.16,1,0.3,1) both' }}
                >
                  <span aria-hidden="true" className="accent-em mr-1 text-accent">
                    “
                  </span>
                  {active.quote}
                </p>
              </blockquote>

              <figcaption className="mt-10 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-sm tracking-wide text-accent"
                >
                  {active.initials}
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-bone">{active.name}</span>
                  <span className="block text-mute">
                    {active.role}, {active.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="lg:col-span-4" delay={0.1}>
            <ul className="flex flex-col gap-px border-y border-line bg-line lg:border">
              {testimonials.map((t, i) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={i === index}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 bg-ink px-5 py-4 text-left transition-colors duration-500',
                      i === index ? 'text-bone' : 'text-mute-dim hover:text-mute',
                    )}
                  >
                    <span className="text-sm">
                      <span className="block font-medium">{t.company}</span>
                      <span className="block text-xs text-mute-dim">{t.role}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-px shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        i === index ? 'w-10 bg-accent' : 'w-4 bg-line-strong',
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-mute-dim">
              Select a client to read their account of the work.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
