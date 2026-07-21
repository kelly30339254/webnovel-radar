import PageHeader from '@/components/PageHeader'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useWindData } from '@/hooks/useWindData'
import GenreBoard from '@/sections/GenreBoard'
import KeywordClouds from '@/sections/KeywordClouds'
import TrendChart from '@/sections/TrendChart'

export default function TrendsPage() {
  const { data, history, error } = useWindData()
  const historyUpdatedAt = history?.days.at(-1)?.date

  usePageMeta({
    title: '网文风向数据',
    description: '题材热度、生命周期、近 7 日趋势、竞争拥挤度与男频女频内容关键词。',
    path: '/trends',
  })

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="风向数据" hint="先比较题材生命周期和拥挤度，再查看趋势与内容关键词。" />
      <main className="mx-auto max-w-6xl px-5 pb-14 md:px-8">
        {error && <p className="mt-10 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">数据加载失败：{error}</p>}
        {data ? (
          <>
            <GenreBoard genres={data.genres} history={history} boards={data.boards} updatedAt={historyUpdatedAt ?? data.updatedAt} />
            <TrendChart history={history} updatedAt={historyUpdatedAt ?? data.updatedAt} />
            <KeywordClouds keywords={data.keywords} updatedAt={data.updatedAt} />
          </>
        ) : !error ? (
          <p className="py-20 text-center text-sm text-theme-600">风向数据加载中…</p>
        ) : null}
      </main>
    </div>
  )
}
