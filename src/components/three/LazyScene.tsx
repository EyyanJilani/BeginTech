import { Suspense, lazy, useEffect, useState } from 'react'
import { SceneFallback } from './SceneFallback'
import { hasWebGL } from './webgl'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { prefersReducedMotion } from '../../lib/utils'

const HeroCanvas = lazy(() => import('./HeroCanvas'))
const FieldCanvas = lazy(() => import('./FieldCanvas'))

type Props = { variant?: 'hero' | 'field'; className?: string }

/**
 * Gate for every 3D surface on the site.
 *
 * The Three.js bundle is only requested when the browser can render it, the
 * user has not asked for reduced motion, and the browser is idle — so the
 * first paint never competes with a 600kb WebGL download.
 */
export function LazyScene({ variant = 'hero', className }: Props) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL()) return

    let cancelled = false
    const start = () => !cancelled && setEnabled(true)

    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback
    const id = ric ? ric(start, { timeout: 1200 }) : window.setTimeout(start, 350)

    return () => {
      cancelled = true
      if (!ric) window.clearTimeout(id)
    }
  }, [])

  if (!enabled) return <SceneFallback className={className} />

  return (
    <ErrorBoundary label="WebGL" fallback={<SceneFallback className={className} />}>
      <Suspense fallback={<SceneFallback className={className} />}>
        {variant === 'hero' ? <HeroCanvas /> : <FieldCanvas />}
      </Suspense>
    </ErrorBoundary>
  )
}
