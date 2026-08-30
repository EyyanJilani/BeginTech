import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Props = {
  children: ReactNode
  speed?: number
  className?: string
  reverse?: boolean
}

/** CSS-only infinite marquee — no GSAP ticker cost for a purely decorative loop. */
export function Marquee({ children, speed = 40, className, reverse = false }: Props) {
  return (
    <div
      className={cn('relative flex w-full overflow-hidden mask-fade-x', className)}
      aria-hidden="true"
    >
      <div
        className="flex w-max shrink-0 items-center will-change-transform"
        // Longhand only: the `animation` shorthand resets animation-direction,
        // so mixing the two makes the rendered direction order-dependent and
        // React warns about the conflict on every re-render.
        style={{
          animationName: 'bt-marquee',
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center">{children}</div>
      </div>
    </div>
  )
}
