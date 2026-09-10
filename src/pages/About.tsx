import { PageHero } from '../components/sections/PageHero'
import { Stats } from '../components/sections/Stats'
import { Process } from '../components/sections/Process'
import { Testimonials } from '../components/sections/Testimonials'
import { CallToAction } from '../components/sections/CallToAction'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { TextReveal } from '../components/ui/TextReveal'
import { ProjectVisual } from '../components/ui/ProjectVisual'
import { principles, site } from '../data/site'
import { brand, brandOnDark } from '../data/brand'
import { useSeo } from '../hooks/useSeo'

const disciplines = [
  {
    title: 'Strategy',
    body: 'Positioning, product definition and the commercial case. We start by agreeing what would count as success.',
  },
  {
    title: 'Design',
    body: 'Research, interaction design and design systems. Craft that can be measured, not only admired.',
  },
  {
    title: 'Engineering',
    body: 'Web, mobile and backend built by senior engineers who will still be reachable next year.',
  },
  {
    title: 'Applied AI',
    body: 'Retrieval, agents and automation, with the evaluation infrastructure that keeps them honest.',
  },
  {
    title: 'Commerce',
    body: 'Headless storefronts and checkout work where craft and conversion are the same conversation.',
  },
  {
    title: 'Growth',
    body: 'Search, media and lifecycle programmes measured against pipeline rather than impressions.',
  },
]

/*
  Grounded in the real portfolio (data/projects.ts) rather than an invented
  growth story — each entry corresponds to work that actually shipped that
  year, not a headcount or an office nobody can check.
*/
const timeline = [
  {
    year: '2016',
    title: 'Founded in Karachi',
    body: 'Started with a small senior team and a preference for finishing things properly over taking on more than we could do well.',
  },
  {
    year: '2024',
    title: 'First US client',
    body: 'Cake Craft, a Texas manufacturer of cake-decorating supplies, became the studio’s first storefront built for a US-based brand.',
  },
  {
    year: '2025',
    title: 'Work expands to Australia',
    body: 'Insight Electrical and Backflow Testing Co brought the studio into trade-services sites for Melbourne and Brisbane contractors.',
  },
  {
    year: '2026',
    title: 'Fashion and French-market builds',
    body: 'Siyaab Lawn Hub and Dip’N Eat extended the work into fashion e-commerce and a fully French-language storefront.',
  },
]

export default function About() {
  useSeo({
    title: 'About — BeginTech',
    description:
      'BeginTech is a senior team of strategists, designers and engineers based in Karachi, Pakistan. We design, build and transform digital products for clients worldwide.',
    path: '/about',
  })

  return (
    <>
      <PageHero
        eyebrow="About the studio"
        title={
          <>
            We design. We build.
            <br />
            We <span className="accent-em">transform.</span>
          </>
        }
        lede="BeginTech is a software house and creative technology studio based in Karachi. We combine strategy, design, engineering, AI and growth in one senior team — small enough to stay accountable, deep enough to ship serious systems."
        meta={[
          { label: 'Founded', value: String(site.founded) },
          { label: 'Studio', value: 'Karachi, Pakistan' },
          { label: 'Team', value: 'Small & senior' },
          { label: 'Clients', value: 'Local to global' },
        ]}
      />

      {/* Who we are */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="who-heading">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-line-strong" />
                <span className="eyebrow">Who we are</span>
              </Reveal>
              <TextReveal as="h2" className="display-md text-bone" mode="lines">
                <span id="who-heading">
                  A studio built around the work, not around the org chart.
                </span>
              </TextReveal>
            </div>

            <div className="space-y-7 lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="lede">
                  We started in Karachi in 2016 because the choice on the table was unappealing: agencies that
                  designed beautifully and could not build, or development shops that built quickly
                  and had no opinion about what they were building.
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="text-[0.9375rem] leading-relaxed text-mute">
                  Ten years later the studio is still deliberately small. The structure has not
                  changed: a small senior team per engagement, the person who scoped the work still
                  in the room when it ships, and no layer of account management between you and the
                  people building your product.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-[0.9375rem] leading-relaxed text-mute">
                  We take on a limited number of clients at a time. That is a commercial constraint
                  we accept deliberately — it is the only way we know to keep the quality bar where
                  we want it, and to say the honest thing when a brief needs rethinking rather than
                  building.
                </p>
              </Reveal>

              <Reveal delay={0.16} className="pt-4">
                <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
                  {disciplines.map((d) => (
                    <li key={d.title} className="bg-ink p-6">
                      <h3 className="font-display text-base tracking-tight text-bone">{d.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mute-dim">{d.body}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-t border-line py-20 md:py-24" aria-label="Studio in numbers">
        <div className="shell">
          <Reveal className="mb-10">
            <p className="eyebrow">Ten years, measured</p>
          </Reveal>
          <Stats />
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="principles-heading">
        <div className="shell">
          <SectionHeading
            eyebrow="Principles"
            title={<span id="principles-heading">Four things we do not compromise on</span>}
            description="Every studio has values on a wall. These are the four that have actually cost us work — which is how we know they are real."
          />

          <div className="mt-14 grid gap-px border border-line bg-line md:mt-20 md:grid-cols-2">
            {principles.map((p) => (
              <Reveal key={p.index} className="group bg-ink p-8 lg:p-12">
                <div className="flex items-start justify-between gap-6">
                  <span className="font-display text-[0.6875rem] tabular-nums text-accent">
                    {p.index}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px w-12 origin-right bg-line-strong transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-150"
                  />
                </div>
                <h3 className="mt-8 font-display text-2xl tracking-tight text-bone">{p.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="timeline-heading">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeading
                  eyebrow="Trajectory"
                  align="left"
                  title={<span id="timeline-heading">How we got here</span>}
                />
                <div className="mt-10 aspect-4/3 overflow-hidden rounded-lg border border-line">
                  <ProjectVisual
                    art={{ pattern: 'orbit', from: brand.purple, to: '#0A0C12', ink: brandOnDark.blue }}
                    label="BeginTech studio, Karachi"
                  />
                </div>
              </div>
            </div>

            <ol className="lg:col-span-7 lg:col-start-6">
              {timeline.map((item) => (
                <li key={item.year}>
                  <Reveal className="grid grid-cols-[4.5rem_1fr] gap-6 border-t border-line py-8 md:grid-cols-[7rem_1fr]">
                    <span className="font-display text-sm tabular-nums text-accent">{item.year}</span>
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-bone">{item.title}</h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-mute">{item.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Process />
      <Testimonials />
      <CallToAction />
    </>
  )
}
