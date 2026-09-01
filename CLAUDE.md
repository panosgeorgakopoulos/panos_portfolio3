# Panos Portfolio

Single-page personal portfolio for **Panagiotis Sergios Georgakopoulos** ("Panos"),
deployed to <https://panosgeorgakopoulos.gr> via GitHub Pages.

React 19 + TypeScript + Vite 6 + Tailwind CSS v4. No router, no backend, no tests
(see "Known gaps").

## Commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                            |
| `npm run typecheck` | `tsc --noEmit` — run this before claiming done      |
| `npm run build`     | Typechecks, builds `dist/`, then prerenders into it  |
| `npm run preview`   | Serves the built `dist/` (verify here, not in dev)  |
| `npm run deploy`    | Builds and pushes `dist/` to the `gh-pages` branch  |

## Architecture

```
constants.ts   ← ALL site content lives here. Single source of truth.
types.ts       ← Content model. Change here first, then constants, then components.
index.css      ← Tailwind v4 theme (@theme), custom utilities (@utility), base layer.
App.tsx        ← Section order + z-index deck. Skip link.
components/
  Navbar.tsx         Nav + scroll-spy + mobile overlay + ⌘K trigger
  CommandPalette.tsx ⌘K palette (navigate, copy details, open profiles)
  ScrollProgress.tsx Hairline reading-progress bar
  Hero.tsx           Fixed hero, pointer parallax, scramble text
  Experience.tsx     01 / Career
  Process.tsx        02 / Process — animated LayGrounded pipeline
  Skills.tsx         03 / Capabilities
  Projects.tsx       04 / Portfolio
  Education.tsx      05 / Credentials
  Contact.tsx        Footer + CTA
  SectionHeading.tsx Shared section header
  accents.ts         Accent token → literal Tailwind class strings
  useReveal.ts       Shared scroll-reveal IntersectionObserver
  useCountUp.ts      Hero stat count-up (snaps under reduced motion)
  spotlight.ts       Pointer-tracked card highlight (writes --mx/--my)
entry-server.tsx   SSR entry used only by the prerender step
scripts/
  prerender.mjs      Injects the rendered markup into dist/index.html
public/        ← Copied verbatim to dist/. CNAME must stay for the custom domain.
  fonts/       Self-hosted variable woff2 (see "Fonts" below)
  404.html     Redirects stray URLs back to /
  site.webmanifest
```

### Content is data, not markup

Every string a visitor reads comes from `constants.ts`, transcribed from
`Georgakopoulos_CV.docx`. **Never hard-code copy into a component.** If the CV
changes, edit `constants.ts` and the whole site follows. Use the `cv-sync` skill.

### Positioning (confirmed by Panos, 2026-09-01)

He is a **software engineer working in applied AI** — *not* a full-stack
engineer. Do not reintroduce "full-stack" as the headline label anywhere
(`RESUME_DATA.title`, `<title>`, OG/Twitter tags, JSON-LD `jobTitle`, README).

He is open to **any** internship that lines up with the CV — software
engineering, AI/ML, data, product. Maritime is the domain he happens to work in
today, not a filter on the ask. Copy that narrows the ask to shipping is a bug.

Course figures: **37 of 37 courses passed, 185 ECTS**. The CV's education
section still says "155 ECTS · 31 courses" — that line is stale; 37 × 5 = 185
is the correct pair. Do not "fix" the site back to 155/31.

Corollary: the site must not claim anything the CV does not support. The Skills
section used to render invented proficiency percentages ("Java 92%"); it was
replaced with the CV's own skill groupings. Don't reintroduce invented metrics —
`STATS` in `constants.ts` is capped to figures traceable to the CV.

## Gotchas

**The z-index deck.** From `md` up the hero is `position: fixed` with a
full-height spacer after it (below `md` it is in normal flow and the spacer is
hidden — a phone viewport is too short to hold the hero content inside a
clipped, fixed `h-screen` box, and the content was being cut off); every following section is opaque and carries an increasing z-index
(`z-10` Experience → `z-[15]` Process → `z-50` Contact) so each scrolls up over the previous one.
Adding a section means inserting it in `App.tsx` **and** giving it the next
z-index in the run. The navbar sits at `z-70` and the mobile overlay at `z-60`,
above the whole deck — a section at `z-50` or higher will swallow the nav's
clicks. (`--z-index-60` / `--z-index-70` are registered in `index.css`; Tailwind's
default z scale stops at 50.)

**Tailwind class names must be literal.** Tailwind v4 scans source text, so
`` `border-${accent}` `` generates nothing. Accent colours go through the
`ACCENTS` map in `components/accents.ts`, which holds complete class strings.
Add a field there rather than composing a class name at a call site.

**Fonts are self-hosted; do not add a Google Fonts `<link>` back.** Three
variable woff2 files live in `public/fonts/` with `@font-face` rules at the top
of `index.css`, and `index.html` preloads the two that carry visible type. Each
family also has a `-latin-ext` file that `unicode-range` keeps unfetched unless
a character outside Latin-1 appears — the current copy never triggers it, so the
real cost is 102 kB across three same-origin requests with no cross-origin round
trip. To change weights you do not need new files: these are variable fonts
declared `font-weight: 100 900`.

**`Cmd/Ctrl+P` is the CV.** The `@media print` block in `index.css` strips the
chrome, un-fixes the hero, inverts to black on white, expands the hidden
pipeline stages, and reveals a `.print-only` contact line in the hero. That is
deliberately why the repo does not ship `Georgakopoulos_CV.docx` — the document
is the page. If you add a section, check it prints: the usual failures are
white-on-white text (a `text-white/*` span inside a heading) and a wrapper that
survives while its children are hidden.

**The page is prerendered, so components must be SSR-safe.** `npm run build`
runs `vite build`, then `vite build --ssr entry-server.tsx`, then
`scripts/prerender.mjs`, which renders the app once and injects ~85 KB of markup
into `dist/index.html`; `index.tsx` hydrates it. That means: no `window` or
`document` at module scope or during render (guard it in an effect), and
**nothing random or time-dependent in render output** — the hero's particle
field uses a seeded PRNG for exactly this reason, and `useCountUp` starts at the
final value so the prerendered HTML carries the real figure. A hydration
mismatch shows up as a console error and React throwing the server markup away.
If you add a stepper or tab UI, render every panel and `hidden` the inactive
ones so their copy still reaches crawlers.

**Buttons come from the system, not from utilities.** `.btn` + `.btn-primary` /
`.btn-ghost` / `.btn-sm` live in `@layer components` in `index.css`. They are
liquid glass: a blurred, saturated backdrop, a 1px refractive rim drawn with a
`mask-composite` gradient border, and a specular highlight that follows the
pointer via `--mx`/`--my` (spread `{...spotlight}` onto the element to feed it).
`transform` is composed from `--btn-lift` and `--btn-squish` so hover-lift and
press-squish set independently; the press is fast and linear, the release
springs back through `--ease-spring`. An arrow inside a button gets
`className="btn-icon"` so it slides on hover. Do not hand-roll a new button out
of `rounded-full bg-neon-cyan px-6 py-3 …` — that neon-pill look is what this
replaced.

**Order the `-webkit-` prefix *before* the standard property.** lightningcss
collapses a prefixed/unprefixed pair to whichever comes last. With
`backdrop-filter` written first, only `-webkit-backdrop-filter` survived and
Chrome ignored it — the glass silently rendered flat.

**Reveal animation must never be the only thing making content visible.**
`index.html` adds `class="js"` to `<html>` before first paint, and the hidden
state is `.js .reveal-item { opacity: 0 }`. Without scripting — or if the
observer never fires — the content simply renders. Children of a container that
gains `is-revealed` animate in sequence via `style={{ '--i': n }}`; the
reduced-motion block zeroes both duration *and* delay, or long stagger chains
would leave content blank for half a second.

**Tailwind v4 `scale-*` sets the `scale` property, not `transform`.** So
`scale-x-0` and an inline `style.transform = 'scaleX(…)'` multiply, and the
element stays at zero. `ScrollProgress` writes `transform` only. Conversely the
`rise` keyframe animates `transform` while `hover:-translate-y-1.5` sets
`translate`, which is why a revealed card can still lift on hover.

**The hero has two viewport-height breakpoints, not one.** Centred hero content
sits under the floating navbar on a laptop-height window (a 1440x900 display
gives ~757px of viewport), so `index.css` top-aligns it below `52rem` tall and
drops out of `fixed` entirely below `46rem`. Making the hero taller means
re-checking both.

**Neon purple has two tokens on purpose.** `--color-neon-purple` (#bd00ff) is
4.47:1 on the page background — just under the 4.5:1 AA floor — so it is for
decoration only (borders, glows, dots, gradients, `aria-hidden` icons, which
need 3:1). Text uses `--color-neon-purple-text` (#c74dff, 5.76:1), which is what
`ACCENTS.purple.text` points at. Don't put `text-neon-purple` on real copy.

**Tailwind config lives in CSS, not JS.** There is no `tailwind.config.js`.
Colours, fonts, animations and the extra z-index steps are `@theme` tokens in
`index.css`; `bg-grid-pattern`, `text-glow` and `glass` are `@utility` blocks.
The old Play CDN (`cdn.tailwindcss.com`) is gone — do not add it back.

**The fixed hero needs a short-viewport escape hatch.** From `md` up the hero is
`fixed h-screen overflow-hidden`, so a viewport shorter than its content clips it
with no way to scroll. `index.css` reverts `#hero` to the in-flow layout and
hides `#hero-spacer` under `@media (min-width: 48rem) and (max-height: 40rem)`.
Anything that makes the hero taller needs that threshold re-checked.

**Full-bleed decoration must be clipped.** The ambient glows are 500–600px
circles; any section holding one needs `overflow-hidden` or it forces horizontal
scroll on phones. Check `document.documentElement.scrollWidth <= innerWidth` at
~375px after touching a background layer.

**Reduced motion is honoured, and must stay that way.** `index.css` neutralises
animations under `prefers-reduced-motion`, `useReveal` reveals content
immediately, and the hero skips both the scramble effect and the pointer
listener. New animation needs the same treatment.

**Hero parallax writes CSS variables, not React state.** `--px` / `--py` are set
on the section inside a rAF; the transforms are `calc()` in the style attribute.
Putting the pointer position into `useState` re-renders 28 particles per
mousemove — that was the previous implementation.

## Deploy

`npm run deploy` publishes `dist/` to `gh-pages`. `public/CNAME` carries the
custom domain and must survive any change to `public/`. `base` is `/` in
`vite.config.ts` because the site serves from the apex domain, not a repo
subpath.

## Known gaps

No test runner, no linter, no formatter, no CI. Verification today is
`npm run typecheck` plus loading `npm run preview` in a browser and checking the
console. Treat "it typechecks" as necessary, not sufficient.
