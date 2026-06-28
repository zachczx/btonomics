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

import { categories } from '../data/categories'

export function getCategorySlug(categoryName: string): string {
    // 1. Try to find strict match in defined categories
    const found = categories.find(
        (c) =>
            c.name.toLowerCase() === categoryName.toLowerCase() ||
            c.slug === categoryName.toLowerCase(),
    )
    if (found) return found.slug

    // 2. Fallback to legacy kebab-case
    return categoryName.toLowerCase().replace(' ', '-')
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
