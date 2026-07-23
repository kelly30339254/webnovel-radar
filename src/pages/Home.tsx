import { useState } from 'react'
import { useWindData } from '@/hooks/useWindData'
import Hero from '@/sections/Hero'
import Footer from '@/sections/Footer'
import EasterEgg from '@/sections/EasterEgg'
import TodayDecisions from '@/sections/TodayDecisions'
import GrowthTools from '@/sections/GrowthTools'
import WritingPartners from '@/sections/WritingPartners'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function Home() {
  const { data, history, updateStatus, error } = useWindData()
  const [easterEgg, setEasterEgg] = useState(false)
  usePageMeta({
    title: '今日网文风向｜作者决策简报',
    description: '把每日题材热度、新书榜样本与趋势数据，翻译成适配判断、突围样本和 7 天写作行动。',
    path: '/',
  })

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg px-6">
        <div className="max-w-md text-center">
          <p className="font-serif text-2xl font-bold text-theme-950">数据加载失败</p>
          <p className="mt-2 text-sm text-theme-700">{error}</p>
          <p className="mt-4 text-xs text-theme-600">
            请确认 public/data/wind.json 存在；每日任务运行后会自动刷新该文件
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg">
        <p className="animate-pulse text-sm tracking-widest text-theme-700">风向数据加载中…</p>
      </div>
    )
  }

  const historyUpdatedAt = history?.days.at(-1)?.date

  return (
    <div className="relative min-h-screen bg-theme-bg text-theme-950 antialiased">
      <div className={`relative z-10 ${easterEgg ? 'hidden' : ''}`}>
        <Hero data={data} historyDays={history?.days.length ?? 0} updateStatus={updateStatus} />
        <main className="mx-auto max-w-[1440px] px-5 pb-4 md:px-8">
          <TodayDecisions
            genres={data.genres}
            history={history}
            boards={data.boards}
            updatedAt={historyUpdatedAt ?? data.updatedAt}
            sourceDate={updateStatus?.sourceDate}
          />
          <GrowthTools />
          <WritingPartners />
        </main>
        <Footer updatedAt={data.updatedAt} updateStatus={updateStatus} onEasterEgg={() => setEasterEgg(true)} />
      </div>
      <EasterEgg active={easterEgg} date={updateStatus?.checkedAt ?? data.updatedAt} onClose={() => setEasterEgg(false)} />
    </div>
  )
}
