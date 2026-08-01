import { defineConfig } from 'astro/config'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@astrojs/mdx'
import pagefind from 'astro-pagefind'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import { categories } from './src/data/categories'

const blogDirectory = fileURLToPath(new URL('./src/data/blog/', import.meta.url))

function findBlogPosts(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name)

        if (entry.isDirectory()) return findBlogPosts(path)
        return entry.name === 'index.mdx' ? [path] : []
    })
}

function getFrontmatterValue(frontmatter, key) {
    return frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1].trim()
}

const postLastModified = new Map(
    findBlogPosts(blogDirectory).map((path) => {
        const frontmatter =
            readFileSync(path, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
        const category = getFrontmatterValue(frontmatter, 'category')
        const categorySlug = categories.find((item) => item.category === category)?.slug
        const slug = getFrontmatterValue(frontmatter, 'slug')
        const published = getFrontmatterValue(frontmatter, 'pubDate')
        const updated = getFrontmatterValue(frontmatter, 'updated')

        if (!categorySlug || !slug || !published) {
            throw new Error(`Missing sitemap metadata in ${path}`)
        }

        const modified = new Date(
            Math.max(...[published, updated].filter(Boolean).map((date) => new Date(date).valueOf())),
        )

        return [`/${categorySlug}/${slug}`, modified.toISOString()]
    }),
)

// https://astro.build/config
export default defineConfig({
    build: {
        format: 'file', // 'file' is needed for Pagefind to work
    },
    site: 'https://btonomics.com',
    // Retired the tag-driven "topical" categories — keep old indexed/linked URLs
    // alive by redirecting each to its closest surviving category.
    redirects: {
        '/painting-walls': '/renovation',
        '/flooring': '/renovation',
        '/electrical-lighting': '/renovation',
        '/kitchen-bath': '/renovation',
        '/contractors-reviews': '/honest-reviews',
        '/furniture-decor': '/shopping',
    },
    integrations: [
        mdx(),
        pagefind(),
        sitemap({
            serialize(item) {
                const modified = postLastModified.get(new URL(item.url).pathname)
                if (modified) item.lastmod = modified
                return item
            },
        }),
    ],
    vite: {
        plugins: [
            tailwindcss(),
            Icons({
                compiler: 'astro',
            }),
        ],
    },
    prefetch: true,
})
