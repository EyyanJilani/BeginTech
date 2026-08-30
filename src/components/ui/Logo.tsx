import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/**
 * Wordmark + monogram. The mark is a "B" cut from a square — drawn as a single
 * even-odd path so the counters stay crisp at favicon scale, and it inherits
 * currentColor so it works in both themes without a variant.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-7 w-7', className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7.25" stroke="currentColor" strokeOpacity="0.28" />
      <path
        d="M9 9H16.2A3.2 3.2 0 0 1 16.2 15.4H16.8A3.8 3.8 0 0 1 16.8 23H9ZM12 11.2H16.4A1 1 0 0 1 16.4 13.2H12ZM12 17.6H16.9A1.6 1.6 0 0 1 16.9 20.8H12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <circle cx="23" cy="9" r="2" className="fill-accent" />
    </svg>
  )
}

export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn('group flex items-center gap-2.5 text-bone', className)}
      aria-label="BeginTech — home"
      data-cursor="hover"
    >
      <LogoMark className="h-7 w-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[8deg]" />
      <span className="font-display text-[0.95rem] font-semibold tracking-[0.18em]">BEGINTECH</span>
    </Link>
  )
}
