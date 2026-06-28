import IconHammer from '~icons/noto/hammer'
import IconStar from '~icons/noto/star'
import IconCart from '~icons/noto/shopping-cart'
import IconWrench from '~icons/noto/wrench'
import IconThinking from '~icons/noto/thinking-face'

export interface Category {
    /** URL slug, also the value posts get after getCategorySlug() */
    slug: string
    /** display name (nav, headers) */
    name: string
    /** canonical `category` value in post frontmatter */
    category: string
    icon: typeof IconHammer
    description: string
    /** soft tint for the category header band + chips */
    tintBg: string
    tintText: string
}

export const categories: Category[] = [
    {
        slug: 'renovation',
        name: 'Renovation',
        category: 'Renovation',
        icon: IconHammer,
        description:
            'The messy middle, hacking, screeding, wet works, painting, and the trades who did it.',
        tintBg: 'bg-softcoral',
        tintText: 'text-primary',
    },
    {
        slug: 'honest-reviews',
        name: 'Reviews',
        category: 'Honest Reviews',
        icon: IconStar,
        description:
            'No-sponsor verdicts on the stuff we actually bought and the vendors we actually hired.',
        tintBg: 'bg-softteal',
        tintText: 'text-secondary',
    },
    {
        slug: 'shopping',
        name: 'Shopping',
        category: 'Shopping',
        icon: IconCart,
        description:
            'Where to buy, what to skip, and how not to overpay, Taobao, IKEA, and everything in between.',
        tintBg: 'bg-softmarigold',
        tintText: 'text-accent-content',
    },
    {
        slug: 'maintenance',
        name: 'Maintenance',
        category: 'Maintenance',
        icon: IconWrench,
        description:
            'Keeping a lived-in HDB running, servicing, cleaning, mould, and the small fixes.',
        tintBg: 'bg-softteal',
        tintText: 'text-secondary',
    },
    {
        slug: 'general',
        name: 'General',
        category: 'General',
        icon: IconThinking,
        description:
            'Everything else, the money calls, the neighbours, and the occasional good bowl of noodles.',
        tintBg: 'bg-softcoral',
        tintText: 'text-primary',
    },
]

/** Look up a category by its URL slug. */
export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug)
}
