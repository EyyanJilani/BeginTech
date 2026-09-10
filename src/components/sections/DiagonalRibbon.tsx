import { Sparkles } from 'lucide-react'
import { Marquee } from '../ui/Marquee'
import { services } from '../../data/services'

/**
 * A brand-coloured band, tilted off the grid — the one deliberately loud
 * moment on the page. It uses the brand gradient directly rather than theme
 * tokens, so it reads identically in light and dark: a fixed accent beat
 * between two neutral sections, not another surface that has to flip.
 */
export function DiagonalRibbon() {
  const items = services.map((s) => s.navTitle)

  return (
    <div
      className="relative my-4 h-[210px] overflow-hidden sm:h-[260px] md:h-[300px]"
      aria-hidden="true"
    >
      {/* Two bands, opposite rotation, pivoting on the same centre — they
          cross like an X instead of running parallel to one another. */}
      <div
        className="absolute inset-x-[-10vw] top-1/2 z-10 -translate-y-1/2 -rotate-6 py-3 shadow-[0_18px_46px_-18px_rgba(0,0,0,0.45)] sm:-rotate-[4deg] opacity-20"
        style={{
          background:
            'linear-gradient(100deg, var(--color-accent) 0%, var(--color-accent-2) 100%)',
        }}
      >
        <Marquee speed={34} className="py-3">
          {items.map((label) => (
            <span
              key={`a-${label}`}
              className="flex items-center gap-3 pr-6 font-display text-[clamp(1.1rem,2.6vw,2rem)] tracking-tight text-white"
            >
              {label}
              <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-white/70" />
            </span>
          ))}
        </Marquee>
      </div>

      <div
        className="absolute inset-x-[-10vw] top-1/2 z-20 -translate-y-1/2 rotate-6 py-3 shadow-[0_18px_46px_-18px_rgba(0,0,0,0.45)] sm:rotate-[4deg] opacity-50"
        style={{
          background:
            'linear-gradient(100deg, var(--color-accent-2) 0%, var(--color-accent) 100%)',
        }}
      >
        <Marquee speed={38} reverse className="py-3">
          {items.map((label) => (
            <span
              key={`b-${label}`}
              className="flex items-center gap-3 pr-6 font-display text-[clamp(1.1rem,2.6vw,2rem)] tracking-tight text-white/90"
            >
              {label}
              <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-white/65" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
