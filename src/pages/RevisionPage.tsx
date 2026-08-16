import { useEffect, useRef } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function RevisionPage() {
  usePageMeta({
    title: '奶龙修稿器',
    description: '在线修稿工具：错别字检查、语句润色与排版校对。',
    path: '/revision',
  })

  const frameRef = useRef<HTMLIFrameElement>(null)

  // iframe 高度 = 视口高 - 导航实际高，避免双滚动条（移动端快捷导航行高不同也兼容）
  useEffect(() => {
    const nav = document.querySelector('nav')
    const apply = () => {
      if (frameRef.current && nav) {
        frameRef.current.style.height = `${window.innerHeight - nav.getBoundingClientRect().height}px`
      }
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  return (
    <div className="bg-theme-bg">
      <iframe
        ref={frameRef}
        src="/revision-app/index.html"
        title="奶龙修稿器"
        className="block w-full border-0"
      />
    </div>
  )
}
