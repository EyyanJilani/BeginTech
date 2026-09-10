import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { revealLines } from '../../animations/presets'
import { prefersReducedMotion } from '../../lib/utils'

type Props = {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  meta?: { label: string; value: string }[]
  breadcrumb?: { label: string; to: string }[]
  children?: ReactNode
}

/** Shared inner-page opener. Same rhythm as the home hero, a third of the height. */
export function PageHero({ eyebrow, title, lede, meta, breadcrumb, children }: Props) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const heading = el.querySelector('[data-page-title]')
      if (heading) revealLines(heading, { delay: 0.12, stagger: 0.1, scroll: false })

      if (prefersReducedMotion()) {
        gsap.set('[data-page-item]', { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        '[data-page-item]',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, stagger: 0.07, delay: 0.25, ease: 'bt' },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
      {/*
        No accent-glow blob here on purpose — Hero already owns that motif on
        the homepage. Repeating it identically behind every inner page (About,
        Work, Contact, all 8 service pages, every case study) is exactly the
        kind of sameness that makes a site feel templated rather than designed.
      */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-40 mask-fade-b"
      />

      <div className="shell relative">
        {breadcrumb && (
          <nav data-page-item aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-mute-dim">
              {breadcrumb.map((crumb, i) => (
                <li key={`${crumb.to}-${crumb.label}`} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <Link to={crumb.to} className="link-underline transition-colors hover:text-bone">
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <p data-page-item className="eyebrow mb-7 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>

        <h1 data-page-title className="display-lg max-w-[16ch] text-bone" style={{ opacity: 0 }}>
          {title}
        </h1>

        {lede && (
          <div data-page-item className="mt-9 max-w-2xl">
            <p className="lede">{lede}</p>
          </div>
        )}

        {children && <div data-page-item className="mt-10">{children}</div>}

        {meta && (
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 md:mt-20 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} data-page-item>
                <dt className="text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim">
                  {m.label}
                </dt>
                <dd className="mt-2 font-display text-lg tracking-tight text-bone">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
