import { db } from './supabase'

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
}

export type PostSummary = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  reading_time: number | null
  category: Pick<Category, 'id' | 'name' | 'slug'> | null
}

export type Post = PostSummary & {
  content: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  author: { full_name: string | null } | null
}

export const PAGE_SIZE = 9

const SUMMARY_COLUMNS =
  'id,title,slug,excerpt,featured_image,published_at,reading_time,category:categories(id,name,slug)'

/*
  Public queries. RLS already limits anonymous reads to published posts, but
  the filters are repeated here so that a signed-in admin browsing the public
  blog sees exactly what visitors see, never their own drafts.
*/
function publishedPosts(columns: string) {
  return db()
    .from('posts')
    .select(columns, { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
}

/** Strips characters that would break a PostgREST `or=` filter. */
function cleanSearch(q: string) {
  return q.replace(/[%,()*\\]/g, ' ').trim().slice(0, 80)
}

export async function listPublishedPosts({
  page = 0,
  categoryId,
  search,
}: {
  page?: number
  categoryId?: string
  search?: string
}) {
  let query = publishedPosts(SUMMARY_COLUMNS)
  if (categoryId) query = query.eq('category_id', categoryId)
  const q = search ? cleanSearch(search) : ''
  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)

  const from = page * PAGE_SIZE
  const { data, error, count } = await query
    .order('published_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)
  if (error) throw error
  return { posts: (data ?? []) as unknown as PostSummary[], total: count ?? 0 }
}

export async function getPublishedPost(slug: string) {
  const { data, error } = await publishedPosts(
    `${SUMMARY_COLUMNS},content,updated_at,seo_title,seo_description,seo_keywords,author:profiles(full_name)`,
  )
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data as unknown as Post | null
}

/** Same category first, then most recent, never the post itself. */
export async function getRelatedPosts(post: Pick<Post, 'id' | 'category'>, limit = 3) {
  const related: PostSummary[] = []
  if (post.category) {
    const { data, error } = await publishedPosts(SUMMARY_COLUMNS)
      .eq('category_id', post.category.id)
      .neq('id', post.id)
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    related.push(...((data ?? []) as unknown as PostSummary[]))
  }
  if (related.length < limit) {
    const exclude = [post.id, ...related.map((p) => p.id)]
    const { data, error } = await publishedPosts(SUMMARY_COLUMNS)
      .not('id', 'in', `(${exclude.join(',')})`)
      .order('published_at', { ascending: false })
      .limit(limit - related.length)
    if (error) throw error
    related.push(...((data ?? []) as unknown as PostSummary[]))
  }
  return related
}

export async function listCategories() {
  const { data, error } = await db()
    .from('categories')
    .select('id,name,slug,description')
    .order('name')
  if (error) throw error
  return (data ?? []) as Category[]
}

/* ------------------------------------------------------------------ */
/* Shared helpers (public + admin)                                     */
/* ------------------------------------------------------------------ */

export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/g, '')
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** ~200 words per minute, never less than one minute. */
export function readingTime(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
