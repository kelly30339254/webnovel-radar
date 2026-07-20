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
import WriterPersonality from '@/sections/WriterPersonality'
import { PetalRain } from '@/sections/Stickers'

export default function Home() {
  const { data, history, error } = useWindData()
  const [easterEgg, setEasterEgg] = useState(false)

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff5f7] px-6">
        <div className="max-w-md text-center">
          <p className="font-serif text-2xl font-bold text-rose-950">数据加载失败</p>
          <p className="mt-2 text-sm text-rose-400">{error}</p>
          <p className="mt-4 text-xs text-rose-300">
            请确认 public/data/wind.json 存在；每日任务运行后会自动刷新该文件
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff5f7]">
        <p className="animate-pulse text-sm tracking-widest text-rose-400">风向数据加载中…</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#fff5f7] text-rose-950 antialiased">
      <PetalRain />
      <div className={`relative z-10 ${easterEgg ? 'hidden' : ''}`}>
        <Nav updatedAt={data.updatedAt} />
        <Hero data={data} historyDays={history?.days.length ?? 0} />
        <main className="mx-auto max-w-6xl px-5 pb-4 md:px-8">
          <WriterPersonality />
          <GenreBoard genres={data.genres} />
          <TrendChart history={history} />
          <KeywordClouds keywords={data.keywords} />
          <FanqieBoards boards={data.boards} />
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <IpHot items={data.ipHot ?? []} />
            <div>
              <AdaptWatch items={data.adaptWatch ?? []} />
              <Announcements items={data.announcements ?? []} />
            </div>
          </div>
          <ZhiyuWriting />
        </main>
        <Footer updatedAt={data.updatedAt} onEasterEgg={() => setEasterEgg(true)} />
      </div>
      <EasterEgg active={easterEgg} onClose={() => setEasterEgg(false)} />
    </div>
  )
}
