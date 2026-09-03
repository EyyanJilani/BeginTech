/*
  Explicit imports rather than string paths, so Vite fingerprints and bundles
  these the same way it does the logo assets — a literal '/src/...' string
  only resolves in dev and silently 404s in the production build.
*/
import brooklynBites from '../assets/img/work/brooklyn-bites.jpg'
import siyaabLawnHub from '../assets/img/work/siyaab-lawn-hub.jpg'
import dipNEat from '../assets/img/work/dip-n-eat.jpg'
import cakeCraft from '../assets/img/work/cake-craft.jpg'
import insightElectrical from '../assets/img/work/insight-electrical.jpg'
import backflowTestingCo from '../assets/img/work/backflow-testing-co.jpg'
import solidificationSolutions from '../assets/img/work/solidification-solutions.jpg'
import signaturesPlus from '../assets/img/work/signatures-plus.jpg'

export const workImages = {
  'brooklyn-bites': brooklynBites,
  'siyaab-lawn-hub': siyaabLawnHub,
  'dip-n-eat': dipNEat,
  'cake-craft': cakeCraft,
  'insight-electrical': insightElectrical,
  'backflow-testing-co': backflowTestingCo,
  'solidification-solutions': solidificationSolutions,
  'signatures-plus': signaturesPlus,
} as const
