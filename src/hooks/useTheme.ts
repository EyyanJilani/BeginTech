import { useSyncExternalStore } from 'react'
import { getTheme, subscribeTheme, toggleTheme, setTheme, initialTheme } from '../lib/theme'
import type { Theme } from '../lib/theme'

/**
 * Subscribes to the theme store. Every mounted toggle re-renders together,
 * and any component that needs to branch on the theme (the WebGL scenes)
 * gets the same value.
 */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, getTheme, initialTheme)
  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' }
}
