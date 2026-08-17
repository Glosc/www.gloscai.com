import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, breaks: false })

const legalDocs = import.meta.glob('/src/content/legal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function getDoc(slug: 'privacy' | 'terms', lang: 'zh' | 'en'): string {
  const path = `/src/content/legal/${slug}.${lang}.md`
  const raw = legalDocs[path]
  if (!raw) {
    throw new Error(`Missing legal document: ${path}`)
  }
  return raw
}

export function renderLegalDoc(slug: 'privacy' | 'terms', locale: string) {
  const lang = locale === 'zh' ? 'zh' : 'en'
  const raw = getDoc(slug, lang)
  return { html: md.render(raw), lang }
}
