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
    surface: 'border-[#174c43] bg-[#174c43] text-white',
    iconTone: 'border-white/35 bg-white/10 text-white',
    muted: 'text-white/75',
    divider: 'border-white/25',
    event: 'home_tool_prompt',
  },
  {
    to: '/nbti',
    icon: PenLine,
    title: '网文十六型人格',
    description: '60 秒测出创作画像，保存专属结果海报。',
    surface: 'border-[#b89247] bg-[#efe4cd] text-theme-950',
    iconTone: 'border-[#b89247] bg-white/55 text-[#8b641d]',
    muted: 'text-stone-600',
    divider: 'border-[#cdb984]',
    event: 'home_tool_nbti',
  },
] as const

export default function GrowthTools() {
  return (
    <section id="tools" className="mt-12 scroll-mt-24" aria-labelledby="growth-tools-title">
      <SectionTitle id="growth-tools-title" title="开书辅助工具" hint="评估选题、生成命题、认识创作偏好" />
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <Link
          to="/radar"
          onClick={() => trackEvent('home_tool_radar')}
          className="group relative flex min-h-72 flex-col overflow-hidden border border-theme-950 bg-theme-950 p-7 text-white shadow-[8px_8px_0_0_rgba(158,18,32,0.16)] transition-transform hover:-translate-y-1 lg:col-span-6"
        >
          <span className="absolute inset-y-0 left-0 w-2 bg-theme-500" aria-hidden="true" />
          <span className="absolute right-7 top-5 font-serif text-7xl font-black text-white/[0.07]" aria-hidden="true">01</span>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-2 border border-white/35 px-3 py-1.5 text-xs font-semibold text-white">
              <Target size={15} /> 首选工具
            </span>
            <span className="flex h-11 w-11 items-center justify-center border border-white/25 text-theme-200">
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={22} />
            </span>
          </div>
          <div className="mt-auto max-w-lg pt-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-theme-200">开书决策报告 · MARKET DECISION</p>
            <h3 className="mt-3 font-serif text-4xl font-black">生成我的开书雷达</h3>
            <p className="mt-4 text-sm leading-7 text-white/75">结合近期题材热度、更新能力和计划篇幅，判断这本书现在值不值得开，并给出 7 天验证路线。</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-4 text-xs font-bold text-theme-200">
              <span>适配度评分</span><span>突围定位</span><span>风险清单</span>
            </div>
          </div>
        </Link>

        {SECONDARY_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.to} to={tool.to} onClick={() => trackEvent(tool.event)} className={`group relative flex min-h-72 flex-col overflow-hidden border p-6 shadow-[6px_6px_0_0_rgba(69,57,46,0.09)] transition-transform hover:-translate-y-1 lg:col-span-3 ${tool.surface}`}>
              <span className="absolute right-5 top-3 font-serif text-6xl font-black opacity-10" aria-hidden="true">{tool.to === '/prompt-lab' ? '02' : '03'}</span>
              <span className={`flex h-12 w-12 flex-none items-center justify-center border ${tool.iconTone}`}><Icon size={22} /></span>
              <span className="mt-auto block pt-7">
                <span className={`text-xs font-bold tracking-[0.16em] ${tool.muted}`}>每日更新 · 可生成海报</span>
                <span className="mt-3 block font-serif text-2xl font-black">{tool.title}</span>
                <span className={`mt-3 block text-sm leading-7 ${tool.muted}`}>{tool.description}</span>
              </span>
              <span className={`mt-5 flex items-center justify-between border-t pt-4 text-xs font-bold ${tool.divider}`}>
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
