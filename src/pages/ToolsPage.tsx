import PageHeader from '@/components/PageHeader'
import { usePageMeta } from '@/hooks/usePageMeta'
import BookRecs from '@/sections/BookRecs'
import GrowthTools from '@/sections/GrowthTools'
import WritingPartners from '@/sections/WritingPartners'

export default function ToolsPage() {
  usePageMeta({
    title: '网文创作工具',
    description: '开书雷达、命题盲盒、创作人格、创作切口和写作搭子入口。',
    path: '/tools',
  })

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="创作工具" hint="从选题评估、故事生成到找搭子，把想法推进成可执行的开书计划。" />
      <main className="mx-auto max-w-6xl px-5 pb-14 md:px-8">
        <GrowthTools />
        <BookRecs />
        <WritingPartners />
      </main>
    </div>
  )
}
