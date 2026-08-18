import { usePageMeta } from '@/hooks/usePageMeta'
import Hero from '@/components/workbench/Hero'
import InteractiveCanvas from '@/components/workbench/InteractiveCanvas'
import CanvasFeatures from '@/components/workbench/CanvasFeatures'
import MoreFeatures from '@/components/workbench/MoreFeatures'
import DownloadSection from '@/components/workbench/DownloadSection'

export default function WorkbenchPage() {
  usePageMeta({
    title: '奶龙作者工作台',
    description:
      '以画布为核心的网文写作工作台：灵感画布多视图、AI 辅助、写作工具一体，数据保存在本机。',
    path: '/workbench',
  })

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      {/* 顶部深色渐变光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-rose-500/15 via-violet-500/10 to-transparent"
      />

      <div className="relative">
        <Hero />

        <section id="canvas-demo" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 sm:py-32">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-theme-950 sm:text-4xl">
              上手试试，这就是画布
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              拖动卡片、框选多选，亲自感受灵感画布的操作手感。
            </p>
          </div>
          <InteractiveCanvas />
        </section>

        <CanvasFeatures />
        <MoreFeatures />
        <DownloadSection />

        <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
          <p>奶龙作者工作台 · 本页面为产品介绍，作品数据均保存在用户本机 · © 网文风向</p>
        </footer>
      </div>
    </div>
  )
}
