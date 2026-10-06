import { useLayoutEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { imageReveal } from '../animations/presets'
import { PageHero } from '../components/sections/PageHero'
import { CallToAction } from '../components/sections/CallToAction'
import { ProjectMedia } from '../components/ui/ProjectMedia'
import { ProjectVisual } from '../components/ui/ProjectVisual'
import { ProjectCard } from '../components/ui/ProjectCard'
import { Reveal } from '../components/ui/Reveal'
import { TextReveal } from '../components/ui/TextReveal'
import { projectBySlug, projects } from '../data/projects'
import { useSeo } from '../hooks/useSeo'
import { useJsonLd } from '../hooks/useJsonLd'
import { ORG_ID, ORIGIN, breadcrumbSchema } from '../lib/schema'
import NotFound from './NotFound'

/** Keeps the title near Google's ~60-character display width. */
function caseStudyTitle(name: string, discipline: string) {
  const full = `${name}: ${discipline} Case Study | BeginTech`
  return full.length <= 62 ? full : `${name}: ${discipline} | BeginTech`
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projectBySlug(slug) : undefined
  const frameRef = useRef<HTMLDivElement>(null)

  useSeo({
    title: project ? caseStudyTitle(project.name, project.discipline) : 'Page not found | BeginTech',
    description: project?.summary ?? 'The page you were looking for does not exist.',
    path: project ? `/work/${project.slug}` : undefined,
    type: project ? 'article' : 'website',
    noindex: !project,
  })

  useJsonLd(
    'project-jsonld',
    project
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': `${ORIGIN}/work/${project.slug}#casestudy`,
          name: `${project.name}: ${project.discipline}`,
          headline: project.headline,
          description: project.summary,
          url: `${ORIGIN}/work/${project.slug}`,
          ...(project.image ? { image: `${ORIGIN}${project.image}` } : {}),
          dateCreated: project.year,
          genre: project.category,
          keywords: project.services.join(', '),
          creator: { '@id': ORG_ID },
          about: { '@type': 'Organization', name: project.client },
        }
      : null,
  )

  useJsonLd(
    'breadcrumb-jsonld',
    project
      ? breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: project.name, path: `/work/${project.slug}` },
        ])
      : null,
  )

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      imageReveal(el, el.firstElementChild)
    }, el)
    return () => ctx.revert()
  }, [slug])

  if (!project) return <NotFound />

  /* The next three projects, wrapping around, every case study is linked
     from three others instead of all of them pointing at the first three. */
  const at = projects.findIndex((p) => p.slug === project.slug)
  const related = [1, 2, 3].map((n) => projects[(at + n) % projects.length])

  return (
    <>
      <PageHero
        eyebrow={project.discipline}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Work', to: '/work' },
          { label: project.name, to: `/work/${project.slug}` },
        ]}
        title={project.headline}
        lede={project.summary}
        meta={[
          { label: 'Client', value: project.client },
          { label: 'Sector', value: project.sector },
          { label: 'Discipline', value: project.category },
          { label: 'Year', value: project.year },
        ]}
      />

      <div className="shell">
        <div
          ref={frameRef}
          className="aspect-16/9 overflow-hidden rounded-xl border border-line bg-surface"
        >
          <div className="h-full w-full">
            <ProjectMedia project={project} label={project.name} />
          </div>
        </div>
      </div>

      {/* Outcome */}
      <section className="border-t border-line py-20 md:py-24" aria-label="Outcomes">
        <div className="shell">
          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {project.outcome.map((o) => (
              <Reveal key={o.label} className="bg-ink p-8 lg:p-10">
                <p className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none tracking-tighter text-bone">
                  {o.value}
                </p>
                <p className="mt-4 text-sm text-mute">{o.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="border-t border-line py-24 md:py-32" aria-label="Case study">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-10">
                <div>
                  <p className="eyebrow mb-4">Services</p>
                  <ul className="space-y-2 text-sm text-mute">
                    {project.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow mb-4">Stack</p>
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-3 py-1 text-[0.6875rem] text-mute"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/contact" className="link-underline inline-flex items-center gap-2 text-sm text-bone">
                  Start a project like this
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-16 lg:col-span-7 lg:col-start-6">
              <div>
                <p className="eyebrow mb-6">The challenge</p>
                <TextReveal as="p" className="font-display text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.3] tracking-tight text-bone">
                  {project.challenge}
                </TextReveal>
              </div>

              <div>
                <p className="eyebrow mb-6">Our approach</p>
                <Reveal>
                  <p className="text-[0.9375rem] leading-relaxed text-mute">{project.approach}</p>
                </Reveal>
              </div>

              <Reveal className="aspect-4/3 overflow-hidden rounded-lg border border-line">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.name} website by BeginTech, ${project.discipline.toLowerCase()} page design`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-bottom"
                  />
                ) : (
                  <ProjectVisual
                    art={{ ...project.art, pattern: project.art.pattern === 'grid' ? 'mesh' : 'grid' }}
                    label={`${project.name}, system detail`}
                  />
                )}
              </Reveal>

              <div>
                <p className="eyebrow mb-6">Result</p>
                <Reveal>
                  <p className="text-[0.9375rem] leading-relaxed text-mute">
                    Delivered and live, covering {project.outcome.map((o) => o.label.toLowerCase()).join(', ')}.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="related-heading">
        <div className="shell">
          <div className="mb-14 flex items-end justify-between gap-8">
            <h2 id="related-heading" className="display-sm text-bone">
              More work
            </h2>
            <Link to="/work" className="link-underline shrink-0 text-sm text-mute hover:text-bone">
              All projects
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {related.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i + 1} ratio="tall" />
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  )
}
