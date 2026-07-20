import type { WindData } from '@/types/wind'
import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { trackEvent } from '@/hooks/useAnalytics'

export default function Hero({ data, historyDays = 0 }: { data: WindData; historyDays?: number }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://nailong.zhiyuxiezuo.com/'

  const handleShare = async () => {
    const payload = {
      title: '网文风向 · 网文作者每日选题雷达',
      text: data.verdict,
      url: shareUrl,
    }
    trackEvent('home_share')
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
    <header className="border-b border-theme-200 bg-theme-50/70">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 md:px-8 md:pb-12 md:pt-11">
        <div className="rise-in flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-widest text-theme-700">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-theme-500" />
            Webnovel Radar · 番茄小说
          </span>
          <span>每日 07:23 自动更新</span>
          <button
            onClick={handleShare}
            className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-theme-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-theme-800 shadow-sm hover:bg-theme-100"
          >
            <Share2 size={12} />
            {copied ? '已复制' : '分享'}
          </button>
        </div>
        <h1
          className="rise-in mt-7 font-serif text-5xl font-bold text-theme-950 md:text-7xl"
          style={{ animationDelay: '0.08s' }}
        >
          网文风向
        </h1>
        <p
          className="rise-in mt-3 text-base font-semibold text-theme-600 md:text-lg"
          style={{ animationDelay: '0.1s' }}
        >
          网文作者每日选题雷达 · 热榜 · 技巧 · 风向
        </p>
        <div className="rise-in mt-4 h-1 w-24 bg-theme-500" style={{ animationDelay: '0.14s' }} />
        <p
          className="rise-in mt-6 max-w-3xl text-xl font-medium leading-relaxed text-theme-950/85 md:text-2xl"
          style={{ animationDelay: '0.2s' }}
        >
          {data.verdict}
        </p>
        <p className="rise-in mt-4 text-sm font-medium text-theme-700" style={{ animationDelay: '0.26s' }}>
          番茄男频 / 女频新书榜 · 题材热度与趋势 · 内容关键词 · IP 改编 · 官方公告 —— 只追新书，不看总榜
        </p>
        <div className="rise-in mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-theme-200 bg-theme-200 shadow-sm sm:grid-cols-4" style={{ animationDelay: '0.3s' }}>
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex min-h-16 flex-col justify-center bg-white px-4 py-3"
            >
              <b className="font-mono text-xl font-bold tabular-nums text-theme-700">{s.value}</b>
              <i className="mt-1 text-xs font-medium not-italic text-theme-700">{s.label}</i>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
