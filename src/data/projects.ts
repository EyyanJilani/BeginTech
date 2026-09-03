import { brandOnDark } from './brand'

export type ProjectCategory = 'Web' | 'Mobile' | 'SaaS' | 'Branding' | 'AI'

export type ArtPattern = 'orbit' | 'grid' | 'waves' | 'stack' | 'mesh' | 'arc'

export type Project = {
  slug: string
  name: string
  category: ProjectCategory
  discipline: string
  year: string
  client: string
  sector: string
  headline: string
  summary: string
  challenge: string
  approach: string
  outcome: { value: string; label: string }[]
  services: string[]
  stack: string[]
  /** Procedural artwork config — keeps the portfolio asset-free and unbreakable. */
  art: { pattern: ArtPattern; from: string; to: string; ink: string }
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'finova',
    name: 'Finova',
    category: 'SaaS',
    discipline: 'FinTech Platform',
    year: '2025',
    client: 'Finova Group',
    sector: 'Financial infrastructure',
    headline: 'A treasury platform that made a 40-tab spreadsheet obsolete.',
    summary:
      'Multi-entity cash management for finance teams operating across fourteen currencies and six banking partners.',
    challenge:
      'Finova had product-market fit and an interface their own team avoided. Onboarding took nine days of manual configuration, and the reconciliation view — the reason customers bought — was the slowest screen in the product.',
    approach:
      'We rebuilt the data layer around a normalised ledger, replaced the reconciliation grid with a virtualised view that renders 200,000 rows without a spinner, and designed a guided onboarding that provisions entities and bank connections in a single session.',
    outcome: [
      { value: '9d → 40m', label: 'Time to onboard' },
      { value: '3.2×', label: 'Weekly active accounts' },
      { value: '61%', label: 'Fewer support tickets' },
    ],
    services: ['Product Design', 'Platform Engineering', 'Design System'],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    art: { pattern: 'grid', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
    featured: true,
  },
  {
    slug: 'velo',
    name: 'Velo',
    category: 'Mobile',
    discipline: 'Mobility App',
    year: '2025',
    client: 'Velo Mobility',
    sector: 'Urban transport',
    headline: 'Door-to-door journeys across every operator in the city.',
    summary:
      'One app for bikes, scooters, rail and ride-hail, with a booking flow that holds together underground.',
    challenge:
      'Riders were switching between four apps to complete a single journey, and every operator exposed a different, occasionally unavailable API. Coverage gaps in transit tunnels broke bookings mid-flow.',
    approach:
      'An offline-first architecture queues intent locally and settles when connectivity returns. A unified operator abstraction degrades gracefully when a provider drops, and the map renders vector tiles cached on device.',
    outcome: [
      { value: '4.8★', label: 'App Store rating' },
      { value: '180k', label: 'Journeys in month one' },
      { value: '1.4s', label: 'Cold start, mid-tier Android' },
    ],
    services: ['UX Research', 'Mobile Engineering', 'Design System'],
    stack: ['React Native', 'Expo', 'Kotlin', 'GraphQL', 'Mapbox'],
    art: { pattern: 'waves', from: '#0f2416', to: '#07120b', ink: brandOnDark.green },
    featured: true,
  },
  {
    slug: 'orbital',
    name: 'Orbital',
    category: 'AI',
    discipline: 'AI Knowledge Platform',
    year: '2026',
    client: 'Orbital Intelligence',
    sector: 'Enterprise AI',
    headline: 'Answers with citations, over twelve years of internal documents.',
    summary:
      'A retrieval platform that lets 4,000 engineers query the entire corpus of a manufacturing group — and trust what comes back.',
    challenge:
      'The pilot answered fluently and wrongly. Without an evaluation set there was no way to tell a regression from a bad day, and legal would not approve a system that could not show its sources.',
    approach:
      'We built a golden dataset with domain experts, moved to hybrid retrieval with reranking, and made every claim traceable to a source span. A regression suite runs on each model change, with cost and latency tracked per query class.',
    outcome: [
      { value: '94%', label: 'Answer accuracy on eval set' },
      { value: '100%', label: 'Responses source-attributed' },
      { value: '−58%', label: 'Inference cost per query' },
    ],
    services: ['AI Engineering', 'Evaluation Infrastructure', 'Product Design'],
    stack: ['Python', 'Claude', 'pgvector', 'PostgreSQL', 'LangGraph', 'Modal'],
    art: { pattern: 'orbit', from: '#1d1030', to: '#0d0718', ink: brandOnDark.purple },
    featured: true,
  },
  {
    slug: 'maison',
    name: 'Maison Levant',
    category: 'Web',
    discipline: 'Luxury E-Commerce',
    year: '2025',
    client: 'Maison Levant',
    sector: 'Luxury goods',
    headline: 'A storefront that reads like the atelier it represents.',
    summary:
      'Headless commerce for a fourth-generation leather house, built for editorial merchandising and instant navigation.',
    challenge:
      'A heritage brand with a storefront that loaded in six seconds and photographed its products beautifully in a template that flattened them. Mobile conversion was a third of desktop.',
    approach:
      'Editorial collection pages art-directed per season, product imagery served responsively at four densities, and an edge-rendered front-end where navigation is effectively instant. Checkout rebuilt against funnel data rather than assumption.',
    outcome: [
      { value: '+87%', label: 'Mobile conversion' },
      { value: '0.6s', label: 'Largest contentful paint' },
      { value: '+34%', label: 'Average order value' },
    ],
    services: ['Art Direction', 'Headless Commerce', 'Performance'],
    stack: ['Next.js', 'Shopify Hydrogen', 'Sanity', 'Stripe', 'Vercel'],
    art: { pattern: 'arc', from: '#2b2408', to: '#141105', ink: brandOnDark.yellow },
    featured: true,
  },
  {
    slug: 'nexus',
    name: 'Nexus Grid',
    category: 'SaaS',
    discipline: 'Enterprise Operations',
    year: '2024',
    client: 'Nexus Energy',
    sector: 'Energy & utilities',
    headline: 'Grid operations in real time, for controllers who cannot look away.',
    summary:
      'A control-room dashboard streaming telemetry from 12,000 substations, designed to be read at a glance under pressure.',
    challenge:
      'Operators were monitoring six screens of legacy software. Critical alerts shared visual weight with routine ones, and the interface had never been tested in the low-light conditions of an actual control room.',
    approach:
      'We ran sessions in the room itself. Alert hierarchy was rebuilt around severity and time-to-act, colour was tuned for sustained low-light viewing, and the streaming layer was rewritten to hold 60fps with 12,000 live channels.',
    outcome: [
      { value: '−72%', label: 'Mean time to acknowledge' },
      { value: '12k', label: 'Live telemetry channels' },
      { value: '6 → 2', label: 'Screens per operator' },
    ],
    services: ['UX Research', 'Data Visualisation', 'Platform Engineering'],
    stack: ['React', 'WebGL', 'TypeScript', '.NET', 'TimescaleDB', 'Kubernetes'],
    art: { pattern: 'mesh', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
    featured: true,
  },
  {
    slug: 'lumina',
    name: 'Lumina',
    category: 'Branding',
    discipline: 'Identity & Digital Product',
    year: '2024',
    client: 'Lumina Health',
    sector: 'Digital health',
    headline: 'An identity for a health company that refused to look like one.',
    summary:
      'Positioning, identity system and product design for a preventative health platform entering three new markets.',
    challenge:
      'Lumina looked like every other wellness startup — soft gradients, rounded everything, no position anyone could repeat. Their clinical rigour was the differentiator and nothing on screen said so.',
    approach:
      'We rebuilt the positioning around evidence, then designed an identity with the precision of medical documentation and the warmth of a good clinic: a bespoke type scale, a restrained palette, and motion that never overstates a result.',
    outcome: [
      { value: '3', label: 'Markets launched' },
      { value: '+41%', label: 'Brand recall, tested' },
      { value: '2.1×', label: 'Trial-to-paid conversion' },
    ],
    services: ['Positioning', 'Identity System', 'Product Design'],
    stack: ['Figma', 'After Effects', 'React', 'Design Tokens'],
    art: { pattern: 'stack', from: '#0f2416', to: '#07120b', ink: brandOnDark.green },
    featured: true,
  },
  {
    slug: 'atlas-freight',
    name: 'Atlas Freight',
    category: 'Web',
    discipline: 'Logistics Platform',
    year: '2024',
    client: 'Atlas Freight',
    sector: 'Logistics',
    headline: 'Quote to booking in ninety seconds, across three continents.',
    summary:
      'A customer portal replacing an email-and-PDF quoting process for a mid-market freight forwarder.',
    challenge:
      'Every quote took two days and travelled through four inboxes. Customers had no visibility after booking, and the operations team spent most of its day answering "where is my container".',
    approach:
      'We modelled the rate engine first, exposed it through a portal that quotes instantly, and connected carrier tracking so status updates arrive without anyone being asked.',
    outcome: [
      { value: '2d → 90s', label: 'Quote turnaround' },
      { value: '−64%', label: 'Status enquiries' },
      { value: '+29%', label: 'Quote-to-booking rate' },
    ],
    services: ['Product Design', 'Platform Engineering', 'Integrations'],
    stack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    art: { pattern: 'grid', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
    featured: false,
  },
  {
    slug: 'kite',
    name: 'Kite',
    category: 'Mobile',
    discipline: 'Consumer Finance App',
    year: '2026',
    client: 'Kite Financial',
    sector: 'Consumer fintech',
    headline: 'Saving that works for people paid irregularly.',
    summary:
      'A savings app for freelancers, built around variable income rather than a fixed monthly salary.',
    challenge:
      'Every product in the category assumed a predictable pay date. For seven million self-employed users in the launch market, that assumption made the core feature unusable.',
    approach:
      'We designed around income events instead of calendar months, with rules that adapt to cash-flow shape, and an onboarding that reads bank history to propose a plan rather than asking users to invent one.',
    outcome: [
      { value: '68%', label: 'Day-30 retention' },
      { value: '£210', label: 'Median monthly saved' },
      { value: '4.7★', label: 'Store rating' },
    ],
    services: ['UX Research', 'Mobile Engineering', 'Brand Extension'],
    stack: ['React Native', 'Swift', 'TypeScript', 'Supabase', 'Plaid'],
    art: { pattern: 'arc', from: '#2b1122', to: '#150810', ink: brandOnDark.magenta },
    featured: false,
  },
  {
    slug: 'sonder',
    name: 'Sonder',
    category: 'AI',
    discipline: 'AI Support Automation',
    year: '2025',
    client: 'Sonder Retail Group',
    sector: 'Retail operations',
    headline: 'Support triage that knows when to stop and ask a human.',
    summary:
      'An automation layer resolving routine retail support at volume, with hard stops on anything touching money.',
    challenge:
      'Seasonal ticket volume swung 400% and the team hired against the peak all year. Earlier automation attempts had refunded orders they should not have.',
    approach:
      'Intent classification with calibrated confidence, full resolution only for reversible actions, and an explicit escalation path everywhere else. Every automated resolution is sampled and scored weekly.',
    outcome: [
      { value: '71%', label: 'Tickets fully resolved' },
      { value: '0', label: 'Unauthorised refunds' },
      { value: '−4.5h', label: 'Median first response' },
    ],
    services: ['AI Engineering', 'Workflow Design', 'Integrations'],
    stack: ['Python', 'Claude', 'FastAPI', 'PostgreSQL', 'Zendesk API'],
    art: { pattern: 'mesh', from: '#2b1122', to: '#150810', ink: brandOnDark.magenta },
    featured: false,
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    category: 'Branding',
    discipline: 'Identity System',
    year: '2024',
    client: 'Meridian Capital',
    sector: 'Investment',
    headline: 'An identity built to survive being set in twelve languages.',
    summary:
      'Brand system and digital presence for an investment firm operating across Europe, the Gulf and Southeast Asia.',
    challenge:
      'The existing wordmark broke in Arabic and Thai, and regional offices had each produced their own unofficial variant. Nothing was consistent except the disagreement.',
    approach:
      'A modular mark that works across scripts, a type system with vetted regional companions, and guidelines written as decisions rather than suggestions — with the assets to make the right choice the easy one.',
    outcome: [
      { value: '12', label: 'Languages supported' },
      { value: '9', label: 'Offices aligned' },
      { value: '1', label: 'Asset library' },
    ],
    services: ['Identity System', 'Type Direction', 'Web Design'],
    stack: ['Figma', 'Illustrator', 'Next.js', 'Sanity'],
    art: { pattern: 'stack', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
    featured: false,
  },
  {
    slug: 'northwind',
    name: 'Northwind',
    category: 'SaaS',
    discipline: 'Field Operations Suite',
    year: '2023',
    client: 'Northwind Services',
    sector: 'Field services',
    headline: 'Scheduling 900 engineers without a single phone call.',
    summary:
      'Dispatch, routing and job management for a national maintenance provider, usable in a van with one bar of signal.',
    challenge:
      'Dispatch ran on whiteboards and phone calls. Engineers arrived without parts, jobs were double-booked, and no one could answer how long anything actually took.',
    approach:
      'A constraint-based scheduler that accounts for skills, parts and travel, paired with an offline-capable mobile app where engineers capture work in under a minute.',
    outcome: [
      { value: '+22%', label: 'Jobs per engineer / week' },
      { value: '−38%', label: 'Travel distance' },
      { value: '900', label: 'Engineers on platform' },
    ],
    services: ['Platform Engineering', 'Mobile', 'Optimisation'],
    stack: ['TypeScript', 'Node.js', 'React Native', 'PostgreSQL', 'Kubernetes'],
    art: { pattern: 'waves', from: '#0f2416', to: '#07120b', ink: brandOnDark.green },
    featured: false,
  },
  {
    slug: 'aperture',
    name: 'Aperture',
    category: 'Web',
    discipline: 'Creative Portfolio Platform',
    year: '2026',
    client: 'Aperture Collective',
    sector: 'Media & culture',
    headline: 'A publishing platform for photographers who hate publishing platforms.',
    summary:
      'A WebGL-driven portfolio system where the presentation is as considered as the work inside it.',
    challenge:
      'Serious photographers were choosing between templates that flattened their work and custom builds they could not update. Neither respected the images.',
    approach:
      'A colour-managed rendering pipeline, layout templates designed as editorial spreads, and a publishing flow simple enough to use from a hotel room between shoots.',
    outcome: [
      { value: '1,400', label: 'Portfolios published' },
      { value: '98', label: 'Lighthouse performance' },
      { value: '3.1×', label: 'Median session depth' },
    ],
    services: ['Art Direction', 'WebGL', 'Platform Engineering'],
    stack: ['React', 'Three.js', 'Node.js', 'Cloudflare', 'PostgreSQL'],
    art: { pattern: 'orbit', from: '#2b0f0d', to: '#150706', ink: brandOnDark.red },
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const projectCategories: Array<ProjectCategory | 'All'> = [
  'All',
  'Web',
  'Mobile',
  'SaaS',
  'AI',
  'Branding',
]
