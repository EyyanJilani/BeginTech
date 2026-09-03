import { Link } from 'react-router-dom'
import lockupSrc from '../../assets/img/logo-lockup.png'
import markSrc from '../../assets/img/logo-mark.png'
import { cn } from '../../lib/utils'

/*
  Both assets are derived from src/assets/img/logo.png by
  scripts/build-brand-assets.mjs. The master is 8462x2555 (~350kB), which is
  far more than a 40px navbar needs — these are quantised to 960w / 512² and
  land at ~20kB and ~52kB.

  Intrinsic width/height are declared so the browser reserves the right box
  before the image decodes; without them the navbar reflows on first paint.

  `brand-logo` carries a brightness lift under the dark theme. The wordmark's
  own blue (#134E90) sits at roughly 2.2:1 on near-black, so the untouched
  artwork is close to illegible there.
*/

const LOCKUP = { w: 960, h: 270 }

/** Square sprinter mark, no wordmark. For tight spots and square containers. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={markSrc}
      width={512}
      height={512}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={cn('brand-logo h-7 w-7 object-contain', className)}
    />
  )
}

/** Full horizontal lockup — sprinter plus BEGINTECH wordmark. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <img
      src={lockupSrc}
      width={LOCKUP.w}
      height={LOCKUP.h}
      alt="BeginTech"
      decoding="async"
      className={cn('brand-logo w-auto object-contain', className)}
    />
  )
}

export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn('group flex items-center', className)}
      aria-label="BeginTech — home"
      data-cursor="hover"
    >
      <LogoLockup className="h-9 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] md:h-10" />
    </Link>
  )
}
