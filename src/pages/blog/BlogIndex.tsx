import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PageHero } from '../../components/sections/PageHero'
import { CallToAction } from '../../components/sections/CallToAction'
import { BlogCard, BlogCardSkeleton } from '../../components/blog/BlogCard'
import { Button } from '../../components/ui/Button'
import { useSeo } from '../../hooks/useSeo'
import { useJsonLd } from '../../hooks/useJsonLd'
import { breadcrumbSchema } from '../../lib/schema'
import { listCategories, listPublishedPosts, PAGE_SIZE } from '../../lib/blog'
import type { Category, PostSummary } from '../../lib/blog'
import { friendlyMessage } from '../../lib/supabase'
import { cn } from '../../lib/utils'

type Feed = {
  /** The filter this result belongs to — see `key` below. */
  key: string
  status: 'ready' | 'error'
  posts: PostSummary[]
  total: number
  page: number
  error: string
}

export default function BlogIndex() {
  const [params, setParams] = useSearchParams()
  const categorySlug = params.get('category') ?? ''
  const search = params.get('q') ?? ''

  const [categories, setCategories] = useState<Category[] | null>(null)
  const [feed, setFeed] = useState<Feed | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [moreError, setMoreError] = useState('')
  const [draft, setDraft] = useState(search)

  useSeo({
    title: 'Blog — Web Development, AI & Software Insights | BeginTech',
    description:
      'Articles from BeginTech, a web development and software company in Karachi, on building websites, apps, AI chatbots and digital products.',
    path: '/blog',
  })

  useJsonLd(
    'breadcrumb-jsonld',
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
  )

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const activeCategory = categories?.find((c) => c.slug === categorySlug)
  // An unknown category in the URL shows an empty result, not every post.
  const unknownCategory = Boolean(categorySlug && categories && !activeCategory)
  const key = `${categorySlug}|${search}`

  /* First page for the current filter. Results are stored with the key they
     were fetched for, so a filter change reads as "loading" straight away. */
  useEffect(() => {
    if (categorySlug && !categories) return // wait: the query filters by category id
    if (unknownCategory) return
    let cancelled = false
    listPublishedPosts({ page: 0, categoryId: activeCategory?.id, search })
      .then(({ posts, total }) => {
        if (!cancelled) setFeed({ key, status: 'ready', posts, total, page: 0, error: '' })
      })
      .catch((err) => {
        if (!cancelled)
          setFeed({
            key,
            status: 'error',
            posts: [],
            total: 0,
            page: 0,
            error: friendlyMessage(err, 'We could not load articles right now. Please try again shortly.'),
          })
      })
    return () => {
      cancelled = true
    }
  }, [key, categorySlug, categories, unknownCategory, activeCategory?.id, search])

  const current: Feed | null = unknownCategory
    ? { key, status: 'ready', posts: [], total: 0, page: 0, error: '' }
    : feed?.key === key
      ? feed
      : null
  const status = current?.status ?? 'loading'
  const posts = current?.posts ?? []
  const total = current?.total ?? 0

  /* Debounced search → URL, so results are shareable and survive refresh. */
  useEffect(() => {
    if (draft === search) return
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(params)
      if (draft.trim()) next.set('q', draft.trim())
      else next.delete('q')
      setParams(next, { replace: true })
    }, 350)
    return () => window.clearTimeout(id)
  }, [draft, search, params, setParams])

  const selectCategory = (slug: string) => {
    const next = new URLSearchParams(params)
    if (slug) next.set('category', slug)
    else next.delete('category')
    setParams(next, { replace: true })
  }

  const loadMore = async () => {
    if (!current) return
    setLoadingMore(true)
    setMoreError('')
    try {
      const nextPage = current.page + 1
      const { posts: rows } = await listPublishedPosts({
        page: nextPage,
        categoryId: activeCategory?.id,
        search,
      })
      setFeed({ ...current, posts: [...current.posts, ...rows], page: nextPage })
    } catch (err) {
      setMoreError(friendlyMessage(err, 'Could not load more articles.'))
    } finally {
      setLoadingMore(false)
    }
  }

  const filtered = Boolean(categorySlug || search)
  const [lead, ...rest] = posts
  const showLead = !filtered && lead

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={
          <>
            BeginTech <span className="accent-em">Blog</span>
          </>
        }
        lede="Notes from our team in Karachi on web development, mobile apps, AI and the business side of building digital products — written from the work, not for the algorithm."
      />

      <section className="border-t border-line py-14 md:py-20" aria-labelledby="articles-heading">
        <div className="shell">
          <h2 id="articles-heading" className="sr-only">
            Articles
          </h2>

          {/* Filters */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
              {[{ slug: '', name: 'All' }, ...(categories ?? [])].map((c) => (
                <button
                  key={c.slug || 'all'}
                  type="button"
                  onClick={() => selectCategory(c.slug)}
                  aria-pressed={categorySlug === c.slug}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs transition-colors duration-400',
                    categorySlug === c.slug
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-mute hover:border-line-strong hover:text-bone',
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:max-w-xs">
              <span className="sr-only">Search articles</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-mute-dim"
              />
              <input
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search articles"
                className="w-full border-b border-line bg-transparent py-3 pl-7 text-sm text-bone outline-none transition-colors placeholder:text-mute-dim/70 focus:border-accent"
              />
            </label>
          </div>

          <div className="mt-14 md:mt-20">
            {status === 'loading' && (
              <div className="space-y-16" role="status" aria-live="polite">
                <span className="sr-only">Loading articles</span>
                {!filtered && <BlogCardSkeleton featured />}
                <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            )}

            {status === 'error' && (
              <p role="alert" className="py-16 text-center text-sm text-mute">
                {current?.error}
              </p>
            )}

            {status === 'ready' && posts.length === 0 && (
              <p className="py-16 text-center text-sm text-mute">
                {filtered
                  ? 'No articles match that filter yet.'
                  : 'Our first articles are on their way. Check back soon.'}
              </p>
            )}

            {status === 'ready' && posts.length > 0 && (
              <>
                {showLead && <BlogCard post={lead} featured className="mb-20 md:mb-24" />}
                <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
                  {(showLead ? rest : posts).map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {moreError && (
                  <p role="alert" className="mt-10 text-center text-sm text-mute">
                    {moreError}
                  </p>
                )}
                {posts.length < total && (
                  <div className="mt-16 flex justify-center">
                    <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                      {loadingMore ? 'Loading…' : 'Load more articles'}
                    </Button>
                  </div>
                )}
                {posts.length >= total && total > PAGE_SIZE && (
                  <p className="mt-16 text-center text-xs text-mute-dim">You have reached the end.</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  )
}
