import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import SectionTitle from '@/sections/SectionTitle'
import ViewMoreLink from '@/components/ViewMoreLink'
import { trackEvent } from '@/hooks/useAnalytics'

const TIPS_GUIDE_URL = 'https://qcnog55dveec.feishu.cn/wiki/UinlwatmmiwBhTkS9XWchGWMnKh?from=from_copylink'

type Tip = {
  id: string
  title: string
  category: string
  summary: string
  usage: string
}

type TipsData = {
  updatedAt: string
  tips: Tip[]
}

const CATEGORY_STYLE: Record<string, string> = {
  节奏: 'bg-theme-100 text-theme-700',
  结构: 'bg-pink-100 text-pink-700',
  套路: 'bg-fuchsia-100 text-fuchsia-700',
  开头: 'bg-amber-100 text-amber-700',
  人物: 'bg-emerald-100 text-emerald-700',
  情绪: 'bg-cyan-100 text-cyan-700',
  悬念: 'bg-violet-100 text-violet-700',
  设定: 'bg-blue-100 text-blue-700',
  爽点: 'bg-orange-100 text-orange-700',
  描写: 'bg-teal-100 text-teal-700',
  创新: 'bg-indigo-100 text-indigo-700',
}

export default function WritingTips({ showMore = true }: { showMore?: boolean }) {
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
        hint={`${data.tips.length} 条干货 · 已整理为一份完整手册`}
        right={
          <span className="flex flex-wrap items-center justify-end gap-2">
            {showMore && <ViewMoreLink to="/tips" />}
            <a
              href={TIPS_GUIDE_URL}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent('writing_tips_guide')}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-theme-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-theme-800"
            >
              查看完整技巧手册 <ExternalLink size={13} />
            </a>
          </span>
        }
        footer={
          <span>更新于 {data.updatedAt}</span>
        }
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.tips.map((tip, i) => (
          <div
            key={tip.id}
            className="card-pink flex flex-col rounded-lg border border-theme-200 bg-white p-5 shadow-sm"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  CATEGORY_STYLE[tip.category] ?? 'bg-theme-50 text-theme-600'
                }`}
              >
                {tip.category}
              </span>
              <h3 className="text-base font-bold text-theme-950">{tip.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-theme-700">{tip.summary}</p>
            <div className="mt-3 rounded-lg bg-theme-50 p-3">
              <p className="text-xs leading-relaxed text-theme-600">
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
