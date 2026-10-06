import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { safeNext, useAdminAuth } from '../authContext'
import { Field, Notice, inputClass, primaryButton, Spinner } from '../ui'
import { LogoLockup } from '../../components/ui/Logo'

const MESSAGES = {
  invalid: 'That email and password combination is not correct.',
  forbidden: 'This account does not have admin access.',
  unconfirmed: 'This email address has not been confirmed yet. Confirm the user in Supabase → Authentication → Users.',
  error: 'Sign-in is unavailable right now. Please try again in a moment.',
} as const

export default function Login() {
  const { state, signIn } = useAdminAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(params.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (state.status === 'loading') return <Spinner label="Checking your session" />
  if (state.status === 'admin') return <Navigate to={next} replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setBusy(true)
    setError('')
    const result = await signIn(email.trim(), password)
    setBusy(false)
    if (result === 'ok') navigate(next, { replace: true })
    else setError(MESSAGES[result])
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm">
        <LogoLockup className="mx-auto mb-10 h-12" />
        <div className="rounded-xl border border-line bg-surface p-7 sm:p-8">
          <h1 className="font-display text-2xl tracking-tight text-bone">Admin sign in</h1>
          <p className="mt-2 text-sm text-mute">Manage the BeginTech blog.</p>

          {state.status === 'unconfigured' ? (
            <div className="mt-6">
              <Notice tone="error">Supabase is not configured for this deployment.</Notice>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
              <Field id="email" label="Email">
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field id="password" label="Password">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </Field>

              {error && <Notice tone="error">{error}</Notice>}

              <button type="submit" disabled={busy} className={`${primaryButton} w-full`}>
                {busy && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                {busy ? 'Signing in' : 'Sign in'}
              </button>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-mute-dim">
          <a href="/" className="link-underline hover:text-bone">
            Back to begintech.co
          </a>
        </p>
      </div>
    </div>
  )
}
