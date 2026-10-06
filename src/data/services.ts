export type ServiceDetail = {
  slug: string
  index: string
  title: string
  navTitle: string
  category: 'Development' | 'Design' | 'Technology' | 'Growth'
  tagline: string
  summary: string
  /** <title> for the service page — keyword-led, kept under ~60 characters. */
  seoTitle: string
  /** Meta description — written for the search snippet, ~150–160 characters. */
  seoDescription: string
  /** Plain-language overview: what the service is, for whom, where. Rendered under an H2. */
  introHeading: string
  intro: string[]
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
    seoTitle: 'Web Development Services in Karachi, Pakistan | BeginTech',
    seoDescription:
      'Custom website design and web development from a Karachi-based agency: fast React and Next.js sites, headless CMS, SEO-ready builds and code you own.',
    introHeading: "Web development company in Karachi, Pakistan",
    intro: [
      "BeginTech is a web development agency based in Karachi. We design and build business websites, marketing sites, web applications and online stores for companies in Pakistan and abroad — from the first wireframe to launch and the support after it.",
      "Every site is custom-built rather than adapted from a theme: responsive from mobile up, built to load quickly on mobile connections, structured for search engines from day one, and handed over with the code in your own repository. If you already have a website, we can redesign it, migrate it to a modern stack, or take over its development.",
    ],
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
      {
        q: "How much does a website cost?",
        a: "It depends on the number of pages, features and integrations involved. After a short discovery call we send a fixed quote and timeline, so you know the cost before any work starts.",
      },
      {
        q: "Will my website be SEO-friendly?",
        a: "Yes. Every build ships with clean URLs, page titles and meta descriptions, structured data, an XML sitemap, fast load times and mobile-friendly layouts — the technical foundation search engines need.",
      },
      {
        q: "Can you redesign our existing website?",
        a: "Yes. We review what works on the current site — content, rankings, conversion paths — keep it, and rebuild the rest, with redirects in place so search traffic is not lost.",
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
    seoTitle: 'Mobile App Development Company in Pakistan | BeginTech',
    seoDescription:
      'iOS and Android app development from Karachi, Pakistan — React Native, Swift and Kotlin apps taken from prototype to App Store and Play Store release.',
    introHeading: "Mobile app development company in Pakistan",
    intro: [
      "We design and develop iOS and Android apps from Karachi for startups and established businesses — customer-facing apps, ordering and booking apps, and internal tools for field teams.",
      "Most apps are built with React Native, so one codebase serves both platforms, with native Swift or Kotlin where the product needs it. We handle App Store and Google Play submission and set up releases under your own accounts.",
    ],
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
      {
        q: "How much does it cost to build an app?",
        a: "Cost depends on the platforms, features and integrations. We scope it in discovery and give you a fixed quote for the first release before development starts.",
      },
      {
        q: "Can the app connect to our existing website or system?",
        a: "Yes. The app can use your existing backend or APIs, or we build the API layer alongside it.",
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
    seoTitle: 'UI/UX Design Services in Karachi, Pakistan | BeginTech',
    seoDescription:
      'Research-led UI/UX and product design from Karachi: user flows, high-fidelity interfaces, prototypes and design systems your engineers can build from.',
    introHeading: "UI/UX design agency in Karachi",
    intro: [
      "BeginTech's design team works on websites, web apps and mobile apps — user research, user flows, wireframes, visual interface design and clickable prototypes in Figma.",
      "We design with the build in mind, so the handover is a component system and annotated screens your developers (or ours) can implement directly, including accessibility notes.",
    ],
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
      {
        q: "Do you redesign existing products?",
        a: "Yes. Redesigns start with a review of where users struggle today, so changes are based on evidence rather than taste.",
      },
      {
        q: "What tools do you use?",
        a: "Figma for design and prototyping, with design tokens and a component library handed over for development.",
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
    seoTitle: 'AI Development & Automation Services, Pakistan | BeginTech',
    seoDescription:
      'AI development from a Karachi software house: retrieval systems, AI agents, copilots and workflow automation — evaluated, monitored and costed for production.',
    introHeading: "AI development company in Pakistan",
    intro: [
      "We build practical AI software for businesses: AI chatbots and assistants, document processing and data extraction, search over your own company knowledge, AI agents that work inside your existing tools, and automation of repetitive back-office work.",
      "Our engineers work with models from Anthropic and OpenAI as well as open-weight models, and wrap them in the evaluation, monitoring and cost controls a production system needs. If your problem is better solved without AI, we will tell you.",
    ],
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
      {
        q: "What kinds of AI projects do you build?",
        a: "AI chatbots and assistants, document and data extraction, search over company knowledge, AI agents that work inside existing tools, and workflow automation.",
      },
      {
        q: "Do you build AI chatbots?",
        a: "Yes — website, WhatsApp and internal knowledge-base chatbots are covered on our AI chatbot development page.",
      },
    ],
    related: ['ai-chatbot-development', 'software-development', 'web-development'],
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
    seoTitle: 'Custom Software Development Company in Pakistan | BeginTech',
    seoDescription:
      'Custom software and SaaS development from a Karachi software house: multi-tenant platforms, internal tools, billing, permissions and legacy modernisation.',
    introHeading: "Software house in Karachi, Pakistan",
    intro: [
      "As a software house, BeginTech builds the custom software that off-the-shelf tools do not cover: SaaS products, customer portals, internal dashboards, booking and order systems, ERP and CRM extensions, and APIs that connect the systems you already use.",
      "Projects run in two-week cycles with a working release at the end of each, and finish with documentation, tests and runbooks so your own team can maintain the software — or so we can keep supporting it.",
    ],
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
      {
        q: "What kind of software do you build?",
        a: "SaaS products, internal tools and dashboards, customer portals, booking and order systems, and integrations between existing platforms.",
      },
      {
        q: "Do you provide support after launch?",
        a: "Yes. We offer ongoing maintenance and development, and every project is documented so another team could take over if you prefer.",
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
    seoTitle: 'Branding & Logo Design Agency in Karachi | BeginTech',
    seoDescription:
      'Brand identity and logo design from Karachi, Pakistan: positioning, logo systems, typography, colour, motion identity and practical brand guidelines.',
    introHeading: "Branding and logo design agency in Karachi",
    intro: [
      "We create brand identities for new and growing businesses — logo design, colour and typography, brand guidelines, and the social media and web assets that carry the identity day to day.",
      "Because we also build websites and apps, identities are designed for screens first: legible at small sizes, adaptable to dark mode, and supplied in the formats your developers and designers need.",
    ],
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
      {
        q: "Do you offer logo design on its own?",
        a: "Yes. Most clients pair it with colour, typography and basic guidelines so the logo is used consistently, but a standalone logo project is fine.",
      },
      {
        q: "What files will we receive?",
        a: "Logo files in vector and web formats (SVG, PDF and PNG), colour and font specifications, and guidelines on how to use them.",
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
    seoTitle: 'E-Commerce Website Development in Pakistan | BeginTech',
    seoDescription:
      'E-commerce website development from Karachi: Shopify and custom online stores with fast product pages, optimised checkout and catalogue migration.',
    introHeading: "E-commerce website development in Pakistan",
    intro: [
      "We build online stores for retail, fashion, food and manufacturing brands — on Shopify or as custom e-commerce websites — including product catalogues, cart and checkout, and payment and delivery integrations.",
      "Our portfolio includes fashion and food-ordering stores for Pakistani brands as well as storefronts for clients in the US and France. If you are moving from another platform, we migrate products and URLs with redirects so existing search rankings carry over.",
    ],
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
      {
        q: "Shopify or a custom online store?",
        a: "Shopify suits most stores that need to launch quickly and be run by a non-technical team. A custom build makes sense for unusual catalogues, complex pricing or deep integration with other systems. We recommend one after discovery.",
      },
      {
        q: "Can you integrate local payment and delivery options?",
        a: "Yes. We integrate the payment gateways and courier services your business already uses, provided they offer an API or plugin.",
      },
    ],
    related: ['web-development', 'branding', 'digital-marketing'],
  },
  {
    slug: 'digital-marketing',
    index: '08',
    title: 'Social Media Marketing & Digital Growth',
    navTitle: 'Digital Marketing',
    category: 'Growth',
    tagline: 'Social media marketing and growth programmes accountable to pipeline, not impressions.',
    summary:
      'Social media marketing, SEO, performance media and lifecycle — run as one measured system with the product it promotes.',
    seoTitle: 'Digital & Social Media Marketing Agency, Karachi | BeginTech',
    seoDescription:
      'Social media marketing, SEO, paid media and lifecycle email from a Karachi agency — run as one measured system and reported against pipeline, not impressions.',
    introHeading: "Digital marketing agency in Karachi",
    intro: [
      "BeginTech runs social media marketing, search engine optimisation (SEO), Google and Meta advertising, and email marketing for businesses in Pakistan and abroad.",
      "Because we also design and build websites, campaigns and landing pages are planned together, tracking is set up properly, and results are reported against enquiries and sales rather than likes and impressions.",
    ],
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
      {
        q: "Do you offer SEO services?",
        a: "Yes — technical SEO, on-page optimisation, content planning and local SEO, reported against search traffic and enquiries.",
      },
      {
        q: "Which platforms do you run ads on?",
        a: "Meta (Facebook and Instagram), LinkedIn and Google Ads, with GA4 tracking so every channel is measured the same way.",
      },
    ],
    related: ['branding', 'ecommerce', 'web-development'],
  },
  {
    slug: 'ai-chatbot-development',
    index: '09',
    title: 'AI Chatbot Development',
    navTitle: 'AI Chatbots',
    category: 'Technology',
    tagline: 'Chatbots that answer from your own content — on your website, WhatsApp and internal tools.',
    summary:
      'Custom AI chatbots and assistants built on large language models, grounded in your documents and data, with a handover to a person when the bot should not answer.',
    seoTitle: 'AI Chatbot Development Company in Pakistan | BeginTech',
    seoDescription:
      'Custom AI chatbot development from Karachi: website, WhatsApp and customer support chatbots grounded in your own data, with human handover and analytics.',
    introHeading: 'AI chatbot development in Pakistan',
    intro: [
      'BeginTech builds custom AI chatbots for businesses — customer support bots on your website, WhatsApp chatbots, lead qualification assistants and internal knowledge assistants for your team.',
      'Unlike scripted, rule-based bots, these chatbots understand free-text questions and answer from your own content. We connect them to your systems where needed, add a clean handover to a human, and give you analytics on what customers are actually asking.',
    ],
    statement:
      'A chatbot that makes things up is worse than no chatbot. We build assistants that answer from your own content, know when to hand over to a person, and are measured on whether they actually resolve questions — not on how clever they sound.',
    capabilities: [
      {
        title: 'Customer support chatbots',
        body: 'Website and in-app assistants that answer from your help centre, policies and product data, and pass the conversation to your team when they should.',
      },
      {
        title: 'WhatsApp & messaging bots',
        body: 'Assistants on WhatsApp Business and the other channels your customers already use, connected to orders, bookings or your CRM.',
      },
      {
        title: 'Knowledge-base assistants',
        body: 'Search-and-answer over internal documents, SOPs and wikis for your own staff, with access that respects who is asking.',
      },
      {
        title: 'Evaluation & guardrails',
        body: 'Test sets built from real questions, rules for what the bot must not answer, and conversation analytics so quality is measured before and after launch.',
      },
    ],
    deliverables: [
      'Use-case and conversation design',
      'Chatbot grounded in your content',
      'Website widget or messaging channel integration',
      'Human handover and escalation flow',
      'Evaluation set and conversation analytics',
      'Guide for updating the knowledge base',
    ],
    stack: ['Claude', 'OpenAI', 'Python', 'Node.js', 'pgvector', 'WhatsApp Business API', 'LangGraph'],
    engagement: [
      { label: 'Typical timeline', value: '4 – 10 weeks' },
      { label: 'Team', value: 'AI engineer, full-stack engineer, PM' },
    ],
    faqs: [
      {
        q: 'Will the chatbot make up answers?',
        a: 'It is grounded in the content you provide and instructed to say it does not know rather than guess. We test it against real customer questions before launch and keep monitoring conversations afterwards.',
      },
      {
        q: 'Can it reply in Urdu or Roman Urdu?',
        a: 'Current language models handle Urdu and Roman Urdu reasonably well. We test against real messages in the languages your customers use before committing to it.',
      },
      {
        q: 'Can it connect to our systems?',
        a: 'Yes — order status, bookings, CRM or ticketing, through their APIs. Anything that changes data gets a confirmation step or a human check.',
      },
      {
        q: 'What do we need to provide?',
        a: 'The content the bot should answer from (FAQs, policies, product data, documents), real customer questions if you have them, and one person on your side who owns the answers.',
      },
    ],
    related: ['ai-development', 'web-development', 'software-development'],
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
      { label: 'AI Chatbots', to: '/services/ai-chatbot-development', note: 'Website & WhatsApp bots' },
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
