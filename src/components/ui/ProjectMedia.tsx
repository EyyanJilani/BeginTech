import type { Project } from '../../data/projects'
import { ProjectVisual } from './ProjectVisual'

type Props = {
  project: Project
  label: string
  className?: string
}

/**
 * Renders a project's real screenshot when one exists, falling back to the
 * procedural SVG art otherwise. Centralised here so every surface — cards,
 * the case-study hero, the services showcase — treats the two sources the
 * same way instead of branching in three places.
 */
export function ProjectMedia({ project, label, className }: Props) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${label} — website screenshot`}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-top ${className ?? ''}`}
      />
    )
  }

  return <ProjectVisual art={project.art} label={label} className={className} />
}
