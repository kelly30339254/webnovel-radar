import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import WritingTips from '@/sections/WritingTips'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function TipsPage() {
  const [title, setTitle] = useState('网文写作技巧')
  usePageMeta({ title: '网文写作技巧', description: '网文结构、节奏、爽点、人设与章末钩子的实用写作方法。', path: '/tips' })

  useEffect(() => {
    fetch('/data/writing-tips.json')
      .then((r) => r.json())
      .then((d) => {
        if (d?.tips?.length) {
          setTitle(`网文写作技巧 · ${d.tips.length} 条干货`)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#fff5f7] px-5 pb-12 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/70 px-3 py-1.5 text-xs text-rose-500 transition-colors hover:bg-white hover:text-rose-600"
          >
            <ArrowLeft size={12} />
            返回首页
          </Link>
          <h1 className="font-serif text-xl font-bold text-rose-950">{title}</h1>
        </div>
        <WritingTips />
      </div>
    </div>
  )
}
