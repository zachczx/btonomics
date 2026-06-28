import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.resolve(__dirname, '../src/data/blog')

async function migrate() {
    console.log('Starting migration...')

    // Get all category directories
    const categories = await fs.readdir(BLOG_DIR, { withFileTypes: true })

    for (const cat of categories) {
        if (!cat.isDirectory()) continue
        if (cat.name === 'images') continue // Skip top-level images folder if it exists (though usually inside categories)

        const catPath = path.join(BLOG_DIR, cat.name)
        console.log(`Processing category: ${cat.name}`)

        const files = await fs.readdir(catPath)

        for (const file of files) {
            // Process .mdx files only
            if (!file.endsWith('.mdx')) continue

            // Match pattern: [pid]_[slug].mdx (e.g., 29_my-post.mdx)
            const match = file.match(/^(\d+)_(.+)\.mdx$/)

            if (match) {
                const pid = match[1]
                const slug = match[2]
                const originalFilePath = path.join(catPath, file)
                const newPostDir = path.join(catPath, slug)
                const newFilePath = path.join(newPostDir, 'index.mdx')

                console.log(`  Migrating: ${file} -> ${slug}/index.mdx`)

                // 1. Create new directory
                await fs.mkdir(newPostDir, { recursive: true })

                // 2. Read content
                let content = await fs.readFile(originalFilePath, 'utf-8')

                // 3. Update Frontmatter (remove pid)
                content = content.replace(/^pid:\s*\d+\r?\n/m, '')

                // 4. Move images
                // Look for images in [cat]/images that start with [pid]_
                const imagesDir = path.join(catPath, 'images')
                if (await fs.stat(imagesDir).catch(() => false)) {
                    const images = await fs.readdir(imagesDir)
                    const relatedImages = images.filter((img) => img.startsWith(`${pid}_`))

                    for (const img of relatedImages) {
                        const oldImgPath = path.join(imagesDir, img)
                        // Remove pid prefix from image name for cleaner look?
                        // Or keep it to avoid conflicts?
                        // User asked to "naming the mdx and images file using that pid as the prefix. but thats quite clunky"
                        // So let's remove the prefix!
                        // But we need to update the content references too.

                        // e.g. 29_img.jpg -> img.jpg (Careful if multiple images map to same name without prefix, unlikely if they were numbered sequentially or unique)
                        // Actually, existing images might be "29_20180517_lw.jpg". Removing "29_" gives "20180517_lw.jpg".

                        const newImgName = img.replace(new RegExp(`^${pid}_`), '')
                        const newImgPath = path.join(newPostDir, newImgName)

                        await fs.rename(oldImgPath, newImgPath)
                        console.log(`    Moved Image: ${img} -> ${newImgName}`)

                        // 5. Update content references
                        // Replace "./images/29_something.jpg" with "./something.jpg"
                        // Regex search for: ./images/[pid]_[name]
                        // We can just iterate over the images we moved.

                        // Escape regex special chars in filenames if needed, but usually safe for standard images
                        const escapedImg = img.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                        const pattern = new RegExp(`\\./images/${escapedImg}`, 'g')
                        content = content.replace(pattern, `./${newImgName}`)
                    }
                }

                // 6. Write new file
                await fs.writeFile(newFilePath, content, 'utf-8')

                // 7. Delete old file
                await fs.unlink(originalFilePath)
            } else {
                console.log(`  Skipping (no pid match): ${file}`)
            }
        }

        // Clean up empty images dir if needed?
        // Maybe unsafe if we missed something. Let's leave it for manual cleanup or checking.
    }

    console.log('Migration complete.')
}

migrate().catch(console.error)
