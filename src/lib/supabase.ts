import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/*
  Browser Supabase client. This is a static Vite SPA with no server of its
  own, so there is no @supabase/ssr cookie layer or middleware: the session
  lives in localStorage and every request carries the user's JWT.

  The publishable key is designed to ship to the browser. What a request can
  actually do is decided in Postgres by Row Level Security and
  public.is_admin() (supabase/blog_schema.sql) — never by this file. The
  service-role key must never be referenced anywhere in src/.
*/
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase: SupabaseClient | null =
  URL && KEY
    ? createClient(URL, KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    : null

/** Throws a friendly error when the env vars are missing, instead of a null deref. */
export function db(): SupabaseClient {
  if (!supabase) throw new FriendlyError('The blog is temporarily unavailable.')
  return supabase
}

/** An error whose message is safe to show to a visitor. */
export class FriendlyError extends Error {}

/**
 * Maps a Supabase/PostgREST error to something a person can act on, without
 * leaking table names, constraint names or SQL to the UI.
 */
export function friendlyMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  if (err instanceof FriendlyError) return err.message
  const e = err as { code?: string; message?: string; status?: number } | null
  if (!e) return fallback
  if (e.code === '23505') return 'That slug is already in use. Choose a different one.'
  if (e.code === '42501' || e.status === 401 || e.status === 403)
    return 'You do not have permission to do that.'
  if (e.code === '23514') return 'One of the fields is invalid or too long.'
  if (typeof e.message === 'string' && /fetch|network/i.test(e.message))
    return 'Could not reach the server. Check your connection and try again.'
  return fallback
}
