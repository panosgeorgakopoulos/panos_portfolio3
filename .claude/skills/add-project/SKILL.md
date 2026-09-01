---
name: add-project
description: Add or edit a project entry in the portfolio's Selected Work section, end to end. Use when asked to add, remove, reorder or update a project.
---

# Add a project

Projects are data. There is no per-project component.

## 1. Add the entry

Append to `PROJECTS` in `constants.ts`, matching the `Project` shape in
`types.ts`:

```ts
{
  id: 'kebab-case-unique',
  title: 'NAME',
  subtitle: 'What it is, in three or four words',
  accent: 'cyan' | 'purple' | 'green',
  bullets: [
    'What was built and the engineering decision behind it.',
    'A second bullet only if it adds something the first does not.',
  ],
  tags: ['Stack', 'Items'],
  link: 'https://github.com/...', // optional
}
```

Rules that keep the section coherent:

- **Order is priority order.** The grid renders in array order and numbers
  entries `01`, `02`… — put the strongest work first.
- **Two bullets, achievement-first.** Lead with what was built or measured, not
  with the technology. The technology is already in `tags`.
- **Accents cycle for rhythm**, not meaning. Avoid three of the same colour in a
  row.
- **`link` is optional.** With a link the card renders as an `<a>` and grows an
  arrow affordance; without one it renders as an `<article>`. Do not add a
  placeholder `#` — that produces a card that looks clickable and is not.
- Keep bullets to roughly one or two lines each. The cards sit in a two-column
  grid and lock to equal height per row.

## 2. Verify

```bash
npm run typecheck && npm run build && npm run preview
```

In the preview, check the Projects section at both a narrow (~375px) and a wide
(~1440px) viewport: cards in a row should end up the same height, and the tag
row should stay pinned to the card bottom. An odd number of projects leaves a
gap in the last row of the two-column grid — that is expected, but look at it
before shipping.
