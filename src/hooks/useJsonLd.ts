import { useEffect } from 'react'

/**
 * Injects a route-scoped JSON-LD script tag, keyed by id so a route change
 * replaces rather than stacks scripts, and removes it on unmount so it never
 * leaks onto a page it doesn't describe.
 */
export function useJsonLd(id: string, data: object | null) {
  useEffect(() => {
    if (!data) return

    let tag = document.getElementById(id) as HTMLScriptElement | null
    if (!tag) {
      tag = document.createElement('script')
      tag.id = id
      tag.type = 'application/ld+json'
      document.head.appendChild(tag)
    }
    tag.textContent = JSON.stringify(data)

    return () => {
      tag?.remove()
    }
  }, [id, data])
}
