import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CallToAction } from '../../components/sections/CallToAction'
import { BlogCard } from '../../components/blog/BlogCard'
import { Markdown } from '../../components/blog/Markdown'
import { useSeo } from '../../hooks/useSeo'
import { useJsonLd } from '../../hooks/useJsonLd'
import { ORG_ID, ORIGIN, breadcrumbSchema } from '../../lib/schema'
import { formatDate, getPublishedPost, getRelatedPosts } from '../../lib/blog'
import type { Post, PostSummary } from '../../lib/blog'
import { friendlyMessage } from '../../lib/supabase'
import NotFound from '../NotFound'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing' }
  | { status: 'ready'; post: Post }

export default function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>()
  /* Results are stored against the slug they belong to, so navigating to
     another post reads as "loading" immediately without resetting state
     inside the effect. */
  const [result, setResult] = useState<{ slug: string; state: State } | null>(null)
  const [relatedFor, setRelatedFor] = useState<{ slug: string; posts: PostSummary[] } | null>(null)

  useEffect(() => {
    let cancelled = false
    getPublishedPost(slug)
      .then((post) => {
        if (cancelled) return
        if (!post) {
          setResult({ slug, state: { status: 'missing' } })
          return
        }
        setResult({ slug, state: { status: 'ready', post } })
        getRelatedPosts(post)
          .then((posts) => !cancelled && setRelatedFor({ slug, posts }))
          .catch(() => {})
      })
      .catch((err) => {
        if (!cancelled)
          setResult({
            slug,
            state: { status: 'error', message: friendlyMessage(err, 'This article could not be loaded right now.') },
          })
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const state: State = result?.slug === slug ? result.state : { status: 'loading' }
  const related = relatedFor?.slug === slug ? relatedFor.posts : []

  const post = state.status === 'ready' ? state.post : null
  const url = `${ORIGIN}/blog/${slug}`
  const description = post ? post.seo_description || post.excerpt || post.title : ''

  useSeo({
    title: post
      ? post.seo_title || `${post.title} | BeginTech Blog`
      : state.status === 'missing'
        ? 'Page not found — BeginTech'
        : 'BeginTech Blog',
    description: post ? description : 'Articles from BeginTech on web development, apps and AI.',
    path: state.status === 'missing' || state.status === 'error' ? undefined : `/blog/${slug}`,
    image: post?.featured_image ?? undefined,
    type: post ? 'article' : 'website',
    // A transient load failure must never be indexed as the article.
    noindex: state.status === 'missing' || state.status === 'error',
    keywords: post?.seo_keywords ?? undefined,
    publishedTime: post?.published_at ?? undefined,
    modifiedTime: post?.updated_at,
  })

  useJsonLd(
    'article-jsonld',
    post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: post.title.slice(0, 110),
          description,
          image: [post.featured_image || `${ORIGIN}/og.png`],
          datePublished: post.published_at,
          dateModified: post.updated_at,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          url,
          ...(post.category ? { articleSection: post.category.name } : {}),
          ...(post.seo_keywords ? { keywords: post.seo_keywords } : {}),
          inLanguage: 'en',
          author: post.author?.full_name
            ? { '@type': 'Person', name: post.author.full_name, worksFor: { '@id': ORG_ID } }
            : { '@type': 'Organization', '@id': ORG_ID, name: 'BeginTech', url: `${ORIGIN}/` },
          publisher: {
            '@type': 'Organization',
            '@id': ORG_ID,
            name: 'BeginTech',
            logo: { '@type': 'ImageObject', url: `${ORIGIN}/favicon-512.png`, width: 512, height: 512 },
          },
        }
      : null,
  )

  useJsonLd(
    'breadcrumb-jsonld',
    post
      ? breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])
      : null,
  )

  if (state.status === 'missing') return <NotFound />

  if (state.status === 'error') {
    return (
      <section className="shell flex min-h-[70vh] flex-col items-start justify-center gap-6 pt-36">
        <p className="eyebrow">Blog</p>
        <p role="alert" className="lede max-w-xl">
          {state.message}
        </p>
        <Link to="/blog" className="link-underline text-sm text-bone">
          Back to all articles
        </Link>
      </section>
    )
  }

  if (!post) return <ArticleSkeleton />

  const published = formatDate(post.published_at)
  const meta = [
    post.author?.full_name && { label: 'Author', value: post.author.full_name },
    published && { label: 'Published', value: published },
    post.reading_time && { label: 'Reading time', value: `${post.reading_time} min` },
    post.category && { label: 'Category', value: post.category.name },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <article>
        <header className="relative overflow-hidden pb-12 pt-36 md:pb-16 md:pt-48">
          <div
            aria-hidden="true"
            className="grid-lines pointer-events-none absolute inset-0 opacity-40 mask-fade-b"
          />
          <div className="shell relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-mute-dim">
                <li>
                  <Link to="/" className="link-underline hover:text-bone">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/blog" className="link-underline hover:text-bone">
                    Blog
                  </Link>
                </li>
              </ol>
            </nav>

            {post.category && (
              <Link
                to={`/blog?category=${post.category.slug}`}
                className="eyebrow mb-7 inline-flex items-center gap-3 hover:text-bone"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                {post.category.name}
              </Link>
            )}

            <h1 className="display-md max-w-[22ch] text-bone">{post.title}</h1>
            {post.excerpt && <p className="lede mt-8 max-w-2xl">{post.excerpt}</p>}

            {meta.length > 0 && (
              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 md:grid-cols-4">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim">{m.label}</dt>
                    <dd className="mt-2 font-display text-lg tracking-tight text-bone">
                      {m.label === 'Published' ? (
                        <time dateTime={post.published_at ?? undefined}>{m.value}</time>
                      ) : (
                        m.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </header>

        {post.featured_image && (
          <div className="shell">
            <div className="aspect-[16/9] overflow-hidden rounded-xl border border-line bg-surface">
              <img
                src={post.featured_image}
                alt={post.title}
                width={1600}
                height={900}
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="shell py-16 md:py-24">
          <div className="mx-auto max-w-[44rem]">
            <Markdown>{post.content}</Markdown>

            <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/blog" className="link-underline text-sm text-mute hover:text-bone">
                All articles
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 text-sm text-bone">
                <span className="link-underline">Talk to us about your project</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line py-24 md:py-32" aria-labelledby="related-heading">
          <div className="shell">
            <div className="mb-14 flex items-end justify-between gap-8">
              <h2 id="related-heading" className="display-sm text-bone">
                Related articles
              </h2>
              <Link to="/blog" className="link-underline shrink-0 text-sm text-mute hover:text-bone">
                All articles
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CallToAction />
    </>
  )
}

function ArticleSkeleton() {
  return (
    <div className="shell animate-pulse pb-24 pt-36 md:pt-48" role="status" aria-live="polite">
      <span className="sr-only">Loading article</span>
      <div className="h-3 w-24 rounded bg-surface-2" />
      <div className="mt-8 h-12 w-full max-w-3xl rounded bg-surface-2" />
      <div className="mt-4 h-12 w-2/3 max-w-2xl rounded bg-surface-2" />
      <div className="mt-10 h-4 w-full max-w-xl rounded bg-surface-2" />
      <div className="mt-16 aspect-[16/9] w-full rounded-xl bg-surface-2" />
    </div>
  )
}
