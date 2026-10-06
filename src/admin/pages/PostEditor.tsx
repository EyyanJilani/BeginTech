import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, ImagePlus, Loader2, X } from 'lucide-react'
import { createPost, getPost, isSlugAvailable, updatePost, uploadImage } from '../api'
import type { PostInput } from '../api'
import { useAdminAuth } from '../authContext'
import { MarkdownEditor } from '../MarkdownEditor'
import { Field, Notice, PageHeader, Spinner, inputClass, primaryButton, smallButton } from '../ui'
import { listCategories, SLUG_PATTERN, slugify } from '../../lib/blog'
import type { Category } from '../../lib/blog'
import { friendlyMessage } from '../../lib/supabase'
import { cn } from '../../lib/utils'

const empty: PostInput = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  category_id: null,
  status: 'draft',
  published_at: null,
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
}

type Errors = Partial<Record<keyof PostInput, string>>

/** ISO → value for <input type="datetime-local"> in the editor's local time. */
function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

function validate(v: PostInput): Errors {
  const e: Errors = {}
  if (!v.title.trim()) e.title = 'A title is required.'
  else if (v.title.length > 200) e.title = 'Keep the title under 200 characters.'
  if (!SLUG_PATTERN.test(v.slug)) e.slug = 'Use lowercase letters, numbers and single hyphens only.'
  if ((v.excerpt ?? '').length > 500) e.excerpt = 'Keep the excerpt under 500 characters.'
  if (v.status === 'published' && !v.content.trim()) e.content = 'A published post needs content.'
  if (v.featured_image && !/^https:\/\/\S+$/.test(v.featured_image.trim()))
    e.featured_image = 'Use an https:// image URL, or upload an image.'
  if ((v.seo_title ?? '').length > 120) e.seo_title = 'Keep the SEO title under 120 characters.'
  if ((v.seo_description ?? '').length > 320) e.seo_description = 'Keep the SEO description under 320 characters.'
  return e
}

function Counter({ value, ideal }: { value: string | null; ideal: number }) {
  const n = (value ?? '').length
  return (
    <span className={cn(n > ideal ? 'text-accent-2' : 'text-mute-dim')}>
      {n}/{ideal} recommended
    </span>
  )
}

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const { state } = useAdminAuth()
  const location = useLocation()
  const justCreated = (location.state as { created?: boolean } | null)?.created

  const [values, setValues] = useState<PostInput>(empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [missing, setMissing] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(justCreated ? 'Post created.' : '')
  const [dirty, setDirty] = useState(false)
  const slugTouched = useRef(!isNew)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories.'))
  }, [])

  useEffect(() => {
    if (!id) return
    // An existing post's slug is never auto-rewritten from its title — this
    // also covers the hop from /new to /:id/edit, which reuses this instance.
    slugTouched.current = true
    getPost(id)
      .then((post) => {
        if (!post) {
          setMissing(true)
          return
        }
        setValues({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          content: post.content,
          featured_image: post.featured_image ?? '',
          category_id: post.category_id,
          status: post.status,
          published_at: post.published_at,
          seo_title: post.seo_title ?? '',
          seo_description: post.seo_description ?? '',
          seo_keywords: post.seo_keywords ?? '',
        })
      })
      .catch((err) => setError(friendlyMessage(err, 'Could not load this post.')))
      .finally(() => setLoading(false))
  }, [id])

  /* Warn before leaving with unsaved edits. */
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) => {
    setDirty(true)
    setSaved('')
    setValues((v) => {
      const next = { ...v, [key]: value }
      // The slug follows the title until someone edits it by hand.
      if (key === 'title' && !slugTouched.current) next.slug = slugify(String(value))
      return next
    })
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const checkSlug = async () => {
    if (!SLUG_PATTERN.test(values.slug)) return
    try {
      if (!(await isSlugAvailable(values.slug, id)))
        setErrors((e) => ({ ...e, slug: 'Another post already uses this slug.' }))
    } catch {
      /* the save will check again */
    }
  }

  const onFeaturedUpload = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      set('featured_image', await uploadImage(file))
    } catch (err) {
      setError(friendlyMessage(err, 'Image upload failed.'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved('')
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setError('Please fix the highlighted fields.')
      return
    }
    if (state.status !== 'admin') return

    setSaving(true)
    try {
      if (!(await isSlugAvailable(values.slug, id))) {
        setErrors({ slug: 'Another post already uses this slug.' })
        setError('Please fix the highlighted fields.')
        return
      }
      if (isNew) {
        const newId = await createPost(values, state.user.id)
        setDirty(false)
        navigate(`/admin/posts/${newId}/edit`, { replace: true, state: { created: true } })
      } else {
        await updatePost(id, values)
        setDirty(false)
        setSaved(
          values.status === 'published'
            ? 'Saved and live. New posts reach the sitemap after the next site rebuild.'
            : 'Draft saved.',
        )
      }
    } catch (err) {
      setError(friendlyMessage(err, 'The post could not be saved.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner label="Loading post" />
  if (missing) {
    return (
      <>
        <PageHeader title="Post not found" />
        <Link to="/admin/posts" className="link-underline text-sm text-bone">
          Back to posts
        </Link>
      </>
    )
  }

  const aria = (key: keyof PostInput) => ({
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <PageHeader
        title={isNew ? 'New post' : 'Edit post'}
        actions={
          <>
            {!isNew && values.status === 'published' && (
              <a href={`/blog/${values.slug}`} target="_blank" rel="noopener" className={smallButton}>
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                View
              </a>
            )}
            <Link to="/admin/posts" className={smallButton}>
              Cancel
            </Link>
            <button type="submit" disabled={saving || uploading} className={primaryButton}>
              {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving' : isNew ? 'Create post' : 'Save changes'}
            </button>
          </>
        }
      />

      <div className="mb-6 space-y-3">
        {error && <Notice tone="error">{error}</Notice>}
        {saved && <Notice tone="success">{saved}</Notice>}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_20rem]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <Field id="title" label="Title" required error={errors.title}>
            <input
              id="title"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              className={cn(inputClass, 'text-base')}
              {...aria('title')}
            />
          </Field>

          <Field
            id="slug"
            label="Slug"
            required
            error={errors.slug}
            hint={
              <>
                begintech.co/blog/{values.slug || '…'}
                {!isNew && values.status === 'published' && (
                  <> · Changing the slug of a published post breaks existing links to it.</>
                )}
              </>
            }
          >
            <input
              id="slug"
              value={values.slug}
              onChange={(e) => {
                slugTouched.current = true
                set('slug', e.target.value.toLowerCase())
              }}
              onBlur={checkSlug}
              className={cn(inputClass, 'font-mono')}
              {...aria('slug')}
            />
          </Field>

          <Field
            id="excerpt"
            label="Excerpt"
            error={errors.excerpt}
            hint="One or two sentences shown on blog cards and under the title."
          >
            <textarea
              id="excerpt"
              rows={3}
              value={values.excerpt ?? ''}
              onChange={(e) => set('excerpt', e.target.value)}
              className={cn(inputClass, 'resize-y')}
              {...aria('excerpt')}
            />
          </Field>

          <Field id="content" label="Content" error={errors.content}>
            <MarkdownEditor
              id="content"
              value={values.content}
              onChange={(v) => set('content', v)}
              invalid={Boolean(errors.content)}
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="space-y-5 rounded-xl border border-line bg-surface p-5">
            <h2 className="eyebrow">Publishing</h2>
            <Field id="status" label="Status">
              <select
                id="status"
                value={values.status}
                onChange={(e) => set('status', e.target.value as PostInput['status'])}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field
              id="published_at"
              label="Published date"
              hint="Leave empty to use the moment you publish. A future date schedules the post."
            >
              <input
                id="published_at"
                type="datetime-local"
                value={toLocalInput(values.published_at)}
                onChange={(e) =>
                  set('published_at', e.target.value ? new Date(e.target.value).toISOString() : null)
                }
                className={inputClass}
              />
            </Field>
            <Field id="category" label="Category">
              <select
                id="category"
                value={values.category_id ?? ''}
                onChange={(e) => set('category_id', e.target.value || null)}
                className={inputClass}
              >
                <option value="">Uncategorised</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </section>

          <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
            <h2 className="eyebrow">Featured image</h2>
            {values.featured_image && !errors.featured_image ? (
              <div className="relative overflow-hidden rounded-lg border border-line">
                <img src={values.featured_image} alt="" className="aspect-[16/10] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => set('featured_image', '')}
                  aria-label="Remove featured image"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong text-sm text-mute transition-colors hover:border-accent hover:text-bone"
              >
                {uploading ? (
                  <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                ) : (
                  <ImagePlus aria-hidden="true" className="h-5 w-5" />
                )}
                {uploading ? 'Uploading' : 'Upload image'}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => onFeaturedUpload(e.target.files?.[0])}
            />
            <Field
              id="featured_image"
              label="…or image URL"
              error={errors.featured_image}
              hint="JPG/PNG/WebP up to 10 MB; resized to 1920px and converted to WebP."
            >
              <input
                id="featured_image"
                value={values.featured_image ?? ''}
                onChange={(e) => set('featured_image', e.target.value)}
                placeholder="https://"
                className={inputClass}
                {...aria('featured_image')}
              />
            </Field>
          </section>

          <section className="space-y-5 rounded-xl border border-line bg-surface p-5">
            <h2 className="eyebrow">SEO</h2>
            <Field
              id="seo_title"
              label="SEO title"
              error={errors.seo_title}
              hint={<Counter value={values.seo_title} ideal={60} />}
            >
              <input
                id="seo_title"
                value={values.seo_title ?? ''}
                onChange={(e) => set('seo_title', e.target.value)}
                placeholder={values.title ? `${values.title} | BeginTech Blog` : ''}
                className={inputClass}
                {...aria('seo_title')}
              />
            </Field>
            <Field
              id="seo_description"
              label="SEO description"
              error={errors.seo_description}
              hint={<Counter value={values.seo_description} ideal={160} />}
            >
              <textarea
                id="seo_description"
                rows={3}
                value={values.seo_description ?? ''}
                onChange={(e) => set('seo_description', e.target.value)}
                placeholder={values.excerpt ?? ''}
                className={cn(inputClass, 'resize-y')}
                {...aria('seo_description')}
              />
            </Field>
            <Field id="seo_keywords" label="SEO keywords" hint="Comma-separated.">
              <input
                id="seo_keywords"
                value={values.seo_keywords ?? ''}
                onChange={(e) => set('seo_keywords', e.target.value)}
                className={inputClass}
              />
            </Field>
          </section>
        </div>
      </div>
    </form>
  )
}
