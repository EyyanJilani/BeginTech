/*
  Shared JSON-LD builders. The Organization and WebSite nodes themselves live
  in index.html (so they are on every page, including before JS runs); route
  schema here only references them by @id, which keeps a single source of
  truth for company facts.
*/

export const ORIGIN = 'https://begintech.co'
export const ORG_ID = `${ORIGIN}/#organization`
export const WEBSITE_ID = `${ORIGIN}/#website`

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${ORIGIN}${c.path}`,
    })),
  }
}
