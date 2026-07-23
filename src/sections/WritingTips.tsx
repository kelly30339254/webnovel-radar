import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import SectionTitle from '@/sections/SectionTitle'

const TIPS_GUIDE_URL = 'https://qcnog55dveec.feishu.cn/wiki/UinlwatmmiwBhTkS9XWchGWMnKh?from=from_copylink'

type Tip = {
  id: string
  title: string
  category: string
  summary: string
  usage: string
  sourceUrl: string
}

type TipsData = {
  updatedAt: string
  tips: Tip[]
}

const CATEGORY_STYLE: Record<string, string> = {
  节奏: 'border-theme-500 text-theme-700',
  结构: 'border-theme-500 text-theme-700',
  套路: 'border-[#174c43] text-[#174c43]',
  开头: 'border-amber-600 text-amber-800',
  人物: 'border-[#174c43] text-[#174c43]',
  情绪: 'border-theme-500 text-theme-700',
  悬念: 'border-stone-500 text-stone-700',
  设定: 'border-[#174c43] text-[#174c43]',
  爽点: 'border-amber-600 text-amber-800',
  描写: 'border-stone-500 text-stone-700',
  创新: 'border-theme-500 text-theme-700',
}

export default function WritingTips() {
  const [data, setData] = useState<TipsData | null>(null)

  useEffect(() => {
    fetch('/data/writing-tips.json')
      .then((r) => r.json())
      .then((d: TipsData) => setData(d))
      .catch(() => setData(null))
  }, [])

  if (!data) return null

  return (
    <section className="mt-16">
      <SectionTitle
        id="writing-tips"
        title="网文写作技巧"
        hint={`${data.tips.length} 条实用方法 · 按当前卡点选择`}
        right={
          <a
            href={TIPS_GUIDE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-9 items-center gap-1.5 border border-theme-400 bg-white/70 px-3 py-1.5 text-xs font-semibold text-theme-700 transition-colors hover:bg-theme-50 hover:text-theme-950"
          >
            完整技巧文档 <ExternalLink size={13} />
          </a>
        }
        footer={
          <>
            <span>更新于 {data.updatedAt}</span>
            <span>来源：网络公开写作教程与作者经验分享</span>
          </>
        }
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.tips.map((tip, i) => (
          <div
            key={tip.id}
            className="flex flex-col border border-stone-300 bg-white/65 p-5"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`border px-2 py-0.5 text-xs font-semibold ${
                  CATEGORY_STYLE[tip.category] ?? 'border-theme-500 text-theme-700'
                }`}
              >
                {tip.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-theme-950">{tip.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-700">{tip.summary}</p>
            <div className="mt-4 border-l-2 border-theme-500 bg-stone-50/70 p-3">
              <p className="text-xs leading-relaxed text-stone-600">
                <span className="font-semibold text-theme-800">用法：</span>
                {tip.usage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
