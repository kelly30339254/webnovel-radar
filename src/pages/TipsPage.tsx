import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
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
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title={title} hint="按开头、结构、节奏、人物与爽点分类查找，直接解决当前写作卡点。" />
      <main className="mx-auto max-w-[1440px] px-5 pb-14 md:px-8">
        <WritingTips />
      </main>
    </div>
  )
}
