import { useState } from 'react'
import { Link } from 'react-router'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Gauge,
  Share2,
  Sparkles,
  Target,
} from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'
import { buildGenreSignals, formatDelta, signalTone } from '@/lib/genreSignals'
import type { GenreSignal } from '@/lib/genreSignals'
import type { Board, GenreHeat, HistoryData } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'

function radarPath(name: string): string {
  const channel = name.includes('女频') ? 'female' : 'male'
  return `/radar?channel=${channel}&genre=${encodeURIComponent(name)}`
}

function actionFor(signal: GenreSignal): string {
  if (signal.crowding >= 75) return '借题材热度，但至少替换主角职业、核心机制或关系矛盾中的两项。'
  if (signal.delta7 >= 4) return '先写一版强目标开场，用前三章验证读者是否愿意继续追更。'
  if (signal.delta7 < 0) return '保留题材母题，把开篇冲突换成更具体、可兑现的新承诺。'
  return '把题材优势落在人设反差和连续兑现上，不依赖题材名本身制造期待。'
}

function evidenceFor(signal: GenreSignal): string {
  return `热度 ${signal.heat}，近 7 日 ${formatDelta(signal.delta7)}，趋势加速度 ${formatDelta(signal.acceleration)}，拥挤度 ${signal.crowding}。`
}

export default function TodayDecisions({
  genres,
  history,
  boards,
  updatedAt,
  sourceDate,
}: {
  genres: GenreHeat[]
  history: HistoryData | null
  boards: Board[]
  updatedAt?: string
  sourceDate?: string
}) {
  const [shared, setShared] = useState(false)
  const signals = buildGenreSignals(genres, history, boards)
  const opportunity = [...signals].sort((a, b) => (b.delta7 + b.acceleration) - (a.delta7 + a.acceleration))[0]
  const crowded = [...signals].filter((signal) => signal.name !== opportunity?.name).sort((a, b) => b.crowding - a.crowding)[0]
  const cooling = [...signals]
    .filter((signal) => signal.name !== opportunity?.name && signal.name !== crowded?.name)
    .sort((a, b) => a.delta7 - b.delta7)[0]
  if (!opportunity || !crowded || !cooling) return null

  const opportunityNote = genres.find((genre) => genre.name === opportunity.name)?.note
  const secondary = [
    {
      label: '高热但拥挤',
      signal: crowded,
      icon: AlertTriangle,
      tone: 'border-amber-200 bg-amber-50 text-amber-800',
      summary: '可以写，但必须先找到与榜首不同的兑现机制。',
    },
    {
      label: cooling.delta7 < 0 ? '暂缓追高' : '继续观察',
      signal: cooling,
      icon: ArrowDownRight,
      tone: 'border-blue-200 bg-blue-50 text-blue-700',
      summary: cooling.delta7 < 0 ? '热度动能正在减弱，先用短篇幅试写验证。' : '信号尚未形成明显窗口，适合保留创意而非立即重注。',
    },
  ]

  const shareBrief = async () => {
    const url = `${window.location.origin}/?utm_source=direction_brief&utm_medium=share#direction`
    const text = [
      '【网文风向 · 近期写作方向】',
      `首选：${opportunity.name}（${opportunity.stageLabel}期）`,
      `证据：${evidenceFor(opportunity)}`,
      `动作：${actionFor(opportunity)}`,
      `避坑：${crowded.name} 当前拥挤度 ${crowded.crowding}，不要照抄榜首。`,
    ].join('\n')
    trackEvent('direction_brief_share', { genre: opportunity.name })
    try {
      if (navigator.share) await navigator.share({ title: '网文风向 · 近期写作方向', text, url })
      else await navigator.clipboard.writeText(`${text}\n${url}`)
      setShared(true)
      window.setTimeout(() => setShared(false), 2000)
    } catch {
      // 用户取消系统分享时保持当前页面状态
    }
  }

  return (
    <section id="direction" className="mt-12 scroll-mt-24" aria-labelledby="today-decisions-title">
      <SectionTitle
        id="today-decisions-title"
        title="近期写作方向"
        hint="把热度、增速和拥挤度翻成开书动作"
        right={
          <button
            type="button"
            onClick={shareBrief}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-theme-300 bg-white px-3 py-2 text-xs font-semibold text-theme-800 shadow-sm transition-colors hover:bg-theme-50"
          >
            {shared ? <Check size={15} /> : <Share2 size={15} />}
            <span aria-live="polite">{shared ? '已分享' : '分享方向简报'}</span>
          </button>
        }
        footer={
          <>
            {updatedAt && <span>趋势数据截止 {updatedAt}</span>}
            {sourceDate && <span>新书榜截止 {sourceDate}</span>}
            <span>结论来自站内近 7 日趋势与在榜样本</span>
          </>
        }
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.85fr)]">
        <article className="relative overflow-hidden rounded-lg border border-theme-300 bg-theme-100 px-5 py-6 text-theme-950 shadow-lg shadow-theme-950/5 sm:px-7 sm:py-7">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-theme-500" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-theme-300 bg-white px-2.5 py-1 text-xs font-semibold text-theme-800">
              <ArrowUpRight size={15} /> 首选窗口
            </span>
            <span className="rounded-md bg-theme-accent-soft px-2.5 py-1 text-xs font-bold text-theme-950">{opportunity.stageLabel}期</span>
          </div>

          <div className="mt-7 max-w-2xl">
            <p className="text-xs font-semibold text-theme-600">本周优先研究</p>
            <h3 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">{opportunity.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-theme-800">{opportunityNote ?? evidenceFor(opportunity)}</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-theme-200 bg-theme-200">
            {[
              { label: '当前热度', value: opportunity.heat },
              { label: '7 日变化', value: formatDelta(opportunity.delta7) },
              { label: '拥挤度', value: opportunity.crowding },
            ].map((metric) => (
              <div key={metric.label} className="bg-white px-3 py-3 sm:px-4">
                <b className="block font-mono text-xl tabular-nums text-theme-800">{metric.value}</b>
                <span className="mt-1 block text-[11px] text-theme-600">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-l-2 border-theme-accent pl-4">
            <p className="text-xs font-semibold text-theme-600">建议切口</p>
            <p className="mt-1 text-sm leading-relaxed text-theme-950">{actionFor(opportunity)}</p>
          </div>

          <Link
            to={radarPath(opportunity.name)}
            onClick={() => trackEvent('direction_to_radar', { genre: opportunity.name })}
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-theme-800 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-theme-900"
          >
            带入开书雷达 <ArrowRight size={17} />
          </Link>
        </article>

        <div className="grid gap-4">
          {secondary.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="card-pink flex flex-col rounded-lg border border-theme-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
                    <Icon size={14} /> {item.label}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${signalTone(item.signal.stage)}`}>{item.signal.stageLabel}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-theme-950">{item.signal.name}</h3>
                <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-theme-600">
                  <span className="inline-flex items-center gap-1"><Gauge size={13} /> 热度 {item.signal.heat}</span>
                  <span className="inline-flex items-center gap-1"><Target size={13} /> 拥挤 {item.signal.crowding}</span>
                  <span className="inline-flex items-center gap-1"><Sparkles size={13} /> 7 日 {formatDelta(item.signal.delta7)}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-theme-700">{item.summary}</p>
                <p className="mt-2 text-xs leading-relaxed text-theme-600">{actionFor(item.signal)}</p>
                <Link
                  to={radarPath(item.signal.name)}
                  onClick={() => trackEvent('direction_to_radar', { genre: item.signal.name })}
                  className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-theme-700 hover:text-theme-950"
                >
                  查看对应开书策略 <ArrowRight size={14} />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
