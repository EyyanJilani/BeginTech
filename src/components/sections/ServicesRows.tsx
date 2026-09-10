import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectVisual } from '../ui/ProjectVisual'
import { ButtonLink } from '../ui/Button'
import { services } from '../../data/services'
import type { ArtPattern } from '../../data/projects'
import { brandOnDark } from '../../data/brand'
import { cn } from '../../lib/utils'

/** Each service carries its own artwork so the hover preview feels art-directed. */
const art: Record<string, { pattern: ArtPattern; from: string; to: string; ink: string }> = {
  'web-development': { pattern: 'grid', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
  'mobile-development': { pattern: 'stack', from: '#0f2416', to: '#07120b', ink: brandOnDark.green },
  'ui-ux-design': { pattern: 'arc', from: '#2b1122', to: '#150810', ink: brandOnDark.magenta },
  'ai-development': { pattern: 'orbit', from: '#1d1030', to: '#0d0718', ink: brandOnDark.purple },
  'software-development': { pattern: 'mesh', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
  branding: { pattern: 'waves', from: '#2b1122', to: '#150810', ink: brandOnDark.magenta },
  ecommerce: { pattern: 'arc', from: '#2b2408', to: '#141105', ink: brandOnDark.yellow },
  'digital-marketing': { pattern: 'waves', from: '#0f2416', to: '#07120b', ink: brandOnDark.green },
}

/**
 * Expanding service rows.
 *
 * The preview artwork lives *inside* the row it belongs to rather than
 * following the cursor. A cursor-tracked card either lags behind fast pointer
 * movement or covers the very title being pointed at — both of which read as
 * broken. Anchoring it to the row keeps the reveal deterministic, gives touch
 * users the same content, and lets the row's own expand animation carry it.
 */
export function ServicesRows() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section
      className="force-dark relative border-t border-line bg-ink py-24 md:py-32"
      aria-labelledby="services-heading"
      onPointerLeave={() => setActive(null)}
    >
      <div className="shell">
        <SectionHeading
          eyebrow="What we do"
          title={
            <span id="services-heading">
              Eight disciplines, <span className="accent-em">one team.</span>
            </span>
          }
          description="We are deliberately full-stack as a studio: the people who define the strategy sit beside the people who ship the code. Nothing gets lost in a handover that never happens."
        />

        <ul className="mt-16 md:mt-24">
          {services.map((service) => {
            const isActive = active === service.slug
            const dimmed = active !== null && !isActive
            const visual = art[service.slug]

            return (
              <li key={service.slug} className="border-t border-line last:border-b">
                <Link
                  to={`/services/${service.slug}`}
                  className="group block"
                  onPointerEnter={() => setActive(service.slug)}
                  onFocus={() => setActive(service.slug)}
                  onBlur={() => setActive(null)}
                >
                  <div className="flex items-center gap-5 py-7 md:gap-10 md:py-9">
                    <span
                      className={cn(
                        'w-8 shrink-0 font-display text-xs tabular-nums transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-12 md:text-sm',
                        isActive ? 'translate-x-1.5 text-accent' : 'text-mute-dim',
                      )}
                    >
                      {service.index}
                    </span>

                    {/* Rows stay readable at rest; only a *sibling* being hovered
                        dims them, so the list never looks uniformly greyed out. */}
                    <h3
                      className={cn(
                        'flex-1 font-display text-[clamp(1.35rem,3.6vw,3rem)] leading-[1.05] tracking-tight transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isActive && 'translate-x-2 text-bone md:translate-x-4',
                        dimmed && 'text-mute-dim',
                        !isActive && !dimmed && 'text-bone/75',
                      )}
                    >
                      {service.title}
                    </h3>

                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-12 md:w-12',
                        isActive
                          ? 'rotate-0 border-accent bg-accent/10 text-accent'
                          : '-rotate-45 border-line text-mute-dim',
                      )}
                    >
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>

                  {/*
                    Expanding detail. Below md the detail is always open — there
                    is no hover on touch, so gating it would hide the copy
                    entirely. From md up the row drives it via --rows.
                  */}
                  <div
                    className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-rows-[var(--rows)]"
                    style={{ '--rows': isActive ? '1fr' : '0fr' } as CSSProperties}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-8 pb-8 md:flex-row md:items-end md:gap-12 md:pb-10 md:pl-22">
                        <div className="flex-1">
                          <p className="max-w-xl text-sm leading-relaxed text-mute">
                            {service.summary}
                          </p>
                          <ul className="mt-6 flex flex-wrap gap-2">
                            {service.stack.slice(0, 5).map((tech) => (
                              <li
                                key={tech}
                                className="rounded-full border border-line px-3 py-1 text-[0.6875rem] text-mute"
                              >
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {visual && (
                          <div
                            className={cn(
                              'hidden w-[15rem] shrink-0 overflow-hidden rounded-lg border border-line md:block lg:w-[19rem]',
                              'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                              isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                            )}
                          >
                            <div className="aspect-16/10">
                              <ProjectVisual art={visual} label={service.title} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-mute">
            Most engagements combine three or four of these. We scope the combination in discovery.
          </p>
          <ButtonLink to="/contact" variant="outline">
            Discuss your project
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
