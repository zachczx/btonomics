# De-genericizing pass

Companion to `redesign.md`. Goal: strip the generic 2025 AI-landing-page
furniture off an otherwise distinctive design, and push the **renovation-document**
language (blueprints, paint chips, dimension lines, receipts/verdicts) into the
places where structure lives.

The bones were already good — the before/after hero, the blueprint grid,
Bricolage + Hanken, ink-as-workhorse, `ledger` numerals. The problem was generic
furniture layered on top. These are the tells we found, loudest first, and what
we did about each.

## Status

| #   | Tell                                       | Status                                 |
| --- | ------------------------------------------ | -------------------------------------- |
| 1   | Emoji icons                                | ✅ paint-chip swatches                 |
| 2   | Coral-kicker → big-bold-heading headers    | ✅ dimension-line device               |
| 3   | By-the-numbers stats strip                 | ⏭️ kept (judged defensible)            |
| 4   | Rounded-2xl + lift + pillowy shadow cards  | ✅ flat drafting border-snap           |
| 5   | Trailing "→" arrows / coral-on-hover swaps | 🔶 partial (header arrows → SVG icons) |

## What we changed

### #1 — Icons → paint-chip swatches

The category icons were full-colour **noto emoji** (🔨 ⭐ 🛒 🔧 🤔) in pastel
soft-tint tiles — peak template, and against the brand's own "no emoji sprinkle"
rule. Replaced with paint-chip **swatches**: each category carries a `swatch` hex
in `src/data/categories.ts`, rendered by `src/components/CategorySwatch.astro`
(solid colour block + a darker bottom band, like a real paint sample). Ties to
the existing coral paint-chip logo.

- Palette: Renovation `#ff5a45` · Reviews `#0e9aa0` · Shopping `#ffb22e` ·
  Maintenance `#37658a` (blueprint blue) · General `#1b1714` (ink).
- Touches: navbar Browse dropdown, home category cards, category page header +
  switcher. Count badges went neutral (ink-on-paper) so there's no rainbow.

### #2 — Section headers → dimension line

Every section used the same unit: a small coral uppercase kicker over a
`text-4xl font-extrabold` heading — the single most recognizable landing-page
signature. Replaced with `src/components/SectionHeading.astro`: a bold heading
over a hairline **dimension line** (end-ticks + rule, the architect's "measure"),
with the kicker demoted to a small ink annotation — and made **factual** where
natural:

| Was (coral kicker)         | Now (ink annotation)    |
| -------------------------- | ----------------------- |
| "Receipts don't lie"       | "16 verdicts on record" |
| "Find your rabbit hole"    | "50 posts indexed"      |
| "Fresh off the to-do list" | "6 most recent"         |

- Action links use an **SVG arrow icon** (Lucide arrow-right, navbar stroke
  style) with a subtle hover nudge — not a text "→".
- Applied to home (×3), `/verdicts`, `/blog`, `/about-us`, `/search`,
  `/tag/[tag]`, and the post "Keep reading" header. "Keep browsing" de-coralled.
- Kept: `ReviewSummary`'s card labels (semantic coral = cons, teal = pros — not
  section headers) and the hero before/after "→" badge (documented signature).

### #3 — Stats strip (kept, on purpose)

The homepage "50 posts · 8 years · 16 verdicts · wins/fails" band is a SaaS
silhouette. But the numbers are honest and specific to a diary (not vanity
metrics), the execution is restrained (no gradient, tabular-nums on paper), and a
running win/fail tally **is** the subject of a "receipts" blog. Verdict: the
pattern is a mild tell, but the content earns its place. Left as-is.

- Optional future tweak: reframe the silhouette from "metrics band" to "ledger
  line" (right-aligned tabular figures with hairline leaders, like a receipt
  subtotal) to make it unmistakably ours rather than merely defensible.

### #4 — Cards → flat drafting border-snap

Every card was `rounded-2xl` with an identical `hover:-translate-y-1` + soft
pillowy drop-shadow (which `redesign.md` itself warns against). Now: flat, no
lift, no shadow; corners squared to `rounded-lg` for edge contrast against the
pills; hover **snaps the border to ink** (a CAD-selection feel, `transition-colors`).

- Applied to `PostCard`, home category + Win/Fail feature cards (feature cards
  keep their coral/teal border), `ReviewSummary`, the post main panel
  (`shadow-sm` → hairline border), cover image, mobile-TOC details, empty state.
- Kept: prose-image shadow (body content), floating dropdown elevation (overlays
  need it), hero signature images, and the rounded-full pills (now contrasted by
  the squarer cards).

### Win/Fail markers → dot + label (no emoji)

`PostCard`'s Win/Fail started as a loud solid emoji pill overlaid on the image;
it became a subtle teal/coral **dot + label** in the meta row. The two homepage
feature cards kept their emoji pills longer, then dropped them for the same dot +
label (slightly larger). No emoji remain anywhere in the chrome.

## What's left

- **Tail of #5** — coral-on-hover heading swaps (card titles turn coral on
  hover, still on `PostCard` and the home category cards). The last "default
  interaction" tell. Minor.
- **The bigger lever (net-new design, not cleanup):** push the
  renovation-document language _into_ more surfaces rather than only removing
  generic bits — the hero, the verdict card, post chrome. That's where the
  identity goes from "not generic" to "unmistakably this blog."

## Principle

Spend boldness in one place; keep everything else quiet. Structural devices
(the dimension line, the paint chip, the ledger) should encode something true
about the subject, not decorate. Prefer specific/factual copy over clever.
