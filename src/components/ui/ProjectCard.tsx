import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { ProjectVisual } from './ProjectVisual'
import { imageReveal, parallax } from '../../animations/presets'
import type { Project } from '../../data/projects'
import { cn } from '../../lib/utils'

type Props = {
  project: Project
  /** Controls the frame's aspect ratio so a grid can be composed asymmetrically. */
  ratio?: 'tall' | 'wide' | 'square'
  className?: string
  index?: number
  parallaxAmount?: number
}

const ratios: Record<NonNullable<Props['ratio']>, string> = {
  tall: 'aspect-[4/5]',
  wide: 'aspect-[16/10]',
  square: 'aspect-square',
}

export function ProjectCard({
  project,
  ratio = 'wide',
  className,
  index,
  parallaxAmount = 0,
}: Props) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const frame = el.querySelector('[data-frame]')
      const media = el.querySelector('[data-media]')
      if (frame) imageReveal(frame, media)
      if (parallaxAmount) parallax(media as Element, parallaxAmount, el)
    }, el)
    return () => ctx.revert()
  }, [parallaxAmount])

  return (
    <article ref={root} className={cn('group', className)}>
      <Link
        to={`/work/${project.slug}`}
        className="block"
        data-cursor="hover"
        data-cursor-label="View"
        aria-label={`${project.name} — ${project.discipline}`}
      >
        <div
          data-frame
          className={cn(
            'relative overflow-hidden rounded-lg border border-line bg-surface',
            ratios[ratio],
          )}
        >
          <div
            data-media
            className="absolute inset-[-12%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          >
            <ProjectVisual art={project.art} label={project.name} />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-40" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
            <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              {project.category}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-3">
              {index !== undefined && (
                <span className="font-display text-[0.6875rem] tabular-nums text-accent">
                  {index.toString().padStart(2, '0')}
                </span>
              )}
              <h3 className="font-display text-xl tracking-tight text-bone md:text-2xl">
                {project.name}
              </h3>
            </div>
            <p className="mt-1.5 text-sm text-mute">{project.discipline}</p>
          </div>
          <span className="shrink-0 pt-1 text-xs tabular-nums text-mute-dim">{project.year}</span>
        </div>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-mute-dim">{project.summary}</p>
      </Link>
    </article>
  )
}
