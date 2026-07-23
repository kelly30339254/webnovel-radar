import { useMemo, useState } from 'react'
import { CalendarDays, Check, FileDown, FileText, LoaderCircle } from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'
import { downloadDailyBriefPoster } from '@/lib/dailyBriefPoster'
import type { UpdateStatus, WindData } from '@/types/wind'

function verdictLines(verdict: string): string[] {
  const lines = verdict.split(/[；;]/).map((line) => line.trim()).filter(Boolean)
  return lines.length > 1 ? lines : [verdict]
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}

export default function Hero({
  data,
  historyDays = 0,
  updateStatus,
}: {
  data: WindData
  historyDays?: number
  updateStatus?: UpdateStatus | null
}) {
  const [shared, setShared] = useState(false)
  const [posterBusy, setPosterBusy] = useState(false)
  const [posterReady, setPosterReady] = useState(false)
  const lines = useMemo(() => verdictLines(data.verdict), [data.verdict])
  const sourceDate = updateStatus?.sourceDate ?? data.boards.map((board) => board.dataDate).filter(Boolean).sort().at(-1)

  const handleShare = async () => {
    const url = `${window.location.origin}/?utm_source=daily_brief&utm_medium=share`
    const text = [
      '【网文风向 · 今日作者决策简报】',
      data.verdict,
      `数据截止：${data.updatedAt}`,
      `参考数据：番茄男/女频新书榜 ${data.boards.reduce((sum, board) => sum + board.books.length, 0)} 本，查看了最近 ${historyDays} 天`,
      '说明：最近变化只帮助选题；记录天数太少的题材不会被推荐。',
    ].join('\n')
    trackEvent('home_share')
    try {
      await copyText(`${text}\n${url}`)
      setShared(true)
      window.setTimeout(() => setShared(false), 2000)
      if (navigator.share && navigator.maxTouchPoints > 0) {
        await navigator.share({ title: '网文风向 · 今日作者决策简报', text, url })
      }
    } catch {
      // 用户取消系统分享时保持当前页面状态
    }
  }

  const handlePoster = async () => {
    setPosterBusy(true)
    trackEvent('daily_brief_poster_download', { date: data.updatedAt })
    try {
      await downloadDailyBriefPoster({
        date: data.updatedAt,
        verdict: data.verdict,
        genres: data.genres,
        boards: data.boards,
        historyDays,
      })
      setPosterReady(true)
      window.setTimeout(() => setPosterReady(false), 5000)
    } finally {
      setPosterBusy(false)
    }
  }

  return (
    <header className="border-b border-theme-200/80 bg-theme-bg">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-12 pt-10 md:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.72fr)] lg:items-center lg:gap-16 lg:pb-16 lg:pt-12">
        <div className="rise-in">
          <h1 className="font-serif text-[clamp(3.6rem,7.2vw,7.25rem)] font-black leading-[0.92] tracking-[-0.06em] text-[#111]">
            <span className="text-theme-600">今日</span>网文风向
          </h1>
          <div className="mt-7 flex items-center gap-2" aria-hidden="true">
            <span className="h-1 w-16 bg-theme-600" />
            <span className="h-px w-32 bg-theme-600" />
          </div>

          <blockquote className="relative mt-8 max-w-3xl pl-12 font-serif text-[clamp(1.8rem,3.4vw,3.25rem)] font-bold leading-[1.34] tracking-[-0.03em] text-[#171513] sm:pl-20">
            <span className="absolute left-0 top-[-0.3em] font-serif text-8xl font-black leading-none text-stone-200" aria-hidden="true">“</span>
            {lines.map((line) => <span key={line} className="block">{line}{line === lines.at(-1) ? '' : '，'}</span>)}
            <span className="ml-2 text-stone-200" aria-hidden="true">”</span>
          </blockquote>

          <div className="mt-7 flex items-center gap-4 text-sm font-medium tracking-wide text-stone-700">
            <span className="h-1 w-12 bg-theme-600" aria-hidden="true" />
            <CalendarDays size={18} className="text-theme-600" />
            <time dateTime={data.updatedAt}>{data.updatedAt}</time>
            {sourceDate && <span className="hidden text-xs text-stone-500 sm:inline">新书榜截止 {sourceDate}</span>}
          </div>

          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handlePoster}
              disabled={posterBusy}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-theme-600 px-5 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-theme-700 disabled:cursor-wait disabled:opacity-70"
            >
              {posterBusy ? <LoaderCircle size={21} className="animate-spin" /> : posterReady ? <Check size={21} /> : <FileDown size={21} />}
              {posterBusy ? '正在生成海报' : posterReady ? '海报已生成' : '生成今日风向海报'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-theme-500 bg-transparent px-5 py-3 text-base font-bold text-theme-700 transition-colors hover:bg-white"
            >
              {shared ? <Check size={21} /> : <FileText size={21} />}
              <span aria-live="polite">{shared ? '简报已复制' : '分享文字简报'}</span>
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-stone-500">
            数据来源：番茄男/女频新书榜和站内最近 {historyDays} 天记录；记录太少的题材只展示，不会因为某一天突然变热就被推荐。
          </p>
        </div>

        <div className="rise-in mx-auto w-full max-w-[460px]" style={{ animationDelay: '0.1s' }}>
          <div className="relative aspect-[3/4]">
            <span className="absolute inset-3 translate-x-4 translate-y-3 border border-stone-300 bg-[#eee8dc] shadow-lg" aria-hidden="true" />
            <article className="absolute inset-0 flex flex-col overflow-hidden border border-stone-300 bg-[#f8f4ec] p-5 shadow-2xl shadow-stone-900/20 sm:p-6" aria-label="今日网文风向海报预览">
              <div className="flex items-start justify-between border-b border-theme-400/70 pb-3">
                <img src="/assets/webnovel-radar-seal.png" alt="网文风向" className="h-12 w-12 object-cover" />
                <time className="pt-2 font-serif text-lg text-stone-800" dateTime={data.updatedAt}>{data.updatedAt}</time>
              </div>
              <div className="relative z-10 mt-5 flex min-h-0 flex-1 flex-col overflow-hidden border border-theme-300/70">
                <div className="px-4 pt-4">
                  <h2 className="whitespace-nowrap font-serif text-[clamp(1.75rem,3vw,2.7rem)] font-black tracking-[-0.06em] text-[#111]">
                    <span className="text-theme-600">今日</span>网文风向
                  </h2>
                  <p className="mt-2 border-y border-stone-300 py-2 text-center font-serif text-[10px] tracking-[0.28em] text-stone-600">圈速览 · 趋势洞察 · 创作参考</p>
                  <p className="mt-4 line-clamp-4 font-serif text-base font-bold leading-relaxed text-stone-900 sm:text-lg">{data.verdict}</p>
                  <div className="mt-3 grid grid-cols-3 border-y border-stone-300 py-2 text-center text-[9px] text-stone-600">
                    <span>{historyDays} 天趋势</span><span>{data.genres.length} 个题材</span><span>{data.boards.reduce((sum, board) => sum + board.books.length, 0)} 本新书</span>
                  </div>
                </div>
                <img
                  src="/assets/daily-report-poster-art.png"
                  alt="城市、楼阁与书卷构成的网文日刊插画"
                  className="mt-auto h-[42%] w-full flex-none object-cover object-bottom"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </header>
  )
}
