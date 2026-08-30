import { useLayoutEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { gsap } from '../../lib/gsap'
import { fadeUp } from '../../animations/presets'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  y?: number
  stagger?: number
  /** Animate direct children individually instead of the wrapper itself. */
  staggerChildren?: boolean
  start?: string
}

export function Reveal({
  children,
  as: asTag = 'div',
  className,
  delay = 0,
  y = 44,
  stagger = 0.08,
  staggerChildren = false,
  start = 'top 86%',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const targets = staggerChildren ? Array.from(el.children) : el
      fadeUp(targets, {
        y,
        delay,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [delay, y, stagger, staggerChildren, start])

  // Cast the polymorphic tag to a concrete intrinsic so TS resolves a single
  // props signature instead of the full ElementType union.
  const Tag = asTag as 'div'

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  )
}
