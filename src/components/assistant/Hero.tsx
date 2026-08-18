import { AppWindow, Database, Download, Inbox, Send, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

const DOWNLOAD_URL = 'https://pan.quark.cn/s/4281c66844d0'
const BAIDU_URL = 'https://pan.baidu.com/s/1BQE9mhYLDtd9kc49qmzghw?pwd=spmv'

interface StatItem {
  icon: LucideIcon
  label: string
  detail: string
}

const STATS: StatItem[] = [
  { icon: Users, label: '2481 位内置编辑', detail: '一键云端同步最新' },
  { icon: Send, label: '多邮箱轮投', detail: '一稿一投 · 单日上限' },
  { icon: Inbox, label: '回信自动判定', detail: '过稿 / 退稿 / 需修改' },
  { icon: Database, label: '本地 SQLite 存储', detail: '数据只留在本机' },
]

export default function Hero() {
  const { trackEvent } = useAnalytics()

  return (
    <section className="relative overflow-hidden">
      {/* 渐变光晕 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-rose-500/20 blur-3xl motion-safe:animate-pulse"
          style={{ animationDuration: '9s' }}
        />
        <div
          className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl motion-safe:animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '1.5s' }}
        />
        <div
          className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose-400/10 blur-3xl motion-safe:animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '3s' }}
        />
        {/* 细网格纹理 */}
        <div
          className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 text-center sm:pt-36">
        {/* 徽章 */}
        <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-wide text-slate-300">
          <AppWindow className="h-3.5 w-3.5 text-rose-400" />
          Windows 桌面端 · 数据只存本机
        </div>

        {/* 主标题 */}
        <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-theme-950 sm:text-5xl lg:text-6xl">
          投稿这件事，
          <br />
          交给
          <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
            自动流程
          </span>
          。
        </h1>
        <p className="mt-4 font-serif text-lg text-slate-300 sm:text-xl">
          奶龙投稿助手
        </p>

        {/* 副文案 */}
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-400">
          多邮箱轮投批量投稿，回信自动判定过稿 / 退稿，内置 2481 位收稿编辑库。
          投稿记录、稿费与统计数据全部保存在本机，不依赖任何账号体系。
        </p>

        {/* CTA */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() =>
              trackEvent('click_assistant_download', {
                placement: 'assistant_hero',
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30"
          >
            <Download className="h-4 w-4" />
            免费下载
          </a>
          <a
            href={BAIDU_URL}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() =>
              trackEvent('click_assistant_download', {
                placement: 'assistant_hero_baidu',
              })
            }
            className="glass glass-sheen inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-slate-200 transition-transform duration-200 motion-safe:hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            百度网盘（提取码 spmv）
          </a>
          <a
            href="#flow-demo"
            className="glass glass-sheen inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-slate-200 transition-transform duration-200 motion-safe:hover:-translate-y-0.5"
          >
            看看自动投稿流程
          </a>
        </div>

        {/* 数据片 */}
        <div className="mt-16 grid grid-cols-2 gap-4 text-left lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass glass-sheen rounded-2xl px-5 py-4"
            >
              <stat.icon className="h-4 w-4 text-rose-400" />
              <p className="mt-2.5 text-sm font-medium text-theme-950">{stat.label}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* 卡密购买提示 */}
        <p className="mt-6 text-xs text-slate-400">
          购买卡密请添加微信{' '}
          <strong className="font-bold text-theme-700">nailong327</strong>
        </p>
      </div>
    </section>
  )
}
