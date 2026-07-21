import { useState } from 'react'
import { useWindData } from '@/hooks/useWindData'
import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import GenreBoard from '@/sections/GenreBoard'
import TrendChart from '@/sections/TrendChart'
import KeywordClouds from '@/sections/KeywordClouds'
import FanqieBoards from '@/sections/FanqieBoards'
import IpHot from '@/sections/IpHot'
import AdaptWatch from '@/sections/AdaptWatch'
import Announcements from '@/sections/Announcements'
import Footer from '@/sections/Footer'
import EasterEgg from '@/sections/EasterEgg'
import ZhiyuWriting from '@/sections/ZhiyuWriting'
import GrowthTools from '@/sections/GrowthTools'
import TodayDecisions from '@/sections/TodayDecisions'
import FanqieDebut from '@/sections/FanqieDebut'
import WritingTips from '@/sections/WritingTips'
import BookRecs from '@/sections/BookRecs'
import WritingPartners from '@/sections/WritingPartners'
import { PetalRain } from '@/sections/Stickers'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function Home() {
  const { data, history, updateStatus, error } = useWindData()
  const [easterEgg, setEasterEgg] = useState(false)
  usePageMeta({
    title: '网文作者每日选题雷达',
    description: '每日题材风向、番茄新书榜、IP 改编信号，以及可直接使用的开书雷达和创作人格测试。',
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
      <PetalRain />
      <div className={`relative z-10 ${easterEgg ? 'hidden' : ''}`}>
        <Nav updatedAt={data.updatedAt} />
        <Hero data={data} historyDays={history?.days.length ?? 0} updateStatus={updateStatus} />
        <main className="mx-auto max-w-6xl px-5 pb-4 md:px-8">
          <TodayDecisions
            genres={data.genres}
            history={history}
            boards={data.boards}
            updatedAt={historyUpdatedAt ?? data.updatedAt}
            sourceDate={updateStatus?.sourceDate}
          />
          <GrowthTools />
          <WritingPartners />
          <GenreBoard genres={data.genres} history={history} boards={data.boards} updatedAt={historyUpdatedAt ?? data.updatedAt} />
          <TrendChart history={history} updatedAt={historyUpdatedAt ?? data.updatedAt} />
          <KeywordClouds keywords={data.keywords} updatedAt={data.updatedAt} />
          <BookRecs />
          <FanqieBoards boards={data.boards} />
          <IpHot />
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <AdaptWatch items={data.adaptWatch ?? []} />
            <Announcements items={data.announcements ?? []} />
          </div>
          <FanqieDebut />
          <WritingTips />
          <ZhiyuWriting />
        </main>
        <Footer updatedAt={data.updatedAt} updateStatus={updateStatus} onEasterEgg={() => setEasterEgg(true)} />
      </div>
      <EasterEgg active={easterEgg} onClose={() => setEasterEgg(false)} />
    </div>
  )
}
