import { useEffect, useState } from 'react'
import SectionTitle from '@/sections/SectionTitle'
import ViewMoreLink from '@/components/ViewMoreLink'

type ShortDrama = {
  rank: number
  title: string
  heat: string
  note?: string
  playUrl: string
}

type Category = {
  name: string
  items: ShortDrama[]
}

type HongguoData = {
  updatedAt: string
  categories: Category[]
}

const FORM_STYLE: Record<string, string> = {
  真人剧: 'bg-theme-100 text-theme-700',
  漫剧: 'bg-pink-100 text-pink-700',
  AI剧: 'bg-fuchsia-100 text-fuchsia-700',
}

function heatValue(text: string): number {
  const value = Number.parseFloat(text.replace(/[^\d.]/g, ''))
  if (Number.isNaN(value)) return 0
  return text.includes('亿') ? value * 10000 : value
}

export default function IpHot() {
  const [data, setData] = useState<HongguoData | null>(null)

  useEffect(() => {
    fetch('/data/hongguo-hot.json')
      .then((r) => r.json())
      .then((d: HongguoData) => setData(d))
      .catch(() => setData(null))
  }, [])

  if (!data) return null

  return (
    <section id="ip" aria-labelledby="ip-heading" className="rise-in mt-20 scroll-mt-24" style={{ animationDelay: '0.3s' }}>
      <SectionTitle
        id="ip-heading"
        title="IP 改编热点"
        hint="红果短剧热播榜"
        right={<ViewMoreLink to="/ip" />}
        footer={
          <>
            <span>数据截止 {data.updatedAt}</span>
            <span>每日 07:23 校验来源</span>
            <span>来源：红果短剧官方排行榜</span>
          </>
        }
      />
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {data.categories.map((cat) => {
          const sortedItems = [...cat.items].sort((a, b) => heatValue(b.heat) - heatValue(a.heat))
          return (
          <div
            key={cat.name}
            className="card-pink rounded-2xl border border-theme-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-between border-b border-theme-50 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-theme-950">
                <span className={`rounded-full px-2.5 py-1 text-xs ${FORM_STYLE[cat.name] ?? 'bg-theme-50 text-theme-600'}`}>
                  {cat.name}
                </span>
              </h3>
              <span className="text-xs text-theme-600">按热度降序</span>
            </div>
            <ol className="space-y-3">
              {sortedItems.map((it, index) => (
                <li key={`${cat.name}-${it.title}`} className="group flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-theme-100 to-pink-100 text-xs font-bold text-theme-600 shadow-sm">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={it.playUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block truncate text-base font-medium text-theme-950 transition-colors group-hover:text-theme-600"
                      title={it.title}
                    >
                      {it.title}
                    </a>
                    <p className="mt-1 text-xs text-theme-700">
                      <span className="font-medium text-theme-500">热度 {it.heat}</span>
                      {it.note ? ` · ${it.note}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          )
        })}
      </div>
    </section>
  )
}
