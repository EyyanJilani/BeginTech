import { Link } from 'react-router-dom'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from './Magnetic'
import { cn } from '../../lib/utils'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-45'

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.8125rem]',
  lg: 'h-[3.35rem] px-7 text-sm',
}

const variants: Record<Variant, string> = {
  solid: 'bg-bone text-ink hover:text-ink',
  outline: 'border border-line-strong text-bone hover:text-ink',
  ghost: 'text-mute hover:text-bone',
}

function Inner({
  children,
  arrow,
  variant,
}: {
  children: ReactNode
  arrow?: boolean
  variant: Variant
}) {
  return (
    <>
      {variant !== 'ghost' && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 translate-y-full rounded-full transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0',
            variant === 'solid' ? 'bg-accent' : 'bg-bone',
          )}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5 whitespace-nowrap">
        {children}
        {arrow && (
          <ArrowUpRight
            aria-hidden="true"
            className="h-[1.05em] w-[1.05em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </span>
    </>
  )
}

type SharedProps = {
  variant?: Variant
  size?: Size
  arrow?: boolean
  magnetic?: boolean
  className?: string
  children: ReactNode
}

type AnchorRest = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>

export function ButtonLink({
  to,
  href,
  variant = 'solid',
  size = 'lg',
  arrow = true,
  magnetic = true,
  className,
  children,
  ...rest
}: SharedProps & { to?: string; href?: string } & AnchorRest) {
  const cls = cn(base, sizes[size], variants[variant], className)
  const content = (
    <Inner arrow={arrow} variant={variant}>
      {children}
    </Inner>
  )

  const node = to ? (
    <Link to={to} className={cls} data-cursor="hover">
      {content}
    </Link>
  ) : (
    <a href={href} className={cls} data-cursor="hover" {...rest}>
      {content}
    </a>
  )

  return magnetic ? <Magnetic>{node}</Magnetic> : node
}

export function Button({
  variant = 'solid',
  size = 'lg',
  arrow = false,
  magnetic = true,
  className,
  children,
  ...rest
}: SharedProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>) {
  const node = (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      data-cursor="hover"
      {...rest}
    >
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </button>
  )
  return magnetic ? <Magnetic>{node}</Magnetic> : node
}
