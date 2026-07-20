import { useMemo, useState } from 'react'
import type { HistoryData } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'

const COLORS = ['hsl(var(--theme-600))', '#2563eb', '#0891b2', '#7c3aed', '#ea580c', '#16a34a', '#db2777', '#4f46e5']
const W = 720
const H = 300
const PAD = { left: 36, right: 120, top: 18, bottom: 30 }

function shortName(name: string): string {
  const stripped = name.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').split('/')[0].trim()
  return stripped.length > 8 ? stripped.slice(0, 8) + '…' : stripped
}

export default function TrendChart({
  history,
  updatedAt,
}: {
  history: HistoryData | null
  updatedAt?: string
}) {
  const [range, setRange] = useState<7 | 30>(7)
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const [compareMode, setCompareMode] = useState(false)

  const days = useMemo(() => {
    const all = history?.days ?? []
    return all.slice(-range)
  }, [history, range])

  const allSeries = useMemo(() => {
    if (!days.length) return []
    const latest = days[days.length - 1]
    const top = [...latest.genres].sort((a, b) => b.heat - a.heat).map((g) => g.name)
    return top.map((name, i) => ({
      name,
      color: COLORS[i % COLORS.length],
      points: days.map((d) => {
        const hit = d.genres.find((g) => g.name === name)
        return hit ? hit.heat : null
      }),
    }))
  }, [days])

  const defaultVisible = useMemo(() => new Set(allSeries.slice(0, 3).map((s) => s.name)), [allSeries])

  const activeVisible = useMemo(() => {
    if (visible.size === 0) return defaultVisible
    return visible
  }, [visible, defaultVisible])

  const xOf = (i: number) =>
    days.length <= 1
      ? PAD.left + (W - PAD.left - PAD.right) / 2
      : PAD.left + (i * (W - PAD.left - PAD.right)) / (days.length - 1)
  const yOf = (heat: number) => PAD.top + ((100 - heat) * (H - PAD.top - PAD.bottom)) / 100

  const rendered = useMemo(
    () =>
      allSeries
        .map((s) => {
          if (!activeVisible.has(s.name)) return null
          const pts = s.points
            .map((p, i) => (p == null ? null : { x: xOf(i), y: yOf(p), v: p }))
            .filter((p): p is { x: number; y: number; v: number } => p !== null)
          return pts.length ? { s, pts, last: pts[pts.length - 1] } : null
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSeries, activeVisible, days]
  )

  const labels = useMemo(() => {
    const LABEL_H = 27
    const minY = PAD.top + 12
    const maxY = H - PAD.bottom - 16
    const items = rendered.map((r) => ({ name: r.s.name, y: r.last.y })).sort((a, b) => a.y - b.y)
    for (let i = 1; i < items.length; i++) if (items[i].y - items[i - 1].y < LABEL_H) items[i].y = items[i - 1].y + LABEL_H
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].y > maxY) items[i].y = maxY
      if (i > 0 && items[i].y - items[i - 1].y < LABEL_H) items[i - 1].y = items[i].y - LABEL_H
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].y < minY) items[i].y = minY
      if (i < items.length - 1 && items[i + 1].y - items[i].y < LABEL_H) items[i + 1].y = items[i].y + LABEL_H
    }
    return new Map(items.map((it) => [it.name, it.y]))
  }, [rendered])

  const toggleSeries = (name: string) => {
    setVisible((prev) => {
      const next = new Set(prev.size === 0 ? defaultVisible : prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        if (compareMode && next.size >= 3) {
          const first = next.values().next().value
          if (first) next.delete(first)
        }
        next.add(name)
      }
      return next
    })
  }

  const toggle = (
    <span className="inline-flex overflow-hidden rounded-full border border-theme-200 text-xs">
      {([7, 30] as const).map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          className={`px-3 py-1 transition-colors ${
            range === r ? 'bg-gradient-to-r from-theme-500 to-theme-400 text-white' : 'bg-white text-theme-600 hover:bg-theme-50'
          }`}
        >
          近{r}天
        </button>
      ))}
    </span>
  )

  return (
    <section id="trend" aria-labelledby="trend-heading" className="rise-in mt-14 scroll-mt-24" style={{ animationDelay: '0.14s' }}>
      <SectionTitle
        id="trend-heading"
        title="热度趋势"
        hint={`每日归档自动积累 · 已积累 ${history?.days.length ?? 0} 天`}
        right={toggle}
        footer={
          <>
            {updatedAt && <span>更新于 {updatedAt}</span>}
            <span>默认展示 Top 3，点击图例可切换</span>
            <span>来源：网文大数据历史归档</span>
          </>
        }
      />

      {days.length < 2 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-theme-300 bg-white/80 p-8 text-center">
          <p className="font-medium text-theme-900">趋势数据积累中</p>
          <p className="mt-1 text-sm text-theme-600">
            每日任务会把当天题材热度写入历史归档，积累 2 天以上即自动绘制题材热度曲线。
          </p>
        </div>
      ) : (
        <div className="card-pink mt-6 rounded-2xl border border-theme-200/70 bg-white/90 p-4 shadow-sm shadow-theme-100/60">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-theme-600">
              当前显示 {activeVisible.size} / {allSeries.length} 个题材
            </span>
            <button
              onClick={() => {
                setCompareMode((v) => !v)
                if (!compareMode) {
                  setVisible(new Set(Array.from(activeVisible).slice(0, 3)))
                }
              }}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                compareMode
                  ? 'bg-theme-500 text-white'
                  : 'border border-theme-200 bg-white text-theme-500 hover:bg-theme-50'
              }`}
            >
              {compareMode ? '退出对比' : '对比模式'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px]" role="img" aria-label="题材热度趋势图">
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line x1={PAD.left} x2={W - PAD.right} y1={yOf(v)} y2={yOf(v)} stroke="#fce7f3" strokeWidth="1" />
                  <text x={PAD.left - 8} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#f9a8d4" fontFamily="monospace">
                    {v}
                  </text>
                </g>
              ))}
              {days.map((d, i) => {
                const showLabel = days.length <= 10 || i % 5 === 0 || i === days.length - 1
                if (!showLabel) return null
                return (
                  <text
                    key={d.date}
                    x={xOf(i)}
                    y={H - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#f9a8d4"
                    fontFamily="monospace"
                  >
                    {d.date.slice(5)}
                  </text>
                )
              })}
              {rendered.map(({ s, pts, last }) => {
                const labelX = Math.min(last.x + 8, W - PAD.right + 10)
                const ly = labels.get(s.name) ?? last.y
                const shifted = Math.abs(ly - last.y) > 4
                return (
                  <g key={s.name}>
                    {pts.length > 1 && (
                      <polyline
                        points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    )}
                    {pts.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={s.color} opacity="0.9" />
                    ))}
                    {shifted && (
                      <line
                        x1={last.x + 5}
                        y1={last.y}
                        x2={labelX - 5}
                        y2={ly - 4}
                        stroke={s.color}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity="0.5"
                      />
                    )}
                    <circle cx={last.x} cy={last.y} r="3" fill={s.color} stroke="#fff" strokeWidth="1.5" />
                    <text x={labelX} y={ly} fontSize="11" fontWeight="600" fill={s.color} stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="monospace">
                      {last.v}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 px-2">
            {allSeries.map((s) => {
              const active = activeVisible.has(s.name)
              return (
                <button
                  key={s.name}
                  onClick={() => toggleSeries(s.name)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${
                    active
                      ? 'border-theme-200 bg-white text-theme-700 shadow-sm'
                      : 'border-transparent bg-theme-50/60 text-theme-500 hover:text-theme-600'
                  }`}
                  title={s.name}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active ? s.color : 'hsl(var(--theme-300))' }} />
                  <span className="max-w-[6rem] truncate">{shortName(s.name)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
