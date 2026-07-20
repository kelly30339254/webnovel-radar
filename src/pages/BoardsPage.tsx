import { useEffect, useState } from 'react'
import FanqieBoards from '@/sections/FanqieBoards'
import type { WindData } from '@/types/wind'
import { usePageMeta } from '@/hooks/usePageMeta'
import PageHeader from '@/components/PageHeader'

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
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="番茄新书榜" hint="每日新书样本，只看新书，不看总榜" />
      <main className="mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-8">
        {data ? (
          <FanqieBoards boards={data.boards} />
        ) : (
          <p className="text-center text-sm text-theme-700">榜单加载中…</p>
        )}
      </main>
    </div>
  )
}
