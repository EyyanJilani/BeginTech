import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { PageHero } from '../components/sections/PageHero'
import { CallToAction } from '../components/sections/CallToAction'
import { ProjectCard } from '../components/ui/ProjectCard'
import { projectCategories, projects } from '../data/projects'
import type { ProjectCategory } from '../data/projects'
import { cn, prefersReducedMotion } from '../lib/utils'
import { useSeo } from '../hooks/useSeo'

export default function Work() {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All')
  const gridRef = useRef<HTMLDivElement>(null)

  useSeo({
    title: 'Work — BeginTech',
    description:
      'Selected case studies from BeginTech: fintech platforms, mobility apps, AI retrieval systems, luxury commerce, enterprise dashboards and identity systems.',
    path: '/work',
  })

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  /* Re-enter animation on every filter change; ScrollTrigger is refreshed
     because the grid height changes underneath every trigger below it. */
  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el) return
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh()
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { y: 34, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.055,
          ease: 'bt',
          onComplete: () => ScrollTrigger.refresh(),
        },
      )
    }, el)

    return () => ctx.revert()
  }, [filter])

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title={
          <>
            Products we were
            <br />
            <span className="accent-em">proud</span> to sign.
          </>
        }
        lede="Twelve engagements across fintech, mobility, AI, commerce, energy and health. Each one is a real problem someone had to solve — the numbers are the ones our clients report."
        meta={[
          { label: 'Case studies', value: String(projects.length) },
          { label: 'Sectors', value: '9' },
          { label: 'Countries', value: '18' },
          { label: 'Since', value: '2016' },
        ]}
      />

      <section className="border-t border-line py-16 md:py-20" aria-labelledby="gallery-heading">
        <div className="shell">
          {/* The gallery has no visible title by design, but the project cards
              are h3s — without this the outline jumps straight from h1 to h3. */}
          <h2 id="gallery-heading" className="sr-only">
            Project gallery
          </h2>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter projects by discipline"
            >
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs transition-colors duration-400',
                    filter === cat
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-mute hover:border-line-strong hover:text-bone',
                  )}
                >
                  {cat}
                  <span className="ml-2 tabular-nums text-mute-dim">
                    {cat === 'All'
                      ? projects.length
                      : projects.filter((p) => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>

            <p aria-live="polite" className="text-xs text-mute-dim">
              Showing {visible.length} of {projects.length} projects
            </p>
          </div>

          <div
            ref={gridRef}
            className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-20 xl:gap-x-12"
          >
            {visible.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i + 1}
                ratio={i % 3 === 0 ? 'wide' : 'tall'}
                className={i % 4 === 1 ? 'md:mt-16' : undefined}
              />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-20 text-center text-sm text-mute">
              Nothing published in this discipline yet — ask us about it directly.
            </p>
          )}
        </div>
      </section>

      <CallToAction />
    </>
  )
}
