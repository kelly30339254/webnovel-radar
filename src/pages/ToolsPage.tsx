import PageHeader from '@/components/PageHeader'
import { usePageMeta } from '@/hooks/usePageMeta'
import BookRecs from '@/sections/BookRecs'
import GrowthTools from '@/sections/GrowthTools'

export default function ToolsPage() {
  usePageMeta({
    title: '网文创作工具',
    description: '开书雷达、命题盲盒、创作人格和创作切口入口。',
    path: '/tools',
  })

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="创作工具" hint="从选题评估到故事生成，把想法推进成可执行的开书计划。" />
      <main className="mx-auto max-w-[1440px] px-5 pb-14 md:px-8">
        <GrowthTools />
        <BookRecs />
      </main>
    </div>
  )
}
