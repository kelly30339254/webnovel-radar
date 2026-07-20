import { useEffect, useState } from 'react'
import SourceLink from '@/sections/SourceLink'
import SectionTitle from '@/sections/SectionTitle'

type ShortDrama = {
  rank: number
  title: string
  heat: string
  note?: string
}

type Category = {
  name: string
  items: ShortDrama[]
}

type HongguoData = {
  updatedAt: string
  sourceUrl: string
  categories: Category[]
}

const FORM_STYLE: Record<string, string> = {
  真人剧: 'bg-rose-100 text-rose-700',
  漫剧: 'bg-pink-100 text-pink-700',
  AI剧: 'bg-fuchsia-100 text-fuchsia-700',
  短剧: 'bg-rose-100 text-rose-700',
  动漫: 'bg-fuchsia-100 text-fuchsia-700',
  影视: 'bg-amber-100 text-amber-700',
  游戏: 'bg-emerald-100 text-emerald-700',
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
    <section id="ip" aria-labelledby="ip-heading" className="rise-in scroll-mt-24" style={{ animationDelay: '0.3s' }}>
      <SectionTitle
        id="ip-heading"
        title="IP 改编热点"
        hint={`红果短剧热播榜 · ${data.updatedAt}`}
        right={<SourceLink url={data.sourceUrl} label="网文大数据" />}
      />
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {data.categories.map((cat) => (
          <div key={cat.name} className="rounded-2xl border border-rose-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-950">
              <span className={`rounded-full px-2 py-0.5 text-xs ${FORM_STYLE[cat.name] ?? 'bg-rose-50 text-rose-600'}`}>{cat.name}</span>
              <span className="text-xs font-normal text-rose-300">热播榜 TOP10</span>
            </h3>
            <ol className="space-y-2">
              {cat.items.map((it) => (
                <li key={`${cat.name}-${it.rank}`} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md bg-rose-50 text-[10px] font-bold text-rose-500">
                    {it.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-rose-950" title={it.title}>
                      {it.title}
                    </p>
                    <p className="text-xs text-rose-400">
                      热度 {it.heat}
                      {it.note ? ` · ${it.note}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
