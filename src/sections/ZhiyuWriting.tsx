import SectionTitle from '@/sections/SectionTitle'
import SourceLink from '@/sections/SourceLink'
import { trackEvent } from '@/hooks/useAnalytics'
import { Sparkles, Wand2, FileText } from 'lucide-react'

const FEATURES = [
  { icon: Sparkles, text: 'AI 辅助，高效写作' },
  { icon: Wand2, text: '3 分钟生成万字大纲' },
  { icon: FileText, text: '从大纲到成文，一路智能陪伴' },
]

const EXAMPLE_TEXT = '主角被退婚后，意外觉醒了签到系统……'

export default function ZhiyuWriting() {
  const targetUrl = `https://zhiyuxiezuo.com/login?invited=HKMLyO`
  return (
    <section className="mt-14">
      <SectionTitle
        id="zhiyu-writing"
        title="智语写作"
        hint="AI 辅助创作工具"
        right={<SourceLink url={targetUrl} label="免费试用" />}
      />
      <a
        href={targetUrl}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => trackEvent('click_zhiyu_writing')}
        className="card-pink group mt-4 block rounded-2xl border border-theme-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-theme-200 hover:bg-white hover:shadow-md"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex-none">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-theme-100 bg-gradient-to-br from-theme-50 to-pink-100 p-1 shadow-inner">
              <img
                src="/images/zhiyuxiezuo.png"
                alt="智语写作"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-theme-950">智语写作</h3>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <span
                  key={f.text}
                  className="inline-flex items-center gap-1 rounded-full bg-theme-50 px-2.5 py-0.5 text-xs font-medium text-theme-600"
                >
                  <f.icon size={10} />
                  {f.text}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-theme-700">点击跳转，开启 AI 写作新体验 ↗</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-theme-100 bg-theme-50/40 p-4 transition-colors group-hover:bg-theme-50/70">
          <p className="text-xs font-medium text-theme-700">AI 续写示例</p>
          <p className="mt-1 text-sm text-theme-700">
            “{EXAMPLE_TEXT}”
            <span className="ml-2 inline-flex items-center rounded-full bg-theme-500 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              去智语看看怎么接
            </span>
          </p>
        </div>
      </a>
    </section>
  )
}
