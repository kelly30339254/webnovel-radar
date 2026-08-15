import { AppWindow, Database, Download, LayoutGrid, Package, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

const DOWNLOAD_URL = 'https://pan.quark.cn/s/e26eb632dfa9'

interface StatItem {
  icon: LucideIcon
  label: string
  detail: string
}

const STATS: StatItem[] = [
  { icon: LayoutGrid, label: '6 种画布视图', detail: '自由 / 时间线 / 关系' },
  { icon: Database, label: '本地 SQLite 存储', detail: '数据只留在本机' },
  { icon: Sparkles, label: '多模型 AI 配置', detail: 'OpenAI 兼容接口' },
  { icon: Package, label: '安装版 / 便携版', detail: '解压即可使用' },
]

interface MiniNode {
  title: string
  kind: string
  tone: string
  className: string
}

const MINI_NODES: MiniNode[] = [
  {
    title: '林晚',
    kind: '人物',
    tone: 'bg-rose-400/60',
    className: 'left-[8%] top-[14%]',
  },
  {
    title: '旧港雨夜',
    kind: '剧情',
    tone: 'bg-violet-400/60',
    className: 'left-[52%] top-[6%]',
  },
  {
    title: '第七封信',
    kind: '伏笔',
    tone: 'bg-amber-300/50',
    className: 'left-[58%] top-[52%]',
  },
  {
    title: '临江市',
    kind: '地点',
    tone: 'bg-sky-300/50',
    className: 'left-[12%] top-[62%]',
  },
]

/** 首屏装饰用迷你画布：纯 CSS/SVG 静态示意图，不参与交互 */
function MiniCanvas() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden select-none lg:block"
    >
      <div className="glass relative aspect-[5/4] w-full overflow-hidden rounded-2xl opacity-90">
        {/* 网格纹理 */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* 连线 */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 80"
          preserveAspectRatio="none"
        >
          <path
            d="M22 22 C 36 18, 44 14, 56 14"
            fill="none"
            stroke="rgba(251,113,133,0.45)"
            strokeWidth="0.5"
          />
          <path
            d="M60 22 C 64 32, 66 40, 66 56"
            fill="none"
            stroke="rgba(167,139,250,0.45)"
            strokeWidth="0.5"
          />
          <path
            d="M56 62 C 42 66, 32 68, 24 70"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <path
            d="M20 30 C 18 44, 18 54, 20 66"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="0.5"
          />
        </svg>
        {/* 便签节点 */}
        {MINI_NODES.map((node) => (
          <div
            key={node.title}
            className={`absolute w-[30%] rounded-lg border border-white/15 bg-white/10 px-3 pb-2.5 pt-3 shadow-lg shadow-black/30 backdrop-blur-md ${node.className}`}
          >
            <span
              className={`absolute -top-1.5 left-1/2 h-2.5 w-10 -translate-x-1/2 -rotate-2 rounded-sm ${node.tone}`}
            />
            <p className="text-[10px] font-medium tracking-wide text-white/90">
              {node.title}
            </p>
            <p className="mt-0.5 text-[9px] text-slate-400">{node.kind}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

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

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 sm:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            {/* 徽章 */}
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-wide text-slate-300">
              <AppWindow className="h-3.5 w-3.5 text-rose-400" />
              Windows 本地写作工作台
            </div>

            {/* 主标题 */}
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
              把整本书，
              <br />
              摊在一块
              <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
                画布
              </span>
              上。
            </h1>
            <p className="mt-4 font-serif text-lg text-slate-300 sm:text-xl">
              奶龙作者工作台
            </p>

            {/* 副文案 */}
            <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
              一款以灵感画布为核心的网文写作工作台：人物、剧情、伏笔在画布上一眼看清，
              AI 辅助与写作工具合为一体。所有数据保存在你的本机，不上传、不依赖云端。
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() =>
                  trackEvent('click_workbench_download', {
                    placement: 'workbench_hero',
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30"
              >
                <Download className="h-4 w-4" />
                免费下载
              </a>
              <a
                href="#canvas-demo"
                className="glass glass-sheen inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-slate-200 transition-transform duration-200 motion-safe:hover:-translate-y-0.5"
              >
                看看画布
              </a>
            </div>
          </div>

          <MiniCanvas />
        </div>

        {/* 数据片 */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass glass-sheen rounded-2xl px-5 py-4"
            >
              <stat.icon className="h-4 w-4 text-rose-400" />
              <p className="mt-2.5 text-sm font-medium text-white">{stat.label}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
