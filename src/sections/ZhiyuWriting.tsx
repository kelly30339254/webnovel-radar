import { BookOpen, ExternalLink, GitBranch, Layers3, Wand2 } from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'
import { zhiyuUrl } from '@/lib/zhiyu'
import SectionTitle from '@/sections/SectionTitle'

const OUTPUTS = [
  { icon: GitBranch, title: '故事主线', text: '把核心设定拆成可持续推进的矛盾链' },
  { icon: Layers3, title: '章节节拍', text: '安排阶段目标、升级节点和章末钩子' },
  { icon: BookOpen, title: '人物关系', text: '明确人物想要什么、关系怎么变、情绪落到什么结果' },
]

export default function ZhiyuWriting() {
  const targetUrl = zhiyuUrl('home_bridge')

  return (
    <section id="zhiyu-writing" className="mt-14 scroll-mt-24" aria-labelledby="zhiyu-writing-title">
      <SectionTitle
        id="zhiyu-writing-title"
        title="从选题到成稿"
        hint="由智语写作提供"
        footer={
          <>
            <span>开书方向确认后继续生成大纲</span>
            <span>跳转不会上传本站生成内容</span>
          </>
        }
      />

      <div className="mt-5 overflow-hidden border-y border-theme-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
          <div className="order-2 px-5 py-7 sm:px-7 sm:py-8 lg:order-1">
            <p className="text-xs font-semibold text-theme-600">NEXT STEP · OUTLINE</p>
            <h3 className="mt-2 max-w-2xl font-serif text-3xl font-bold leading-tight text-theme-950 sm:text-4xl">
              方向有了，把它继续写成大纲
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-theme-700">
              完成开书雷达或命题盲盒后，带着题材、人设和核心冲突进入智语写作，继续拆人物关系、故事主线与章节节拍。
            </p>

            <div className="mt-6 border-l-4 border-theme-accent bg-theme-accent-soft px-4 py-3">
              <p className="text-[11px] font-semibold text-theme-600">示例输入</p>
              <p className="mt-1 text-sm font-bold text-theme-950">都市脑洞 · 身份反转 · 直播验证</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {OUTPUTS.map((output) => {
                const Icon = output.icon
                return (
                  <div key={output.title} className="flex items-start gap-3">
                    <Icon className="mt-0.5 flex-none text-theme-500" size={17} />
                    <div>
                      <p className="text-sm font-bold text-theme-950">{output.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-theme-600">{output.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <aside className="order-1 flex flex-col justify-center bg-theme-accent-soft px-6 py-7 sm:px-7 lg:order-2 lg:py-8">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}images/zhiyuxiezuo.png`} alt="智语写作" className="h-11 w-11 rounded-lg object-cover shadow-sm" />
              <div>
                <p className="text-sm font-bold text-theme-950">智语写作</p>
                <p className="text-xs text-theme-600">AI 辅助创作工具</p>
              </div>
            </div>
            <p className="mt-6 text-sm font-semibold leading-relaxed text-theme-950">先免费生成一个大纲，看看这本书能不能继续往下写。</p>
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent('click_zhiyu_writing', { placement: 'home_bridge' })}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-theme-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-theme-800"
            >
              <Wand2 size={18} /> 免费生成一个大纲 <ExternalLink size={15} />
            </a>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-theme-600">将在新标签页打开智语写作</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
