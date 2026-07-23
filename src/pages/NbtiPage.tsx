import { useParams } from 'react-router'
import NbtiTester from '@/sections/NbtiTester'
import { isResultKey, NBTI_RESULTS } from '@/lib/nbti'
import { usePageMeta } from '@/hooks/usePageMeta'
import PageHeader from '@/components/PageHeader'

export default function NbtiPage() {
  const { result } = useParams()
  const initialResult = isResultKey(result) ? result : null
  usePageMeta({
    title: initialResult ? `我的网文创作人格是「${NBTI_RESULTS[initialResult].name}」` : '网文十六型人格测试',
    description: '用 20 道题看看你的网文写作习惯，并获得适合题材、具体建议和分享海报。',
    path: initialResult ? `/nbti/${initialResult}` : '/nbti',
  })

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="网文十六型人格测试" hint="20 道题，生成你的四维创作档案" />
      <main className="mx-auto max-w-3xl px-5 pb-12 pt-8 md:px-8">
        <NbtiTester key={initialResult ?? 'quiz'} standalone initialResult={initialResult} />
      </main>
    </div>
  )
}
