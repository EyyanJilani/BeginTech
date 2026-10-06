import { db } from '../lib/supabase'
import { FriendlyError } from '../lib/supabase'
import { readingTime } from '../lib/blog'
import type { Category } from '../lib/blog'

/*
  Admin data access. Every call here runs as the signed-in user; Postgres
  RLS (is_admin()) decides whether it succeeds.
*/

export type AdminPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published'
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  reading_time: number | null
  created_at: string
  updated_at: string
  category?: { name: string } | null
}

export type PostInput = Omit<
  AdminPost,
  'id' | 'created_at' | 'updated_at' | 'reading_time' | 'author_id' | 'category'
>

/*
  RLS doesn't raise on UPDATE/DELETE it filters out — it just affects zero
  rows. Asking for the affected ids back turns that silent no-op into an
  explicit permission error.
*/
function ensureAffected(rows: unknown[] | null) {
  if (!rows || rows.length === 0)
    throw new FriendlyError('Nothing was changed — you may not have permission, or the item no longer exists.')
}

/* ---------------------------------- posts --------------------------------- */

export async function listAllPosts() {
  const { data, error } = await db()
    .from('posts')
    .select(
      'id,title,slug,status,published_at,updated_at,created_at,category_id,category:categories(name)',
    )
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as AdminPost[]
}

export async function getPost(id: string) {
  const { data, error } = await db().from('posts').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as AdminPost | null
}

/** True when no other post uses this slug. */
export async function isSlugAvailable(slug: string, exceptId?: string) {
  let q = db().from('posts').select('id', { head: true, count: 'exact' }).eq('slug', slug)
  if (exceptId) q = q.neq('id', exceptId)
  const { count, error } = await q
  if (error) throw error
  return (count ?? 0) === 0
}

function normalise(input: PostInput) {
  const blank = (v: string | null) => (v && v.trim() ? v.trim() : null)
  return {
    ...input,
    title: input.title.trim(),
    excerpt: blank(input.excerpt),
    featured_image: blank(input.featured_image),
    seo_title: blank(input.seo_title),
    seo_description: blank(input.seo_description),
    seo_keywords: blank(input.seo_keywords),
    reading_time: readingTime(input.content),
  }
}

export async function createPost(input: PostInput, authorId: string) {
  const { data, error } = await db()
    .from('posts')
    .insert({ ...normalise(input), author_id: authorId })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

export async function updatePost(id: string, input: PostInput) {
  const { data, error } = await db().from('posts').update(normalise(input)).eq('id', id).select('id')
  if (error) throw error
  ensureAffected(data)
}

export async function setPostStatus(id: string, status: 'draft' | 'published') {
  // published_at is filled in by a database trigger when first published.
  const { data, error } = await db().from('posts').update({ status }).eq('id', id).select('id')
  if (error) throw error
  ensureAffected(data)
}

export async function deletePost(id: string) {
  const { data, error } = await db().from('posts').delete().eq('id', id).select('id')
  if (error) throw error
  ensureAffected(data)
}

/* ------------------------------- categories ------------------------------- */

export type CategoryWithCount = Category & { posts: { count: number }[] }

export async function listCategoriesWithCounts() {
  const { data, error } = await db()
    .from('categories')
    .select('id,name,slug,description,posts(count)')
    .order('name')
  if (error) throw error
  return (data ?? []) as unknown as CategoryWithCount[]
}

export async function saveCategory(
  input: { name: string; slug: string; description: string },
  id?: string,
) {
  const row = {
    name: input.name.trim(),
    slug: input.slug.trim(),
    description: input.description.trim() || null,
  }
  const { data, error } = id
    ? await db().from('categories').update(row).eq('id', id).select('id')
    : await db().from('categories').insert(row).select('id')
  if (error) throw error
  ensureAffected(data)
}

export async function deleteCategory(id: string) {
  // Posts keep existing — the FK is ON DELETE SET NULL.
  const { data, error } = await db().from('categories').delete().eq('id', id).select('id')
  if (error) throw error
  ensureAffected(data)
}

/* -------------------------------- dashboard ------------------------------- */

export async function getStats() {
  const count = async (status?: 'draft' | 'published') => {
    let q = db().from('posts').select('id', { head: true, count: 'exact' })
    if (status) q = q.eq('status', status)
    const { count: n, error } = await q
    if (error) throw error
    return n ?? 0
  }
  const categories = async () => {
    const { count: n, error } = await db()
      .from('categories')
      .select('id', { head: true, count: 'exact' })
    if (error) throw error
    return n ?? 0
  }
  const [total, published, drafts, cats] = await Promise.all([
    count(),
    count('published'),
    count('draft'),
    categories(),
  ])
  return { total, published, drafts, categories: cats }
}

/* --------------------------------- images --------------------------------- */

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_INPUT_BYTES = 10 * 1024 * 1024 // before compression
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // bucket limit
const MAX_WIDTH = 1920

/** Downscale to MAX_WIDTH and re-encode as WebP. GIFs are kept as-is (animation). */
async function optimise(file: File): Promise<Blob> {
  if (file.type === 'image/gif') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.82))
  if (!blob) throw new FriendlyError('This image could not be processed. Try a JPG or PNG.')
  return blob
}

function safeBaseName(name: string) {
  const base = name.replace(/\.[^.]+$/, '')
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image'
  )
}

/** Validates, optimises and uploads an image; returns its public URL. */
export async function uploadImage(file: File) {
  if (!ALLOWED.includes(file.type))
    throw new FriendlyError('Please upload a JPG, PNG, WebP, GIF or AVIF image.')
  if (file.size > MAX_INPUT_BYTES) throw new FriendlyError('That image is larger than 10 MB.')

  const blob = await optimise(file)
  if (blob.size > MAX_UPLOAD_BYTES)
    throw new FriendlyError('That image is still over 5 MB after compression. Try a smaller one.')

  const ext = blob.type === 'image/gif' ? 'gif' : 'webp'
  const now = new Date()
  const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${safeBaseName(file.name)}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const bucket = db().storage.from('blog-images')
  const { error } = await bucket.upload(path, blob, {
    contentType: blob.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new FriendlyError('Upload failed. Check that you are signed in as an admin and try again.')
  return bucket.getPublicUrl(path).data.publicUrl
}
