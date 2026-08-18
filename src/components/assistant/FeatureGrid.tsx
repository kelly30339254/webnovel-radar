import type { ComponentType } from 'react'
import {
  BarChart3,
  BellRing,
  BookUser,
  CalendarClock,
  MailCheck,
  Mails,
  MailX,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface AssistantFeature {
  icon: ComponentType<{ size?: number | string; className?: string }>
  title: string
  description: string
}

const FEATURES: AssistantFeature[] = [
  {
    icon: Mails,
    title: '多邮箱轮投',
    description: '多槽位并发轮投发出，效率翻倍，投稿不再一封一封等。',
  },
  {
    icon: ShieldCheck,
    title: '一稿一投保护',
    description: '收到回复前不重复投递，避免一篇稿子撞进同一家邮箱。',
  },
  {
    icon: CalendarClock,
    title: '定时投稿',
    description: '预约好时间，到点自动发出，不错过编辑的上班时间。',
  },
  {
    icon: Sparkles,
    title: 'AI 智选与代写投稿信',
    description: 'AI 帮你挑编辑、写投稿信，OpenAI 兼容接口，Key 自己配。',
  },
  {
    icon: MailCheck,
    title: '回信自动判定',
    description: '本地关键词规则识别过稿、退稿、需修改，判定结果供你确认。',
  },
  {
    icon: MailX,
    title: '退信自动标记',
    description: '退信的失效邮箱自动标记跳过，需要时也可以手动恢复。',
  },
  {
    icon: BellRing,
    title: '催稿提醒',
    description: '超过 30 天未回复自动提醒，该催的稿一篇都不漏。',
  },
  {
    icon: BarChart3,
    title: '稿费记录与统计',
    description: '记录每一笔稿费，自动统计过稿率与平均回复时长。',
  },
  {
    icon: BookUser,
    title: '内置编辑库',
    description: '内置 2481 位收稿编辑，一键云端同步最新收稿信息。',
  },
]

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-rose-400">FEATURES</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-theme-950 sm:text-4xl">
          投稿的每一步，都有人替你把关
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
          从发出第一封投稿信，到收到回复、记下稿费，投稿助手把琐碎的环节都接管了。
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group glass glass-sheen rounded-2xl p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-rose-400 transition-colors group-hover:text-rose-300">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 text-base font-semibold text-theme-950">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
