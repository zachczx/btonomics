import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import pagefind from 'astro-pagefind'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'

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
    integrations: [mdx(), pagefind(), sitemap()],
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
