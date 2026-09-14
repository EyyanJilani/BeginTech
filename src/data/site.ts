export const site = {
  name: 'BeginTech',
  tagline: 'Digital Product & Technology Studio',
  email: 'info@begintech.co',
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

/*
  Every number here has to be true and checkable against the real portfolio in
  data/projects.ts — the brief this was written against is explicit that
  invented stats are worse than no stats at all. If the portfolio grows, these
  should grow with it rather than being padded ahead of the evidence.
*/
export const stats = [
  { value: 10, suffix: '+', label: 'Years building', detail: 'Since 2016' },
  { value: 8, suffix: '', label: 'Live projects', detail: 'Shipped and in production' },
  { value: 4, suffix: '', label: 'Countries served', detail: 'Pakistan, France, US, Australia' },
  { value: 7, suffix: '', label: 'Sectors covered', detail: 'Food, fashion, retail, trades' },
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

/*
  These are real end-customer reviews, left on the storefronts we built —
  not testimonials about BeginTech itself. We have not been given a testimonial
  from either business owner about the engagement, so it would be dishonest to
  present customer reviews of a burger or a dress as if they were client
  feedback on our design work. The section below is framed accordingly: proof
  the products work, not endorsements of the studio. Lightly cleaned for
  spelling/punctuation only — meaning and attribution are unchanged.
*/
export const testimonials = [
  {
    quote: 'Good taste and good experience, staff is very cooperative.',
    name: 'Ahmad Malik',
    role: 'Verified buyer',
    company: 'Brooklyn Bites',
    initials: 'AM',
  },
  {
    quote:
      'Good taste, loved the vibe, and the food hit the spot. Every bite of pizza was perfect — highly recommend.',
    name: 'Aliya Amin',
    role: 'Verified buyer',
    company: 'Brooklyn Bites',
    initials: 'AA',
  },
  {
    quote:
      'The variety of unstitched lawn here is unmatched. I found all the latest collections from my favorite big brands under one roof. The fabric is soft, breathable, and exactly as described.',
    name: 'Hina Sheikh',
    role: 'Verified buyer',
    company: 'Siyaab Lawn Hub',
    initials: 'HS',
  },
  {
    quote:
      'I had a confusion regarding the size chart, so I messaged their support team. They were very polite and guided me to the right size. The dress fits like a dream.',
    name: 'Mariam Durrani',
    role: 'Verified buyer',
    company: 'Siyaab Lawn Hub',
    initials: 'MD',
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
