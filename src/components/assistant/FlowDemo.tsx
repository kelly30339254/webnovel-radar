import type { ComponentType, ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ClipboardCheck,
  FileText,
  Inbox,
  Mail,
  Mails,
  ShieldCheck,
} from 'lucide-react'

type IconComponent = ComponentType<{ size?: number | string; className?: string }>

/** 单个邮箱的轮投高亮相位（10s 总循环内错开） */
const MAILBOX_GLOW_DELAYS = ['0s', '1.5s', '3s', '4.5s']
/** 编辑来信依次出现的相位 */
const LETTER_IN_DELAYS = ['4.6s', '5.4s', '6.2s', '7s']
/** 判定徽章依次点亮的相位 */
const BADGE_PULSE_DELAYS = ['6.5s', '7.5s', '8.5s']
/** 三段连线上小圆点的飞行相位 */
const CONNECTOR_DOT_DELAYS = ['0.2s', '4.8s', '6.2s']

const MAILBOXES = [
  { name: '邮箱 1', host: 'qq.com' },
  { name: '邮箱 2', host: '163.com' },
  { name: '邮箱 3', host: 'outlook.com' },
  { name: '邮箱 4', host: 'gmail.com' },
]

const EDITORS = [
  { magazine: '《青春文学》', editor: '陈编辑' },
  { magazine: '《幻想志》', editor: '林编辑' },
  { magazine: '《都市故事》', editor: '王编辑' },
  { magazine: '《山海月刊》', editor: '赵编辑' },
]

interface Verdict {
  label: string
  hint: string
  badgeClass: string
}

const VERDICTS: Verdict[] = [
  {
    label: '过稿',
    hint: '命中「采用 / 留用」',
    badgeClass: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300',
  },
  {
    label: '退稿',
    hint: '命中「遗憾 / 不合」',
    badgeClass: 'border-rose-400/40 bg-rose-500/15 text-rose-300',
  },
  {
    label: '需修改',
    hint: '命中「修改后再审」',
    badgeClass: 'border-amber-400/40 bg-amber-500/15 text-amber-300',
  },
]

interface StageShellProps {
  step: string
  title: string
  subtitle: string
  icon: IconComponent
  children: ReactNode
}

function StageShell({ step, title, subtitle, icon: Icon, children }: StageShellProps) {
  return (
    <div className="glass-soft min-w-0 flex-1 rounded-xl p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-rose-300">
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-theme-950">
            <span className="mr-1.5 text-rose-400">{step}</span>
            {title}
          </p>
          <p className="truncate text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

interface ConnectorProps {
  delay: string
}

function Connector({ delay }: ConnectorProps) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-10 w-full flex-none items-center justify-center md:h-auto md:w-12 md:self-stretch"
    >
      <div className="hidden h-px w-full bg-gradient-to-r from-rose-500/50 to-violet-500/50 md:block" />
      <div className="h-full w-px bg-gradient-to-b from-rose-500/50 to-violet-500/50 md:hidden" />
      <ArrowRight size={14} className="absolute hidden text-rose-400/80 md:block" />
      <ArrowDown size={14} className="absolute text-rose-400/80 md:hidden" />
      <span
        className="assistant-dot-x absolute left-0 top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-rose-400 opacity-0 shadow-[0_0_8px_2px_rgba(251,113,133,0.65)] md:block"
        style={{ animationDelay: delay }}
      />
      <span
        className="assistant-dot-y absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rose-400 opacity-0 shadow-[0_0_8px_2px_rgba(251,113,133,0.65)] md:hidden"
        style={{ animationDelay: delay }}
      />
    </div>
  )
}

export default function FlowDemo() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-rose-400">AUTO FLOW</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-theme-950 sm:text-4xl">
          自动投稿，一目了然
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
          从文稿库到编辑回信，奶龙投稿助手把整套流程自动跑完：多邮箱轮投发出、IMAP 只读监控收件箱、本地关键词规则自动判定。
        </p>
      </div>

      <div className="glass mt-12 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-stretch md:flex-row">
          <StageShell step="①" title="文稿库" subtitle="导入文稿，生成投稿信" icon={FileText}>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 p-2.5">
                <FileText size={18} className="flex-none text-rose-300" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-theme-950">《海雾灯塔》</p>
                  <p className="text-[11px] text-slate-400">12,400 字 · txt 导入</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 p-2.5">
                <Mail size={18} className="flex-none text-violet-300" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-theme-950">投稿信 · 致陈编辑</p>
                  <p className="text-[11px] text-slate-400">已按刊物自动套用称呼</p>
                </div>
              </div>
            </div>
          </StageShell>

          <Connector delay={CONNECTOR_DOT_DELAYS[0]} />

          <StageShell step="②" title="多邮箱轮投" subtitle="轮流发信，单邮箱有日上限" icon={Mails}>
            <div className="space-y-2">
              {MAILBOXES.map((box, index) => (
                <div
                  key={box.name}
                  className="assistant-mail-glow flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 p-2.5"
                  style={{ animationDelay: MAILBOX_GLOW_DELAYS[index] }}
                >
                  <Mail size={16} className="flex-none text-rose-300" />
                  <p className="min-w-0 flex-1 truncate text-xs text-slate-300">
                    <span className="font-medium text-theme-950">{box.name}</span>
                    <span className="ml-1.5 text-slate-400">{box.host}</span>
                  </p>
                  <span className="flex-none text-[11px] text-slate-500">轮投中</span>
                </div>
              ))}
            </div>
          </StageShell>

          <Connector delay={CONNECTOR_DOT_DELAYS[1]} />

          <StageShell step="③" title="编辑收件箱" subtitle="IMAP 只读监控，来信自动归集" icon={Inbox}>
            <div className="space-y-2">
              {EDITORS.map((item, index) => (
                <div
                  key={item.magazine}
                  className="assistant-letter-in flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 p-2.5 opacity-0"
                  style={{ animationDelay: LETTER_IN_DELAYS[index] }}
                >
                  <Inbox size={16} className="flex-none text-violet-300" />
                  <p className="min-w-0 flex-1 truncate text-xs text-slate-300">
                    <span className="font-medium text-theme-950">{item.magazine}</span>
                    <span className="ml-1.5 text-slate-400">{item.editor} · 来信</span>
                  </p>
                </div>
              ))}
            </div>
          </StageShell>

          <Connector delay={CONNECTOR_DOT_DELAYS[2]} />

          <StageShell step="④" title="回信自动判定" subtitle="本地关键词规则，结果待你确认" icon={ClipboardCheck}>
            <div className="space-y-2.5">
              {VERDICTS.map((verdict, index) => (
                <div key={verdict.label} className="flex items-center gap-2.5">
                  <span
                    className={`assistant-badge-pulse inline-flex w-16 flex-none items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold opacity-35 ${verdict.badgeClass}`}
                    style={{ animationDelay: BADGE_PULSE_DELAYS[index] }}
                  >
                    {verdict.label}
                  </span>
                  <p className="min-w-0 truncate text-[11px] text-slate-400">{verdict.hint}</p>
                </div>
              ))}
            </div>
          </StageShell>
        </div>

        <p className="mt-8 flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-slate-400">
          <ShieldCheck size={14} className="mt-0.5 flex-none text-emerald-400/80" />
          一稿一投保护：同一篇稿同一时间只投一家编辑；收信只读，判定结果仅供你确认参考
        </p>
      </div>
    </section>
  )
}
