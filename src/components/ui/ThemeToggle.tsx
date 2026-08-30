import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/utils'

/**
 * Light/dark switch. The two icons are stacked and cross-faded rather than
 * swapped conditionally, so the control never changes size mid-transition and
 * the rotation reads as one continuous motion.
 */
export function ThemeToggle({
  className,
  variant = 'icon',
}: {
  className?: string
  variant?: 'icon' | 'row'
}) {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        className={cn(
          'flex w-full items-center justify-between rounded-full border border-line px-5 py-3.5 text-sm text-bone transition-colors duration-500',
          className,
        )}
      >
        <span>{isDark ? 'Dark' : 'Light'} theme</span>
        <span className="relative flex h-5 w-5 items-center justify-center text-accent">
          <Icons isDark={isDark} />
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-cursor="hover"
      className={cn(
        'relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition-colors duration-500 hover:border-line-strong hover:text-bone',
        className,
      )}
    >
      <Icons isDark={isDark} />
    </button>
  )
}

function Icons({ isDark }: { isDark: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-[1.05rem] w-[1.05rem]">
      <Sun
        className={cn(
          'absolute inset-0 h-full w-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <Moon
        className={cn(
          'absolute inset-0 h-full w-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0',
        )}
      />
    </span>
  )
}
