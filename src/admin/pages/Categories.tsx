import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { deleteCategory, listCategoriesWithCounts, saveCategory } from '../api'
import type { CategoryWithCount } from '../api'
import { Field, Notice, PageHeader, Spinner, inputClass, primaryButton, smallButton } from '../ui'
import { SLUG_PATTERN, slugify } from '../../lib/blog'
import { friendlyMessage } from '../../lib/supabase'
import { cn } from '../../lib/utils'

type Form = { name: string; slug: string; description: string }
const blank: Form = { name: '', slug: '', description: '' }

export default function Categories() {
  const [rows, setRows] = useState<CategoryWithCount[] | null>(null)
  const [form, setForm] = useState<Form>(blank)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(() => {
    listCategoriesWithCounts()
      .then(setRows)
      .catch((err) => setError(friendlyMessage(err, 'Could not load categories.')))
  }, [])

  useEffect(load, [load])

  const reset = () => {
    setForm(blank)
    setEditingId(null)
    setSlugTouched(false)
  }

  const edit = (c: CategoryWithCount) => {
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '' })
    setEditingId(c.id)
    setSlugTouched(true)
    setError('')
    setNotice('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')
    if (!form.name.trim()) return setError('A category name is required.')
    if (!SLUG_PATTERN.test(form.slug)) return setError('The slug may use lowercase letters, numbers and hyphens only.')
    setBusy(true)
    try {
      await saveCategory(form, editingId ?? undefined)
      setNotice(editingId ? 'Category updated.' : 'Category created.')
      reset()
      load()
    } catch (err) {
      setError(friendlyMessage(err, 'The category could not be saved.'))
    } finally {
      setBusy(false)
    }
  }

  const remove = async (c: CategoryWithCount) => {
    const count = c.posts[0]?.count ?? 0
    const message =
      count > 0
        ? `Delete "${c.name}"? Its ${count} post${count === 1 ? '' : 's'} will be kept but become uncategorised.`
        : `Delete "${c.name}"?`
    if (!window.confirm(message)) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await deleteCategory(c.id)
      if (editingId === c.id) reset()
      setNotice('Category deleted.')
      load()
    } catch (err) {
      setError(friendlyMessage(err, 'The category could not be deleted.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Categories" description="Group posts on the blog. Deleting a category never deletes posts." />

      <div className="mb-6 space-y-3">
        {error && <Notice tone="error">{error}</Notice>}
        {notice && <Notice tone="success">{notice}</Notice>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="order-2 lg:order-1">
          {rows === null && !error && <Spinner label="Loading categories" />}
          {rows?.length === 0 && (
            <p className="rounded-xl border border-line bg-surface p-6 text-sm text-mute">No categories yet.</p>
          )}
          {rows && rows.length > 0 && (
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
              {rows.map((c) => (
                <li
                  key={c.id}
                  className={cn(
                    'flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between',
                    editingId === c.id && 'bg-surface-2/60',
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-bone">{c.name}</p>
                    <p className="truncate text-xs text-mute-dim">
                      /{c.slug} · {c.posts[0]?.count ?? 0} posts
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" className={smallButton} onClick={() => edit(c)} disabled={busy}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={cn(smallButton, 'text-red-500 hover:border-red-400/60')}
                      onClick={() => remove(c)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="order-1 h-fit space-y-5 rounded-xl border border-line bg-surface p-5 lg:order-2"
        >
          <h2 className="eyebrow">{editingId ? 'Edit category' : 'New category'}</h2>
          <Field id="cat-name" label="Name" required>
            <input
              id="cat-name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: slugTouched ? f.slug : slugify(e.target.value),
                }))
              }
              className={inputClass}
            />
          </Field>
          <Field id="cat-slug" label="Slug" required hint="Used in /blog?category=…">
            <input
              id="cat-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setForm((f) => ({ ...f, slug: e.target.value.toLowerCase() }))
              }}
              className={cn(inputClass, 'font-mono')}
            />
          </Field>
          <Field id="cat-description" label="Description">
            <textarea
              id="cat-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={cn(inputClass, 'resize-y')}
            />
          </Field>
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={primaryButton}>
              {busy && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {editingId ? 'Save' : 'Create'}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className={smallButton}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
