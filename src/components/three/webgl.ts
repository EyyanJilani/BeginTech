let cached: boolean | null = null

/** Feature-detect WebGL2/WebGL once; the result gates every 3D import. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached
  if (typeof window === 'undefined') return (cached = false)
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    cached = Boolean(gl)
    // Release the probe context immediately — browsers cap simultaneous contexts.
    const lose = (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')
    lose?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
