---
name: site-audit
description: Run a full parallel audit of the portfolio — accessibility, performance, SEO, CV-fidelity and design — then merge the results into one prioritised report. Use when asked to audit, review, or find problems with the site, or before a deploy that matters.
---

# Full site audit

Fans five specialist agents out in parallel, then reconciles their findings into
a single ranked list. The whole point is the fan-out: launch them in **one**
message so they run concurrently, not one after another.

## 1. Prepare

Build first, so every agent reads the same artefacts:

```bash
npm run build
```

If the audit should reflect the live site rather than the working tree, say so in
the report — the agents read the working tree.

## 2. Fan out

In a single message, launch all five with the `Agent` tool:

| `subagent_type`  | Covers                                              |
| ---------------- | --------------------------------------------------- |
| `site-a11y`      | Semantics, keyboard, focus, contrast, reduced motion |
| `site-perf`      | Bundle, render churn, animation cost, assets         |
| `site-seo`       | Meta, OG, JSON-LD, sitemap, SPA crawlability         |
| `site-content`   | CV fidelity, consistency, positioning                |
| `site-design`    | Hierarchy, breakpoints, spacing, interaction states  |

Give each the same context: the repo path, that `CLAUDE.md` describes the
architecture, and any specific worry that prompted the audit. Do not pass them
each other's findings — independence is what makes the overlap meaningful.

## 3. Reconcile

Agents will disagree and overlap. Do not concatenate five reports.

- **Merge duplicates.** When two agents find the same defect from different
  angles, that raises confidence — state it once and note both angles.
- **Resolve conflicts.** Perf and design will sometimes pull against each other
  (blur radii, animation). Pick a side and say why.
- **Verify before repeating.** An agent's finding is a claim, not a fact. Spot-check
  anything surprising, anything that names a line number, and anything you would
  act on. Drop what does not survive.
- **Cut the padding.** Findings that would change nothing a visitor experiences
  do not belong in the top list.

## 4. Report

One document, findings ranked by impact across all five domains:

1. **Ship-blockers** — broken, wrong, or actively costing the owner opportunities.
2. **Worth doing** — real improvements with a clear payoff.
3. **Optional polish** — cheap, low stakes.
4. **Checked and fine** — coverage, so the reader knows what was looked at.

Each finding: what, where (`file:line`), why it matters, and the fix. Attribute
nothing to "the agents" — you verified it, so state it directly.

Then ask which items to implement. Do not start fixing during the audit.
