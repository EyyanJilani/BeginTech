import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { deletePost, listAllPosts, setPostStatus } from '../api'
import type { AdminPost } from '../api'
import { Notice, PageHeader, Spinner, StatusBadge, primaryButton, smallButton } from '../ui'
import { friendlyMessage } from '../../lib/supabase'
import { formatDate } from '../../lib/blog'
import { cn } from '../../lib/utils'

export default function Posts() {
  const [posts, setPosts] = useState<AdminPost[] | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    listAllPosts()
      .then(setPosts)
      .catch((err) => setError(friendlyMessage(err, 'Could not load posts.')))
  }, [])

  useEffect(load, [load])

  const act = async (post: AdminPost, action: 'publish' | 'unpublish' | 'delete') => {
    if (action === 'delete' && !window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setBusyId(post.id)
    setError('')
    setNotice('')
    try {
      if (action === 'delete') await deletePost(post.id)
      else await setPostStatus(post.id, action === 'publish' ? 'published' : 'draft')
      setNotice(
        action === 'delete'
          ? 'Post deleted.'
          : action === 'publish'
            ? 'Post published. It will appear in the sitemap after the next site rebuild.'
            : 'Post moved back to drafts.',
      )
      load()
    } catch (err) {
      setError(friendlyMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Posts"
        description="Drafts are visible only here. Published posts appear on /blog."
        actions={
          <Link to="/admin/posts/new" className={primaryButton}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New post
          </Link>
        }
      />

      <div className="space-y-3">
        {error && <Notice tone="error">{error}</Notice>}
        {notice && <Notice tone="success">{notice}</Notice>}
      </div>

      {posts === null && !error && <Spinner label="Loading posts" />}

      {posts && posts.length === 0 && (
        <p className="rounded-xl border border-line bg-surface p-8 text-sm text-mute">
          No posts yet. <Link to="/admin/posts/new" className="link-underline text-bone">Create one</Link>.
        </p>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface" data-lenis-prevent>
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-line text-[0.6875rem] uppercase tracking-[0.16em] text-mute-dim">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Title</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Category</th>
                <th scope="col" className="px-4 py-3 font-medium">Published</th>
                <th scope="col" className="px-4 py-3 font-medium">Updated</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {posts.map((p) => (
                <tr key={p.id} className={cn(busyId === p.id && 'opacity-50')}>
                  <td className="max-w-xs px-4 py-3">
                    <Link to={`/admin/posts/${p.id}/edit`} className="text-bone hover:text-accent">
                      {p.title}
                    </Link>
                    <p className="truncate text-xs text-mute-dim">/blog/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-mute">{p.category?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-mute">{formatDate(p.published_at) || '-'}</td>
                  <td className="px-4 py-3 text-mute">{formatDate(p.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/posts/${p.id}/edit`} className={smallButton}>
                        Edit
                      </Link>
                      {p.status === 'draft' ? (
                        <button
                          type="button"
                          className={smallButton}
                          disabled={busyId === p.id}
                          onClick={() => act(p, 'publish')}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={smallButton}
                          disabled={busyId === p.id}
                          onClick={() => act(p, 'unpublish')}
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        type="button"
                        className={cn(smallButton, 'text-red-500 hover:border-red-400/60')}
                        disabled={busyId === p.id}
                        onClick={() => act(p, 'delete')}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
