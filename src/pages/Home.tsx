import { Hero } from '../components/sections/Hero'
import { DiagonalRibbon } from '../components/sections/DiagonalRibbon'
import { Statement } from '../components/sections/Statement'
import { ServicesRows } from '../components/sections/ServicesRows'
import { FeaturedWork } from '../components/sections/FeaturedWork'
import { Process } from '../components/sections/Process'
import { TechEcosystem } from '../components/sections/TechEcosystem'
import { Testimonials } from '../components/sections/Testimonials'
import { CallToAction } from '../components/sections/CallToAction'
import { Stats } from '../components/sections/Stats'
import { Reveal } from '../components/ui/Reveal'
import { useSeo } from '../hooks/useSeo'

export default function Home() {
  useSeo({
    title: 'BeginTech — Website Design & Social Media Marketing Agency, Pakistan',
    description:
      'BeginTech is a Karachi-based website design and social media marketing agency serving clients across Pakistan — websites, online stores and social media growth, built and run by one senior team.',
    path: '/',
  })

  return (
    <>
      <Hero />
      <Statement />
      <ServicesRows />
      <DiagonalRibbon />
      <FeaturedWork />
      <Process />

      <section className="border-t border-line py-20 md:py-24" aria-label="Studio in numbers">
        <div className="shell">
          <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="eyebrow">By the numbers</p>
            <p className="max-w-sm text-sm text-mute">
              A decade of shipping, and the discipline that comes with maintaining what we ship.
            </p>
          </Reveal>
          <Stats />
        </div>
      </section>

      <TechEcosystem />
      <Testimonials />
      <CallToAction />
    </>
  )
}
