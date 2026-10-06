import type { ReactNode } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import { cn } from '../lib/utils'

/* Small admin-only primitives, built from the site's own tokens. */

export const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-bone outline-none transition-colors placeholder:text-mute-dim/70 focus:border-accent'

export const smallButton =
  'inline-flex h-9 items-center justify-center gap-2 rounded-full border border-line px-4 text-xs font-medium text-bone transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-50'

export const primaryButton =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full bg-bone px-5 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50'

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-bone md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-mute">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.6875rem] uppercase tracking-[0.18em] text-mute-dim">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-mute-dim">{hint}</p>
      )}
    </div>
  )
}

export function Notice({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2.5 rounded-lg border p-3.5 text-sm',
        tone === 'error'
          ? 'border-red-400/40 bg-red-400/[0.07] text-red-500'
          : 'border-accent/40 bg-accent/[0.06] text-bone',
      )}
    >
      {tone === 'error' ? (
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      )}
      <span>{children}</span>
    </p>
  )
}

export function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-[0.6875rem] uppercase tracking-[0.14em]',
        status === 'published' ? 'border-accent/50 text-accent' : 'border-line text-mute',
      )}
    >
      {status}
    </span>
  )
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-[bt-spin-slow_1s_linear_infinite] rounded-full border border-line border-t-accent"
      />
    </div>
  )
}
