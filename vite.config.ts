import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    target: 'es2020',
    cssMinify: 'lightningcss',
    // The `three` chunk is intentionally large. It is never part of the entry
    // graph — it loads only when the browser reports WebGL, the user has not
    // requested reduced motion, and the main thread is idle.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Keep the heavy visual libraries out of the entry chunk so the
        // first paint never waits on WebGL or the animation engine.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'three'
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('react-router')) return 'router'
          }
          return undefined
        },
      },
    },
  },
})
