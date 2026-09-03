import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { brand, brandOnDark } from '../../data/brand'

type Tier = 'low' | 'mid' | 'high'
type Theme = 'light' | 'dark'

/** Shared pointer/scroll state, lerped in one place so every layer stays in sync. */
type Drive = { px: number; py: number; scroll: number }

/*
  The identity is a sprinter built out of fragmented shards with a trail of
  splinters behind it. So the hero is a kinetic shard field rather than a
  generic glass orb: a few hundred flat-faceted slivers in the brand hues,
  tumbling inside a slow orbital drift.

  Materials are flat-shaded on purpose — the logo artwork is flat vector
  facets, and smooth shading would read as plastic instead.
*/

const COUNT: Record<Tier, number> = { low: 90, mid: 170, high: 260 }

/** Hue mix roughly matching the logo: blue leads, magenta answers. */
const MIX: [keyof typeof brand, number][] = [
  ['blue', 0.5],
  ['magenta', 0.24],
  ['purple', 0.14],
  ['green', 0.12],
]

/*
  Intensities are deliberately low. The renderer tone-maps with ACES, which
  desaturates anything it pushes into the highlights — an over-lit flat-shaded
  material turns the brand hues into pastel. Just enough light to separate the
  facets, no more.
*/
const PALETTE = {
  light: {
    ambient: 0.42,
    key: 0.85,
    rim: 0.3,
    ring: brand.blue,
    ringOpacity: 0.3,
    dust: brand.blue,
    dustOpacity: 0.35,
  },
  dark: {
    ambient: 0.45,
    key: 1.05,
    rim: 0.45,
    ring: brandOnDark.blue,
    ringOpacity: 0.38,
    dust: brandOnDark.blue,
    dustOpacity: 0.6,
  },
} as const

type Shard = {
  base: THREE.Vector3
  axis: THREE.Vector3
  spin: number
  scale: THREE.Vector3
  phase: number
  drift: THREE.Vector3
}

/** Deterministic pseudo-random so the composition is identical every load. */
function rand(i: number, salt: number) {
  return (Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1
}

function buildShards(count: number): Shard[] {
  const out: Shard[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    // Fibonacci shell keeps the cloud evenly covered with no clumping, then a
    // jittered radius gives it depth instead of a hard sphere surface.
    const y = 1 - (i / (count - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i

    // Radius is skewed inward with a power curve so the field has a dense
    // nucleus and thins into a spray, the way the logo's sprinter carries a
    // trail of splinters. A uniform radius just reads as confetti.
    const t = Math.pow(Math.abs(rand(i, 1)), 1.7)
    const r = 1.05 + t * 2.75

    // Forward lean along +x and a slight rise, so it reads as motion rather
    // than an explosion.
    const base = new THREE.Vector3(
      Math.cos(theta) * ring * r * 1.2 + t * 0.5,
      y * r * 0.9 + t * 0.25,
      Math.sin(theta) * ring * r,
    )

    const long = 0.5 + Math.abs(rand(i, 5)) * 1.5
    // Bigger near the core, finer at the edges — gives the cloud depth.
    const s = (0.08 + Math.abs(rand(i, 2)) * 0.085) * (1.3 - t * 0.62)

    out.push({
      base,
      axis: new THREE.Vector3(rand(i, 3), rand(i, 4), rand(i, 6)).normalize(),
      spin: 0.18 + Math.abs(rand(i, 7)) * 0.5,
      scale: new THREE.Vector3(s, s * 0.45, s * (1 + long)),
      phase: Math.abs(rand(i, 8)) * Math.PI * 2,
      drift: new THREE.Vector3(rand(i, 9), rand(i, 10), rand(i, 11)).multiplyScalar(0.22),
    })
  }
  return out
}

export function ShardCore({
  tier,
  theme,
  drive,
}: {
  tier: Tier
  theme: Theme
  drive: React.RefObject<Drive>
}) {
  const p = PALETTE[theme]
  const root = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const rings = useRef<THREE.Group>(null)
  const dust = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const count = COUNT[tier]
  const shards = useMemo(() => buildShards(count), [count])
  const dustPositions = useMemo(() => buildDust(tier === 'low' ? 160 : 340), [tier])

  // Fit to narrow viewports without moving the camera.
  const fit = Math.min(1, viewport.width / 7.6)

  /* Per-instance colour is written once — only the matrices change per frame. */
  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const source = theme === 'dark' ? brandOnDark : brand
    const colour = new THREE.Color()

    for (let i = 0; i < count; i++) {
      let pick = Math.abs(rand(i, 21))
      let key: keyof typeof brand = 'blue'
      for (const [name, weight] of MIX) {
        if (pick < weight) {
          key = name
          break
        }
        pick -= weight
      }
      colour.set(source[key])
      m.setColorAt(i, colour)
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [count, theme])

  const smoothed = useRef({ x: 0, y: 0 })
  const scratch = useMemo(
    () => ({
      matrix: new THREE.Matrix4(),
      quat: new THREE.Quaternion(),
      pos: new THREE.Vector3(),
    }),
    [],
  )

  useFrame((state, delta) => {
    const d = drive.current
    const m = mesh.current
    if (!d || !root.current || !m) return

    const k = 1 - Math.pow(0.0018, delta) // frame-rate independent damping
    smoothed.current.x += (d.px - smoothed.current.x) * k
    smoothed.current.y += (d.py - smoothed.current.y) * k

    const t = state.clock.elapsedTime
    const s = d.scroll

    root.current.rotation.y = smoothed.current.x * 0.5 + t * 0.075 + s * 0.7
    root.current.rotation.x = -smoothed.current.y * 0.3 + Math.sin(t * 0.22) * 0.06
    root.current.position.y = Math.sin(t * 0.4) * 0.1 - s * 1.5
    root.current.position.x = smoothed.current.x * 0.3
    root.current.scale.setScalar(fit * (1 - s * 0.26))

    for (let i = 0; i < count; i++) {
      const sh = shards[i]
      const wobble = Math.sin(t * 0.5 + sh.phase)
      scratch.pos
        .copy(sh.base)
        .addScaledVector(sh.drift, wobble)
        // Gentle breathing so the cloud never feels frozen.
        .multiplyScalar(1 + Math.sin(t * 0.3 + sh.phase) * 0.035)
      scratch.quat.setFromAxisAngle(sh.axis, t * sh.spin + sh.phase)
      scratch.matrix.compose(scratch.pos, scratch.quat, sh.scale)
      m.setMatrixAt(i, scratch.matrix)
    }
    m.instanceMatrix.needsUpdate = true

    if (rings.current) {
      rings.current.rotation.z = t * 0.12
      rings.current.rotation.x = 0.5 + smoothed.current.y * 0.22
    }
    if (dust.current) {
      dust.current.rotation.y = -t * 0.025
    }
  })

  return (
    <>
      <ambientLight intensity={p.ambient} />
      <directionalLight position={[4, 6, 6]} intensity={p.key} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={p.rim} color={p.ring} />

      <group ref={root}>
        <instancedMesh
          ref={mesh}
          args={[undefined, undefined, count]}
          frustumCulled={false}
          castShadow={false}
          receiveShadow={false}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial flatShading roughness={0.5} metalness={0.08} />
        </instancedMesh>

        {/* Two hairline orbits give the cloud a centre to read against. */}
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.05, 0.0055, 3, 128]} />
            <meshBasicMaterial color={p.ring} transparent opacity={p.ringOpacity} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0.55, 0.3]}>
            <torusGeometry args={[3.7, 0.004, 3, 128]} />
            <meshBasicMaterial color={p.ring} transparent opacity={p.ringOpacity * 0.6} />
          </mesh>
        </group>

        <points ref={dust}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color={p.dust}
            transparent
            opacity={p.dustOpacity}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      </group>
    </>
  )
}

function buildDust(count: number) {
  const arr = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const ring = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const r = 4.2 + Math.abs(rand(i, 31)) * 1.8
    arr[i * 3] = Math.cos(theta) * ring * r
    arr[i * 3 + 1] = y * r * 0.8
    arr[i * 3 + 2] = Math.sin(theta) * ring * r
  }
  return arr
}
