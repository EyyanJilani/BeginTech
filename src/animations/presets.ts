import { gsap, SplitText } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/utils'

type El = gsap.TweenTarget

const DEFAULT_START = 'top 85%'

export const reduced = prefersReducedMotion

/*
 * Every entrance below uses fromTo(), never from().
 *
 * from() infers the destination from whatever is on the element when the tween
 * is built. If a stale inline style survives — a StrictMode effect remount, an
 * interrupted context revert — it records the *hidden* state as the
 * destination, animates 0 → 0, and the content is invisible forever with no
 * error anywhere. fromTo() states the visible end explicitly, so that failure
 * mode cannot happen.
 */

/** Elements rise into place with a soft blur-off. */
export function fadeUp(target: El, vars: gsap.TweenVars = {}) {
  if (reduced()) {
    return gsap.set(target, { opacity: 1, y: 0, filter: 'none' })
  }
  const { y = 44, ...rest } = vars
  return gsap.fromTo(
    target,
    { y, opacity: 0, filter: 'blur(6px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      stagger: 0.08,
      clearProps: 'filter',
      ...rest,
    },
  )
}

/** Scroll-linked variant of fadeUp. */
export function fadeUpOnScroll(target: El, trigger: Element, vars: gsap.TweenVars = {}) {
  return fadeUp(target, {
    scrollTrigger: { trigger, start: DEFAULT_START, once: true },
    ...vars,
  })
}

/**
 * Line-by-line masked headline reveal. Returns the SplitText so callers can
 * revert it — leaving splits in place breaks text selection and screen readers.
 * `autoSplit` re-splits (and replays the tween) when fonts load or the box
 * resizes, so line breaks never end up stale.
 */
export function revealLines(
  el: Element,
  opts: { trigger?: Element; delay?: number; stagger?: number; duration?: number; scroll?: boolean } = {},
) {
  if (reduced()) {
    gsap.set(el, { opacity: 1 })
    return null
  }

  gsap.set(el, { opacity: 1 })

  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    linesClass: 'bt-line',
    onSplit: (self) =>
      gsap.fromTo(
        self.lines,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: opts.duration ?? 1.25,
          stagger: opts.stagger ?? 0.09,
          delay: opts.delay ?? 0,
          ease: 'bt',
          ...(opts.scroll === false
            ? {}
            : { scrollTrigger: { trigger: opts.trigger ?? el, start: DEFAULT_START, once: true } }),
        },
      ),
  })
}

/** Word-level scrub reveal with blur — used for oversized editorial statements. */
export function revealWords(el: Element, opts: { trigger?: Element; stagger?: number } = {}) {
  if (reduced()) {
    gsap.set(el, { opacity: 1 })
    return null
  }

  gsap.set(el, { opacity: 1 })

  return SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { opacity: 0.08, filter: 'blur(5px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: opts.stagger ?? 0.035,
          ease: 'bt',
          scrollTrigger: {
            trigger: opts.trigger ?? el,
            start: 'top 78%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      ),
  })
}

/** Clip-path image reveal with a counter-scale on the inner media. */
export function imageReveal(frame: Element, media?: Element | null) {
  if (reduced()) return
  gsap.fromTo(
    frame,
    { clipPath: 'inset(0% 0% 100% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.4,
      ease: 'bt',
      scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
    },
  )
  if (media) {
    gsap.fromTo(
      media,
      { scale: 1.25 },
      {
        scale: 1,
        duration: 1.6,
        ease: 'bt',
        scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
      },
    )
  }
}

/** Continuous scrub parallax. `amount` is expressed in px of total travel. */
export function parallax(target: El, amount = 90, trigger?: Element) {
  if (reduced()) return
  return gsap.fromTo(
    target,
    { y: 0 },
    {
      y: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: (trigger ?? (target as Element)) as Element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    },
  )
}

/** Animated count-up that respects reduced motion. */
export function countTo(el: Element, value: number, suffix = '') {
  const state = { n: 0 }
  const write = () => {
    el.textContent = `${Math.round(state.n)}${suffix}`
  }
  if (reduced()) {
    state.n = value
    write()
    return
  }
  return gsap.fromTo(
    state,
    { n: 0 },
    {
      n: value,
      duration: 2,
      ease: 'bt',
      onUpdate: write,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    },
  )
}
