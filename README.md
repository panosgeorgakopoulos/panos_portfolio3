# Panos Portfolio

Personal portfolio for **Panagiotis Sergios Georgakopoulos** — software
engineer working in applied AI, Computer Science at the University of Piraeus.

Live at **[panosgeorgakopoulos.gr](https://panosgeorgakopoulos.gr)**.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · lucide-react

Press <kbd>⌘K</kbd> (or <kbd>Ctrl</kbd>+<kbd>K</kbd>) anywhere on the site to
open the command palette — jump to a section, copy the email or phone number,
or open a profile.

No router, no backend. Builds to static files served by GitHub Pages from the
`gh-pages` branch.

## Getting started

```bash
npm install
npm run dev
```

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server with HMR                                |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm run build`     | Typechecks, then builds to `dist/`                 |
| `npm run preview`   | Serves the production build                        |
| `npm run deploy`    | Publishes `dist/` to the `gh-pages` branch         |

## Structure

```
constants.ts      All site content — the single source of truth
types.ts          Content model
index.css         Tailwind v4 theme, custom utilities, base layer
App.tsx           Section order and the scroll z-index deck
components/       One component per section, plus shared helpers
public/           Copied verbatim to dist/ (CNAME, favicon, OG image, sitemap)
```

Content is data. Every visible string comes from `constants.ts`, transcribed
from `Georgakopoulos_CV.docx`. To change what the site says, edit that file —
not a component.

## Working on it with Claude Code

`CLAUDE.md` documents the architecture and the non-obvious constraints (the
z-index deck, Tailwind v4's CSS-first config, why accent classes must be
literal). `.claude/` adds:

- **Skills** — `/cv-sync` re-transcribes the site from a new CV revision,
  `/add-project` adds an entry to Selected Work, `/site-audit` runs the full
  parallel audit, `/ship` verifies and deploys.
- **Agents** — `site-a11y`, `site-perf`, `site-seo`, `site-content` and
  `site-design`, five specialists the audit skill fans out in parallel.

## Licence

Content and design © Panagiotis Sergios Georgakopoulos. Code available for
reference.
