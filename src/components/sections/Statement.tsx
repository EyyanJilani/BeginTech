import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { revealWords } from '../../animations/presets'
import { Reveal } from '../ui/Reveal'
import { principles } from '../../data/site'

export function Statement() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const line = el.querySelector('[data-statement]')
      if (line) revealWords(line, { stagger: 0.02 })

      gsap.to('[data-statement-mark]', {
        rotate: 220,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative border-t border-line py-28 md:py-40" aria-labelledby="statement-heading">
      <div className="shell">
        <div className="mb-16 flex items-center gap-4 md:mb-24">
          <span
            data-statement-mark
            aria-hidden="true"
            className="block h-5 w-5 border border-accent/60"
          />
          <span className="eyebrow">Our position</span>
        </div>

        {/* This oversized line is the section's heading, not decoration —
            keeping it an h2 preserves the document outline. */}
        <h2 id="statement-heading" data-statement className="display-lg max-w-[22ch] text-bone" style={{ opacity: 0 }}>
          Technology should not only work. It should make people{' '}
          <span className="accent-em">feel</span> something.
        </h2>

        <Reveal className="mt-14 max-w-2xl md:mt-20" delay={0.1}>
          <p className="lede">
            Anyone can ship features. The difference between software people tolerate and software
            people choose is a hundred decisions most teams never make consciously — how fast the
            first screen paints, what happens when the network drops, whether an error message
            respects the person reading it. We are unusually interested in those decisions.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-px border border-line bg-line md:mt-28 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.index} className="group bg-ink p-8 lg:p-10" delay={i * 0.06}>
              <span className="text-[0.6875rem] font-medium tabular-nums text-accent">{p.index}</span>
              <h3 className="mt-6 font-display text-xl tracking-tight text-bone">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-mute">{p.body}</p>
              <span
                aria-hidden="true"
                className="mt-8 block h-px w-10 origin-left bg-accent/60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-[3.5]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
