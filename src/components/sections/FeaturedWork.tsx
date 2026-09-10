import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { featuredProjects } from '../../data/projects'

/**
 * Editorial, deliberately asymmetric. Column spans and offsets vary per row so
 * the eye travels rather than scanning a uniform grid.
 */
export function FeaturedWork() {
  const [a, b, c, d, e, f] = featuredProjects

  return (
    <section className="relative border-t border-line py-24 md:py-32" aria-labelledby="work-heading">
      <div className="shell">
        <SectionHeading
          eyebrow="Selected work"
          title={<span id="work-heading">Selected work</span>}
          description="Six live builds that show the range — food ordering, fashion e-commerce, a manufacturer's storefront, an electrical contractor, a French street-food kitchen and a backflow testing service."
        />

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-24">
          <ProjectCard
            project={a}
            index={1}
            ratio="wide"
            parallaxAmount={-40}
            className="md:col-span-8"
          />
          <ProjectCard
            project={b}
            index={2}
            ratio="tall"
            parallaxAmount={40}
            className="md:col-span-4 md:mt-32"
          />

          <ProjectCard
            project={c}
            index={3}
            ratio="tall"
            parallaxAmount={-30}
            className="md:col-span-5"
          />
          <div className="hidden md:col-span-1 md:block" />
          <ProjectCard
            project={d}
            index={4}
            ratio="wide"
            parallaxAmount={30}
            className="md:col-span-6 md:mt-40"
          />

          <ProjectCard
            project={e}
            index={5}
            ratio="wide"
            parallaxAmount={-24}
            className="md:col-span-7"
          />
          <ProjectCard
            project={f}
            index={6}
            ratio="square"
            parallaxAmount={24}
            className="md:col-span-4 md:col-start-9 md:mt-28"
          />
        </div>

        <Reveal className="mt-24 flex flex-col items-start gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-mute">
            More case studies, filterable by discipline.
          </p>
          <ButtonLink to="/work" variant="outline">
            View all work
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
