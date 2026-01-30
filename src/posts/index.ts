import { Buffer } from 'buffer'
import matter from 'gray-matter'

if (typeof globalThis !== 'undefined' && typeof (globalThis as { Buffer?: typeof Buffer }).Buffer === 'undefined') {
  ;(globalThis as { Buffer?: typeof Buffer }).Buffer = Buffer
}

export type BlogPost = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  content: string
}

const rawPostModules = import.meta.glob<string>('./*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const parsedPosts: BlogPost[] = Object.entries(rawPostModules)
  .map(([path, fileContents]) => {
    const { data, content } = matter(fileContents)
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path
    const title = typeof data.title === 'string' ? data.title : slug
    const date = typeof data.date === 'string' ? data.date : ''
    const summary = typeof data.summary === 'string' ? data.summary : ''
    const tags = Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === 'string') : []

    return {
      slug,
      title,
      date,
      summary,
      tags,
      content,
    }
  })
  .sort((a, b) => {
    const left = new Date(a.date).getTime()
    const right = new Date(b.date).getTime()
    return Number.isNaN(right) || Number.isNaN(left) ? 0 : right - left
  })

export const getPosts = (): BlogPost[] => parsedPosts

export const getPostBySlug = (slug: string): BlogPost | undefined => parsedPosts.find((post) => post.slug === slug)
