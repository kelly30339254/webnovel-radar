import type { Board, GenreHeat, HistoryData } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'
import { buildGenreSignals, formatDelta, signalTone } from '@/lib/genreSignals'

export default function GenreBoard({ genres, history, boards, updatedAt }: { genres: GenreHeat[]; history: HistoryData | null; boards: Board[]; updatedAt?: string }) {
  const signals = buildGenreSignals(genres, history, boards)

  return (
    <section id="genres" aria-labelledby="genre-heading" className="rise-in mt-12 scroll-mt-24" style={{ animationDelay: '0.1s' }}>
      <SectionTitle
        id="genre-heading"
        title="题材现在怎么样"
        hint="现在有多火 · 最近涨跌 · 同类书多不多"
        footer={
          <>
            {updatedAt && <span>更新于 {updatedAt}</span>}
            <span>近 7 日历史归档</span>
            <span>来源：过去几天的记录和新书榜</span>
          </>
        }
      />
      <ol className="mt-4 divide-y divide-theme-100 border-y border-theme-100 bg-white/60">
        {signals.map((signal, index) => (
          <li key={signal.name} className="px-2 py-4 sm:px-3">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_3.2rem] items-start gap-2 sm:grid-cols-[2rem_minmax(10rem,1.2fr)_minmax(8rem,1fr)_4rem_4.5rem_4rem] sm:items-center sm:gap-3">
              <span className="pt-0.5 font-mono text-sm text-theme-600">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-theme-950">{signal.name}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${signalTone(signal.stage)}`}>{signal.stageLabel}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-theme-500">{signal.advice}</p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-theme-100" role="img" aria-label={`热度 ${signal.heat}`}>
                  <span className="block h-full rounded-full bg-theme-500" style={{ width: `${signal.heat}%` }} />
                </span>
              </div>
              <div className="hidden text-center sm:block"><p className="font-mono text-sm font-semibold text-theme-900">{formatDelta(signal.delta7)}</p><p className="text-[10px] text-theme-700">7 日</p></div>
              <div className="hidden text-center sm:block"><p className="font-mono text-sm font-semibold text-amber-700">{signal.crowding}</p><p className="text-[10px] text-theme-700">同类书</p></div>
              <div className="text-right"><p className="font-mono text-base font-bold text-theme-700">{signal.heat}</p><p className="text-[10px] text-theme-700">有多火</p></div>
              <div className="col-start-2 col-end-[-1] mt-2 grid grid-cols-3 gap-px bg-theme-100 sm:hidden">
                <div className="bg-white py-2"><p className="font-mono text-sm font-semibold text-emerald-700">{formatDelta(signal.delta7)}</p><p className="text-[10px] text-theme-700">7 日变化</p></div>
                <div className="bg-white py-2 text-center"><p className="font-mono text-sm font-semibold text-blue-700">{formatDelta(signal.acceleration)}</p><p className="text-[10px] text-theme-700">最近还在涨吗</p></div>
                <div className="bg-white py-2 text-right"><p className="font-mono text-sm font-semibold text-amber-700">{signal.crowding}</p><p className="text-[10px] text-theme-700">同类书</p></div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <details className="mt-3 text-xs text-theme-500">
        <summary className="cursor-pointer font-medium text-theme-600">这些数字怎么看</summary>
        <p className="mt-2 max-w-3xl leading-relaxed">“最近还在涨吗”会比较最近几天和前几天；“同类书”会参考题材热度和新书榜里相似作品的数量。这些数字只帮助你比较题材，不是平台的官方预测。</p>
      </details>
    </section>
  )
}
