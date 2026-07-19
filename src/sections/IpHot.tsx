import type { IpHotItem } from '@/types/wind'
import SourceLink from '@/sections/SourceLink'
import SectionTitle from '@/sections/SectionTitle'

const FORM_STYLE: Record<string, string> = {
  短剧: 'bg-rose-100 text-rose-700',
  漫剧: 'bg-pink-100 text-pink-700',
  动漫: 'bg-fuchsia-100 text-fuchsia-700',
  影视: 'bg-amber-100 text-amber-700',
  游戏: 'bg-emerald-100 text-emerald-700',
}

export default function IpHot({ items }: { items: IpHotItem[] }) {
  return (
    <section id="ip" aria-labelledby="ip-heading" className="rise-in scroll-mt-24" style={{ animationDelay: '0.3s' }}>
      <SectionTitle id="ip-heading" title="IP 改编热点" hint="红果短剧官方排行榜 · 番茄/红果官方公告" />
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li
            key={it.title}
            className="card-pink rounded-2xl border border-rose-200/70 bg-white/90 p-4 shadow-sm shadow-rose-100/60"
          >
            <div className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex-none rounded-full px-2 py-0.5 text-xs font-semibold ${FORM_STYLE[it.form] ?? 'bg-rose-50 text-rose-600'}`}>
                {it.form}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug text-rose-950">{it.title}</p>
                {it.genre && <p className="mt-0.5 text-xs text-rose-300">{it.genre}</p>}
                {it.note && <p className="mt-1.5 text-sm leading-relaxed text-rose-900/60">{it.note}</p>}
              </div>
              <SourceLink url={it.sourceUrl} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
