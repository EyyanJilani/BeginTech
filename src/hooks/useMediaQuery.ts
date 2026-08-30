import { useEffect, useState } from 'react'

export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
