import type { Board } from '@/types/wind'
import SourceLink from '@/sections/SourceLink'
import SectionTitle from '@/sections/SectionTitle'
import ViewMoreLink from '@/components/ViewMoreLink'
import { freshnessLabel } from '@/lib/freshness'

const CHANNEL_STYLE: Record<string, { chip: string; bar: string }> = {
  男频: { chip: 'border-theme-700 text-theme-800', bar: 'bg-theme-800' },
  女频: { chip: 'border-[#174c43] text-[#174c43]', bar: 'bg-[#174c43]' },
}

function boardFreshness(dataDate?: string): { text: string; stale: boolean } | null {
  if (!dataDate) return null
  const t = Date.parse(dataDate)
  if (Number.isNaN(t)) return { text: `截止 ${dataDate}`, stale: false }
  const days = Math.floor((Date.now() - t) / 86400000)
  return { text: `数据截止 ${dataDate}`, stale: days > 3 }
}

export default function FanqieBoards({ boards, showViewMore = true }: { boards: Board[]; showViewMore?: boolean }) {
  const latestDate = boards.map((b) => b.dataDate).filter(Boolean).sort().pop()
  const moduleFresh = freshnessLabel(latestDate)

  return (
    <section id="boards" aria-labelledby="boards-heading" className="rise-in mt-14 scroll-mt-24" style={{ animationDelay: '0.24s' }}>
      <SectionTitle
        id="boards-heading"
        title="番茄新书榜"
        hint="男频 / 女频分频 · 只取新书榜，不含总榜"
        right={showViewMore ? <ViewMoreLink to="/boards" /> : undefined}
        footer={
          <>
            {moduleFresh && (
              <span className={moduleFresh.stale ? 'font-medium text-amber-500' : ''}>
                {moduleFresh.text}
                {moduleFresh.stale ? ' · 数据偏旧' : ''}
              </span>
            )}
            <span>每日 07:23 自动更新</span>
            <span>来源：番茄小说官方榜单</span>
          </>
        }
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {boards.map((b) => {
          const style = CHANNEL_STYLE[b.channel] ?? { chip: 'border-theme-700 text-theme-800', bar: 'bg-theme-700' }
          const fresh = boardFreshness(b.dataDate)
          return (
            <article
              key={`${b.platform}-${b.channel}`}
              className="overflow-hidden border border-stone-300 bg-white/65"
            >
              <header className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-b border-stone-300 px-5 py-4">
                <span className={`border px-2 py-0.5 text-xs font-semibold ${style.chip}`}>{b.channel}</span>
                <span className="font-serif text-base font-bold text-theme-950">{b.chartName}</span>
                <span className="ml-auto flex items-center gap-2">
                  {fresh && (
                    <span className={`text-xs ${fresh.stale ? 'font-medium text-amber-600' : 'text-stone-400'}`}>
                      {fresh.text}
                      {fresh.stale ? ' · 偏旧' : ''}
                    </span>
                  )}
                  <SourceLink url={b.sourceUrl} />
                </span>
              </header>
              <ol className="divide-y divide-stone-200 px-5">
                {b.books.map((book) => (
                  <li key={`${b.channel}-${book.rank}-${book.title}`} className="flex items-start gap-3 py-3">
                    <span className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center font-mono text-xs font-bold text-white ${style.bar}`}>
                      {book.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <a
                        href={`https://fanqienovel.com/search/${encodeURIComponent(book.title)}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="block font-serif font-bold leading-snug text-theme-950 hover:text-theme-700"
                        title={book.title}
                      >
                        {book.title}
                      </a>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {book.author}
                        {book.heat ? ` · ${book.heat}` : ''}
                      </p>
                    </div>
                    <span className="mt-0.5 flex-none border-l border-theme-400 pl-2 text-xs text-theme-700">
                      {book.genre}
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          )
        })}
      </div>
    </section>
  )
}
