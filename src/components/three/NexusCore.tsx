import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

type Tier = 'low' | 'mid' | 'high'
type Theme = 'light' | 'dark'

/*
  The scene renders over a transparent canvas, so every colour has to be chosen
  against the page behind it. On paper the white wireframes would be invisible
  and the additive dust would wash out, so the light palette inverts the
  structure to ink and swaps the dust to normal blending.
*/
const PALETTE = {
  dark: {
    accent: '#7c8cff',
    structure: '#ffffff',
    structureOpacity: 0.09,
    shellOpacity: 0.16,
    ringOpacity: 0.22,
    dustOpacity: 0.7,
    dustBlending: THREE.AdditiveBlending,
    core: '#c9cfe8',
    glass: '#dfe3ff',
    fill: '#404860',
    ambient: 0.55,
    keyIntensity: 2.1,
    fillIntensity: 1.1,
    pointIntensity: 6,
    envIntensity: 1.4,
    /* Transmission refracts the scene render target. On ink that reads as deep
       glass; on paper it samples the transparent canvas and turns into a black
       blob that swallows the headline — so light gets polished metal instead. */
    useTransmission: true,
  },
  light: {
    accent: '#4b57e0',
    structure: '#0b0c0e',
    structureOpacity: 0.28,
    shellOpacity: 0.45,
    ringOpacity: 0.4,
    dustOpacity: 0.5,
    dustBlending: THREE.NormalBlending,
    /*
      A mirror is the wrong material on paper: reflecting the black env turns
      it into a heavy blob, reflecting a light env makes it vanish. Light uses
      a diffuse mid indigo instead — clearly an object against the page, and
      still ~5.5:1 behind the headline where the two overlap.
    */
    core: '#7d87bf',
    glass: '#c7cdf5',
    fill: '#ffffff',
    /* A diffuse surface blows out under the rig the glass core needed, so the
       light theme dims every lamp rather than only recolouring them. */
    ambient: 0.35,
    keyIntensity: 0.9,
    fillIntensity: 0.45,
    pointIntensity: 1.2,
    envIntensity: 0.6,
    useTransmission: false,
  },
} as const

/** Shared pointer/scroll state, lerped in one place so every layer stays in sync. */
type Drive = { px: number; py: number; scroll: number }

export function NexusCore({
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
  const shell = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)
  const dust = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  // Fit the object to narrow viewports without touching the camera.
  const fit = Math.min(1, viewport.width / 7.2)

  const particles = useMemo(() => buildParticles(tier === 'low' ? 420 : tier === 'mid' ? 900 : 1500), [tier])

  const smoothed = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const d = drive.current
    if (!d || !root.current) return

    const k = 1 - Math.pow(0.0015, delta) // frame-rate independent damping
    smoothed.current.x += (d.px - smoothed.current.x) * k
    smoothed.current.y += (d.py - smoothed.current.y) * k

    const t = state.clock.elapsedTime
    const s = d.scroll

    root.current.rotation.y = smoothed.current.x * 0.55 + t * 0.055 + s * 0.8
    root.current.rotation.x = -smoothed.current.y * 0.34 + Math.sin(t * 0.25) * 0.05
    root.current.position.y = Math.sin(t * 0.45) * 0.09 - s * 1.5
    root.current.position.x = smoothed.current.x * 0.35
    const scale = fit * (1 - s * 0.28)
    root.current.scale.setScalar(scale)

    if (shell.current) {
      shell.current.rotation.y = -t * 0.11 - smoothed.current.x * 0.2
      shell.current.rotation.z = t * 0.04
    }
    if (rings.current) {
      rings.current.rotation.z = t * 0.16
      rings.current.rotation.x = 0.42 + smoothed.current.y * 0.25
    }
    if (dust.current) {
      dust.current.rotation.y = t * 0.03
      dust.current.rotation.x = -t * 0.014
    }
  })

  return (
    <>
      <ambientLight intensity={p.ambient} />
      <directionalLight position={[4, 6, 5]} intensity={p.keyIntensity} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={p.fillIntensity} color={p.accent} />
      <pointLight position={[0, 0, 3]} intensity={p.pointIntensity} distance={9} color={p.accent} />

      {/* Procedural environment — no HDRI fetch, so nothing can 404 offline. */}
      <Environment resolution={tier === 'high' ? 256 : 128}>
        <Lightformer
          form="rect"
          intensity={theme === 'light' ? 5 : 3.2}
          position={[3, 4, 4]}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer form="rect" intensity={1.6} position={[-5, -1, 2]} scale={[6, 6, 1]} color={p.accent} />
        <Lightformer form="circle" intensity={2.4} position={[0, -5, -3]} scale={[5, 5, 1]} color={p.fill} />
      </Environment>

      <group ref={root}>
        {/* Core — refractive on capable GPUs, polished metal everywhere else. */}
        <mesh castShadow={false} receiveShadow={false}>
          <icosahedronGeometry args={[1.32, tier === 'low' ? 2 : 6]} />
          {tier === 'high' && p.useTransmission ? (
            <MeshTransmissionMaterial
              samples={4}
              resolution={256}
              thickness={1.15}
              roughness={0.08}
              anisotropy={0.4}
              chromaticAberration={0.32}
              distortion={0.28}
              distortionScale={0.4}
              temporalDistortion={0.08}
              ior={1.44}
              color={p.glass}
              backside={false}
            />
          ) : (
            <meshPhysicalMaterial
              color={p.core}
              metalness={theme === 'light' ? 0.2 : 0.86}
              roughness={theme === 'light' ? 0.3 : 0.14}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={p.envIntensity}
            />
          )}
        </mesh>

        {/* Inner emissive nucleus, visible through the refraction. */}
        <mesh scale={0.42}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={p.accent} transparent opacity={0.55} />
        </mesh>

        {/* Faceted wireframe shell */}
        <group ref={shell}>
          <mesh>
            <icosahedronGeometry args={[2.05, 1]} />
            <meshBasicMaterial
              color={p.structure}
              wireframe
              transparent
              opacity={p.structureOpacity}
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[2.62, 0]} />
            <meshBasicMaterial color={p.accent} wireframe transparent opacity={p.shellOpacity} />
          </mesh>
        </group>

        {/* Orbital rings */}
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.35, 0.006, 3, 128]} />
            <meshBasicMaterial color={p.accent} transparent opacity={0.65} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0.5, 0.3]}>
            <torusGeometry args={[2.95, 0.004, 3, 128]} />
            <meshBasicMaterial color={p.structure} transparent opacity={p.ringOpacity} />
          </mesh>
        </group>

        {/* Dust field */}
        <points ref={dust}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.018}
            color={p.accent}
            transparent
            opacity={p.dustOpacity}
            sizeAttenuation
            depthWrite={false}
            blending={p.dustBlending}
          />
        </points>
      </group>
    </>
  )
}

/** Points distributed on a spherical shell with jittered radius. */
function buildParticles(count: number) {
  const arr = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radiusAt = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const r = 3.1 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 1.9
    arr[i * 3] = Math.cos(theta) * radiusAt * r
    arr[i * 3 + 1] = y * r * 0.85
    arr[i * 3 + 2] = Math.sin(theta) * radiusAt * r
  }
  return arr
}
