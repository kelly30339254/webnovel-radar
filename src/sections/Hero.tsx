import type { WindData } from '@/types/wind'
import { HeroStickers } from '@/sections/Stickers'

export default function Hero({ data, historyDays = 0 }: { data: WindData; historyDays?: number }) {
  const bookCount = data.boards.reduce((sum, b) => sum + b.books.length, 0)
  const tagCount = (data.keywords?.male.tags.length ?? 0) + (data.keywords?.female.tags.length ?? 0)
  const stats = [
    { label: '今日风向题材', value: data.genres.length },
    { label: '在榜新书', value: bookCount },
    { label: '内容关键词', value: tagCount },
    { label: '已归档天数', value: historyDays },
  ]

  return (
    <header className="relative overflow-hidden border-b border-rose-100 bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl"
        aria-hidden="true"
      />
      <HeroStickers />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-10 md:px-8 md:pt-14">
        <div className="rise-in flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-rose-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            Webnovel Radar · 番茄小说
          </span>
          <span>每日 07:23 自动更新</span>
          <span className="ml-auto font-mono normal-case tracking-normal text-rose-400/80">
            更新于 {data.updatedAt}
          </span>
        </div>
        <h1
          className="rise-in mt-8 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 bg-clip-text font-serif text-5xl font-bold tracking-tight text-transparent md:text-7xl"
          style={{ animationDelay: '0.08s' }}
        >
          网文风向
        </h1>
        <div className="rise-in mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-rose-400 to-pink-300" style={{ animationDelay: '0.14s' }} />
        <p
          className="rise-in mt-6 max-w-3xl text-xl font-medium leading-relaxed text-rose-950/85 md:text-2xl"
          style={{ animationDelay: '0.2s' }}
        >
          {data.verdict}
        </p>
        <p className="rise-in mt-4 text-sm text-rose-400" style={{ animationDelay: '0.26s' }}>
          番茄男频 / 女频新书榜 · 题材热度与趋势 · 内容关键词 · IP 改编 · 官方公告 —— 只追新书，不看总榜
        </p>
        <div className="rise-in mt-7 flex flex-wrap gap-2.5" style={{ animationDelay: '0.32s' }}>
          {stats.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-rose-200/80 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
            >
              <b className="font-mono text-base font-bold tabular-nums text-rose-600">{s.value}</b>
              <i className="text-xs not-italic text-rose-400">{s.label}</i>
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
