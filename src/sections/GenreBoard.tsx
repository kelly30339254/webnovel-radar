import type { GenreHeat, Trend } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'

const TREND_META: Record<Trend, { mark: string; className: string; label: string }> = {
  up: { mark: '▲', className: 'text-emerald-500', label: '上升' },
  down: { mark: '▼', className: 'text-rose-500', label: '下降' },
  flat: { mark: '—', className: 'text-neutral-400', label: '持平' },
  new: { mark: 'NEW', className: 'text-pink-500 font-semibold', label: '新上榜' },
}

export default function GenreBoard({ genres, updatedAt }: { genres: GenreHeat[]; updatedAt?: string }) {
  return (
    <section id="genres" aria-labelledby="genre-heading" className="rise-in mt-12 scroll-mt-24" style={{ animationDelay: '0.1s' }}>
      <SectionTitle
        id="genre-heading"
        title="题材热度"
        hint="最热 = 100 · 相对热度 · 趋势对比上一周期"
        footer={
          <>
            {updatedAt && <span>更新于 {updatedAt}</span>}
            <span>每日 07:23 自动更新</span>
            <span>来源：番茄小说新书榜</span>
          </>
        }
      />
      <ol className="mt-4 divide-y divide-rose-100/80">
        {genres.map((g, i) => {
          const heat = Math.max(0, Math.min(100, g.heat))
          const trend = TREND_META[g.trend] ?? TREND_META.flat
          return (
            <li
              key={g.name}
              className="grid grid-cols-[2rem_1fr_2.6rem_2.4rem] items-center gap-x-2 rounded-lg px-2 py-3 transition-colors hover:bg-rose-50 sm:grid-cols-[2rem_minmax(6rem,11rem)_1fr_2.6rem_2.4rem] sm:gap-x-3 md:gap-x-4"
            >
              <span className="font-mono text-sm text-rose-300">{String(i + 1).padStart(2, '0')}</span>
              <span className="truncate font-medium text-rose-950" title={g.name}>{g.name}</span>
              <span className="hidden sm:flex sm:items-center sm:gap-3">
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-rose-100" role="img" aria-label={`热度 ${heat}`}>
                  <span
                    className={`block h-full rounded-full ${
                      i === 0
                        ? 'bg-gradient-to-r from-rose-500 to-pink-400'
                        : 'bg-rose-400/70'
                    }`}
                    style={{ width: `${heat}%` }}
                  />
                </span>
              </span>
              <span className={`text-center text-xs ${trend.className}`} aria-label={trend.label} title={trend.label}>
                {trend.mark}
              </span>
              <span className="text-right font-mono text-sm tabular-nums text-rose-900/70">{heat}</span>
              {g.note && (
                <span className="col-start-2 col-end-[-1] -mt-1 text-xs text-rose-400/90 sm:col-start-2 sm:col-end-[-1]">{g.note}</span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
