import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext'
import type { AuthState, AuthCtx } from './authContext'

/*
  Admin session state.

  This is a UX gate, not the security boundary. Every read of drafts and every
  write is authorised again inside Postgres by RLS + public.is_admin(), so a
  user who bypasses this component in devtools gets nothing but empty results
  and permission errors.

  The user is re-validated against the Auth server (getUser) rather than
  trusting the locally cached session, and the role is read from the
  profiles table, never from user-editable metadata.
*/

async function resolve(): Promise<AuthState> {
  if (!supabase) return { status: 'unconfigured' }
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return { status: 'signed-out' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profile?.role === 'admin') return { status: 'admin', user: data.user, name: profile.full_name }
  return { status: 'forbidden', user: data.user }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    resolve().then((s) => alive && setState(s))
    if (!supabase) return

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setState({ status: 'signed-out' })
      // Token refreshes keep the same user and role; no need to refetch.
    })
    return () => {
      alive = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback<AuthCtx['signIn']>(async (email, password) => {
    if (!supabase) return 'error'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.code === 'email_not_confirmed') return 'unconfirmed'
      // 400 = wrong email/password; anything else is an outage or rate limit.
      return error.code === 'invalid_credentials' || error.status === 400 ? 'invalid' : 'error'
    }
    const next = await resolve()
    if (next.status === 'admin') {
      setState(next)
      return 'ok'
    }
    // Signed in but not an admin: don't leave a dangling session behind.
    await supabase.auth.signOut()
    setState({ status: 'signed-out' })
    return 'forbidden'
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    setState({ status: 'signed-out' })
  }, [])

  return <AuthContext.Provider value={{ state, signIn, signOut }}>{children}</AuthContext.Provider>
}
