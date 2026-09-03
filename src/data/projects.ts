import { brandOnDark } from './brand'
import { workImages } from './work-images'

export type ProjectCategory = 'Web' | 'E-Commerce' | 'Branding'

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
  /** Real screenshot, when we have one. Takes precedence over `art`. */
  image?: string
  /** Procedural artwork fallback — keeps the card from breaking if `image` is absent. */
  art: { pattern: ArtPattern; from: string; to: string; ink: string }
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'brooklyn-bites',
    name: 'Brooklyn Bites',
    category: 'E-Commerce',
    discipline: 'Food Ordering Platform',
    year: '2025',
    client: 'Brooklyn Bites',
    sector: 'Food & beverage',
    headline: 'A smash-burger ordering experience built to move fast on a phone.',
    summary:
      'A dark, appetite-led ordering site for a Lahore smash-burger and pizza kitchen — menu, deals engine and cart in one flow.',
    challenge:
      'The kitchen had a strong menu and no digital storefront that matched it. Customers were ordering over the phone or through third-party apps that buried the brand behind someone else\'s UI.',
    approach:
      'We built a dark, photography-led storefront with the menu organised into four browsable categories, a rotating best-seller rail, and a promo bar for live deals and delivery thresholds — all backed by a lightweight cart that gets someone from craving to checkout in a few taps.',
    outcome: [
      { value: '4', label: 'Menu categories' },
      { value: '7', label: 'Live deal bundles' },
      { value: '4.9★', label: 'Rating shown at launch' },
    ],
    services: ['Web Design', 'Front-End Development', 'Menu & Cart System'],
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Stripe'],
    image: workImages['brooklyn-bites'],
    art: { pattern: 'grid', from: '#2b1608', to: '#140b04', ink: brandOnDark.yellow },
    featured: true,
  },
  {
    slug: 'siyaab-lawn-hub',
    name: 'Siyaab Lawn Hub',
    category: 'E-Commerce',
    discipline: 'Fashion E-Commerce',
    year: '2026',
    client: 'Siyaab Lawn Hub',
    sector: 'Fashion & retail',
    headline: 'A multi-brand storefront for stitched and unstitched lawn.',
    summary:
      'A catalogue-first ecommerce build for a women\'s ethnic-wear retailer, spanning six shop categories across dozens of designer collections.',
    challenge:
      'The catalogue spans stitched and unstitched pieces across more than a dozen designer lines, kids wear and seasonal sale stock. Without clear structure, that range turns into a wall of product tiles nobody can navigate.',
    approach:
      'We organised the storefront around six shop categories — stitched lawn, stitched formals, unstitched lawn, unstitched formals, kids wear and sale — each with its own landing treatment, then built collection pages that let a single designer\'s line stand on its own.',
    outcome: [
      { value: '6', label: 'Shop categories' },
      { value: '8+', label: 'Designer collections' },
      { value: '3', label: 'Featured testimonials' },
    ],
    services: ['E-Commerce Design', 'Front-End Development', 'Catalogue Architecture'],
    stack: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    image: workImages['siyaab-lawn-hub'],
    art: { pattern: 'waves', from: '#2b1122', to: '#150810', ink: brandOnDark.magenta },
    featured: true,
  },
  {
    slug: 'dip-n-eat',
    name: "Dip'N Eat",
    category: 'E-Commerce',
    discipline: 'Street Food Ordering',
    year: '2026',
    client: "Dip'N Eat",
    sector: 'Food & beverage',
    headline: 'A French-language storefront built around the sauce, not the burger.',
    summary:
      'A bold, dark ordering site for a Guadeloupe street-food kitchen whose whole positioning is the dip, not the bun.',
    challenge:
      'Most burger sites sell the burger. This kitchen\'s actual differentiator is the signature dips — a positioning that needed the site itself to argue the case, in French, for a Caribbean audience.',
    approach:
      'The homepage leads with the sauce rather than the sandwich, structures the menu into three simple bundles (Quick Dip, Dip & Fries, Full Dip) instead of an à la carte maze, and carries the copy fully in French rather than a translated template.',
    outcome: [
      { value: '3', label: 'Bundle menus' },
      { value: 'FR', label: 'Fully localised copy' },
      { value: '4.5★', label: 'Guest rating shown' },
    ],
    services: ['Web Design', 'Front-End Development', 'French Localisation'],
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    image: workImages['dip-n-eat'],
    art: { pattern: 'arc', from: '#2b2408', to: '#141105', ink: brandOnDark.yellow },
    featured: true,
  },
  {
    slug: 'cake-craft',
    name: 'Cake Craft',
    category: 'E-Commerce',
    discipline: 'Baking Supplies E-Commerce',
    year: '2024',
    client: 'Cake Craft Factory LLC',
    sector: 'Retail & manufacturing',
    headline: 'A catalogue site for a US baking-supplies manufacturer.',
    summary:
      'A clean, product-led storefront for a Texas manufacturer of fondant, icing and cake-decorating supplies, made in the USA.',
    challenge:
      'A manufacturer selling into both retail customers and resellers needed one site that could showcase the product range, point to a full catalogue, and support the community of cake artists already using the brand on Instagram.',
    approach:
      'We built the homepage around four core product families — fondant, coloring gel, sprinkles and icing tubes — with a how-to video section for technique content and a curated Instagram artist grid, so the brand\'s existing community became part of the storefront itself.',
    outcome: [
      { value: '4', label: 'Product lines catalogued' },
      { value: 'US', label: 'Manufactured & shipped' },
      { value: '10', label: 'Artists featured' },
    ],
    services: ['E-Commerce Design', 'Front-End Development', 'Content Structure'],
    stack: ['React', 'Tailwind CSS', 'Shopify'],
    image: workImages['cake-craft'],
    art: { pattern: 'stack', from: '#2b1122', to: '#150810', ink: brandOnDark.magenta },
    featured: true,
  },
  {
    slug: 'insight-electrical',
    name: 'Insight Electrical',
    category: 'Web',
    discipline: 'Trade Services Website',
    year: '2025',
    client: 'Insight Electrical Co.',
    sector: 'Electrical & trades',
    headline: 'A project-led site for a Melbourne electrical contractor.',
    summary:
      'A dark, image-forward site for a commercial and industrial electrical contractor, organised around the sectors and project types it actually works in.',
    challenge:
      'Commercial electrical work is won on trust and evidence of relevant experience — the previous presence didn\'t make it easy for a facilities manager to see whether this contractor had done work like theirs before.',
    approach:
      'We structured the site around six sectors — commercial, industrial, education, health, government and hospitality — with a filterable projects gallery showing real categories of work, from car park and sports lighting to thermographic imaging and EV charging installation.',
    outcome: [
      { value: '6', label: 'Project sectors' },
      { value: '4', label: 'Specialist service lines' },
      { value: 'VIC', label: 'Melbourne-based coverage' },
    ],
    services: ['Web Design', 'Front-End Development', 'Project Showcase'],
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    image: workImages['insight-electrical'],
    art: { pattern: 'mesh', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
    featured: true,
  },
  {
    slug: 'backflow-testing-co',
    name: 'Backflow Testing Co',
    category: 'Web',
    discipline: 'Trade Services Website',
    year: '2025',
    client: 'Backflow Testing Co',
    sector: 'Plumbing & trades',
    headline: 'A licensed-plumber site built to answer the compliance questions first.',
    summary:
      'A Brisbane backflow-prevention and TMV testing service, positioned around QBCC licensing and the annual inspection cycle property owners actually need explained.',
    challenge:
      'Backflow and TMV testing is a compliance-driven trade — customers arrive with a specific regulatory question, not a general interest in plumbing, and the old presence didn\'t answer it fast enough.',
    approach:
      'The site leads with licensing and guarantee, then answers the two questions that drive most enquiries — what is a TMV, and what does annual registration actually require — directly on the page, backed by a clear step-by-step for device registration and testing.',
    outcome: [
      { value: 'QBCC', label: 'Licensed positioning' },
      { value: '4', label: 'Core services listed' },
      { value: 'QLD', label: 'Brisbane-based coverage' },
    ],
    services: ['Web Design', 'Front-End Development', 'Compliance Content'],
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    image: workImages['backflow-testing-co'],
    art: { pattern: 'grid', from: '#0d2440', to: '#07131f', ink: brandOnDark.blue },
    featured: true,
  },
  {
    slug: 'solidification-solutions',
    name: 'Solidification Solutions',
    category: 'Web',
    discipline: 'Trade Services Website',
    year: '2025',
    client: 'Solidification Solutions',
    sector: 'Construction & flooring',
    headline: 'A gallery-led site for an Australian concrete, epoxy and timber flooring trade.',
    summary:
      'A before/after-driven site for a flooring contractor spanning three distinct trades — concrete, epoxy and timber — that customers rarely realise come from one team.',
    challenge:
      'Concrete overlay, epoxy coating and timber floor sanding are three different trades with three different buyers. A single generic services page was flattening all of it into one undifferentiated offer.',
    approach:
      'We split the site into three clear service pillars, each with its own finish options — stipple, burnt, exposed aggregate for concrete; matt, satin, gloss for epoxy and timber — and let the work itself carry the page through large, honest photography rather than stock imagery.',
    outcome: [
      { value: '3', label: 'Distinct service pillars' },
      { value: '12+', label: 'Finish options shown' },
      { value: 'AU', label: 'Trade-wide coverage' },
    ],
    services: ['Web Design', 'Front-End Development', 'Trade Photography Layout'],
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    image: workImages['solidification-solutions'],
    art: { pattern: 'mesh', from: '#1c1c1c', to: '#0c0c0c', ink: brandOnDark.red },
    featured: false,
  },
  {
    slug: 'signatures-plus',
    name: 'Signatures Plus',
    category: 'E-Commerce',
    discipline: 'Auction Marketplace',
    year: '2024',
    client: 'Signatures Plus',
    sector: 'Automotive & collectibles',
    headline: "Victoria's boutique auction house for signature number plates.",
    summary:
      'A dark, editorial marketplace for buying, selling and auctioning collectible signature plates — a niche that lives or dies on how premium it feels.',
    challenge:
      'Signature plates are a luxury collectible, not a commodity — the site had to read closer to a boutique auction house than a classifieds listing, while still handling live auctions, direct sales and a straightforward sell-your-plate flow.',
    approach:
      'We built a moody, automotive-led visual language around large plate photography, then structured the core flows — buy, sell, live auctions, results — as distinct paths rather than one crowded marketplace page.',
    outcome: [
      { value: 'VIC', label: 'State-licensed auctions' },
      { value: '3', label: 'Core marketplace flows' },
      { value: 'Live', label: 'Auction & bidding system' },
    ],
    services: ['Web Design', 'Front-End Development', 'Marketplace UX'],
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    image: workImages['signatures-plus'],
    art: { pattern: 'orbit', from: '#1c1c1c', to: '#0a0a0a', ink: brandOnDark.yellow },
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const projectCategories: Array<ProjectCategory | 'All'> = ['All', 'Web', 'E-Commerce', 'Branding']
