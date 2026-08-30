import { useLayoutEffect, useRef } from 'react'
import type { DependencyList, RefObject } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Scoped gsap.context() bound to a container ref.
 * Every tween/ScrollTrigger created inside is reverted on unmount, which is
 * what keeps route changes from leaking triggers in a React SPA.
 */
export function useGsapScope<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: { scope: T }) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const scope = ref.current
    if (!scope) return
    const ctx = gsap.context(() => setup({ scope }), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
