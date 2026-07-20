import type { AdaptWatchItem } from '@/types/wind'
import SourceLink from '@/sections/SourceLink'
import SectionTitle from '@/sections/SectionTitle'

export default function AdaptWatch({ items }: { items: AdaptWatchItem[] }) {
  return (
    <section id="adapt" aria-labelledby="adapt-heading" className="rise-in scroll-mt-24" style={{ animationDelay: '0.34s' }}>
      <SectionTitle
        id="adapt-heading"
        title="改编风向标"
        hint="番茄作家专区官方栏目 · 红果官方公告"
        footer={<span>来源：番茄作家专区 / 红果短剧官方公告</span>}
      />
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li
            key={it.title}
            className="card-pink rounded-2xl border border-theme-200/70 bg-white/90 p-4 shadow-sm shadow-theme-100/60"
          >
            <div className="flex items-start gap-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  {it.date && <span className="font-mono text-xs text-theme-500">{it.date}</span>}
                  <p className="font-medium leading-snug text-theme-950">{it.title}</p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-theme-900/60">{it.summary}</p>
              </div>
              <SourceLink url={it.sourceUrl} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
