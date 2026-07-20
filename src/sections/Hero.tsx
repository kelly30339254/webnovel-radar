import type { WindData } from '@/types/wind'
import { HeroStickers } from '@/sections/Stickers'
import { Share2 } from 'lucide-react'
import { useState } from 'react'

export default function Hero({ data, historyDays = 0 }: { data: WindData; historyDays?: number }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://nailong-d4g922z6h6d9ff59e-1455870789.tcloudbaseapp.com/'

  const handleShare = async () => {
    const payload = {
      title: '网文风向 · 网文作者每日选题雷达',
      text: data.verdict,
      url: shareUrl,
    }
    try {
      if (navigator.share) {
        await navigator.share(payload)
      } else {
        await navigator.clipboard.writeText(`${payload.title}\n${payload.text}\n${payload.url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // 用户取消或分享失败时静默处理
    }
  }
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
          <button
            onClick={handleShare}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-white/60 px-2.5 py-1 text-[11px] text-rose-500 transition-colors hover:bg-white hover:text-rose-600"
          >
            <Share2 size={12} />
            {copied ? '已复制' : '分享'}
          </button>
        </div>
        <h1
          className="rise-in mt-8 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 bg-clip-text font-serif text-5xl font-bold tracking-tight text-transparent md:text-7xl"
          style={{ animationDelay: '0.08s' }}
        >
          网文风向
        </h1>
        <p
          className="rise-in mt-3 text-base font-medium text-rose-500 md:text-lg"
          style={{ animationDelay: '0.1s' }}
        >
          网文作者每日选题雷达 · 热榜 · 技巧 · 风向
        </p>
        <div className="rise-in mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-rose-400 to-pink-300" style={{ animationDelay: '0.14s' }} />
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
