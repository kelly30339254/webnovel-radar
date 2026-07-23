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
  真人剧: 'border-theme-600 text-theme-700',
  漫剧: 'border-[#174c43] text-[#174c43]',
  AI剧: 'border-stone-500 text-stone-700',
}

export default function IpHot({ showViewMore = true }: { showViewMore?: boolean }) {
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
        hint="红果官网首页最新推荐"
        right={showViewMore ? <ViewMoreLink to="/ip" /> : undefined}
        footer={
          <>
            <span>数据截止 {data.updatedAt}</span>
            <span>每日 07:23 自动更新</span>
            <span>来源：红果短剧官网公开推荐</span>
          </>
        }
      />
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {data.categories.map((cat) => {
          return (
          <div
            key={cat.name}
            className="border border-stone-300 bg-white/65 p-5"
          >
            <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-theme-950">
                <span className={`border px-2.5 py-1 text-xs ${FORM_STYLE[cat.name] ?? 'border-theme-600 text-theme-700'}`}>
                  {cat.name}
                </span>
              </h3>
              <span className="text-xs text-stone-400">官网推荐顺序</span>
            </div>
            <ol className="space-y-3">
              {cat.items.map((it, index) => (
                <li key={`${cat.name}-${it.title}`} className="group flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center bg-theme-800 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={it.playUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block truncate font-serif text-base font-bold text-theme-950 transition-colors group-hover:text-theme-700"
                      title={it.title}
                    >
                      {it.title}
                    </a>
                    <p className="mt-1 text-xs text-stone-500">
                      <span className="font-medium text-theme-700">{it.heat}</span>
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
