import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import IpHot from '@/sections/IpHot'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function IpPage() {
  usePageMeta({ title: 'IP 改编热点', description: '红果短剧、漫剧与 AI 剧热播信号，以及网文改编方向。', path: '/ip' })
  return (
    <div className="min-h-screen bg-[#fff5f7] px-5 pb-12 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/70 px-3 py-1.5 text-xs text-rose-500 transition-colors hover:bg-white hover:text-rose-600"
          >
            <ArrowLeft size={12} />
            返回首页
          </Link>
          <h1 className="font-serif text-xl font-bold text-rose-950">IP 改编热点</h1>
        </div>
        <IpHot />
      </div>
    </div>
  )
}
