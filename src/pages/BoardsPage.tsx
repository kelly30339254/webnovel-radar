import PageHeader from '@/components/PageHeader'
import FanqieBoards from '@/sections/FanqieBoards'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useWindData } from '@/hooks/useWindData'

export default function BoardsPage() {
  const { data, error } = useWindData()
  usePageMeta({ title: '番茄新书榜', description: '番茄小说男频与女频新书榜，每日更新，只看新书，不看总榜。', path: '/boards' })

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="新书榜" hint="男频、女频分开看，只看近期新书，不用总榜旧书干扰判断。" />
      <main className="mx-auto max-w-6xl px-5 pb-14 md:px-8">
        {error && <p className="mt-10 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">榜单加载失败：{error}</p>}
        {data ? <FanqieBoards boards={data.boards} showViewMore={false} /> : !error ? <p className="py-20 text-center text-sm text-theme-600">榜单加载中…</p> : null}
      </main>
    </div>
  )
}
