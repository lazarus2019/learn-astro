type Glob = {
    file: string
    url: string
}



export type MarkdownPost = {
    title: string
    author: string
    description: string
    image: {
        url: string,
        alt: string
    },
    layout?: string,
    pubDate: string
    tags: string[],
}

export type Post = Glob & {
    frontmatter: MarkdownPost
}