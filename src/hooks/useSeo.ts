import { useEffect } from 'react'
import { ORIGIN } from '../lib/schema'

type Seo = {
  title: string
  description: string
  path?: string
  /** Absolute URL of the share image. Defaults to the site-wide OG card. */
  image?: string
  type?: 'website' | 'article'
  /** Keeps the page out of the index (404s, thin utility pages). */
  noindex?: boolean
}

const DEFAULT_IMAGE = `${ORIGIN}/og.png`

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Per-route document metadata — title, description, canonical, robots, OG and Twitter tags. */
export function useSeo({ title, description, path, image, type = 'website', noindex }: Seo) {
  useEffect(() => {
    document.title = title
    const shareImage = image ?? DEFAULT_IMAGE

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    )
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:image"]', 'property', 'og:image', shareImage)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImage)

    const url = `${ORIGIN}${path ?? window.location.pathname}`
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)

    // A noindexed page shouldn't nominate itself (or anything else) as canonical.
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (noindex) {
      link?.remove()
      return
    }
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [title, description, path, image, type, noindex])
}
