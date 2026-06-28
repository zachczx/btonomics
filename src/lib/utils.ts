import { getCollection, type CollectionEntry } from 'astro:content'

// export async function GetPid() {
//     const allPosts = await getCollection('blog')

//     allPosts.sort((a, b) => (a.data.pid || 0) - (b.data.pid || 0))
//     const lastId = allPosts[allPosts.length - 1].data.pid
//     console.log(lastId)
// }

/**
 *
 * @param {object} posts - gotten from getCollection()
 * @param {array} data.tags - tags for each post, optional
 */
export async function GetUniqueTags(posts: CollectionEntry<'blog'>[]) {
    const tags = posts.flatMap((post) => post.data.tags || [])
    return [...new Set(tags)].sort()
}

/** Tags too broad or structural to be useful as browse facets. */
export const STRUCTURAL_TAGS = new Set(
    ['BTO', 'Guide', 'Renovation', 'Shopping', 'Maintenance', 'Preparation', 'Thoughts'].map((t) =>
        t.toLowerCase(),
    ),
)

/** Tags that co-occur with `tag` across the collection, most-frequent first, excluding structural tags. */
export function getRelatedTags(posts: CollectionEntry<'blog'>[], tag: string, limit = 6): string[] {
    const counts: Record<string, number> = {}
    for (const post of posts) {
        const tags = post.data.tags || []
        if (!tags.includes(tag)) continue
        for (const t of tags) {
            if (t === tag || STRUCTURAL_TAGS.has(t.toLowerCase())) continue
            counts[t] = (counts[t] || 0) + 1
        }
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([t]) => t)
}

/**
 * Posts to recommend at the end of an article: same category first, then by shared-tag
 * overlap, with recency as the final tiebreaker so the block always fills even when a
 * post has no category/tag siblings. Excludes the current post.
 */
export function getRelatedPosts(
    posts: CollectionEntry<'blog'>[],
    current: CollectionEntry<'blog'>,
    limit = 3,
): CollectionEntry<'blog'>[] {
    const currentCategory = getCategorySlug(current.data.category)
    const currentTags = new Set(current.data.tags || [])
    return posts
        .filter((p) => p.id !== current.id)
        .map((post) => {
            const sameCategory = getCategorySlug(post.data.category) === currentCategory
            const sharedTags = (post.data.tags || []).filter((t) => currentTags.has(t)).length
            return { post, score: (sameCategory ? 1000 : 0) + sharedTags }
        })
        .sort(
            (a, b) =>
                b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
        )
        .slice(0, limit)
        .map((x) => x.post)
}

import { categories } from '../data/categories'

export function getCategorySlug(categoryName: string): string {
    const key = categoryName.toLowerCase()
    // 1. Match against a defined category by canonical name, display name, or slug
    const found = categories.find(
        (c) => c.category.toLowerCase() === key || c.name.toLowerCase() === key || c.slug === key,
    )
    if (found) return found.slug

    // 2. Fallback to kebab-case for anything not in categories.ts
    return key.replace(/\s+/g, '-')
}

export async function CleanAndSort() {
    const posts = await getCollection('blog')

    posts.forEach((entry) => {
        entry.data.category = getCategorySlug(entry.data.category)
    })

    posts.sort((a, b) => {
        return b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    })

    return posts
}

export function FilterCleanSort(collection: CollectionEntry<'blog'>[], filter: string) {
    const posts = collection.filter((entry) => {
        return entry.data.category === filter
    })
    posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    return posts
}

/**
 * I tried writing this for the blog post dates using getFullYear() etc, but this was subpar.
 * Problem: Sounds good in theory but if it counts as 1 month difference between 5 Dec and 30 Nov, even if only a few days passed.
 * Very tiresome to have to account for all ways of calculation, so I decided to revert to manually doing 365 days a year, 30 days a month
 */
export function CalculateDateAgo(postDate: Date) {
    const today = new Date()
    const yearsInBetween = today.getFullYear() - postDate.getFullYear()
    const monthsInBetween = today.getMonth() - postDate.getMonth()
    const daysInBetween = today.getDate() - postDate.getDate()
    let differenceString = ''
    console.log(yearsInBetween)
    console.log(monthsInBetween)
    console.log(daysInBetween)
    if (yearsInBetween === 0 && monthsInBetween === 0) {
        if (daysInBetween === 0) {
            differenceString = `Today`
        } else if (daysInBetween === 1) {
            differenceString = `1 day ago`
        } else {
            differenceString = `${daysInBetween} days ago`
        }
    } else if (yearsInBetween === 0 && monthsInBetween < 2 && monthsInBetween >= 1) {
        differenceString = `1 month ago`
    } else if (yearsInBetween === 0 && monthsInBetween >= 2) {
        differenceString = `${monthsInBetween} months ago`
    } else if (yearsInBetween >= 1 && yearsInBetween < 2) {
        differenceString = `1 year ago`
    } else if (yearsInBetween >= 2) {
        // Several years
        //Check number of months
        if (monthsInBetween >= 11) {
            differenceString = `${yearsInBetween + 1} years ago`
        } else {
            differenceString = `${yearsInBetween} years ago`
        }
    }

    return differenceString
}
