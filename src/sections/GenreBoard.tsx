import type { Board, GenreHeat, HistoryData } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'
import { buildGenreSignals, formatDelta, signalTone } from '@/lib/genreSignals'

export default function GenreBoard({ genres, history, boards, updatedAt }: { genres: GenreHeat[]; history: HistoryData | null; boards: Board[]; updatedAt?: string }) {
  const signals = buildGenreSignals(genres, history, boards)

  return (
    <section id="genres" aria-labelledby="genre-heading" className="rise-in mt-12 scroll-mt-24" style={{ animationDelay: '0.1s' }}>
      <SectionTitle
        id="genre-heading"
        title="题材决策信号"
        hint="热度 · 生命周期 · 7 日变化 · 竞争拥挤度"
        footer={
          <>
            {updatedAt && <span>更新于 {updatedAt}</span>}
            <span>近 7 日历史归档</span>
            <span>来源：番茄小说新书榜</span>
          </>
        }
      />
      <ol className="mt-4 divide-y divide-rose-100 border-y border-rose-100 bg-white/60">
        {signals.map((signal, index) => (
          <li key={signal.name} className="px-2 py-4 sm:px-3">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_3.2rem] items-start gap-2 sm:grid-cols-[2rem_minmax(10rem,1.2fr)_minmax(8rem,1fr)_4rem_4.5rem_4rem] sm:items-center sm:gap-3">
              <span className="pt-0.5 font-mono text-sm text-rose-300">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-rose-950">{signal.name}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${signalTone(signal.stage)}`}>{signal.stageLabel}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-rose-500">{signal.advice}</p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-rose-100" role="img" aria-label={`热度 ${signal.heat}`}>
                  <span className="block h-full rounded-full bg-rose-500" style={{ width: `${signal.heat}%` }} />
                </span>
              </div>
              <div className="hidden text-center sm:block"><p className="font-mono text-sm font-semibold text-rose-900">{formatDelta(signal.delta7)}</p><p className="text-[10px] text-rose-400">7 日</p></div>
              <div className="hidden text-center sm:block"><p className="font-mono text-sm font-semibold text-amber-700">{signal.crowding}</p><p className="text-[10px] text-rose-400">拥挤度</p></div>
              <div className="text-right"><p className="font-mono text-base font-bold text-rose-700">{signal.heat}</p><p className="text-[10px] text-rose-400">热度</p></div>
              <div className="col-start-2 col-end-[-1] mt-2 grid grid-cols-3 gap-px bg-rose-100 sm:hidden">
                <div className="bg-white py-2"><p className="font-mono text-sm font-semibold text-emerald-700">{formatDelta(signal.delta7)}</p><p className="text-[10px] text-rose-400">7 日变化</p></div>
                <div className="bg-white py-2 text-center"><p className="font-mono text-sm font-semibold text-blue-700">{formatDelta(signal.acceleration)}</p><p className="text-[10px] text-rose-400">加速度</p></div>
                <div className="bg-white py-2 text-right"><p className="font-mono text-sm font-semibold text-amber-700">{signal.crowding}</p><p className="text-[10px] text-rose-400">拥挤度</p></div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <details className="mt-3 text-xs text-rose-500">
        <summary className="cursor-pointer font-medium text-rose-600">查看指标口径</summary>
        <p className="mt-2 max-w-3xl leading-relaxed">生命周期结合当前热度、7 日变化和最近 3 日加速度判断；拥挤度结合题材热度与当前新书榜同类作品数量估算。所有指标用于选题比较，不代表平台官方预测。</p>
      </details>
    </section>
  )
}
