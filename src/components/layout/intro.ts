import { prefersReducedMotion } from '../../lib/utils'

export const INTRO_SEEN_KEY = 'bt:intro-seen'

export function introAlreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
    /* private mode — the intro simply plays again next session */
  }
}

/**
 * Whether the opening curtain should run at all. A tab opened in the
 * background never receives animation frames, so the intro would sit there
 * until the user switches to it — skip straight to content in that case.
 */
export function shouldShowIntro() {
  const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden'
  return !introAlreadySeen() && !prefersReducedMotion() && !hidden
}
