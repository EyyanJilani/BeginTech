import { cn } from '../../lib/utils'
import { brand } from '../../data/brand'

/*
  Deterministic shard scatter. The WebGL hero is a tumbling shard field, so the
  no-WebGL fallback shows the same composition held still rather than a
  completely different shape.
*/
const HUES = [brand.blue, brand.magenta, brand.purple, brand.green]
const SHARDS = Array.from({ length: 34 }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180
  const rad = 16 + ((i * 7) % 34)
  return {
    x: 50 + Math.cos(a) * rad,
    y: 50 + Math.sin(a) * rad * 0.92,
    w: 5 + ((i * 5) % 9),
    h: 9 + ((i * 11) % 16),
    r: (i * 47) % 360,
    o: 0.3 + ((i * 13) % 5) / 9,
    c: HUES[i % HUES.length],
  }
})

/**
 * Pure-CSS stand-in for the WebGL hero. Shown when the GPU context is
 * unavailable, when the user asks for reduced motion, or while the 3D bundle
 * is still in flight — the page never waits on Three.js to look finished.
 */
export function SceneFallback({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 aspect-square w-[80%] max-w-[640px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_58%_38%,var(--color-accent-glow),transparent_64%)] blur-2xl" />

        {/* Two hairline orbits, matching the WebGL version's structure. */}
        <div className="absolute inset-[16%] rounded-full border border-accent/25" />
        <div className="absolute inset-[30%] rounded-full border border-accent/15" />

        {/* A static scatter of shards so the fallback reads as the same idea. */}
        {SHARDS.map((s, i) => (
          <span
            key={i}
            className="absolute block"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.w}px`,
              height: `${s.h}px`,
              background: s.c,
              opacity: s.o,
              transform: `rotate(${s.r}deg)`,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 grid-lines opacity-[0.35] mask-fade-b" />
    </div>
  )
}
