import { useEffect } from 'react'

const DEFAULT_ORIGIN = 'https://nailong-d4g922z6h6d9ff59e-1455870789.tcloudbaseapp.com'
const DEFAULT_IMAGE = '/images/og-cover.png'

type PageMeta = {
  title: string
  description: string
  path: string
  image?: string
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function usePageMeta({ title, description, path, image = DEFAULT_IMAGE }: PageMeta) {
  useEffect(() => {
    const origin = import.meta.env.VITE_PUBLIC_ORIGIN || window.location.origin || DEFAULT_ORIGIN
    const canonicalUrl = `${origin}${path}`
    const imageUrl = image.startsWith('http') ? image : `${origin}${image}`
    document.title = `${title}｜网文风向`
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [description, image, path, title])
}

