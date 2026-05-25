import { imageSize } from "image-size"
import { readFileSync, statSync } from "fs"
import path from "path"

export type GifEntry = {
    slug: string
    title: string
    image: any
    src: string
    width: number
    height: number
    size: number
}

const modules = import.meta.glob("../content/gif/*.gif", { eager: true, })
export default async function getGIFs(): Promise<GifEntry[]> {
    return Object.entries(modules).map(([modulePath, module]) => {
        const file = path.basename(modulePath)
        const filepath = path.resolve("src/content/gif", file)
        const buffer = readFileSync(filepath)
        const stats = statSync(filepath)
        const dimensions = imageSize(buffer)
        const basename = file.replace(".gif", "")
        const slug = basename.toLowerCase().replaceAll(" ", "-")
        return {
            slug,
            title: basename,
            image: (module as any).default,
            src: (module as any).default.src,
            width: dimensions.width ?? 0,
            height: dimensions.height ?? 0,
            size: stats.size,
        }
    })
}
