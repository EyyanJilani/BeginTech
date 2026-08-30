import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { deviceTier } from '../../lib/utils'
import { useTheme } from '../../hooks/useTheme'

const ACCENT = { dark: new THREE.Color('#7c8cff'), light: new THREE.Color('#4b57e0') }

type Theme = 'light' | 'dark'

/**
 * Ambient WebGL backdrop for the closing CTA — a slow wave lattice.
 * Deliberately cheap: one buffer geometry, no lights, no post-processing.
 */
function WaveLattice({ tier, theme }: { tier: 'low' | 'mid' | 'high'; theme: Theme }) {
  const mesh = useRef<THREE.Points>(null)
  const cols = tier === 'low' ? 46 : tier === 'mid' ? 70 : 94
  const rows = tier === 'low' ? 26 : tier === 'mid' ? 40 : 54

  const { positions, base } = useMemo(() => {
    const arr = new Float32Array(cols * rows * 3)
    let i = 0
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        arr[i++] = (x / (cols - 1) - 0.5) * 22
        arr[i++] = 0
        arr[i++] = (z / (rows - 1) - 0.5) * 13
      }
    }
    return { positions: arr, base: arr.slice() }
  }, [cols, rows])

  useFrame((state) => {
    const geo = mesh.current?.geometry
    if (!geo) return
    const attr = geo.getAttribute('position') as THREE.BufferAttribute
    const t = state.clock.elapsedTime * 0.42
    const a = attr.array as Float32Array
    for (let i = 0; i < a.length; i += 3) {
      const x = base[i]
      const z = base[i + 2]
      a[i + 1] =
        Math.sin(x * 0.32 + t) * 0.5 +
        Math.cos(z * 0.42 - t * 0.8) * 0.38 +
        Math.sin((x + z) * 0.18 + t * 0.5) * 0.3
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={mesh} rotation={[-0.62, 0, 0]} position={[0, -1.1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={ACCENT[theme]}
        transparent
        opacity={theme === 'dark' ? 0.75 : 0.55}
        sizeAttenuation
        depthWrite={false}
        // Additive light on ink; normal blending so the lattice stays visible on paper.
        blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  )
}

export default function FieldCanvas() {
  const [tier] = useState(deviceTier)
  const [active, setActive] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.4]}
        camera={{ position: [0, 1.6, 7], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <WaveLattice tier={tier} theme={theme} />
      </Canvas>
    </div>
  )
}
