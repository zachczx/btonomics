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

### IA / navigation rework — done (consolidated on legacy categories)

Retired the second, tag-driven "topical" category set (it was typo-ridden — `Anyth`, `Mistakle`, `Nippon` — and left 30% of posts uncovered while `furniture-decor` caught 46%). One browse axis now: the 5 real categories.

- `src/data/categories.ts` — now the 5 legacy categories (Renovation, Reviews, Shopping, Maintenance, General) with `slug`/`name`/`category`/`icon`/`description`/tint + `getCategoryBySlug`.
- `src/lib/utils.ts` — `getCategorySlug` matches the canonical `category`; added `STRUCTURAL_TAGS` + `getRelatedTags` for code-level tag curation (no post edits).
- `src/pages/[category]/index.astro` — emits only the 5 slugs; identity header (icon + tint band), count, breadcrumb, friendly empty state, "keep browsing" switcher.
- `src/pages/index.astro` — "Browse by category" cards with real per-category counts (was broken tag-intersection).
- `src/components/Navbar.astro` — **Browse** dropdown of the 5 categories (desktop + mobile); "Blog" → "All posts".
- `src/layouts/Footer.astro` — Browse column maps the 5 categories (added missing General).
- `src/pages/tag/[tag].astro` — dropped the global 50-chip cloud; now count + "often appears with" related tags + grid.
- Fixed one post's `category: 'general'` → `'General'` casing.
- Build: 115 → 109 pages (6 topical routes removed).

### Known issues / next

- ~~Search broken by the astro-pagefind v2 API change~~ **Fixed.** `search.astro` now uses v2 (`@pagefind/component-ui`): `<PagefindConfig />` bootstraps the web components and we compose `<pagefind-input>` / `<pagefind-summary>` / `<pagefind-results>` inline for a full-page experience, themed via the `--pf-*` custom properties. `astro check` is back to 0 errors.
- ~~Sort controls on listings~~ **Done** (see engagement pass below).
- ~~A Reviews hub filtered by Win/Fail, sorted by rating~~ **Done** — `/verdicts`.
- ~~Post-page breadcrumb shows the raw `category` vs the nav label~~ **Done** — now shows the display name.
- Mobile polish pass across all surfaces (spot-check; nothing flagged so far).
- Cost is intentionally **not** a sort key: the field is free-text and non-comparable (`$3,800` vs `$8 per bowl` vs `SGD 4 per frame`). Sort offers Newest / Oldest / Highest-rated only.

### Engagement & browse pass — done

- `src/lib/utils.ts` — `getRelatedPosts()` (same-category → shared-tag overlap → recency fallback).
- `src/pages/[category]/[id].astro` — "Keep reading" related-posts grid at the end of every post; collapsible mobile TOC (`<details>`, `lg:hidden`); ~200wpm read-time in the byline; breadcrumb shows the category display name.
- `src/components/PostCard.astro` — subtle Win/Fail dot + label in the meta row (teal dot = Win, coral dot = Fail; no emoji, nothing over the photo — an image-overlay pill was tried and rejected as too loud); `data-date`/`-rating`/`-mood` for client sort/filter.
- `src/components/PostGrid.astro` — **new.** Client-enhanced grid: Newest/Oldest/Highest-rated sort + optional All/Wins/Fails mood filter; re-inits on `astro:page-load` (client-router safe). Used by category listings (sort) and `/verdicts` (sort + filter).
- `src/pages/verdicts.astro` — **new.** Cross-category hub of every post with a rating/verdict (defaults to highest-rated), with count + avg-rating stat line. Linked from navbar, footer, and the home honest-truth section.
- `src/components/TableOfContents.astro` — script re-runs on `astro:page-load`, mirrors active state across both TOC copies (mobile + desktop), and scopes heading observation to the prose body.

### De-genericizing pass — in progress

Goal: strip the generic landing-page furniture and push the renovation-document
language into the structure. Tells identified, loudest first: (1) emoji icons,
(2) eyebrow → big-bold-heading section headers repeated on every section, (3) the
by-the-numbers stats strip, (4) rounded-full-everything + lift-hover soft-shadow
cards, (5) trailing "→" link arrows + coral-on-hover heading swaps.

- **#1 Icons — done.** Category emoji (`~icons/noto/*`) and the soft-tint tiles
  were replaced with **paint-chip swatches**: each category carries a `swatch` hex
  in `categories.ts`, rendered by `src/components/CategorySwatch.astro` (a solid
  colour block with a darker bottom band, like a real paint sample). 5-colour
  palette: coral / teal / marigold / blueprint-blue `#37658a` / ink. Touches the
  navbar Browse dropdown, the home category cards, and the category page header +
  switcher. The home Win/Fail _feature_ cards also dropped their noto emoji pills
  for the same teal/coral dot + label used on `PostCard` — no emoji left anywhere
  in the chrome.

- **#2 Section headers — done.** The coral-eyebrow → big-bold-heading unit was
  replaced with `src/components/SectionHeading.astro`: a bold heading over a
  hairline **dimension line** (end-ticks + rule, the architect's "measure"), with
  the former kicker demoted to a small ink annotation — and, where natural, made
  factual ("16 verdicts on record", "50 posts indexed", "6 most recent") instead
  of cutesy. Optional action link uses an SVG arrow icon (not a text "→") with a
  subtle hover nudge. Applied to home (×3), `/verdicts`, `/blog`, `/about-us`,
  `/search`, `/tag/[tag]`, and the post "Keep reading" header; the category
  "Keep browsing" label was de-coralled. ReviewSummary's card labels keep their
  semantic coral/teal (pros = teal, cons = coral) — they are not section headers.
  (The hero before/after "→" badge is left as-is; it's the documented signature.)

- **#4 Cards — done.** Dropped the uniform `hover:-translate-y-1` + pillowy
  drop-shadow and squared the corners (`rounded-2xl` → `rounded-lg`) for edge
  contrast against the pills. Cards are now flat with a hairline border that
  **snaps to ink on hover** (drafting "selection" feel, `transition-colors`, no
  lift). Applied to `PostCard`, the home category + Win/Fail feature cards
  (feature cards keep their coral/teal border), `ReviewSummary`, the post main
  panel (`shadow-sm` → hairline border), the cover image, the mobile-TOC details,
  and the empty-state box. Kept: prose-image shadow (body content), floating
  dropdown shadows (overlays need elevation), the hero signature images, and the
  rounded-full pills (now contrasted by the squarer cards).

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
