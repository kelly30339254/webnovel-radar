import { ArrowRight, Dices, PenLine, Target } from 'lucide-react'
import { Link } from 'react-router'
import SectionTitle from '@/sections/SectionTitle'
import { trackEvent } from '@/hooks/useAnalytics'

const TOOLS = [
  {
    to: '/radar',
    icon: Target,
    title: '我的开书雷达',
    description: '用今日风向、更新能力和计划篇幅，生成个性化开书报告。',
    tone: 'border-theme-200 bg-theme-50 text-theme-700',
    event: 'home_tool_radar',
  },
  {
    to: '/prompt-lab',
    icon: Dices,
    title: '今日开书命题盲盒',
    description: '从当天热榜抽题材、人设、爽点和前三章钩子。',
    tone: 'border-teal-200 bg-teal-50 text-teal-700',
    event: 'home_tool_prompt',
  },
  {
    to: '/nbti',
    icon: PenLine,
    title: '网文十六型人格',
    description: '60 秒测出创作画像，保存专属结果海报。',
    tone: 'border-amber-200 bg-amber-50 text-amber-800',
    event: 'home_tool_nbti',
  },
] as const

export default function GrowthTools() {
  return (
    <section className="mt-10" aria-labelledby="growth-tools-title">
      <SectionTitle id="growth-tools-title" title="先做一个决定" hint="把风向直接变成下一步" />
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.to} to={tool.to} onClick={() => trackEvent(tool.event)} className="group flex min-h-32 items-start gap-4 border border-theme-100 bg-white p-4 shadow-sm hover:border-theme-200 hover:shadow-md">
              <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg border ${tool.tone}`}><Icon size={19} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-theme-950">{tool.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-theme-500">{tool.description}</span>
              </span>
              <ArrowRight className="mt-1 flex-none text-theme-500 transition-transform group-hover:translate-x-1 group-hover:text-theme-500" size={17} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

