import { Link } from 'react-router-dom'
import { PageHero } from '../components/sections/PageHero'
import { ButtonLink } from '../components/ui/Button'
import { services } from '../data/services'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({
    title: 'Page not found — BeginTech',
    description: 'The page you were looking for does not exist.',
  })

  return (
    <>
      <PageHero
        eyebrow="Error 404"
        title={
          <>
            This page
            <br />
            <span className="accent-serif text-accent">does not</span> exist.
          </>
        }
        lede="The link may be out of date, or the page may have moved. Everything else is where you left it."
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/work" variant="outline" arrow={false}>
            See our work
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-t border-line py-20" aria-label="All services">
        <div className="shell">
          <p className="eyebrow mb-8">Or jump to a service</p>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="link-underline text-sm text-mute transition-colors hover:text-bone"
                >
                  {s.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
