import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight, Check, Minus, Plus } from 'lucide-react'
import { PageHero } from '../../components/sections/PageHero'
import { CallToAction } from '../../components/sections/CallToAction'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Reveal } from '../../components/ui/Reveal'
import { TextReveal } from '../../components/ui/TextReveal'
import { ProjectVisual } from '../../components/ui/ProjectVisual'
import { ButtonLink } from '../../components/ui/Button'
import { serviceBySlug, services } from '../../data/services'
import { projects } from '../../data/projects'
import type { ArtPattern } from '../../data/projects'
import { useSeo } from '../../hooks/useSeo'
import { cn } from '../../lib/utils'

const art: Record<string, { pattern: ArtPattern; from: string; to: string; ink: string }> = {
  'web-development': { pattern: 'grid', from: '#111826', to: '#0A0C12', ink: '#7C8CFF' },
  'mobile-development': { pattern: 'stack', from: '#101A17', to: '#080C0B', ink: '#5FE3C0' },
  'ui-ux-design': { pattern: 'arc', from: '#1A1410', to: '#0D0A08', ink: '#E0A868' },
  'ai-development': { pattern: 'orbit', from: '#141020', to: '#0A080F', ink: '#A78BFF' },
  'software-development': { pattern: 'mesh', from: '#0E1620', to: '#080B0F', ink: '#5AA9FF' },
  branding: { pattern: 'waves', from: '#161514', to: '#0A0A09', ink: '#D8D2C6' },
  ecommerce: { pattern: 'arc', from: '#151217', to: '#0A090C', ink: '#C08BFF' },
  'digital-marketing': { pattern: 'waves', from: '#0C1A18', to: '#080D0C', ink: '#8FE388' },
}

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? serviceBySlug(slug) : undefined
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useSeo({
    title: service ? `${service.title} — BeginTech` : 'Services — BeginTech',
    description: service?.summary ?? 'Services',
    path: service ? `/services/${service.slug}` : '/services',
  })

  if (!service) return <Navigate to="/" replace />

  const visual = art[service.slug] ?? art['web-development']
  const related = service.related
    .map((r) => serviceBySlug(r))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const cases = projects
    .filter((p) => p.services.some((s) => service.title.toLowerCase().includes(s.toLowerCase().split(' ')[0])))
    .slice(0, 2)
  const showcase = cases.length ? cases : projects.slice(0, 2)

  return (
    <>
      <PageHero
        eyebrow={`${service.index} — ${service.category}`}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: service.navTitle, to: `/services/${service.slug}` },
        ]}
        title={service.title}
        lede={service.tagline}
        meta={service.engagement.map((e) => ({ label: e.label, value: e.value }))}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink to="/contact">Start a Project</ButtonLink>
          <ButtonLink to="/work" variant="outline" arrow={false}>
            See related work
          </ButtonLink>
        </div>
      </PageHero>

      {/* Positioning statement + visual */}
      <section className="border-t border-line py-24 md:py-32" aria-label="Overview">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-line-strong" />
                <span className="eyebrow">The short version</span>
              </Reveal>
              <TextReveal
                as="p"
                className="font-display text-[clamp(1.4rem,2.8vw,2.25rem)] leading-[1.25] tracking-tight text-bone"
              >
                {service.statement}
              </TextReveal>
              <Reveal className="mt-9 max-w-xl" delay={0.08}>
                <p className="lede">{service.summary}</p>
              </Reveal>
            </div>

            <Reveal className="lg:col-span-5" delay={0.1}>
              <div className="aspect-4/5 overflow-hidden rounded-xl border border-line">
                <ProjectVisual art={visual} label={service.title} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="capabilities-heading">
        <div className="shell">
          <SectionHeading
            eyebrow="Capabilities"
            title={<span id="capabilities-heading">What the engagement covers</span>}
            description="Scoped in discovery and adjusted at each cycle boundary. Nothing here is fixed before we understand the problem."
          />

          <div className="mt-14 grid gap-px border border-line bg-line md:mt-20 md:grid-cols-2">
            {service.capabilities.map((cap, i) => (
              <Reveal key={cap.title} className="group bg-ink p-8 lg:p-11">
                <span className="font-display text-[0.6875rem] tabular-nums text-accent">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <h3 className="mt-7 font-display text-xl tracking-tight text-bone md:text-2xl">
                  {cap.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">{cap.body}</p>
                <span
                  aria-hidden="true"
                  className="mt-8 block h-px w-10 origin-left bg-accent/60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-[4]"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables + stack */}
      <section className="border-t border-line py-24 md:py-32" aria-label="Deliverables">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal className="mb-8">
                <p className="eyebrow">What you receive</p>
              </Reveal>
              <ul className="space-y-px bg-line">
                {service.deliverables.map((d) => (
                  <Reveal key={d} as="li" className="flex items-start gap-4 bg-ink py-4">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-bone">{d}</span>
                  </Reveal>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal className="mb-8">
                <p className="eyebrow">Typical stack</p>
              </Reveal>
              <Reveal className="flex flex-wrap gap-2" staggerChildren>
                {service.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-4 py-2 text-sm text-mute transition-colors duration-500 hover:border-accent/50 hover:text-bone"
                  >
                    {t}
                  </span>
                ))}
              </Reveal>

              <Reveal className="mt-12 rounded-xl border border-line bg-surface/50 p-8" delay={0.1}>
                <p className="eyebrow mb-6">Engagement shape</p>
                <dl className="space-y-4">
                  {service.engagement.map((e) => (
                    <div key={e.label} className="flex items-baseline justify-between gap-6 border-b border-line pb-4 last:border-0 last:pb-0">
                      <dt className="text-sm text-mute">{e.label}</dt>
                      <dd className="text-right font-display text-base tracking-tight text-bone">
                        {e.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-xs leading-relaxed text-mute-dim">
                  Indicative only. Final scope and cost are agreed after discovery, and we will tell
                  you if your budget does not match the ambition.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="proof-heading">
        <div className="shell">
          <SectionHeading
            eyebrow="Proof"
            title={<span id="proof-heading">Recent work in this discipline</span>}
          />
          <div className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2">
            {showcase.map((p) => (
              <Reveal key={p.slug}>
                <Link to={`/work/${p.slug}`} className="group block" data-cursor="hover" data-cursor-label="View">
                  <div className="aspect-16/10 overflow-hidden rounded-lg border border-line">
                    <div className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                      <ProjectVisual art={p.art} label={p.name} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-bone">{p.name}</h3>
                      <p className="mt-1.5 text-sm text-mute">{p.discipline}</p>
                    </div>
                    <span className="text-xs tabular-nums text-mute-dim">{p.year}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="faq-heading">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="Questions"
                align="left"
                title={<span id="faq-heading">Before you ask</span>}
              />
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-line">
                {service.faqs.map((faq, i) => {
                  const open = openFaq === i
                  return (
                    <li key={faq.q} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        aria-controls={`faq-${i}`}
                        className="flex w-full items-center justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={cn(
                            'font-display text-lg tracking-tight transition-colors duration-500 md:text-xl',
                            open ? 'text-bone' : 'text-mute',
                          )}
                        >
                          {faq.q}
                        </span>
                        {open ? (
                          <Minus aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-mute-dim" />
                        )}
                      </button>
                      <div
                        id={`faq-${i}`}
                        className="grid transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-xl pb-7 text-sm leading-relaxed text-mute">{faq.a}</p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="border-t border-line py-20 md:py-24" aria-labelledby="related-services">
        <div className="shell">
          <h2 id="related-services" className="eyebrow mb-10">
            Often combined with
          </h2>
          <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to={`/services/${r.slug}`}
                  className="group flex h-full flex-col justify-between gap-8 bg-ink p-8 transition-colors duration-500 hover:bg-surface/50"
                >
                  <div>
                    <span className="font-display text-[0.6875rem] tabular-nums text-accent">
                      {r.index}
                    </span>
                    <h3 className="mt-5 font-display text-xl tracking-tight text-bone">{r.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-mute-dim">{r.tagline}</p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 text-mute-dim transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {services
              .filter((s) => s.slug !== service.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="link-underline text-xs text-mute-dim transition-colors hover:text-bone"
                >
                  {s.navTitle}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  )
}
