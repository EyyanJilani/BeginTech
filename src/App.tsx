import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ScrollTrigger } from './lib/gsap'
import { Navbar } from './components/navbar/Navbar'
import { Footer } from './components/footer/Footer'
import { Cursor } from './components/ui/Cursor'
import { Noise } from './components/ui/Noise'
import { Loader } from './components/layout/Loader'
import { shouldShowIntro } from './components/layout/intro'
import { PageTransition } from './components/layout/PageTransition'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Home from './pages/Home'

/* Home ships in the initial bundle; every other route is split. */
const About = lazy(() => import('./pages/About'))
const Work = lazy(() => import('./pages/Work'))
const WorkDetail = lazy(() => import('./pages/WorkDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const ServicePage = lazy(() => import('./pages/services/ServicePage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-[bt-spin-slow_1s_linear_infinite] rounded-full border border-line border-t-accent"
      />
    </div>
  )
}

export default function App() {
  const [intro, setIntro] = useState(shouldShowIntro)

  useSmoothScroll()

  /* Layout settles after fonts land — otherwise every trigger is measured
     against fallback metrics and fires early. */
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const finishIntro = useCallback(() => {
    setIntro(false)
    ScrollTrigger.refresh()
  }, [])

  return (
    <>
      <Cursor />
      <Noise />
      {intro && <Loader onDone={finishIntro} />}

      <Navbar />

      <main id="main">
        <PageTransition>
          {(location) => (
            <Suspense fallback={<RouteFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<WorkDetail />} />
                <Route path="/services/:slug" element={<ServicePage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          )}
        </PageTransition>
      </main>

      <Footer />
    </>
  )
}
