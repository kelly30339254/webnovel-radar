import type { Board } from '@/types/wind'
import SourceLink from '@/sections/SourceLink'
import SectionTitle from '@/sections/SectionTitle'

const CHANNEL_STYLE: Record<string, { chip: string; bar: string }> = {
  男频: { chip: 'bg-rose-900 text-rose-50', bar: 'bg-rose-800' },
  女频: { chip: 'bg-pink-500 text-white', bar: 'bg-pink-400' },
}

function freshness(dataDate?: string): { text: string; stale: boolean } | null {
  if (!dataDate) return null
  const t = Date.parse(dataDate)
  if (Number.isNaN(t)) return { text: `截止 ${dataDate}`, stale: false }
  const days = Math.floor((Date.now() - t) / 86400000)
  return { text: `数据截止 ${dataDate}`, stale: days > 3 }
}

export default function FanqieBoards({ boards }: { boards: Board[] }) {
  return (
    <section id="boards" aria-labelledby="boards-heading" className="rise-in mt-14 scroll-mt-24" style={{ animationDelay: '0.24s' }}>
      <SectionTitle id="boards-heading" title="番茄新书榜" hint="男频 / 女频分频 · 只取新书榜，不含总榜" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {boards.map((b) => {
          const style = CHANNEL_STYLE[b.channel] ?? { chip: 'bg-rose-800 text-white', bar: 'bg-rose-500' }
          const fresh = freshness(b.dataDate)
          return (
            <article
              key={`${b.platform}-${b.channel}`}
              className="card-pink overflow-hidden rounded-2xl border border-rose-200/70 bg-white/90 shadow-sm shadow-rose-100/60"
            >
              <header className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-b border-rose-100 px-5 py-4">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${style.chip}`}>{b.channel}</span>
                <span className="text-sm font-medium text-rose-950">{b.chartName}</span>
                <span className="ml-auto flex items-center gap-2">
                  {fresh && (
                    <span className={`text-xs ${fresh.stale ? 'font-medium text-amber-500' : 'text-rose-300'}`}>
                      {fresh.text}
                      {fresh.stale ? ' · 偏旧' : ''}
                    </span>
                  )}
                  <SourceLink url={b.sourceUrl} />
                </span>
              </header>
              <ol className="divide-y divide-rose-50 px-5">
                {b.books.map((book) => (
                  <li key={`${b.channel}-${book.rank}-${book.title}`} className="flex items-start gap-3 py-3">
                    <span className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg font-mono text-xs font-bold text-white shadow-sm ${style.bar}`}>
                      {book.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug text-rose-950">{book.title}</p>
                      <p className="mt-0.5 text-xs text-rose-400">
                        {book.author}
                        {book.heat ? ` · ${book.heat}` : ''}
                      </p>
                    </div>
                    <span className="mt-0.5 flex-none rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-500">
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
