import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from './lib/gsap'
import { Navbar } from './components/navbar/Navbar'
import { Footer } from './components/footer/Footer'
import { Cursor } from './components/ui/Cursor'
import { Noise } from './components/ui/Noise'
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
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'))
const BlogPost = lazy(() => import('./pages/blog/BlogPost'))
/* The admin is a separate shell (no marketing chrome) in its own chunk, so
   visitors never download it. */
const AdminApp = lazy(() => import('./admin/AdminApp'))

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
  useSmoothScroll()
  const isAdmin = useLocation().pathname.startsWith('/admin')

  /* Layout settles after fonts land, otherwise every trigger is measured
     against fallback metrics and fires early. */
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  if (isAdmin) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <>
      <Cursor />
      <Noise />

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
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
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
