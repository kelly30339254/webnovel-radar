import { useState } from 'react'
import {
  Check,
  Copy,
  Download,
  KeyRound,
  MailOpen,
  MonitorDown,
  ShieldCheck,
} from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'

const DOWNLOAD_URL = 'https://pan.quark.cn/s/4281c66844d0'
const WECHAT_ID = 'nailong327'

const assurances = [
  {
    icon: MailOpen,
    title: '收信只读不删邮件',
    description: 'IMAP 只读监控收件箱，只读取回信用于判定，不会删除或改动你的邮件。',
  },
  {
    icon: KeyRound,
    title: '授权码仅存本机',
    description: 'SMTP 授权码只保存在本机，整库备份导出时不包含授权码。',
  },
  {
    icon: MonitorDown,
    title: 'Windows 10·11 64 位',
    description: '桌面客户端，数据保存在本机 SQLite，无账号体系，开箱即用。',
  },
]

function copyText(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value)
  const input = document.createElement('textarea')
  input.value = value
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
  return Promise.resolve()
}

export default function DownloadSection() {
  const [copied, setCopied] = useState(false)

  const copyWechat = async () => {
    await copyText(WECHAT_ID)
    setCopied(true)
    trackEvent('assistant_wechat_copy')
    window.setTimeout(() => setCopied(false), 1600)
  }

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
              <ShieldCheck size={14} className="text-rose-400" />
              奶龙投稿助手
            </p>
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              让每一次投稿，都准时出发
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              免费下载 Windows 客户端，投稿记录与文稿数据全部保存在本机，
              不上传、不依赖云端，卸下重复劳动，把时间留给写作本身。
            </p>

            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() =>
                trackEvent('click_assistant_download', { placement: 'assistant_bottom' })
              }
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-8 font-serif text-base font-bold text-white shadow-lg shadow-rose-500/25 transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02]"
            >
              <Download size={18} />
              免费下载奶龙投稿助手
            </a>

            {/* 卡密购买区 */}
            <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
              <span>
                购买卡密请添加微信{' '}
                <strong className="font-bold text-theme-700">{WECHAT_ID}</strong>
              </span>
              <button
                type="button"
                onClick={copyWechat}
                className="glass glass-sheen inline-flex min-h-10 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 transition-transform duration-200 motion-safe:hover:-translate-y-0.5"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
                <span aria-live="polite">{copied ? '已复制' : '复制微信号'}</span>
              </button>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
              {assurances.map((item) => (
                <div
                  key={item.title}
                  className="glass-soft rounded-2xl p-4"
                >
                  <item.icon size={18} className="text-rose-400" />
                  <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
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
