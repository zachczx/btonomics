export interface Category {
    /** URL slug, also the value posts get after getCategorySlug() */
    slug: string
    /** display name (nav, headers) */
    name: string
    /** descriptive browser/search title; Layout appends the site name */
    metaTitle: string
    /** canonical `category` value in post frontmatter */
    category: string
    description: string
    /** the category's paint colour (hex) — rendered as a paint-chip swatch */
    swatch: string
}

export const categories: Category[] = [
    {
        slug: 'renovation',
        name: 'Renovation',
        metaTitle: 'HDB Renovation Guides, Costs & Lessons',
        category: 'Renovation',
        description:
            'The messy middle, hacking, screeding, wet works, painting, and the trades who did it.',
        swatch: '#ff5a45', // coral
    },
    {
        slug: 'honest-reviews',
        name: 'Reviews',
        metaTitle: 'Honest HDB Product & Vendor Reviews',
        category: 'Honest Reviews',
        description:
            'No-sponsor verdicts on the stuff we actually bought and the vendors we actually hired.',
        swatch: '#0e9aa0', // teal
    },
    {
        slug: 'shopping',
        name: 'Shopping',
        metaTitle: 'HDB Shopping Guides, Taobao Tips & Savings',
        category: 'Shopping',
        description:
            'Where to buy, what to skip, and how not to overpay, Taobao, IKEA, and everything in between.',
        swatch: '#ffb22e', // marigold
    },
    {
        slug: 'maintenance',
        name: 'Maintenance',
        metaTitle: 'HDB Home Maintenance, Cleaning & Repair Guides',
        category: 'Maintenance',
        description:
            'Keeping a lived-in HDB running, servicing, cleaning, mould, and the small fixes.',
        swatch: '#37658a', // blueprint blue
    },
    {
        slug: 'general',
        name: 'General',
        metaTitle: 'HDB Living, Homeowner Tips & Singapore Stories',
        category: 'General',
        description:
            'Everything else, the money calls, the neighbours, and the occasional good bowl of noodles.',
        swatch: '#1b1714', // ink
    },
]

/** Look up a category by its URL slug. */
export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug)
}
