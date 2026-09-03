export const site = {
  name: 'BeginTech',
  tagline: 'Digital Product & Technology Studio',
  email: 'info@begintech.org',
  phone: '+92 319 4889779',
  location: 'Karachi, Pakistan.',
  hq: 'Karachi, Sindh, Pakistan',
  hours: 'Mon – Sat, 10:00 – 19:00 PKT',
  availability: 'Available for projects worldwide.',
  founded: 2016,
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/begintech00/' },
    { label: 'Instagram', href: 'https://www.instagram.com/begin_tech/?hl=en' },
    { label: 'Facebook', href: 'https://www.facebook.com/BeginTech/' },
    { label: 'X', href: 'https://x.com/' },
  ],
}

export const primaryNav = [
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Contact', to: '/contact' },
]

export const stats = [
  { value: 10, suffix: '+', label: 'Years building', detail: 'Since 2016' },
  { value: 120, suffix: '+', label: 'Products delivered', detail: 'Web, mobile, AI' },
  { value: 45, suffix: '+', label: 'Clients partnered', detail: 'Seed to enterprise' },
  { value: 18, suffix: '', label: 'Countries reached', detail: 'Serving clients worldwide' },
]

export const process = [
  {
    index: '01',
    title: 'Discover',
    duration: '1 – 2 weeks',
    body: 'We interview the people who own the problem, read the data you already have, and write down what success would actually look like. Most engagements change shape here — that is the point of doing it first.',
    outputs: ['Stakeholder interviews', 'Technical audit', 'Success metrics'],
  },
  {
    index: '02',
    title: 'Strategise',
    duration: '1 – 2 weeks',
    body: 'Scope, sequence and architecture, decided together and written down. We name what we are not building in this phase as clearly as what we are.',
    outputs: ['Roadmap & scope', 'Architecture plan', 'Budget model'],
  },
  {
    index: '03',
    title: 'Design',
    duration: '3 – 6 weeks',
    body: 'Flows before pixels, prototypes before promises. You see clickable work in week two, and we test the assumptions that would be expensive to get wrong.',
    outputs: ['User flows', 'Interface design', 'Design system'],
  },
  {
    index: '04',
    title: 'Build',
    duration: '6 – 20 weeks',
    body: 'Two-week cycles, a working deployment at the end of each, and a backlog you can re-order. No twelve-week silence followed by a reveal.',
    outputs: ['Fortnightly releases', 'Automated tests', 'Staging environment'],
  },
  {
    index: '05',
    title: 'Launch',
    duration: '1 – 2 weeks',
    body: 'Staged rollout, monitoring configured before traffic arrives, and a runbook your team can act on at three in the morning without calling us.',
    outputs: ['Release plan', 'Monitoring & alerts', 'Team handover'],
  },
  {
    index: '06',
    title: 'Evolve',
    duration: 'Ongoing',
    body: 'What launched is a hypothesis. We instrument it, read what real usage says, and keep shipping against evidence rather than the original plan.',
    outputs: ['Usage analytics', 'Iteration cycles', 'Quarterly review'],
  },
]

export const technologies = [
  { name: 'React', group: 'Front-end' },
  { name: 'Next.js', group: 'Front-end' },
  { name: 'TypeScript', group: 'Front-end' },
  { name: 'Three.js', group: 'Front-end' },
  { name: 'GSAP', group: 'Front-end' },
  { name: 'Tailwind', group: 'Front-end' },
  { name: 'Node.js', group: 'Back-end' },
  { name: '.NET', group: 'Back-end' },
  { name: 'Python', group: 'Back-end' },
  { name: 'Go', group: 'Back-end' },
  { name: 'GraphQL', group: 'Back-end' },
  { name: 'PostgreSQL', group: 'Data' },
  { name: 'Supabase', group: 'Data' },
  { name: 'Redis', group: 'Data' },
  { name: 'pgvector', group: 'Data' },
  { name: 'Claude', group: 'AI' },
  { name: 'OpenAI', group: 'AI' },
  { name: 'LangGraph', group: 'AI' },
  { name: 'AWS', group: 'Cloud' },
  { name: 'Docker', group: 'Cloud' },
  { name: 'Kubernetes', group: 'Cloud' },
  { name: 'Vercel', group: 'Cloud' },
  { name: 'Cloudflare', group: 'Cloud' },
  { name: 'Terraform', group: 'Cloud' },
]

export const techGroups = ['Front-end', 'Back-end', 'Data', 'AI', 'Cloud'] as const

export const testimonials = [
  {
    quote:
      'They spent the first two weeks telling us which half of our roadmap to delete. That conversation was worth more than the build, and the build was excellent.',
    name: 'Camille Duarte',
    role: 'Chief Product Officer',
    company: 'Finova Group',
    initials: 'CD',
  },
  {
    quote:
      'We have worked with four agencies. BeginTech is the only one whose code our engineers were happy to inherit — documented, tested, and boring in all the right places.',
    name: 'Marcus Reiner',
    role: 'VP Engineering',
    company: 'Nexus Energy',
    initials: 'MR',
  },
  {
    quote:
      'Our AI pilot had been stuck for eight months. They shipped an evaluated, cited, production system in eleven weeks and taught our team to run it.',
    name: 'Priya Raghunathan',
    role: 'Head of Data',
    company: 'Orbital Intelligence',
    initials: 'PR',
  },
  {
    quote:
      'The storefront finally looks like the product. Mobile conversion nearly doubled, and I stopped apologising for our website in board meetings.',
    name: 'Élise Marchand',
    role: 'Managing Director',
    company: 'Maison Levant',
    initials: 'EM',
  },
]

export const principles = [
  {
    index: '01',
    title: 'Strategy before pixels',
    body: 'We would rather lose a week arguing about what to build than lose a quarter building the wrong thing beautifully.',
  },
  {
    index: '02',
    title: 'Craft is measurable',
    body: 'Performance budgets, accessibility targets and evaluation sets. Taste matters, but it should not be the only defence.',
  },
  {
    index: '03',
    title: 'Small senior teams',
    body: 'Four or five specialists who have shipped before. No layers between the person you brief and the person who builds.',
  },
  {
    index: '04',
    title: 'Built to be inherited',
    body: 'Every engagement ends with your team able to run it without us. Documentation, runbooks, and the code in your repository.',
  },
]

export const capabilitiesSummary = [
  'Strategy',
  'Product Design',
  'Engineering',
  'Applied AI',
  'Commerce',
  'Growth',
]
