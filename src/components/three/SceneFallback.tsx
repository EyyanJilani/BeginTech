import { cn } from '../../lib/utils'

/**
 * Pure-CSS stand-in for the WebGL hero. Shown when the GPU context is
 * unavailable, when the user asks for reduced motion, or while the 3D bundle
 * is still in flight — the page never waits on Three.js to look finished.
 */
export function SceneFallback({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 aspect-square w-[78%] max-w-[620px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_60%_35%,var(--color-accent-glow),transparent_62%)] blur-2xl" />
        <div className="absolute inset-[14%] rounded-full border border-bone/12" />
        <div className="absolute inset-[26%] rounded-full border border-bone/8" />
        <div className="absolute inset-[38%] rounded-full border border-accent/25" />
        <div className="absolute inset-[46%] rounded-full bg-[conic-gradient(from_140deg,var(--color-accent),transparent,var(--color-accent-glow),var(--color-accent))] opacity-70 blur-[2px]" />
        <div className="absolute inset-[52%] rounded-full bg-ink" />
        <div className="absolute inset-0 rounded-full border border-bone/8" />
      </div>
      <div className="absolute inset-0 grid-lines opacity-[0.35] mask-fade-b" />
    </div>
  )
}
