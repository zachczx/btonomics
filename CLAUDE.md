# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static Astro site for **btonomics.com** (BTOnomics) — a Singapore HDB/BTO home-renovation blog. Content is MDX, search is build-time, output is fully static. Package manager is **pnpm**.

## Commands

```bash
pnpm dev          # dev server (note: Pagefind search index is NOT built in dev — see below)
pnpm build        # production build to dist/ (also generates the Pagefind index)
pnpm preview      # serve the built dist/ — use this to test search
pnpm prettier     # format the whole repo (prettier . --write)
pnpm astro check  # TypeScript / Astro type checking (no npm script alias)
pnpm exec eslint .   # lint (no npm script alias; rules in eslint.config.js)
```

There is no test suite.

## Architecture

### Content collection

The single `blog` collection (`src/content.config.ts`) loads `src/data/blog/**/[^_]*.mdx`. Each post is a **directory** `src/data/blog/<folder>/<slug>/index.mdx` with its images co-located in the same folder and imported relatively (e.g. `image: './photo.webp'`). Files/folders prefixed with `_` are ignored by the loader.

Frontmatter schema (Zod, in `content.config.ts`):
`title`, `pubDate` (date), `category` (string), `author` — required; `description`, `image`, `tags` (string[]), `slug`, `mood` — optional. `mood` is `'positive'` or `'negative'` and drives the homepage Win/Fail cards.

### The category system (one axis)

There is **one** browse axis: the `category` string in each post's frontmatter — one of `"Renovation"`, `"Honest Reviews"`, `"Shopping"`, `"Maintenance"`, `"General"`. These mirror the on-disk folders (`renovation/`, `honestReviews/`, etc.). A post's **canonical URL is built from its category**: `getCategorySlug(entry.data.category)` resolves it to a slug, so posts live at `/renovation/<slug>`, `/honest-reviews/<slug>`, etc.

`src/data/categories.ts` is the single source of truth for those 5 categories — each entry has `slug`, display `name` (e.g. "Honest Reviews" shows as **Reviews**), canonical `category` (the frontmatter value), a `description`, and a paint-chip `swatch` colour (rendered via `src/components/CategorySwatch.astro`; the old emoji icons + soft-tint tiles were dropped as too generic). It drives the navbar **Browse** dropdown, the homepage "Browse by category" cards, the footer, and `src/pages/[category]/index.astro` (which `getStaticPaths`-emits exactly these 5 slugs and filters by `getCategorySlug(data.category) === slug`). `getCategorySlug()` and `getCategoryBySlug()` live in `src/lib/utils.ts` / `categories.ts`.

> Historical note: there used to be a second, tag-driven set of "topical" categories (`painting-walls`, `flooring`, …). It was retired — the tag→category mappings were typo-ridden and left 30% of posts uncovered. See `redesign.md`.

**Tags** are a secondary facet. There are ~50 of them and most are used once, so the tag UI is curated _in code_, not by editing posts: `STRUCTURAL_TAGS` (in `utils.ts`) hides over-broad tags (BTO, Guide, …) and `getRelatedTags()` powers the "often appears with" row on `/tag/[tag]` (co-occurring tags only — no global tag cloud).

### Routes

- `/` (`pages/index.astro`) — hero, Win/Fail cards (by `mood`), latest 6 posts, Browse-by-category cards (counts by `category`), "See all verdicts" link.
- `/[category]/` — one of the 5 category listings; identity header (icon + tint), count, breadcrumb, sortable post grid (`<PostGrid>`), "keep browsing" switcher.
- `/[category]/[id]` — a post; `id` is the post `slug`. Renders MDX `<Content />` inside `<Prose>` with a sticky `<TableOfContents>` (plus a collapsible mobile TOC) built from `render()` headings, a byline read-time estimate, and a "Keep reading" related-posts grid (`getRelatedPosts`).
- `/verdicts` — cross-category hub of every post carrying a `rating`/`verdict`; `<PostGrid>` with sort + Win/Fail filter, defaulting to highest-rated.
- `/tag/[tag]` — posts for a tag, with a "often appears with" related-tags row (`getRelatedTags`).
- `/blog`, `/about-us`, `/search`.

Post-sorting/cleaning helpers live in `src/lib/utils.ts` (`CleanAndSort`, `FilterCleanSort`, `GetUniqueTags`, `getRelatedPosts`). Note several pages also define their own local `CleanAndSort` inline. `src/components/PostGrid.astro` is the client-enhanced grid (sort Newest/Oldest/Highest-rated + optional All/Wins/Fails mood filter); it re-inits on `astro:page-load` and reads `data-date`/`-rating`/`-mood` off each `PostCard`. Cost is deliberately not a sort key — the field is free-text and non-comparable.

### Search (Pagefind)

Search uses **astro-pagefind**. The index is generated only during `pnpm build`, so search is empty in `pnpm dev` — verify it via `pnpm build && pnpm preview`. This is why `astro.config.mjs` sets `build.format: 'file'` (Pagefind requires it). `data-pagefind-body` (on `Prose.astro`) marks indexable content; `data-pagefind-ignore` excludes regions.

### Styling

**Tailwind CSS v4** via the Vite plugin — there is **no `tailwind.config.js`**. All config lives in `src/styles/global.css` using `@import 'tailwindcss'`, `@plugin`, and `@theme`. **daisyUI v5** provides components; the active theme is the custom `hometheme` defined inline in `global.css` (`Layout.astro` sets `data-theme="hometheme"`). The current direction is **"bright & friendly, but ours"** (V3) — see `redesign.md` at the repo root for the full plan of record.

Palette: **coral** `#ff5a45` (primary), **teal** `#0e9aa0` (secondary), **marigold** `#ffb22e` (accent), **ink** `#1b1714` (neutral — the workhorse for primary buttons and the footer, _not_ coral), on white / **paper** `#fff6ec` (base-200). Win = teal (`success`), Fail = coral (`error`). Custom `@theme` colors (`paper`, `ink`, `softcoral`, `softteal`, `softmarigold`, `blueprint`) generate utilities like `bg-paper`, `text-ink`, `bg-softteal`. Fonts: **Bricolage Grotesque** (headings, `--font-heading`) + **Hanken Grotesk** (body, `--font-body`), self-hosted via `@fontsource-variable`. Signature utilities in `global.css`: `eyebrow` (uppercase Hanken labels), `ledger` (`tabular-nums` for costs/counts — no mono font), `marker` (marigold highlight swipe, use once per view), `blueprint` (faint HDB graph-paper grid). The brand's distinctive bits are the **Before → After** hero pairing, the blueprint grid, the coral paint-chip mark, and ink-as-workhorse — keep boldness spent there and everything else quiet (no gradient blobs, emoji sprinkle, or uniform pillowy shadows).

### Icons

**unplugin-icons** with `~icons/<set>/<name>` imports (e.g. `~icons/noto/hammer`), Astro compiler, backed by `@iconify/json`. Types registered in `tsconfig.json` (`unplugin-icons/types/astro`).

## Conventions

- Indentation is 4 spaces (see existing `.astro`/`.ts` files); Prettier + `prettier-plugin-astro` + `prettier-plugin-tailwindcss` enforce formatting and class ordering.
- New posts: create `src/data/blog/<folder>/<slug>/index.mdx`, co-locate images in that folder, set `slug` in frontmatter to match the folder name (URLs depend on it), and use `tags` that match a `categories.ts` entry if you want the post to surface under a topical category.

## Historical note

`scripts/migrate-blog.ts` is a one-off migration that converted flat `[pid]_[slug].mdx` files (with a shared `images/` dir) into the current per-post `<slug>/index.mdx` directories with co-located images. It is not part of the build — kept for reference only.
