# BeginTech

Marketing site for **BeginTech** — a fictional software house and creative technology studio.
Dark/light themed, WebGL hero, GSAP-driven motion, fully responsive.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger + SplitText) · Three.js / React Three Fiber · Lenis · React Router

---

## Getting started

```bash
npm install
npm run dev
```

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Dev server at `http://localhost:5173`    |
| `npm run build`   | Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | ESLint                                   |

## Routes

```
/                              Home
/about                         About
/work                          Portfolio index (filterable)
/work/:slug                    Case study
/services/:slug                Service detail (8 services)
/contact                       Contact + validated enquiry form
*                              404
```

## Architecture notes

A few decisions that aren't obvious from the file tree:

**Theming.** Light is the default. Every colour utility resolves through CSS custom
properties declared in `src/index.css`; `html[data-theme='dark']` re-declares the same
tokens, so one attribute re-themes the whole site without any component switching classes.
An inline script in `index.html` applies the stored theme before first paint to avoid a
flash. The WebGL scenes take an explicit `theme` prop — white wireframes are invisible on
paper, and the refractive core has to become a diffuse material there.

**Animation.** Every entrance uses `gsap.fromTo()`, never `from()`. `from()` infers its
destination from whatever is on the element at build time; if a stale inline style survives
(a StrictMode effect remount, an interrupted context revert) it records the *hidden* state
as the destination and the content stays invisible with no error. Reusable presets live in
`src/animations/presets.ts`. All tweens are created inside `gsap.context()` and reverted on
unmount so route changes don't leak ScrollTriggers.

**WebGL is optional.** `LazyScene` only requests the Three.js chunk when the browser
reports WebGL, the user hasn't asked for reduced motion, and the main thread is idle. It
degrades to a CSS `SceneFallback` and is wrapped in an error boundary, so a driver crash
can never take the page down. Scenes pause their render loop when scrolled out of view.

**Imagery is procedural.** Project artwork is generated SVG (`ProjectVisual`), not stock
photography — nothing can 404, and each piece is art-directed from its project's palette.
The artwork stays dark in both themes, so overlays sitting on it are deliberately
theme-independent.

**Smooth scroll.** Lenis is wired into GSAP's ticker so both share one RAF loop, and it is
disabled entirely under `prefers-reduced-motion`.

## Project structure

```
src/
  animations/   GSAP presets (fadeUp, revealLines, parallax, imageReveal…)
  components/
    footer/ layout/ navbar/ sections/ three/ ui/
  data/         Site copy, services, projects, testimonials
  hooks/        useTheme, useSeo, useSmoothScroll, useMediaQuery…
  lib/          gsap setup, theme store, utils
  pages/        Route components (all lazy except Home)
```

## Accessibility

Semantic landmarks, a skip link, keyboard-operable menus with correct ARIA, labelled form
fields with inline validation and error announcement, visible focus states, and a full
`prefers-reduced-motion` path that disables smooth scroll, WebGL and every entrance
animation.

## Notes

Content is fictional — the studio, case studies, metrics and testimonials are written as
realistic placeholder copy for a portfolio piece.
