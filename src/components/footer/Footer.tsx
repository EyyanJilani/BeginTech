import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { LogoLockup } from '../ui/Logo'
import { Magnetic } from '../ui/Magnetic'
import { Marquee } from '../ui/Marquee'
import { site } from '../../data/site'
import { services } from '../../data/services'
import { getLenis } from '../../hooks/useSmoothScroll'

const navColumns = [
  {
    title: 'Studio',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Work', to: '/work' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: services.slice(0, 4).map((s) => ({ label: s.navTitle, to: `/services/${s.slug}` })),
  },
  {
    title: 'More services',
    links: services.slice(4).map((s) => ({ label: s.navTitle, to: `/services/${s.slug}` })),
  },
]

export function Footer() {
  const [clock, setClock] = useState('')

  /* Karachi time — a small live detail that signals a real studio. */
  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Karachi',
        }).format(new Date()),
      )
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const toTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent" />

      <div className="border-b border-line py-8">
        <Marquee speed={46}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="flex items-center gap-8 pr-8 font-display text-[clamp(1.75rem,4vw,3.25rem)] tracking-tight text-bone/[0.09]"
            >
              Let&apos;s build something extraordinary
              <span className="text-accent/40">✳</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell py-16 md:py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center" aria-label="BeginTech — home">
              <LogoLockup className="h-14" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute">
              A software house and creative technology studio. We design, engineer and grow digital
              products for companies that intend to last.
            </p>
            <p className="mt-8 flex items-center gap-2.5 text-sm text-mute">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {site.availability}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {navColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="eyebrow mb-5">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label + link.to}>
                      <Link
                        to={link.to}
                        className="link-underline text-sm text-mute transition-colors duration-300 hover:text-bone"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-5">Get in touch</p>
            <ul className="space-y-4 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-bone">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                  className="link-underline text-mute transition-colors hover:text-bone"
                >
                  {site.phone}
                </a>
              </li>
              <li className="text-mute">{site.hq}</li>
              <li className="text-mute-dim">
                {site.hours} · <span className="tabular-nums text-mute">{clock} Karachi</span>
              </li>
            </ul>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-sm text-mute transition-colors hover:text-bone"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-mute-dim">
            © {new Date().getFullYear()} BeginTech Studio. All rights reserved. · Registered in Pakistan.
          </p>

          <Magnetic strength={0.45}>
            <button
              type="button"
              onClick={toTop}
              className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-mute transition-colors duration-300 hover:text-bone"
            >
              Scroll to top
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors duration-500 group-hover:border-accent">
                <ArrowUp
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
                />
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  )
}
