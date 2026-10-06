import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
} from 'lucide-react'
import { Markdown } from '../components/blog/Markdown'
import { uploadImage } from './api'
import { friendlyMessage } from '../lib/supabase'
import { cn } from '../lib/utils'

/*
  A small Markdown editor: textarea + formatting toolbar + live preview that
  uses the exact renderer the public blog uses, so what you preview is what
  gets published. Markdown keeps the stored content portable and safe — no
  HTML is ever stored or rendered.
*/

type Props = {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}

type Edit = { before: string; after?: string; placeholder?: string; line?: boolean }

export function MarkdownEditor({ id, value, onChange, invalid }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  /** Wraps the selection (inline) or prefixes each selected line (block). */
  const apply = ({ before, after = '', placeholder = '', line = false }: Edit) => {
    const el = ref.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    let next: string
    let selStart: number
    let selEnd: number

    if (line) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const block = value.slice(lineStart, end) || placeholder
      const lines = block.split('\n')
      const prefixed = lines
        .map((l, i) => (before === '1. ' ? `${i + 1}. ${l}` : `${before}${l}`))
        .join('\n')
      next = value.slice(0, lineStart) + prefixed + value.slice(end)
      selStart = lineStart
      selEnd = lineStart + prefixed.length
    } else {
      const selected = value.slice(start, end) || placeholder
      next = value.slice(0, start) + before + selected + after + value.slice(end)
      selStart = start + before.length
      selEnd = selStart + selected.length
    }

    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(selStart, selEnd)
    })
  }

  const insertAtCursor = (text: string) => {
    const el = ref.current
    const pos = el ? el.selectionEnd : value.length
    const needsBreak = pos > 0 && value[pos - 1] !== '\n'
    const insert = `${needsBreak ? '\n\n' : ''}${text}\n`
    onChange(value.slice(0, pos) + insert + value.slice(pos))
  }

  const onUpload = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadImage(file)
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
      insertAtCursor(`![${alt}](${url})`)
    } catch (err) {
      setUploadError(friendlyMessage(err, 'Image upload failed.'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return
    const key = e.key.toLowerCase()
    if (key === 'b') apply({ before: '**', after: '**', placeholder: 'bold text' })
    else if (key === 'i') apply({ before: '*', after: '*', placeholder: 'italic text' })
    else if (key === 'k') apply({ before: '[', after: '](https://)', placeholder: 'link text' })
    else return
    e.preventDefault()
  }

  const tools = [
    { label: 'Heading 2', icon: Heading2, edit: { before: '## ', placeholder: 'Heading', line: true } },
    { label: 'Heading 3', icon: Heading3, edit: { before: '### ', placeholder: 'Subheading', line: true } },
    { label: 'Bold (Ctrl+B)', icon: Bold, edit: { before: '**', after: '**', placeholder: 'bold text' } },
    { label: 'Italic (Ctrl+I)', icon: Italic, edit: { before: '*', after: '*', placeholder: 'italic text' } },
    { label: 'Link (Ctrl+K)', icon: Link2, edit: { before: '[', after: '](https://)', placeholder: 'link text' } },
    { label: 'Bulleted list', icon: List, edit: { before: '- ', placeholder: 'List item', line: true } },
    { label: 'Numbered list', icon: ListOrdered, edit: { before: '1. ', placeholder: 'List item', line: true } },
    { label: 'Quote', icon: Quote, edit: { before: '> ', placeholder: 'Quote', line: true } },
    { label: 'Code block', icon: Code2, edit: { before: '```\n', after: '\n```', placeholder: 'code' } },
  ] satisfies { label: string; icon: typeof Bold; edit: Edit }[]

  const toolButton =
    'flex h-8 w-8 items-center justify-center rounded-md text-mute transition-colors hover:bg-surface-2 hover:text-bone disabled:opacity-40'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-surface transition-colors focus-within:border-accent',
        invalid ? 'border-red-400/70' : 'border-line',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5" role="toolbar" aria-label="Formatting">
          {tools.map(({ label, icon: Icon, edit }) => (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              disabled={tab === 'preview'}
              onClick={() => apply(edit)}
              className={toolButton}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
            </button>
          ))}
          <button
            type="button"
            title="Upload image"
            aria-label="Upload image"
            disabled={tab === 'preview' || uploading}
            onClick={() => fileRef.current?.click()}
            className={toolButton}
          >
            {uploading ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </div>

        <div className="flex rounded-full border border-line p-0.5 text-xs" role="tablist">
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-full px-3 py-1 capitalize transition-colors',
                tab === t ? 'bg-bone text-ink' : 'text-mute hover:text-bone',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {uploadError && <p role="alert" className="border-b border-line px-3 py-2 text-xs text-red-500">{uploadError}</p>}

      {tab === 'write' ? (
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          data-lenis-prevent
          rows={22}
          spellCheck
          placeholder={'Write your article in Markdown.\n\n## A section heading\n\nA paragraph with **bold**, *italic* and a [link](https://begintech.co).'}
          className="block min-h-[28rem] w-full resize-y bg-transparent p-4 font-mono text-[0.875rem] leading-relaxed text-bone outline-none placeholder:text-mute-dim/60"
        />
      ) : (
        <div className="min-h-[28rem] p-5 sm:p-8" data-lenis-prevent>
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-mute-dim">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
