import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { TextReveal } from './TextReveal'
import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'between'
  className?: string
  as?: 'h2' | 'h3'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'between',
  className,
  as = 'h2',
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8',
        align === 'between' && 'lg:flex-row lg:items-end lg:justify-between lg:gap-16',
        className,
      )}
    >
      <div className="max-w-3xl">
        <Reveal className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-line-strong" />
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <TextReveal as={as} className="display-md">
          {title}
        </TextReveal>
      </div>
      {description && (
        <Reveal className="max-w-md lg:pb-2" delay={0.1}>
          <p className="lede">{description}</p>
        </Reveal>
      )}
    </div>
  )
}
