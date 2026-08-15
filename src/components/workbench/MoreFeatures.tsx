import type { ComponentType } from 'react'
import {
  Bot,
  FileDown,
  Focus,
  Gauge,
  History,
  Image,
  ListChecks,
  PenLine,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Type,
  Wand2,
} from 'lucide-react'

interface FeatureItem {
  icon: ComponentType<{ size?: number | string; className?: string }>
  text: string
}

const AI_FEATURES: FeatureItem[] = [
  { icon: Settings2, text: '多模型配置中心，自由切换' },
  { icon: PenLine, text: '按细纲写正文、续写与审核' },
  { icon: Wand2, text: '选中段落润色、扩写、缩写' },
  { icon: Image, text: 'AI 生图，为角色和场景配图' },
  { icon: Bot, text: '资料库 AI 拆书，反哺设定' },
  { icon: ListChecks, text: '创作追踪，发现伏笔与时间线问题' },
]

const WRITING_FEATURES: FeatureItem[] = [
  { icon: Save, text: '自动保存与历史版本回溯' },
  { icon: Trash2, text: '章节回收站与定时自动备份' },
  { icon: Type, text: '打字机滚动，视线永远居中' },
  { icon: Focus, text: '全屏专注模式，隔绝打扰' },
  { icon: Gauge, text: '码字冲刺，和朋友拼手速' },
  { icon: Search, text: '全文检索，设定秒查' },
  { icon: FileDown, text: 'TXT / Markdown / Word 导入导出' },
]

function FeaturePanel({
  title,
  subtitle,
  items,
  note,
}: {
  title: string
  subtitle: string
  items: FeatureItem[]
  note?: { icon: ComponentType<{ size?: number | string; className?: string }>; text: string }
}) {
  return (
    <div className="glass glass-sheen rounded-2xl p-6 sm:p-8">
      <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <ul className="mt-6 space-y-3.5">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-rose-400">
              <Icon size={15} />
            </span>
            {text}
          </li>
        ))}
      </ul>
      {note && (
        <p className="glass-soft mt-6 flex items-start gap-2 rounded-xl px-4 py-3 text-xs leading-relaxed text-slate-400">
          <note.icon size={14} className="mt-0.5 flex-none text-violet-400" />
          {note.text}
        </p>
      )}
    </div>
  )
}

export default function MoreFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-rose-400">WORKFLOW</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">
          从灵感落地，到完本交付
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FeaturePanel
          title="AI 辅助，按需取用"
          subtitle="写不写、写多少，都由你决定"
          items={AI_FEATURES}
          note={{
            icon: ShieldCheck,
            text: 'AI 功能需自配 OpenAI 兼容 API，密钥保存在 Windows 安全存储，不出本机。',
          }}
        />
        <FeaturePanel
          title="写作，一气呵成"
          subtitle="码字这件事本身，值得被认真对待"
          items={WRITING_FEATURES}
          note={{
            icon: History,
            text: '数据存在本机 SQLite，配合定时自动备份，稿子始终握在自己手里。',
          }}
        />
      </div>
    </section>
  )
}
