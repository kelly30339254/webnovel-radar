import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import FanqieBoards from '@/sections/FanqieBoards'
import type { WindData } from '@/types/wind'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function BoardsPage() {
  const [data, setData] = useState<WindData | null>(null)
  usePageMeta({ title: '番茄新书榜', description: '番茄小说男频与女频新书榜，每日更新，只看新书，不看总榜。', path: '/boards' })

  useEffect(() => {
    fetch('/data/wind.json')
      .then((r) => r.json())
      .then((d) => setData(d as WindData))
      .catch(() => setData(null))
  }, [])

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
          <h1 className="font-serif text-xl font-bold text-rose-950">番茄新书榜</h1>
        </div>
        {data ? (
          <FanqieBoards boards={data.boards} />
        ) : (
          <p className="text-center text-sm text-rose-400">榜单加载中…</p>
        )}
      </div>
    </div>
  )
}
