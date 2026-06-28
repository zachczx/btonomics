# BTOnomics Redesign — "Bright & Friendly, but Ours" (direction V3)

Living plan of record for the current redesign. Source of truth for tokens is
`src/styles/global.css`; this doc captures intent, decisions, and remaining work.

## North star

Bright, friendly, approachable — **but intentional and grounded in the subject
(a real couple's honest, budget HDB renovation diary)**, never generic AI design.

### Anti-generic rules (hard constraints)

- **No default fonts** (no Poppins / Inter as the face). Use Bricolage Grotesque + Hanken Grotesk.
- **No Airbnb coral+teal gradient soup.** Flat color pops only; **ink is the workhorse** (CTAs, footer).
- **No gradient blobs**, no decorative emoji sprinkle, no uniform pillowy drop-shadows on everything.
- **Real photos do the work.** Restraint everywhere except the one signature.
- **One subject-grounded signature** (see below), boldness spent there only.

## Design tokens (exact values: `src/styles/global.css`)

- **Fonts:** headings `--font-heading` = Bricolage Grotesque Variable; body `--font-body` = Hanken Grotesk Variable. Self-hosted via `@fontsource-variable`.
- **daisyUI theme `hometheme`** (set on `<html data-theme>` in Layout):
    - primary = coral `#ff5a45`
    - secondary = teal `#0e9aa0`
    - accent = marigold `#ffb22e`
    - neutral = ink `#1b1714` (workhorse: primary buttons, footer)
    - base-100 `#ffffff`, base-200 paper `#fff6ec`, base-300 hairline `#ece2d4`, base-content = ink
    - success = teal (WIN), error = coral (FAIL), warning = marigold
- **Custom @theme colors:** `paper`, `ink`, `softcoral`, `softteal`, `softmarigold`, `blueprint` (`#c9b8a3`).
- **Radii:** box `1.1rem`, field `0.7rem`, selector `2rem` (pills).
- **Utilities:**
    - `eyebrow` — uppercase Hanken bold, small (section labels / chips)
    - `ledger` — `tabular-nums` (costs/counts; NO mono font anymore)
    - `marker` — marigold highlight swipe on a word (use **once** per view)
    - `blueprint` — faint graph-paper grid (the HDB motif)
    - `text-list-dot`

## Signature & motifs (the distinctive, ownable bits)

1. **Before → After** (primary signature): vision render (grayscale) → reality photo, with corner labels + an ink "→" badge. Reno's essence. Lives in the hero; reuse where natural.
2. **Blueprint grid** (`.blueprint`) faint behind the hero — "HDB graph paper."
3. **Coral paint-chip** brand mark (rounded square) in nav + footer.
4. **Ink workhorse** — primary buttons and footer are ink, not coral.
5. **Flat pops** — coral/teal/marigold in chips/labels; soft tints (`softcoral/softteal/softmarigold`) as chip backgrounds. Win=teal, Fail=coral, single emoji marker (not decoration).

## Layout system

- `Layout.astro`: `fullBleed` prop (home uses full-bleed bands); other pages use the centered `max-w` container. `data-theme="hometheme"`.
- Home section rhythm: paper hero → white (honest truth) → paper (latest) → white (topics) → ink footer.
- Post reading measure: single column ~`44rem`; cover image may break wider (~`56rem`).

## Status

### Done

- `src/styles/global.css` — V3 tokens, fonts, utilities, blueprint/marker.
- `src/components/Navbar.astro` — paint-chip mark, pill nav, ink Search.
- `src/layouts/Footer.astro` — ink band, coral/teal hover accents.
- `src/components/PostCard.astro` — rounded card, teal tag chip, marigold cost chip, image fallback.
- `src/pages/index.astro` — home: before/after hero + blueprint, Honest Truth (Win/Fail), Latest, Browse by Topic chips.
- `src/components/ReviewSummary.astro` — friendly verdict card (rounded-2xl, star rating, marigold cost tile + teal/coral "the call" tile, pros/cons with soft-tint markers). Mono-receipt look dropped.
- `src/pages/[category]/[id].astro` — post template in V3 (mood pill, cover, byline/dates, tag chips, verdict card, self-funded disclosure, 44rem measure; weights normalized to ≤800).
- `src/components/Prose.astro` — teal links, coral hover (was marigold), Bricolage headings.
- `src/pages/[category]/index.astro`, `src/pages/blog.astro`, `src/pages/tag/[tag].astro` — coral eyebrows, Bricolage titles (`font-extrabold`, since Bricolage tops at 800), teal tag-cloud chips.
- `src/pages/search.astro` — V3 header + Pagefind UI on tokens (Hanken font, readable ink excerpts, coral hover, pill input, focus ring).
- `src/pages/about-us.astro` — V3 listing-style header.

### To do

- Mobile polish pass across all surfaces (spot-check; nothing flagged so far).

### Cleanup — done

- Removed `src/pages/variants/` (v1–v4 mockups).
- Uninstalled unused `@fontsource/space-mono` (Poppins already removed).
- Updated `CLAUDE.md` styling section to V3 (fonts, palette, signature).

## Content notes

- `cost` is optional free-text; most older posts have no exact cost (user forgot) — fine, chips/receipt hide when absent.
- Review fields (`verdict`, `recommend`, `rating`, `pros`, `cons`, `cost`, `updated`) live in MDX frontmatter; only the Nippon Paint post is populated as an example.
- Win/Fail is driven by `mood: positive | negative`.

## Open decisions

- Keep the funny running tallies somewhere (friendly, not dark/mono)? Currently dropped from home.
- Add the actual floor-plan image as a watermark in addition to the CSS blueprint grid?
- Final hero/footer tagline wording.

## Commits (this redesign)

- V3 redesign — foundation + home + chrome + verdict card + post template + listings + search/about + cleanup (single commit to `master`).

## History / context

- Prior direction (earthy "receipts/ledger" + Hanken/Space Mono, sage/terracotta + deep forest) was **rejected** wholesale. Reasons to avoid repeating: too earthy, the mono/ledger gimmick, risk of feeling over-designed.
- Four mockups were shown (minimal / editorial / bright-friendly / dark); user chose **bright-friendly (V3)** with the explicit caveat: don't go overboard with generic LLM designs.
