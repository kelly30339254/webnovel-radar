import { useEffect, useState } from 'react'
import SectionTitle from '@/sections/SectionTitle'
import SourceLink from '@/sections/SourceLink'

type Tip = {
  id: string
  title: string
  category: string
  summary: string
  usage: string
  sourceUrl: string
}

type TipsData = {
  updatedAt: string
  tips: Tip[]
}

const CATEGORY_STYLE: Record<string, string> = {
  节奏: 'bg-rose-100 text-rose-700',
  结构: 'bg-pink-100 text-pink-700',
  套路: 'bg-fuchsia-100 text-fuchsia-700',
  开头: 'bg-amber-100 text-amber-700',
  人物: 'bg-emerald-100 text-emerald-700',
  情绪: 'bg-cyan-100 text-cyan-700',
  悬念: 'bg-violet-100 text-violet-700',
  设定: 'bg-blue-100 text-blue-700',
  爽点: 'bg-orange-100 text-orange-700',
  描写: 'bg-teal-100 text-teal-700',
  创新: 'bg-indigo-100 text-indigo-700',
}

export default function WritingTips() {
  const [data, setData] = useState<TipsData | null>(null)

  useEffect(() => {
    fetch('/data/writing-tips.json')
      .then((r) => r.json())
      .then((d: TipsData) => setData(d))
      .catch(() => setData(null))
  }, [])

  if (!data) return null

  return (
    <section className="mt-16">
      <SectionTitle
        id="writing-tips"
        title="网文写作技巧"
        hint={`${data.tips.length} 条干货 · 点击来源查看原文`}
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.tips.map((tip, i) => (
          <div
            key={tip.id}
            className="card-pink flex flex-col rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  CATEGORY_STYLE[tip.category] ?? 'bg-rose-50 text-rose-600'
                }`}
              >
                {tip.category}
              </span>
              <h3 className="text-base font-bold text-rose-950">{tip.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-rose-700">{tip.summary}</p>
            <div className="mt-3 rounded-xl bg-rose-50/70 p-3">
              <p className="text-xs leading-relaxed text-rose-600">
                <span className="font-semibold text-rose-800">用法：</span>
                {tip.usage}
              </p>
            </div>
            <div className="mt-auto pt-4">
              <SourceLink url={tip.sourceUrl} label="查看来源" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
