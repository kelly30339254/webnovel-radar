import { usePageMeta } from '@/hooks/usePageMeta'
import Hero from '@/components/assistant/Hero'
import FlowDemo from '@/components/assistant/FlowDemo'
import FeatureGrid from '@/components/assistant/FeatureGrid'
import DownloadSection from '@/components/assistant/DownloadSection'

export default function AssistantPage() {
  usePageMeta({
    title: '奶龙投稿助手',
    description:
      '邮箱批量自动投稿软件：多邮箱轮投、回信自动判定、内置 2481 位收稿编辑库，数据只保存在本机。',
    path: '/assistant',
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

        <section id="flow-demo" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 sm:py-32">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-theme-950 sm:text-4xl">
              自动投稿，是这样跑起来的
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              配好邮箱、导入文稿、选好编辑，剩下的交给投稿助手自动完成。
            </p>
          </div>
          <FlowDemo />
        </section>

        <FeatureGrid />
        <DownloadSection />

        <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
          <p>奶龙投稿助手 · 本页面为产品介绍，投稿数据均保存在用户本机 · © 网文风向</p>
        </footer>
      </div>
    </div>
  )
}
