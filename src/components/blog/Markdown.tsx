import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'

/*
  Safe Markdown rendering. react-markdown builds React elements from a syntax
  tree — it never uses innerHTML — and raw HTML inside the Markdown is not
  rendered (no rehype-raw). Its default urlTransform strips javascript:/data:
  style URLs from links and images. So content written in the admin can format
  text but cannot inject script. `skipHtml` drops raw HTML instead of showing
  it as escaped text.
*/

const SITE_HOSTS = new Set(['begintech.co', 'www.begintech.co'])

function isExternal(href: string) {
  try {
    const url = new URL(href, 'https://begintech.co')
    return !SITE_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

const components: Components = {
  // The article title is the page's only H1; demote any # heading in the body.
  h1: ({ children }) => <h2>{children}</h2>,
  a: ({ href = '', children }) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    ),
  img: ({ src, alt }) => (
    <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" decoding="async" />
  ),
}

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose-bt', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  )
}
