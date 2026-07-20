import { useMemo, useState } from 'react'
import type { HistoryData } from '@/types/wind'
import SectionTitle from '@/sections/SectionTitle'

const COLORS = ['#e11d48', '#2563eb', '#0891b2', '#7c3aed']
const W = 720
const H = 300
const PAD = { left: 36, right: 120, top: 18, bottom: 30 }

/* 右侧标签用短名，避免长题材名溢出被裁 */
function shortName(name: string): string {
  const stripped = name.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').split('/')[0].trim()
  return stripped.length > 8 ? stripped.slice(0, 8) : stripped
}

export default function TrendChart({ history }: { history: HistoryData | null }) {
  const [range, setRange] = useState<7 | 30>(7)

  const days = useMemo(() => {
    const all = history?.days ?? []
    return all.slice(-range)
  }, [history, range])

  const series = useMemo(() => {
    if (!days.length) return []
    const latest = days[days.length - 1]
    const top = [...latest.genres].sort((a, b) => b.heat - a.heat).slice(0, 4).map((g) => g.name)
    return top.map((name, i) => ({
      name,
      color: COLORS[i % COLORS.length],
      points: days.map((d) => {
        const hit = d.genres.find((g) => g.name === name)
        return hit ? hit.heat : null
      }),
    }))
  }, [days])

  const xOf = (i: number) =>
    days.length <= 1
      ? PAD.left + (W - PAD.left - PAD.right) / 2
      : PAD.left + (i * (W - PAD.left - PAD.right)) / (days.length - 1)
  const yOf = (heat: number) => PAD.top + ((100 - heat) * (H - PAD.top - PAD.bottom)) / 100

  /* 预先算好每条线的点与终点，供标签防重叠使用 */
  const rendered = useMemo(
    () =>
      series
        .map((s) => {
          const pts = s.points
            .map((p, i) => (p == null ? null : { x: xOf(i), y: yOf(p), v: p }))
            .filter((p): p is { x: number; y: number; v: number } => p !== null)
          return pts.length ? { s, pts, last: pts[pts.length - 1] } : null
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, days]
  )

  /* 右侧标签纵向防重叠：按终点 y 排序后拉开最小行距，触底/触顶时回推 */
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

  const toggle = (
    <span className="inline-flex overflow-hidden rounded-full border border-rose-200 text-xs">
      {([7, 30] as const).map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          className={`px-3 py-1 transition-colors ${
            range === r ? 'bg-gradient-to-r from-rose-500 to-pink-400 text-white' : 'bg-white text-rose-400 hover:bg-rose-50'
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
      />

      {days.length < 2 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-rose-300 bg-white/80 p-8 text-center">
          <p className="font-medium text-rose-900">趋势数据积累中</p>
          <p className="mt-1 text-sm text-rose-400">
            每日任务会把当天题材热度写入历史归档，积累 2 天以上即自动绘制题材热度曲线。
          </p>
        </div>
      ) : (
        <div className="card-pink mt-6 overflow-x-auto rounded-2xl border border-rose-200/70 bg-white/90 p-4 shadow-sm shadow-rose-100/60">
          <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px]" role="img" aria-label="题材热度趋势图">
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
                  {/* 标签被拉开时画一条虚线牵引线指向终点 */}
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
                  {/* 仅保留数字热度，文字加白色描边光晕 */}
                  <text x={labelX} y={ly} fontSize="11" fontWeight="600" fill={s.color} stroke="#fff" strokeWidth="3.5" paintOrder="stroke" fontFamily="monospace">
                    {last.v}
                  </text>
                </g>
              )
            })}
          </svg>
          {/* 图例：类型名称放在图表下方 */}
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
            {series.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-rose-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="max-w-[8rem] truncate" title={s.name}>
                  {shortName(s.name)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
