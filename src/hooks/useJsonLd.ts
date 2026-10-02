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
    const json = JSON.stringify(data)
    tag.textContent = json

    return () => {
      // During a route transition the incoming page may already have taken
      // over this id; only remove the tag if it still holds our content.
      if (tag?.textContent === json) tag.remove()
    }
  }, [id, data])
}
