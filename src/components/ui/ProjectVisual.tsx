import { useId, useMemo } from 'react'
import type { ArtPattern } from '../../data/projects'
import { cn } from '../../lib/utils'

type Props = {
  art: { pattern: ArtPattern; from: string; to: string; ink: string }
  label: string
  className?: string
}

/**
 * Procedural project artwork.
 *
 * Portfolio imagery is generated as SVG rather than loaded from a stock host:
 * nothing can 404, nothing needs a CDN, every piece is art-directed from the
 * project's own palette, and the whole gallery costs a few kilobytes.
 */
export function ProjectVisual({ art, label, className }: Props) {
  const uid = useId().replace(/[:]/g, '')
  const { pattern, from, to, ink } = art

  const body = useMemo(() => renderPattern(pattern, ink, uid), [pattern, ink, uid])

  return (
    <svg
      className={cn('h-full w-full', className)}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${label} — abstract project artwork`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.68" cy="0.28" r="0.75">
          <stop offset="0" stopColor={ink} stopOpacity="0.34" />
          <stop offset="0.55" stopColor={ink} stopOpacity="0.07" />
          <stop offset="1" stopColor={ink} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`ink-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ink} stopOpacity="0.9" />
          <stop offset="1" stopColor={ink} stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`vig-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <rect width="1000" height="1000" fill={`url(#bg-${uid})`} />
      <rect width="1000" height="1000" fill={`url(#glow-${uid})`} />
      {body}
      <rect width="1000" height="1000" fill={`url(#vig-${uid})`} />
    </svg>
  )
}

function renderPattern(pattern: ArtPattern, ink: string, uid: string) {
  switch (pattern) {
    case 'grid':
      return <GridArt ink={ink} uid={uid} />
    case 'orbit':
      return <OrbitArt ink={ink} uid={uid} />
    case 'waves':
      return <WaveArt ink={ink} uid={uid} />
    case 'stack':
      return <StackArt ink={ink} />
    case 'mesh':
      return <MeshArt ink={ink} />
    case 'arc':
      return <ArcArt ink={ink} uid={uid} />
  }
}

/* ---------------------------------------------------------------- patterns */

function GridArt({ ink, uid }: { ink: string; uid: string }) {
  const cols = Array.from({ length: 13 }, (_, i) => 80 + i * 70)
  const rows = Array.from({ length: 13 }, (_, i) => 80 + i * 70)
  const bars = [0.42, 0.68, 0.31, 0.86, 0.55, 0.74, 0.38]
  return (
    <g>
      <g stroke="#ffffff" strokeOpacity="0.055" strokeWidth="1">
        {cols.map((x) => (
          <line key={`c${x}`} x1={x} y1="0" x2={x} y2="1000" />
        ))}
        {rows.map((y) => (
          <line key={`r${y}`} x1="0" y1={y} x2="1000" y2={y} />
        ))}
      </g>
      <g transform="translate(150 560)">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 100}
            y={-h * 380}
            width="46"
            height={h * 380}
            fill={`url(#ink-${uid})`}
            opacity={0.25 + i * 0.09}
          />
        ))}
      </g>
      <line x1="80" y1="560" x2="920" y2="560" stroke={ink} strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="780" cy="230" r="6" fill={ink} />
      <circle cx="780" cy="230" r="34" stroke={ink} strokeOpacity="0.3" fill="none" />
      <circle cx="780" cy="230" r="66" stroke={ink} strokeOpacity="0.12" fill="none" />
    </g>
  )
}

function OrbitArt({ ink, uid }: { ink: string; uid: string }) {
  const rings = [130, 200, 275, 355, 440]
  return (
    <g transform="translate(500 480)">
      <circle r="96" fill={`url(#glow-${uid})`} opacity="0.9" />
      <circle r="92" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="1.2" />
      <circle r="56" fill={ink} fillOpacity="0.1" stroke={ink} strokeOpacity="0.35" />
      {rings.map((r, i) => (
        <ellipse
          key={r}
          rx={r}
          ry={r * (0.32 + i * 0.07)}
          fill="none"
          stroke={ink}
          strokeOpacity={0.34 - i * 0.05}
          strokeWidth="1"
          transform={`rotate(${-24 + i * 11})`}
        />
      ))}
      {rings.map((r, i) => {
        const a = (i * 67 + 25) * (Math.PI / 180)
        return (
          <circle
            key={`d${r}`}
            cx={Math.cos(a) * r}
            cy={Math.sin(a) * r * (0.32 + i * 0.07)}
            r={4 - i * 0.4}
            fill={ink}
            fillOpacity={0.9 - i * 0.12}
          />
        )
      })}
    </g>
  )
}

function WaveArt({ ink, uid }: { ink: string; uid: string }) {
  const layers = Array.from({ length: 9 }, (_, i) => i)
  const path = (offset: number, amp: number) => {
    const pts: string[] = []
    for (let x = -50; x <= 1050; x += 25) {
      const y =
        offset +
        Math.sin((x / 1000) * Math.PI * 2.2 + offset / 90) * amp +
        Math.sin((x / 1000) * Math.PI * 5.1 + offset / 45) * (amp * 0.32)
      pts.push(`${x},${y.toFixed(1)}`)
    }
    return `M${pts.join(' L')}`
  }
  return (
    <g>
      {layers.map((i) => (
        <path
          key={i}
          d={path(240 + i * 62, 34 + i * 5)}
          fill="none"
          stroke={ink}
          strokeOpacity={0.5 - i * 0.045}
          strokeWidth={i === 0 ? 1.8 : 1}
        />
      ))}
      <rect x="0" y="0" width="1000" height="1000" fill={`url(#glow-${uid})`} opacity="0.5" />
      <circle cx="500" cy="240" r="5" fill={ink} />
    </g>
  )
}

function StackArt({ ink }: { ink: string }) {
  const cards = Array.from({ length: 6 }, (_, i) => i)
  return (
    <g transform="translate(500 500)">
      {cards.map((i) => {
        const k = cards.length - i
        return (
          <rect
            key={i}
            x={-300 + i * 16}
            y={-210 + i * 46}
            width="600"
            height="330"
            rx="10"
            fill="#ffffff"
            fillOpacity={0.018 * k}
            stroke={ink}
            strokeOpacity={0.4 - i * 0.055}
            strokeWidth="1"
            transform={`rotate(${-9 + i * 2.4})`}
          />
        )
      })}
      <g transform="rotate(-9)">
        <rect x="-300" y="-210" width="600" height="330" rx="10" fill="#000" fillOpacity="0.28" />
        <rect x="-262" y="-168" width="150" height="8" rx="4" fill={ink} fillOpacity="0.85" />
        <rect x="-262" y="-140" width="330" height="6" rx="3" fill="#fff" fillOpacity="0.18" />
        <rect x="-262" y="-118" width="270" height="6" rx="3" fill="#fff" fillOpacity="0.12" />
        <rect x="-262" y="-40" width="94" height="94" rx="8" fill={ink} fillOpacity="0.16" />
        <rect x="-152" y="-40" width="94" height="94" rx="8" fill="#fff" fillOpacity="0.06" />
        <rect x="-42" y="-40" width="94" height="94" rx="8" fill="#fff" fillOpacity="0.06" />
      </g>
    </g>
  )
}

function MeshArt({ ink }: { ink: string }) {
  // Deterministic pseudo-random lattice — stable across renders, no seeds to store.
  const nodes = useMemo(() => {
    const out: { x: number; y: number }[] = []
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const jitterX = Math.sin(r * 12.9898 + c * 78.233) * 46
        const jitterY = Math.cos(r * 39.425 + c * 11.135) * 46
        out.push({ x: 110 + c * 130 + jitterX, y: 110 + r * 130 + jitterY })
      }
    }
    return out
  }, [])

  const edges: [number, number][] = []
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const i = r * 7 + c
      if (c < 6) edges.push([i, i + 1])
      if (r < 6) edges.push([i, i + 7])
      if (r < 6 && c < 6 && (r + c) % 2 === 0) edges.push([i, i + 8])
    }
  }

  return (
    <g>
      <g stroke={ink} strokeWidth="1">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            strokeOpacity={0.07 + ((i * 37) % 11) * 0.018}
          />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 9 === 0 ? 5 : 2}
          fill={ink}
          fillOpacity={i % 9 === 0 ? 0.95 : 0.32}
        />
      ))}
    </g>
  )
}

function ArcArt({ ink, uid }: { ink: string; uid: string }) {
  const arcs = [200, 280, 360, 440, 520, 600, 680]
  return (
    <g>
      <g transform="translate(500 780)">
        {arcs.map((r, i) => (
          <path
            key={r}
            d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`}
            fill="none"
            stroke={ink}
            strokeOpacity={0.55 - i * 0.06}
            strokeWidth={i === 0 ? 2 : 1}
          />
        ))}
        <circle r="110" fill={`url(#ink-${uid})`} opacity="0.22" />
        <line x1="-700" y1="0" x2="700" y2="0" stroke="#fff" strokeOpacity="0.12" />
      </g>
      <g stroke="#fff" strokeOpacity="0.05">
        {[220, 380, 540].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} />
        ))}
      </g>
      <circle cx="500" cy="780" r="7" fill={ink} />
    </g>
  )
}
