import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getStats, listAllPosts } from '../api'
import type { AdminPost } from '../api'
import { Notice, PageHeader, StatusBadge, primaryButton } from '../ui'
import { friendlyMessage } from '../../lib/supabase'
import { formatDate } from '../../lib/blog'

type Stats = Awaited<ReturnType<typeof getStats>>

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<AdminPost[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getStats(), listAllPosts()])
      .then(([s, posts]) => {
        setStats(s)
        setRecent(posts.slice(0, 6))
      })
      .catch((err) => setError(friendlyMessage(err, 'Could not load the dashboard.')))
  }, [])

  const cards = [
    { label: 'Total posts', value: stats?.total },
    { label: 'Published', value: stats?.published },
    { label: 'Drafts', value: stats?.drafts },
    { label: 'Categories', value: stats?.categories },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <Link to="/admin/posts/new" className={primaryButton}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New post
          </Link>
        }
      />

      {error && <Notice tone="error">{error}</Notice>}

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface p-6">
            <dt className="text-[0.6875rem] uppercase tracking-[0.18em] text-mute-dim">{c.label}</dt>
            <dd className="mt-3 font-display text-4xl tracking-tight text-bone">
              {c.value ?? <span className="inline-block h-9 w-12 animate-pulse rounded bg-surface-2" />}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-12" aria-labelledby="recent-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-heading" className="font-display text-xl tracking-tight text-bone">
            Recent posts
          </h2>
          <Link to="/admin/posts" className="link-underline text-sm text-mute hover:text-bone">
            All posts
          </Link>
        </div>

        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {recent === null && !error &&
            Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
              </li>
            ))}
          {recent?.length === 0 && (
            <li className="p-6 text-sm text-mute">
              No posts yet. <Link to="/admin/posts/new" className="link-underline text-bone">Write the first one</Link>.
            </li>
          )}
          {recent?.map((p) => (
            <li key={p.id}>
              <Link
                to={`/admin/posts/${p.id}/edit`}
                className="flex flex-col gap-2 p-4 transition-colors hover:bg-surface-2/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-bone">{p.title}</span>
                <span className="flex items-center gap-3 text-xs text-mute-dim">
                  <StatusBadge status={p.status} />
                  Updated {formatDate(p.updated_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
