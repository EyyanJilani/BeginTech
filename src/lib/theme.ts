export type Theme = 'light' | 'dark'

export const THEME_KEY = 'bt:theme'
export const DEFAULT_THEME: Theme = 'light'

const THEME_COLOR: Record<Theme, string> = {
  light: '#f6f7f9',
  dark: '#070a0f',
}

function read(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage blocked — fall through to the default */
  }
  return DEFAULT_THEME
}

/**
 * Tiny external store so every toggle on the page stays in sync without a
 * context provider wrapping the tree.
 *
 * The DOM is the source of truth: the inline script in index.html has already
 * stamped data-theme before first paint, so we read back from it rather than
 * re-deriving and risking a mismatch.
 */
let current: Theme =
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
    ? 'dark'
    : typeof document !== 'undefined'
      ? 'light'
      : DEFAULT_THEME

const listeners = new Set<() => void>()

export function getTheme(): Theme {
  return current
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setTheme(next: Theme) {
  if (next === current) return
  current = next
  document.documentElement.dataset.theme = next

  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    /* storage blocked — the choice simply will not persist */
  }

  const meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = THEME_COLOR[next]

  listeners.forEach((l) => l())
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

/** Initial value for the store, used only on the server-less first render. */
export function initialTheme(): Theme {
  return read()
}
