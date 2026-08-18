import { Download, HardDrive, MonitorDown, Package, ShieldCheck } from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'

const DOWNLOAD_URL = 'https://pan.quark.cn/s/e26eb632dfa9'

const assurances = [
  {
    icon: MonitorDown,
    title: 'Windows 本地客户端',
    description: 'Windows 本地客户端，安装版与便携版均提供，按需选择。',
  },
  {
    icon: HardDrive,
    title: '数据保存在本机',
    description: '作品数据存于本机 SQLite，卸载软件不会删除你的作品数据。',
  },
  {
    icon: ShieldCheck,
    title: '密钥本地安全存储',
    description: 'AI 功能需自配 OpenAI 兼容 API，密钥走 Windows 安全存储。',
  },
]

export default function DownloadSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <div className="relative">
        {/* 卡片背后的玫瑰-紫罗兰环境光晕 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 left-1/2 h-56 w-[80%] -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500/30 to-violet-500/30 blur-3xl"
        />
        <div className="glass glass-sheen relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12">
        {/* 渐变光晕 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500/25 via-rose-400/20 to-violet-500/25 blur-3xl"
        />

        <div className="relative">
          <p className="glass mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-slate-300">
            <Package size={14} className="text-rose-400" />
            奶龙作者工作台
          </p>
          <h2 className="font-serif text-3xl font-bold text-theme-950 sm:text-4xl">
            现在就开始，把故事放进画布
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            免费下载 Windows 客户端，安装版与便携版均提供。作品数据保存在本机，
            卸载软件不会删除作品数据，灵感与章节始终握在你自己手里。
          </p>

          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackEvent('click_workbench_download', { placement: 'workbench_bottom' })}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-8 font-serif text-base font-bold text-white shadow-lg shadow-rose-500/25 transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02]"
          >
            <Download size={18} />
            下载奶龙作者工作台
          </a>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {assurances.map((item) => (
              <div
                key={item.title}
                className="glass-soft rounded-2xl p-4"
              >
                <item.icon size={18} className="text-rose-400" />
                <p className="mt-2 text-sm font-semibold text-theme-950">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
