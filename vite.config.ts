import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Vite defaults to 5173 and does not read PORT on its own, so a host that
  // assigns a free port has no way to hand it over. Honour PORT when set and
  // fall back to Vite's own default otherwise.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
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
