import { ArrowRight, Dices, PenLine, Target } from 'lucide-react'
import { Link } from 'react-router'
import SectionTitle from '@/sections/SectionTitle'
import { trackEvent } from '@/hooks/useAnalytics'

const SECONDARY_TOOLS = [
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
    <section id="tools" className="mt-12 scroll-mt-24" aria-labelledby="growth-tools-title">
      <SectionTitle id="growth-tools-title" title="开书辅助工具" hint="评估选题、生成命题、认识创作偏好" />
      <div className="mt-5 grid gap-3 lg:grid-cols-12">
        <Link
          to="/radar"
          onClick={() => trackEvent('home_tool_radar')}
          className="group relative flex min-h-64 flex-col overflow-hidden border-y border-theme-400 bg-white/65 p-6 text-theme-950 transition-colors hover:bg-theme-50/70 lg:col-span-6"
        >
          <span className="absolute inset-y-0 left-0 w-1.5 bg-theme-500" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-2 border border-theme-400 bg-white/80 px-2.5 py-1 text-xs font-semibold text-theme-800">
              <Target size={15} /> 首选工具
            </span>
            <ArrowRight className="text-theme-700 transition-transform group-hover:translate-x-1" size={22} />
          </div>
          <div className="mt-auto max-w-lg pt-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-theme-600">开书决策报告 · MARKET DECISION</p>
            <h3 className="mt-2 font-serif text-3xl font-bold">生成我的开书雷达</h3>
            <p className="mt-3 text-sm leading-relaxed text-theme-800">结合近期题材热度、更新能力和计划篇幅，判断这本书现在值不值得开，并给出 7 天验证路线。</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-theme-600">
              <span>适配度评分</span><span>突围定位</span><span>风险清单</span>
            </div>
          </div>
        </Link>

        {SECONDARY_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.to} to={tool.to} onClick={() => trackEvent(tool.event)} className="group flex min-h-64 flex-col border-y border-stone-300 bg-white/55 p-5 transition-colors hover:border-theme-400 hover:bg-theme-50/60 lg:col-span-3">
              <span className={`flex h-10 w-10 flex-none items-center justify-center border ${tool.tone}`}><Icon size={19} /></span>
              <span className="mt-auto block pt-7">
                <span className="text-xs font-semibold text-theme-600">每日更新</span>
                <span className="mt-2 block text-xl font-bold text-theme-950">{tool.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-theme-700">{tool.description}</span>
              </span>
              <span className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-xs font-semibold text-theme-700">
                <span>{tool.to === '/prompt-lab' ? '书名 · 人设 · 黄金三章' : '四维画像 · 题材建议 · 海报'}</span>
                <ArrowRight className="flex-none transition-transform group-hover:translate-x-1" size={17} />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
