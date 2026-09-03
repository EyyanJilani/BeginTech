import type { CSSProperties } from 'react'
import { brand } from '../../data/brand'
import { cn } from '../../lib/utils'

/*
  The hero element, in plain CSS.

  This replaced a Three.js scene. WebGL cost ~885kB of JavaScript and two live
  render loops writing transforms every frame, which is what made the page
  stutter. Everything here animates `transform` and `opacity` only, so the work
  happens on the compositor and the main thread stays free for scrolling.

  The composition is the same idea as the identity: a cluster of fragmented
  shards in the brand hues, dense at the centre and thinning outward, held
  inside two hairline orbits.
*/

const HUES = [brand.blue, brand.magenta, brand.blue, brand.green, brand.blue, brand.purple]

type Shard = {
  x: number
  y: number
  size: number
  hue: string
  rot: number
  dur: number
  delay: number
  opacity: number
  drift: number
}

/** Golden-angle spiral — even coverage with no clustering, computed once. */
const SHARDS: Shard[] = Array.from({ length: 26 }, (_, i) => {
  const angle = i * 137.508 * (Math.PI / 180)
  // Outward progression, eased so the centre stays denser than the rim.
  const t = Math.pow(i / 25, 0.72)
  const radius = 7 + t * 41

  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius * 0.9,
    size: 44 - t * 22,
    hue: HUES[i % HUES.length],
    rot: (i * 67) % 360,
    dur: 10 + (i % 6) * 2.2,
    // Negative delays start every shard mid-cycle, so nothing is in lockstep
    // and there is no synchronised "pop" on first paint.
    delay: -(i * 0.83),
    opacity: 0.95 - t * 0.38,
    drift: i % 2 === 0 ? 1 : -1,
  }
})

type Props = {
  className?: string
  /** `sparse` thins the cluster right down for use behind body copy. */
  density?: 'full' | 'sparse'
  /** Rings read as structure in the hero, but are noise behind a CTA. */
  rings?: boolean
}

export function ShardField({ className, density = 'full', rings = true }: Props) {
  const shards = density === 'sparse' ? SHARDS.filter((_, i) => i % 2 === 0) : SHARDS

  return (
    <div
      className={cn('pointer-events-none relative h-full w-full overflow-hidden', className)}
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-1/2 aspect-square w-[86%] max-w-[680px] -translate-x-1/2 -translate-y-1/2">
        {/* Soft brand glow anchors the cluster without a hard shape. */}
        <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_56%_40%,var(--color-accent-glow),transparent_66%)] blur-2xl" />

        {rings && (
          <>
            <div className="bt-orbit absolute left-1/2 top-1/2 h-[58%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-accent/25" />
            <div
              className="bt-orbit absolute left-1/2 top-1/2 h-[76%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-accent/15"
              style={{ animationDirection: 'reverse', animationDuration: '38s' }}
            />
          </>
        )}

        {shards.map((s, i) => (
          <span
            key={i}
            className="bt-shard absolute block"
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size * 1.5}px`,
                background: s.hue,
                opacity: s.opacity,
                '--bt-rot': `${s.rot}deg`,
                '--bt-drift': `${s.drift * 14}px`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
