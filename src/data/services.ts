export type ServiceDetail = {
  slug: string
  index: string
  title: string
  navTitle: string
  category: 'Development' | 'Design' | 'Technology' | 'Growth'
  tagline: string
  summary: string
  /** Long-form positioning statement used on the service page hero. */
  statement: string
  capabilities: { title: string; body: string }[]
  deliverables: string[]
  stack: string[]
  engagement: { label: string; value: string }[]
  faqs: { q: string; a: string }[]
  related: string[]
}

export const services: ServiceDetail[] = [
  {
    slug: 'web-development',
    index: '01',
    title: 'Web Design & Development',
    navTitle: 'Web Development',
    category: 'Development',
    tagline: 'Marketing sites and web platforms engineered for speed and story.',
    summary:
      'We build the site your company deserves — art-directed, measurably fast, and structured so your team can keep shipping without waiting on us.',
    statement:
      'A website is the first product most customers ever use. We treat it that way: design systems instead of page mockups, component libraries instead of templates, and performance budgets agreed before the first line of code.',
    capabilities: [
      {
        title: 'Art direction & design systems',
        body: 'Typography, motion and layout rules documented as a living system, so the tenth page looks as considered as the first.',
      },
      {
        title: 'Front-end engineering',
        body: 'React, Next.js and Astro builds with server rendering, edge caching and Core Web Vitals held to a budget we publish in the brief.',
      },
      {
        title: 'Headless CMS integration',
        body: 'Sanity, Contentful or Payload wired to editor-friendly schemas — your marketing team ships pages without a deploy.',
      },
      {
        title: 'Motion & interaction',
        body: 'GSAP and WebGL used with restraint, always with a reduced-motion path and a graceful fallback.',
      },
    ],
    deliverables: [
      'Design system & component library',
      'Responsive build, 375px to 2560px',
      'Headless CMS with editor documentation',
      'Analytics, SEO and structured data',
      'Performance budget & Lighthouse report',
      'Handover session and 30-day support window',
    ],
    stack: ['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind', 'GSAP', 'Sanity', 'Vercel'],
    engagement: [
      { label: 'Typical timeline', value: '6 – 12 weeks' },
      { label: 'Starting from', value: '$18,000' },
      { label: 'Team', value: 'Designer, 2 engineers, PM' },
    ],
    faqs: [
      {
        q: 'Can you work from our existing brand guidelines?',
        a: 'Yes. Roughly half our web work extends an existing identity. We audit what exists, keep what carries equity, and document the digital extensions we add.',
      },
      {
        q: 'Who owns the code?',
        a: 'You do, from day one. We work in your repository where possible, and everything ships with documentation written for the engineer who inherits it.',
      },
    ],
    related: ['ui-ux-design', 'ecommerce', 'branding'],
  },
  {
    slug: 'mobile-development',
    index: '02',
    title: 'Mobile App Design & Development',
    navTitle: 'Mobile Development',
    category: 'Development',
    tagline: 'iOS and Android products people open every day.',
    summary:
      'From first prototype to store release and the release cadence after it — native-feeling apps built on React Native, Swift and Kotlin.',
    statement:
      'Mobile punishes the unconsidered. Every extra tap, every dropped frame, every permission prompt asked too early costs retention. We design for the thumb, engineer for the network you actually have, and instrument everything so the second release is smarter than the first.',
    capabilities: [
      {
        title: 'Product definition',
        body: 'We narrow to the one job the app must do brilliantly before we open a design file.',
      },
      {
        title: 'Cross-platform engineering',
        body: 'React Native and Expo for shared velocity; native Swift or Kotlin modules where the platform demands it.',
      },
      {
        title: 'Offline-first architecture',
        body: 'Local-first data, optimistic writes and conflict resolution so the product works on a train, not just a desk.',
      },
      {
        title: 'Release operations',
        body: 'CI pipelines, staged rollouts, crash reporting and over-the-air updates configured before launch, not after the first incident.',
      },
    ],
    deliverables: [
      'Interactive prototype',
      'iOS and Android builds',
      'Design system with platform variants',
      'App Store and Play Store submission',
      'Analytics and crash instrumentation',
      'Release runbook for your team',
    ],
    stack: ['React Native', 'Expo', 'Swift', 'Kotlin', 'TypeScript', 'Firebase', 'Supabase'],
    engagement: [
      { label: 'Typical timeline', value: '10 – 20 weeks' },
      { label: 'Starting from', value: '$35,000' },
      { label: 'Team', value: 'Designer, 3 engineers, QA, PM' },
    ],
    faqs: [
      {
        q: 'React Native or fully native?',
        a: 'React Native for most products — one team, one roadmap. We go native when the core experience depends on hardware, heavy graphics or platform APIs that bridges handle poorly, and we will tell you which case you are in during discovery.',
      },
      {
        q: 'Do you handle store submission?',
        a: 'Yes, including review responses. We also set up the signing, provisioning and release pipeline under your organisation accounts so you are never locked to us.',
      },
    ],
    related: ['ui-ux-design', 'software-development', 'ai-development'],
  },
  {
    slug: 'ui-ux-design',
    index: '03',
    title: 'UI/UX & Product Design',
    navTitle: 'UI/UX Design',
    category: 'Design',
    tagline: 'Research-led interfaces that make complex products feel obvious.',
    summary:
      'Discovery, information architecture, interaction design and a design system your engineers can actually build from.',
    statement:
      'Good design is not decoration applied late. It is the argument about what the product should be, made visible early enough to change course cheaply. We work in the open — flows before pixels, prototypes before promises.',
    capabilities: [
      {
        title: 'Discovery & research',
        body: 'Stakeholder interviews, user sessions and competitive teardowns that produce decisions, not slide decks.',
      },
      {
        title: 'Information architecture',
        body: 'Flows, states and edge cases mapped before visual design, which is where most rework is avoided.',
      },
      {
        title: 'Interface & motion design',
        body: 'High-fidelity design in Figma with motion specified as timing and easing, not as vague adjectives.',
      },
      {
        title: 'Design systems',
        body: 'Tokens, components and usage rules delivered in Figma and in code, versioned alongside your product.',
      },
    ],
    deliverables: [
      'Research synthesis & opportunity map',
      'User flows and IA',
      'High-fidelity UI across breakpoints',
      'Interactive prototype',
      'Design system & token set',
      'Accessibility annotations to WCAG 2.2 AA',
    ],
    stack: ['Figma', 'Storybook', 'Framer', 'Maze', 'Design Tokens', 'WCAG 2.2'],
    engagement: [
      { label: 'Typical timeline', value: '4 – 10 weeks' },
      { label: 'Starting from', value: '$14,000' },
      { label: 'Team', value: 'Lead designer, researcher, PM' },
    ],
    faqs: [
      {
        q: 'Can you design without building?',
        a: 'Often, yes. When your engineering team is building, we deliver a system they can implement and stay available for design QA through the build.',
      },
      {
        q: 'How do you handle accessibility?',
        a: 'It is scoped from the start — contrast, focus order, keyboard paths and screen-reader semantics are annotated in the handover rather than retrofitted after an audit.',
      },
    ],
    related: ['web-development', 'mobile-development', 'branding'],
  },
  {
    slug: 'ai-development',
    index: '04',
    title: 'AI Development & Automation',
    navTitle: 'AI Development',
    category: 'Technology',
    tagline: 'Applied AI that survives contact with production.',
    summary:
      'Retrieval systems, agents, copilots and workflow automation — evaluated, monitored and costed before they reach your customers.',
    statement:
      'Most AI pilots fail for unglamorous reasons: no evaluation set, no guardrails, no cost ceiling, no owner. We build the boring infrastructure that makes the impressive part dependable, and we say no to the use cases that do not warrant a model at all.',
    capabilities: [
      {
        title: 'Retrieval & knowledge systems',
        body: 'Document pipelines, chunking strategy, hybrid search and citation-backed answers over your own corpus.',
      },
      {
        title: 'Agents & copilots',
        body: 'Tool-using assistants scoped to real workflows, with human checkpoints on anything irreversible.',
      },
      {
        title: 'Evaluation & observability',
        body: 'Golden datasets, regression suites, tracing and cost dashboards so quality is measured, not asserted.',
      },
      {
        title: 'Process automation',
        body: 'Document handling, support triage, data extraction and internal workflows wired to the systems you already run.',
      },
    ],
    deliverables: [
      'Use-case assessment & feasibility note',
      'Working prototype on your data',
      'Evaluation harness and benchmark set',
      'Production deployment with guardrails',
      'Cost and latency monitoring',
      'Team enablement workshop',
    ],
    stack: ['Claude', 'OpenAI', 'Python', 'LangGraph', 'pgvector', 'Postgres', 'Modal', 'AWS'],
    engagement: [
      { label: 'Typical timeline', value: '6 – 16 weeks' },
      { label: 'Starting from', value: '$28,000' },
      { label: 'Team', value: 'AI engineer, backend engineer, PM' },
    ],
    faqs: [
      {
        q: 'Will our data be used to train models?',
        a: 'No. We deploy against enterprise endpoints with training disabled, and where policy requires it we run open-weight models inside your own cloud account.',
      },
      {
        q: 'What if AI is the wrong answer?',
        a: 'We will say so. A deterministic rules engine is cheaper, faster and easier to defend than a model, and a fair number of the briefs we receive are better served by one.',
      },
    ],
    related: ['software-development', 'web-development', 'mobile-development'],
  },
  {
    slug: 'software-development',
    index: '05',
    title: 'Custom Software & SaaS',
    navTitle: 'Software Development',
    category: 'Development',
    tagline: 'Platforms, internal tools and SaaS products built to be maintained.',
    summary:
      'Multi-tenant architecture, billing, permissions and the unglamorous infrastructure that decides whether a product scales.',
    statement:
      'The interesting problems in custom software are rarely the features. They are tenancy, permissions, migrations, audit trails and the second year of maintenance. We design for that year from the first sprint.',
    capabilities: [
      {
        title: 'Architecture & data modelling',
        body: 'Domain modelling, tenancy strategy and migration paths decided deliberately and written down.',
      },
      {
        title: 'Full-stack product engineering',
        body: 'TypeScript, Node, .NET or Python services with typed contracts end to end.',
      },
      {
        title: 'Billing & entitlements',
        body: 'Subscriptions, metered usage, trials and plan gating built on Stripe without leaking pricing logic across the codebase.',
      },
      {
        title: 'Legacy modernisation',
        body: 'Incremental strangler-fig migrations that keep the existing system serving customers throughout.',
      },
    ],
    deliverables: [
      'Technical architecture document',
      'Production application',
      'Role-based access control & audit log',
      'Billing and subscription flows',
      'Automated test suite and CI',
      'Runbooks and onboarding for your engineers',
    ],
    stack: ['TypeScript', 'Node.js', '.NET', 'Python', 'PostgreSQL', 'Redis', 'Prisma', 'Docker'],
    engagement: [
      { label: 'Typical timeline', value: '12 – 26 weeks' },
      { label: 'Starting from', value: '$45,000' },
      { label: 'Team', value: '4 – 6 specialists' },
    ],
    faqs: [
      {
        q: 'Can you take over an existing codebase?',
        a: 'Yes. We start with a two-week audit covering architecture, test coverage, security and delivery risk, and give you a written remediation plan before we commit to a roadmap.',
      },
      {
        q: 'How do you handle scope change?',
        a: 'Two-week cycles with a re-prioritised backlog at each boundary. Scope moves; the budget ceiling does not without an explicit conversation.',
      },
    ],
    related: ['ai-development', 'ecommerce', 'web-development'],
  },
  {
    slug: 'branding',
    index: '06',
    title: 'Branding & Identity',
    navTitle: 'Branding & Logo',
    category: 'Design',
    tagline: 'Identity systems built for screens first.',
    summary:
      'Positioning, naming, logo, typography, motion and the guidelines that keep it coherent as the company grows.',
    statement:
      'A brand that only works on a business card is a liability. We design identities that hold up at 16 pixels in a browser tab and at three metres on a conference wall, with motion and interface behaviour treated as part of the identity rather than an afterthought.',
    capabilities: [
      {
        title: 'Positioning & narrative',
        body: 'The sentence your company can defend, and the language that follows from it.',
      },
      {
        title: 'Visual identity',
        body: 'Logo system, type scale, colour, grid and imagery direction across every surface you actually use.',
      },
      {
        title: 'Motion identity',
        body: 'Signature transitions and logo behaviour specified so video, product and web move the same way.',
      },
      {
        title: 'Brand guidelines',
        body: 'A practical document with rules, examples and the assets teams need — not a 90-page PDF nobody opens.',
      },
    ],
    deliverables: [
      'Positioning and messaging framework',
      'Primary logo and responsive variants',
      'Typography and colour system',
      'Digital and print applications',
      'Motion identity specification',
      'Brand guidelines and asset library',
    ],
    stack: ['Figma', 'Illustrator', 'After Effects', 'Blender', 'Type Design'],
    engagement: [
      { label: 'Typical timeline', value: '5 – 10 weeks' },
      { label: 'Starting from', value: '$16,000' },
      { label: 'Team', value: 'Creative director, designer, writer' },
    ],
    faqs: [
      {
        q: 'Do you offer naming?',
        a: 'Yes, as a distinct engagement including linguistic screening and preliminary trademark checks with your counsel.',
      },
      {
        q: 'Can you refresh rather than replace?',
        a: 'Frequently the better call. We audit the equity in what exists and evolve it, so recognition survives the change.',
      },
    ],
    related: ['ui-ux-design', 'web-development', 'digital-marketing'],
  },
  {
    slug: 'ecommerce',
    index: '07',
    title: 'E-Commerce Development',
    navTitle: 'E-Commerce',
    category: 'Development',
    tagline: 'Storefronts where the experience matches the product.',
    summary:
      'Headless commerce on Shopify and custom stacks — merchandising, checkout and conversion, engineered end to end.',
    statement:
      'Luxury and considered-purchase brands lose more revenue to a slow product page than to any pricing decision. We build storefronts where craft and conversion are the same conversation: art-directed merchandising on top of a checkout tuned to the millisecond.',
    capabilities: [
      {
        title: 'Headless storefronts',
        body: 'Shopify Hydrogen or custom React front-ends with edge rendering and instant navigation.',
      },
      {
        title: 'Merchandising experience',
        body: 'Editorial collection pages, configurators and product storytelling that survives the transition to mobile.',
      },
      {
        title: 'Checkout optimisation',
        body: 'Payments, wallets, tax and shipping tuned against real funnel data rather than best-practice folklore.',
      },
      {
        title: 'Operations integration',
        body: 'ERP, PIM, subscription and fulfilment systems connected so the storefront reflects reality.',
      },
    ],
    deliverables: [
      'Headless storefront build',
      'Product and collection templates',
      'Optimised checkout flow',
      'Search, filtering and recommendations',
      'Analytics and conversion instrumentation',
      'Merchandiser training',
    ],
    stack: ['Shopify Hydrogen', 'Next.js', 'Stripe', 'Algolia', 'Sanity', 'Vercel'],
    engagement: [
      { label: 'Typical timeline', value: '8 – 16 weeks' },
      { label: 'Starting from', value: '$26,000' },
      { label: 'Team', value: 'Designer, 2 engineers, PM' },
    ],
    faqs: [
      {
        q: 'Do we have to leave Shopify?',
        a: 'No. Headless keeps Shopify as the commerce engine and replaces only the storefront, so your operations team keeps the admin they know.',
      },
      {
        q: 'Can you migrate an existing catalogue?',
        a: 'Yes, including redirects, structured data and SEO continuity — the part of a replatform that most often goes wrong.',
      },
    ],
    related: ['web-development', 'branding', 'digital-marketing'],
  },
  {
    slug: 'digital-marketing',
    index: '08',
    title: 'Digital Marketing & Growth',
    navTitle: 'Digital Marketing',
    category: 'Growth',
    tagline: 'Growth programmes accountable to pipeline, not impressions.',
    summary:
      'SEO, performance media, lifecycle and social, run as one measured system with the product it promotes.',
    statement:
      'Marketing that is disconnected from the product it sells generates traffic and little else. Because we build the product, we can close the loop: the landing page, the onboarding, the instrumentation and the campaign are designed together.',
    capabilities: [
      {
        title: 'Technical & content SEO',
        body: 'Crawl health, structured data, internal linking and content built around demand that actually exists.',
      },
      {
        title: 'Performance media',
        body: 'Paid search and social with creative testing, clean attribution and a payback target agreed up front.',
      },
      {
        title: 'Lifecycle & CRM',
        body: 'Onboarding, activation and retention sequences tied to real product events.',
      },
      {
        title: 'Social & content studio',
        body: 'Editorial calendars, motion assets and community management for the channels your audience uses.',
      },
    ],
    deliverables: [
      'Growth audit and channel plan',
      'Measurement and attribution setup',
      'Campaign creative and landing pages',
      'Lifecycle email and CRM flows',
      'Monthly performance reporting',
      'Quarterly strategy review',
    ],
    stack: ['GA4', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'HubSpot', 'Klaviyo', 'Ahrefs'],
    engagement: [
      { label: 'Typical timeline', value: '3-month minimum' },
      { label: 'Starting from', value: '$4,500 / month' },
      { label: 'Team', value: 'Strategist, media buyer, designer' },
    ],
    faqs: [
      {
        q: 'Do you require a long contract?',
        a: 'Three months, because nothing meaningful is provable in less. After that it is month to month.',
      },
      {
        q: 'What do you report on?',
        a: 'Qualified pipeline, cost per acquisition and retention. Impressions and follower counts appear as context, never as the headline.',
      },
    ],
    related: ['branding', 'ecommerce', 'web-development'],
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)

/** Navigation taxonomy for the mega-menu. Some entries point at the shared page above. */
export const serviceMenu: {
  group: string
  blurb: string
  items: { label: string; to: string; note: string }[]
}[] = [
  {
    group: 'Development',
    blurb: 'Ship the product',
    items: [
      { label: 'Web Development', to: '/services/web-development', note: 'Sites & platforms' },
      { label: 'Mobile Development', to: '/services/mobile-development', note: 'iOS & Android' },
      { label: 'Software Development', to: '/services/software-development', note: 'Custom systems' },
      { label: 'SaaS Development', to: '/services/software-development', note: 'Multi-tenant products' },
      { label: 'E-Commerce', to: '/services/ecommerce', note: 'Headless storefronts' },
    ],
  },
  {
    group: 'Design',
    blurb: 'Define the experience',
    items: [
      { label: 'UI/UX Design', to: '/services/ui-ux-design', note: 'Product design' },
      { label: 'Branding', to: '/services/branding', note: 'Identity systems' },
      { label: 'Logo Design', to: '/services/branding', note: 'Marks & wordmarks' },
    ],
  },
  {
    group: 'Technology',
    blurb: 'Build the foundation',
    items: [
      { label: 'AI Development', to: '/services/ai-development', note: 'Agents & retrieval' },
      { label: 'API Development', to: '/services/software-development', note: 'Typed contracts' },
      { label: 'Cloud & DevOps', to: '/services/software-development', note: 'Infrastructure' },
    ],
  },
  {
    group: 'Growth',
    blurb: 'Reach the market',
    items: [
      { label: 'Digital Marketing', to: '/services/digital-marketing', note: 'Search & media' },
      { label: 'Social Media Marketing', to: '/services/digital-marketing', note: 'Content studio' },
    ],
  },
]
