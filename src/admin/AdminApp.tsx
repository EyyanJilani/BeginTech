import { useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ExternalLink, FileText, FolderTree, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { AdminAuthProvider } from './auth'
import { useAdminAuth } from './authContext'
import { Spinner, smallButton } from './ui'
import { LogoLockup } from '../components/ui/Logo'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { useSeo } from '../hooks/useSeo'
import { cn } from '../lib/utils'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import PostEditor from './pages/PostEditor'
import Categories from './pages/Categories'

export default function AdminApp() {
  useSeo({ title: 'Admin — BeginTech', description: 'BeginTech admin.', noindex: true })

  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<Guarded />} />
      </Routes>
    </AdminAuthProvider>
  )
}

function Guarded() {
  const { state, signOut } = useAdminAuth()
  const location = useLocation()

  if (state.status === 'loading') return <Spinner label="Checking your session" />

  if (state.status === 'unconfigured') {
    return (
      <Centered>
        <p className="text-sm text-mute">
          Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.
        </p>
      </Centered>
    )
  }

  if (state.status === 'signed-out') {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/admin/login?next=${next}`} replace />
  }

  if (state.status === 'forbidden') {
    return (
      <Centered>
        <h1 className="font-display text-2xl tracking-tight text-bone">Not authorised</h1>
        <p className="mt-3 text-sm text-mute">
          {state.user.email} is signed in but does not have admin access.
        </p>
        <button type="button" onClick={signOut} className={cn(smallButton, 'mt-6')}>
          Sign out
        </button>
      </Centered>
    )
  }

  return (
    <Shell>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id/edit" element={<PostEditor />} />
        <Route path="categories" element={<Categories />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  )
}

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: 'Posts', icon: FileText, end: false },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree, end: false },
]

function Shell({ children }: { children: React.ReactNode }) {
  const { state, signOut } = useAdminAuth()
  const [open, setOpen] = useState(false)
  const email = state.status === 'admin' ? state.user.email : ''
  const name = state.status === 'admin' ? state.name : null

  const links = (
    <nav aria-label="Admin" className="space-y-1">
      {nav.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive ? 'bg-surface-2 text-bone' : 'text-mute hover:bg-surface-2/60 hover:text-bone',
            )
          }
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
      <a
        href="/blog"
        target="_blank"
        rel="noopener"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mute transition-colors hover:bg-surface-2/60 hover:text-bone"
      >
        <ExternalLink aria-hidden="true" className="h-4 w-4" />
        View blog
      </a>
    </nav>
  )

  const footer = (
    <div className="space-y-4 border-t border-line pt-5">
      <div className="min-w-0">
        <p className="truncate text-sm text-bone">{name || 'Admin'}</p>
        <p className="truncate text-xs text-mute-dim">{email}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <ThemeToggle />
        <button type="button" onClick={signOut} className={smallButton}>
          <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r border-line bg-ink-soft p-5 lg:flex">
        <div>
          <LogoLockup className="mb-10 h-10" />
          {links}
        </div>
        {footer}
      </aside>

      {/* Mobile bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink-soft/95 px-4 py-3 backdrop-blur lg:hidden">
        <LogoLockup className="h-8" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className={smallButton}
        >
          {open ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
          Menu
        </button>
      </header>
      {open && (
        <div id="admin-mobile-nav" className="space-y-5 border-b border-line bg-ink-soft p-4 lg:hidden">
          {links}
          {footer}
        </div>
      )}

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8 text-center">{children}</div>
    </div>
  )
}
