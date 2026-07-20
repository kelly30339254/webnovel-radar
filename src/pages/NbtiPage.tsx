import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import NbtiTester from '@/sections/NbtiTester'

export default function NbtiPage() {
  const [initialResult, setInitialResult] = useState<string | null>(null)

  useEffect(() => {
    // HashRouter 下查询参数在 # 后面，如 #/nbti?r=BSLJ
    const hash = window.location.hash || ''
    const search = hash.split('?')[1] || ''
    const params = new URLSearchParams(search)
    const r = params.get('r')
    if (r && /^[BNGS][LS][DQ][DJ]$/.test(r)) {
      setInitialResult(r)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#fff5f7] px-5 pb-12 pt-6 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/70 px-3 py-1.5 text-xs text-rose-500 transition-colors hover:bg-white hover:text-rose-600"
          >
            <ArrowLeft size={12} />
            返回首页
          </Link>
          <h1 className="font-serif text-xl font-bold text-rose-950">网文十六型人格测试</h1>
        </div>
        <NbtiTester standalone initialResult={initialResult} />
      </div>
    </div>
  )
}
