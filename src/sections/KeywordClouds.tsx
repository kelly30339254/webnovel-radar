import type { KeywordChannel, Keywords } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'

function ChannelPanel({
  title,
  channel,
  palette,
}: {
  title: string
  channel: KeywordChannel
  palette: { bg: string; border: string; hot: string; warm: string; chip: string }
}) {
  const tags = [...channel.tags].sort((a, b) => b.weight - a.weight)
  return (
    <article className={`card-pink rounded-2xl border p-5 shadow-sm shadow-rose-100/60 ${palette.bg} ${palette.border}`}>
      <header className="flex flex-wrap items-baseline gap-x-3">
        <h3 className="font-serif text-lg font-bold text-rose-950">{title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[11px] ${palette.chip}`}>字号 = 相对热度</span>
      </header>
      <p className="mt-2 font-serif text-base font-semibold text-rose-900/90 md:text-lg">
        {channel.summary}
      </p>
      <div className="mt-3 flex flex-wrap items-baseline justify-start gap-x-3 gap-y-1.5">
        {tags.map((t) => {
          const w = Math.max(0, Math.min(100, t.weight))
          const size = 12 + (w / 100) * 20
          const cls = w >= 80 ? palette.hot : w >= 55 ? palette.warm : 'text-rose-900/50'
          return (
            <span
              key={t.word}
              className={`leading-none transition-transform hover:scale-110 ${cls}`}
              style={{ fontSize: `${size.toFixed(1)}px`, fontWeight: w >= 55 ? 700 : 500 }}
              title={`${t.word} · 热度 ${Math.round(w)}`}
            >
              {t.word}
            </span>
          )
        })}
      </div>
    </article>
  )
}

export default function KeywordClouds({ keywords, updatedAt }: { keywords: Keywords; updatedAt?: string }) {
  return (
    <section id="keywords" aria-labelledby="kw-heading" className="rise-in mt-14 scroll-mt-24" style={{ animationDelay: '0.18s' }}>
      <SectionTitle
        id="kw-heading"
        title="内容关键词"
        hint="从新书榜作品标签、分类与书名高频词归纳"
        footer={
          <>
            {updatedAt && <span>更新于 {updatedAt}</span>}
            <span>来源：番茄小说新书榜标题与标签</span>
          </>
        }
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChannelPanel
          title="番茄男频"
          channel={keywords.male}
          palette={{
            bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
            border: 'border-rose-200/70',
            hot: 'text-rose-800',
            warm: 'text-rose-600/85',
            chip: 'bg-rose-100 text-rose-500',
          }}
        />
        <ChannelPanel
          title="番茄女频"
          channel={keywords.female}
          palette={{
            bg: 'bg-gradient-to-br from-rose-100/70 to-pink-100/60',
            border: 'border-rose-300/50',
            hot: 'text-pink-800',
            warm: 'text-pink-600/85',
            chip: 'bg-pink-100 text-pink-500',
          }}
        />
      </div>
    </section>
  )
}
