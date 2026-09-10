import { useLayoutEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { gsap } from '../../lib/gsap'
import { revealLines, revealWords } from '../../animations/presets'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  mode?: 'lines' | 'words'
  delay?: number
  stagger?: number
  /** Skip ScrollTrigger and play immediately (hero / above-the-fold copy). */
  immediate?: boolean
}

export function TextReveal({
  children,
  as: asTag = 'p',
  className,
  mode = 'lines',
  delay = 0,
  stagger,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (mode === 'words') revealWords(el, { stagger })
      else revealLines(el, { delay, stagger, scroll: !immediate })
    }, el)
    return () => ctx.revert()
  }, [mode, delay, stagger, immediate])

  // See Reveal — a concrete intrinsic keeps the polymorphic props resolvable.
  const Tag = asTag as 'p'

  // No inline opacity:0 — revealLines()/revealWords() set opacity:1 on this
  // element as their first synchronous action and hide the split lines/words
  // instead, so the text stays visible by default if the reveal animation
  // never runs (blocked script, thrown error upstream, ...) rather than
  // being invisible forever.
  return (
    <Tag ref={ref as React.Ref<HTMLParagraphElement>} className={className}>
      {children}
    </Tag>
  )
}
