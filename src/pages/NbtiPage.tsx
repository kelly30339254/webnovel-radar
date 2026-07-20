import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import NbtiTester from '@/sections/NbtiTester'
import { isResultKey, NBTI_RESULTS } from '@/lib/nbti'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function NbtiPage() {
  const { result } = useParams()
  const initialResult = isResultKey(result) ? result : null
  usePageMeta({
    title: initialResult ? `我的网文创作人格是「${NBTI_RESULTS[initialResult].name}」` : '网文十六型人格测试',
    description: '20 道题测出你的网文创作人格，并获得适合题材、四维创作画像与分享海报。',
    path: initialResult ? `/nbti/${initialResult}` : '/nbti',
  })

  return (
    <div className="min-h-screen bg-[hsl(var(--theme-bg))] px-5 pb-12 pt-6 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full border border-theme-200 bg-white/70 px-3 py-1.5 text-xs text-theme-500 transition-colors hover:bg-white hover:text-theme-600"
          >
            <ArrowLeft size={12} />
            返回首页
          </Link>
          <h1 className="font-serif text-xl font-bold text-theme-950">网文十六型人格测试</h1>
        </div>
        <NbtiTester key={initialResult ?? 'quiz'} standalone initialResult={initialResult} />
      </div>
    </div>
  )
}
