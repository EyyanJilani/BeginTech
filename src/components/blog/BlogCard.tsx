import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ProjectVisual } from '../ui/ProjectVisual'
import { brandOnDark } from '../../data/brand'
import { formatDate } from '../../lib/blog'
import type { PostSummary } from '../../lib/blog'
import { cn } from '../../lib/utils'

/** Fallback artwork for posts without a featured image, same system as the portfolio cards. */
const fallbackArt = { pattern: 'grid' as const, from: '#0d2440', to: '#07131f', ink: brandOnDark.blue }

type Props = {
  post: PostSummary
  /** Large horizontal layout for the lead article on /blog. */
  featured?: boolean
  className?: string
}

export function BlogCard({ post, featured = false, className }: Props) {
  const date = formatDate(post.published_at)

  return (
    <article className={cn('group', className)}>
      <Link
        to={`/blog/${post.slug}`}
        className={cn('block', featured && 'grid gap-8 md:grid-cols-12 md:items-center md:gap-12')}
        data-cursor="hover"
        data-cursor-label="Read"
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border border-line bg-surface',
            featured ? 'aspect-[16/10] md:col-span-7' : 'aspect-[16/10]',
          )}
        >
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt=""
                loading={featured ? 'eager' : 'lazy'}
                decoding="async"
                width={1600}
                height={1000}
                className="h-full w-full object-cover"
              />
            ) : (
              <ProjectVisual art={fallbackArt} label={post.title} />
            )}
          </div>
          {post.category && (
            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              {post.category.name}
            </span>
          )}
        </div>

        <div className={cn(featured ? 'md:col-span-5' : 'mt-6')}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mute-dim">
            {date && <time dateTime={post.published_at ?? undefined}>{date}</time>}
            {post.reading_time && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </p>
          <h3
            className={cn(
              'mt-3 font-display tracking-tight text-bone',
              featured ? 'text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.1]' : 'text-xl leading-snug md:text-2xl',
            )}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className={cn(
                'mt-3 text-sm leading-relaxed text-mute',
                featured ? 'md:text-base' : 'line-clamp-3',
              )}
            >
              {post.excerpt}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 text-sm text-bone">
            <span className="link-underline">Read article</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </span>
        </div>
      </Link>
    </article>
  )
}

/** Skeleton matching BlogCard's footprint, for loading states. */
export function BlogCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse', featured && 'grid gap-8 md:grid-cols-12 md:items-center md:gap-12')}
    >
      <div className={cn('aspect-[16/10] rounded-lg bg-surface-2', featured && 'md:col-span-7')} />
      <div className={cn('space-y-3', featured ? 'md:col-span-5' : 'mt-6')}>
        <div className="h-3 w-32 rounded bg-surface-2" />
        <div className="h-6 w-4/5 rounded bg-surface-2" />
        <div className="h-3 w-full rounded bg-surface-2" />
        <div className="h-3 w-2/3 rounded bg-surface-2" />
      </div>
    </div>
  )
}
