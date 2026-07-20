import { AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { buildGenreSignals, formatDelta, signalTone } from '@/lib/genreSignals'
import type { Board, GenreHeat, HistoryData } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'

export default function TodayDecisions({ genres, history, boards }: { genres: GenreHeat[]; history: HistoryData | null; boards: Board[] }) {
  const signals = buildGenreSignals(genres, history, boards)
  const opportunity = [...signals].sort((a, b) => (b.delta7 + b.acceleration) - (a.delta7 + a.acceleration))[0]
  const crowded = [...signals].filter((signal) => signal.name !== opportunity?.name).sort((a, b) => b.crowding - a.crowding)[0]
  const cooling = [...signals].filter((signal) => signal.name !== opportunity?.name && signal.name !== crowded?.name).sort((a, b) => a.delta7 - b.delta7)[0]
  if (!opportunity || !crowded || !cooling) return null

  const items = [
    { label: '值得跟进', signal: opportunity, icon: ArrowUpRight, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200', detail: `7 日 ${formatDelta(opportunity.delta7)} · 加速度 ${formatDelta(opportunity.acceleration)}` },
    { label: '需要差异化', signal: crowded, icon: AlertTriangle, tone: 'text-amber-800 bg-amber-50 border-amber-200', detail: `拥挤度 ${crowded.crowding} · 热度 ${crowded.heat}` },
    { label: cooling.delta7 < 0 ? '谨慎追高' : '保持观察', signal: cooling, icon: ArrowDownRight, tone: 'text-blue-700 bg-blue-50 border-blue-200', detail: `7 日 ${formatDelta(cooling.delta7)} · 置信度 ${cooling.confidence}` },
  ]

  return (
    <section className="mt-10" aria-labelledby="today-decisions-title">
      <SectionTitle id="today-decisions-title" title="今日三件事" hint="先看行动信号，再看完整榜单" />
      <div className="mt-4 grid gap-px overflow-hidden border border-theme-100 bg-theme-100 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.tone}`}><Icon size={14} /> {item.label}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${signalTone(item.signal.stage)}`}>{item.signal.stageLabel}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-theme-950">{item.signal.name}</h3>
              <p className="mt-2 font-mono text-xs text-theme-500">{item.detail}</p>
              <p className="mt-3 text-xs leading-relaxed text-theme-600">{item.signal.advice}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
