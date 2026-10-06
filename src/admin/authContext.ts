import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type AuthState =
  | { status: 'loading' }
  | { status: 'unconfigured' }
  | { status: 'signed-out' }
  | { status: 'forbidden'; user: User }
  | { status: 'admin'; user: User; name: string | null }

export type AuthCtx = {
  state: AuthState
  signIn: (email: string, password: string) => Promise<'ok' | 'forbidden' | 'invalid' | 'unconfirmed' | 'error'>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthCtx | null>(null)

export function useAdminAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}

/** Only same-app admin paths are allowed as post-login destinations. */
export function safeNext(next: string | null) {
  if (!next || !next.startsWith('/admin') || next.startsWith('//') || next.includes('\\')) return '/admin'
  return next
}
