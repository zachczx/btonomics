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

### The two-tier category system (the main thing to understand)

There are **two parallel category concepts** and they do not map 1:1:

1. **Legacy categories** — the `category` string in each post's frontmatter (e.g. `"Renovation"`, `"Shopping"`, `"General"`, `"Maintenance"`, `"Honest Reviews"`). These also mirror the on-disk folder names (`renovation/`, `honestReviews/`, etc.). A post's **canonical URL is built from its legacy category**: `getCategorySlug(entry.data.category)` kebab-cases it, so posts live at `/renovation/<slug>`, `/shopping/<slug>`, etc.

2. **New topical categories** — defined in `src/data/categories.ts` (`painting-walls`, `flooring`, `electrical-lighting`, `kitchen-bath`, `contractors-reviews`, `furniture-decor`). These are **tag-driven**: a post belongs to a new category if its `tags` intersect that category's `tags` list. Used for the homepage "Browse by Topic" grid and the `/<new-slug>` listing pages.

So `src/pages/[category]/index.astro` resolves **both**: it `getStaticPaths`-emits new-category slugs _and_ legacy slugs, filtering by tag-intersection for new categories and by frontmatter `category` for legacy ones. When editing category logic, update `src/data/categories.ts` (tags) and keep the legacy fallback paths in sync. `getCategorySlug()` in `src/lib/utils.ts` is the single source for name→slug resolution (matches a `categories.ts` entry, else kebab-case fallback).

### Routes

- `/` (`pages/index.astro`) — hero, Win/Fail cards (by `mood`), latest 6 posts, Browse by Topic grid (counts via tag-intersection).
- `/[category]/` — category listing (new tag-based or legacy).
- `/[category]/[id]` — a post; `id` is the post `slug`. Renders MDX `<Content />` inside `<Prose>` with a sticky `<TableOfContents>` built from `render()` headings.
- `/tag/[tag]` — posts for a tag, grouped into hardcoded legacy-category sections.
- `/blog`, `/about-us`, `/search`.

Post-sorting/cleaning helpers live in `src/lib/utils.ts` (`CleanAndSort`, `FilterCleanSort`, `GetUniqueTags`). Note several pages also define their own local `CleanAndSort` inline.

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
