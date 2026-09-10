import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { Logo } from '../ui/Logo'
import { ButtonLink } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { primaryNav } from '../../data/site'
import { cn, prefersReducedMotion } from '../../lib/utils'

const MENU_ID = 'services-mega-menu'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const barRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const location = useLocation()

  /* Condense the bar once the hero is behind us. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Intro: the bar drops in after the hero headline has started. */
  useEffect(() => {
    const el = barRef.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, delay: 0.35, ease: 'bt' },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  /* Any route change closes everything. Handled during render rather than in
     an effect so the panels are already closed on the first painted frame of
     the new route. */
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    if (servicesOpen) setServicesOpen(false)
    if (mobileOpen) setMobileOpen(false)
  }

  /* Escape closes the open surface and returns focus to the bar. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setServicesOpen(false)
      setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const openServices = () => {
    window.clearTimeout(closeTimer.current)
    setServicesOpen(true)
  }
  const closeServices = (delay = 140) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), delay)
  }

  const onServices = location.pathname.startsWith('/services')

  /* The homepage hero is a fixed dark video regardless of theme (see Hero.tsx),
     so while the bar floats transparently over it — not yet scrolled, no glass
     panel behind it — nav text has to stay light-on-dark even in light theme.
     Once scrolled (or a panel opens) the bar gets its own glass background and
     can go back to the normal theme-reactive tokens. Inner pages don't force a
     dark hero, so they never need this override. */
  const overDarkHero = location.pathname === '/' && !scrolled && !mobileOpen && !servicesOpen

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <header
        ref={barRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled ? 'py-2.5' : 'py-4 md:py-6',
        )}
      >
        <div className="shell">
          <div
            className={cn(
              'relative flex items-center justify-between rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              scrolled || mobileOpen || servicesOpen
                ? 'glass border-line px-4 py-2.5 md:px-5'
                : 'border-transparent px-1 py-2.5 md:px-2',
            )}
          >
            <Logo />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              <div
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={() => closeServices()}
              >
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls={MENU_ID}
                  aria-haspopup="true"
                  onClick={() => (servicesOpen ? closeServices(0) : openServices())}
                  onFocus={openServices}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors duration-300',
                    overDarkHero
                      ? onServices
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                      : onServices || servicesOpen
                        ? 'text-bone'
                        : 'text-mute hover:text-bone',
                  )}
                >
                  Services
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      servicesOpen && 'rotate-180',
                    )}
                  />
                </button>
              </div>

              {primaryNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm transition-colors duration-300',
                      overDarkHero
                        ? isActive
                          ? 'text-white'
                          : 'text-white/70 hover:text-white'
                        : isActive
                          ? 'text-bone'
                          : 'text-mute hover:text-bone',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle
                className={cn(
                  'h-10 w-10 lg:h-11 lg:w-11',
                  overDarkHero && 'border-white/25 text-white/80 hover:border-white/40 hover:text-white',
                )}
              />

              <div className="hidden lg:block">
                <ButtonLink
                  to="/contact"
                  size="md"
                  variant="outline"
                  className={overDarkHero ? 'border-white/30 text-white' : undefined}
                >
                  Start a Project
                </ButtonLink>
              </div>

              <button
                type="button"
                className={cn(
                  'relative -mr-1 flex h-11 w-11 items-center justify-center rounded-full border lg:hidden',
                  overDarkHero ? 'border-white/25' : 'border-line',
                )}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
                <span aria-hidden="true" className="relative block h-3 w-4.5">
                  <span
                    className={cn(
                      'absolute left-0 h-px w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      overDarkHero ? 'bg-white' : 'bg-bone',
                      mobileOpen ? 'top-1.5 rotate-45' : 'top-0',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 h-px w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      overDarkHero ? 'bg-white' : 'bg-bone',
                      mobileOpen ? 'top-1.5 -rotate-45' : 'top-3',
                    )}
                  />
                </span>
              </button>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={() => closeServices()}
          >
            <MegaMenu id={MENU_ID} open={servicesOpen} onNavigate={() => closeServices(0)} />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
