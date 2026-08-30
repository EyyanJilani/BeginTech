import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { serviceMenu } from '../../data/services'
import { primaryNav, site } from '../../data/site'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { ThemeToggle } from '../ui/ThemeToggle'
import { prefersReducedMotion } from '../../lib/utils'

type Props = { open: boolean; onClose: () => void }

/**
 * Full-screen mobile navigation. Designed for the format rather than shrunk
 * from the desktop bar: oversized touch targets, a collapsible services list,
 * and contact details surfaced instead of buried.
 */
export function MobileMenu({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [servicesOpen, setServicesOpen] = useState(false)
  const mounted = useRef(false)

  useLockBodyScroll(open)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' })
      return
    }

    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll('[data-row]')
      const meta = el.querySelectorAll('[data-meta]')

      if (open) {
        gsap.set(el, { pointerEvents: 'auto' })
        gsap
          .timeline({ defaults: { ease: 'bt' } })
          .to(el, { autoAlpha: 1, duration: 0.01 }, 0)
          .fromTo(
            el.querySelector('[data-sheet]'),
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 0.75 },
            0,
          )
          .fromTo(rows, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.055 }, 0.16)
          .fromTo(meta, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 }, 0.34)
      } else if (mounted.current) {
        gsap.set(el, { pointerEvents: 'none' })
        gsap
          .timeline({ defaults: { ease: 'bt-inout' } })
          .to(rows, { y: -18, opacity: 0, duration: 0.28, stagger: 0.02 }, 0)
          .to(el.querySelector('[data-sheet]'), { clipPath: 'inset(0 0 100% 0)', duration: 0.5 }, 0.06)
          .set(el, { autoAlpha: 0 })
      }
      mounted.current = true
    }, el)

    return () => ctx.revert()
  }, [open])

  /* Collapse the services accordion whenever the sheet closes. Adjusting
     state during render on a prop change is the sanctioned pattern here — an
     effect would schedule a second render pass mid-transition. */
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open && servicesOpen) setServicesOpen(false)
  }

  return (
    <div
      ref={ref}
      id="mobile-navigation"
      className="invisible pointer-events-none fixed inset-0 z-40 opacity-0 lg:hidden"
      aria-hidden={!open}
    >
      <div data-sheet className="absolute inset-0 bg-ink">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-1/4 top-0 h-[60vh] w-[80vw] rounded-full bg-[radial-gradient(circle,var(--color-accent-glow),transparent_65%)] blur-2xl" />

        <nav
          className="shell relative flex h-full flex-col overflow-y-auto pb-10 pt-28"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            <li data-row className="border-t border-line">
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                aria-controls="mobile-services"
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="display-sm text-bone">Services</span>
                {servicesOpen ? (
                  <Minus className="h-5 w-5 text-accent" aria-hidden="true" />
                ) : (
                  <Plus className="h-5 w-5 text-mute" aria-hidden="true" />
                )}
              </button>

              <div
                id="mobile-services"
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: servicesOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="space-y-6 pb-7">
                    {serviceMenu.map((group) => (
                      <div key={group.group}>
                        <p className="eyebrow mb-3">{group.group}</p>
                        <ul className="space-y-2.5">
                          {group.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.to}
                                onClick={onClose}
                                className="flex items-center justify-between gap-4 text-[0.9375rem] text-mute transition-colors hover:text-bone"
                              >
                                {item.label}
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>

            {primaryNav.map((item) => (
              <li data-row key={item.to} className="border-t border-line">
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="flex items-center justify-between py-5"
                >
                  <span className="display-sm text-bone">{item.label}</span>
                  <ArrowUpRight className="h-5 w-5 text-mute" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-6 pt-14">
            <Link
              data-meta
              to="/contact"
              onClick={onClose}
              className="flex h-14 w-full items-center justify-center rounded-full bg-bone text-sm font-medium text-ink"
            >
              Start a project
            </Link>
            <div data-meta className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a href={`mailto:${site.email}`} className="text-bone">
                  {site.email}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Studios</p>
                <p className="text-bone">{site.location}</p>
              </div>
            </div>
            <div data-meta>
              <ThemeToggle variant="row" />
            </div>

            <p data-meta className="text-xs text-mute-dim">
              {site.availability}
            </p>
          </div>
        </nav>
      </div>
    </div>
  )
}
