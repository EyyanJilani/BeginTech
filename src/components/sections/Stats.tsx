import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { countTo } from '../../animations/presets'
import { stats } from '../../data/site'
import { cn } from '../../lib/utils'

/** Elegant, restrained counters — one animated pass, no looping. */
export function Stats({ className, bordered = true }: { className?: string; bordered?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
        const value = Number(node.dataset.count)
        countTo(node, value, node.dataset.suffix ?? '')
      })
      gsap.fromTo(
        '[data-stat]',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'bt',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className={cn(
        'grid grid-cols-2 gap-px bg-line lg:grid-cols-4',
        bordered && 'border border-line',
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} data-stat className="bg-ink p-7 lg:p-9">
          <p className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-none tracking-tighter text-bone">
            <span data-count={stat.value} data-suffix={stat.suffix} className="tabular-nums">
              0{stat.suffix}
            </span>
          </p>
          <p className="mt-4 text-sm text-bone">{stat.label}</p>
          <p className="mt-1 text-xs text-mute-dim">{stat.detail}</p>
        </div>
      ))}
    </div>
  )
}
