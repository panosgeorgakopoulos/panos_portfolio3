---
name: ship
description: Verify and deploy the portfolio to GitHub Pages at panosgeorgakopoulos.gr. Use when asked to deploy, publish, or push the site live.
---

# Ship the site

Deployment is public and hard to unsee — verify first, and confirm with the user
before the deploy step.

## 1. Verify

```bash
npm run typecheck
npm run build
npm run preview
```

Then actually load the preview and check:

- Every section renders; the browser console is clean.
- The navbar stays clickable over the final section (the z-index deck is easy to
  break — see `CLAUDE.md`).
- No horizontal scroll at ~375px:
  `document.documentElement.scrollWidth <= window.innerWidth`.
- `dist/CNAME` exists and reads `panosgeorgakopoulos.gr`. Without it the custom
  domain drops on the next deploy.
- `dist/` contains `favicon.svg`, `og-image.jpg`, `robots.txt`, `sitemap.xml`.

Report anything that fails instead of deploying past it.

## 2. Commit

Deploying does not commit source. Commit the working tree first so `gh-pages`
and `main` do not drift.

## 3. Deploy

Confirm with the user, then:

```bash
npm run deploy
```

This force-pushes `dist/` to the `gh-pages` branch. It is a public change to a
live site — never run it unprompted, and never as a way of "testing" a build.

## 4. After

- The live site can lag a minute or two behind the push.
- If copy, the title, or `og-image.jpg` changed, social caches still hold the old
  version. Tell the user to re-scrape via the LinkedIn Post Inspector and the
  Facebook Sharing Debugger; X picks the change up on its own.
- If `public/sitemap.xml`'s `lastmod` is stale, fix it before deploying, not
  after.
