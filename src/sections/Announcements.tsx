import type { Announcement } from '@/types/wind'
import SourceLink from '@/sections/SourceLink'
import SectionTitle from '@/sections/SectionTitle'

export default function Announcements({ items }: { items: Announcement[] }) {
  return (
    <section id="ann" aria-labelledby="ann-heading" className="rise-in mt-10 scroll-mt-24" style={{ animationDelay: '0.38s' }}>
      <SectionTitle
        id="ann-heading"
        title="官方公告 · 征文"
        hint="官方征文与扶持计划释放的题材信号"
        footer={<span>来源：番茄小说 / 红果短剧官方公告</span>}
      />
      <ol className="mt-4 space-y-0 border-l border-theme-500 pl-5">
        {items.map((a) => (
          <li key={`${a.platform}-${a.title}`} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[1.56rem] top-1.5 h-2.5 w-2.5 rotate-45 border border-theme-700 bg-theme-bg" />
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="font-mono text-xs text-theme-600">{a.date ?? ''}</span>
              <span className="border border-theme-400 px-2 py-0.5 text-xs text-theme-700">{a.platform}</span>
              <SourceLink url={a.sourceUrl} />
            </div>
            <p className="mt-2 font-serif font-bold text-theme-950">{a.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{a.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
