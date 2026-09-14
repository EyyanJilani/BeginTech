import { useEffect } from 'react'

type Seo = {
  title: string
  description: string
  path?: string
}

const ORIGIN = 'https://begintech.co'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Per-route document metadata — title, description, canonical and OG tags. */
export function useSeo({ title, description, path }: Seo) {
  useEffect(() => {
    document.title = title

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    const url = `${ORIGIN}${path ?? window.location.pathname}`
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [title, description, path])
}
