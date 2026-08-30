import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { serviceMenu } from '../../data/services'
import { prefersReducedMotion } from '../../lib/utils'

type Props = {
  open: boolean
  onNavigate: () => void
  id: string
}

export function MegaMenu({ open, onNavigate, id }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const panel = el.querySelector('[data-panel]')
    const groups = el.querySelectorAll('[data-group]')
    const items = el.querySelectorAll('[data-item]')

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: open ? 1 : 0 })
      return
    }

    const ctx = gsap.context(() => {
      if (open) {
        gsap.killTweensOf([el, panel, groups, items])
        gsap.set(el, { pointerEvents: 'auto' })
        gsap
          .timeline({ defaults: { ease: 'bt' } })
          .to(el, { autoAlpha: 1, duration: 0.28 }, 0)
          .fromTo(panel, { yPercent: -8, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.65 }, 0)
          .fromTo(groups, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 }, 0.08)
          .fromTo(items, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.018 }, 0.14)
      } else if (!first.current) {
        gsap.killTweensOf([el, panel, groups, items])
        gsap.set(el, { pointerEvents: 'none' })
        gsap
          .timeline({ defaults: { ease: 'bt-inout' } })
          .to(panel, { yPercent: -6, opacity: 0, duration: 0.32 }, 0)
          .to(el, { autoAlpha: 0, duration: 0.28 }, 0)
      }
      first.current = false
    }, el)

    return () => ctx.revert()
  }, [open])

  return (
    <div
      ref={ref}
      id={id}
      className="invisible pointer-events-none absolute inset-x-0 top-full opacity-0"
    >
      <div
        data-panel
        className="glass mx-auto mt-2 max-w-[76rem] overflow-hidden rounded-2xl border border-line panel-shadow"
      >
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
          {serviceMenu.map((group) => (
            <div key={group.group} data-group className="bg-ink-soft/85 p-7">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <span className="eyebrow">{group.group}</span>
                <span className="text-[0.6875rem] text-mute-dim">{group.blurb}</span>
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.label} data-item>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className="group/link -mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-bone/[0.05]"
                    >
                      <span className="flex flex-col">
                        <span className="text-[0.9375rem] font-medium tracking-tight text-bone">
                          {item.label}
                        </span>
                        <span className="text-xs text-mute-dim">{item.note}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 -translate-x-1 text-mute-dim opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0 group-hover/link:text-accent group-hover/link:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line bg-ink/70 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-sm text-mute">
            Not sure which of these you need? Most engagements start with a two-week discovery.
          </p>
          <Link
            to="/contact"
            onClick={onNavigate}
            className="link-underline shrink-0 text-sm font-medium text-bone"
          >
            Book a discovery call
          </Link>
        </div>
      </div>
    </div>
  )
}
