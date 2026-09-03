import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import { ShardCore } from './ShardCore'
import { deviceTier } from '../../lib/utils'
import { useTheme } from '../../hooks/useTheme'

type Drive = { px: number; py: number; scroll: number }

/**
 * Hero WebGL stage. Lazy-loaded, pauses its render loop the moment the hero
 * leaves the viewport, and drops render quality on weaker hardware.
 */
export default function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const drive = useRef<Drive>({ px: 0, py: 0, scroll: 0 })
  const [tier] = useState(deviceTier)
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.01,
    })
    io.observe(el)

    const onPointer = (e: PointerEvent) => {
      drive.current.px = (e.clientX / window.innerWidth) * 2 - 1
      drive.current.py = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      drive.current.scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    }
    const onVisibility = () => setActive(!document.hidden)

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    onScroll()

    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="h-full w-full transition-opacity duration-1000 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={tier === 'high' ? [1, 1.75] : [1, 1.3]}
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        gl={{
          antialias: tier !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(0)
          setReady(true)
        }}
      >
        <ShardCore tier={tier} theme={theme} drive={drive} />
        <AdaptiveDpr pixelated={false} />
        <Preload all />
      </Canvas>
    </div>
  )
}
