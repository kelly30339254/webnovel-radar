import { ExternalLink, Wand2 } from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'
import { zhiyuUrl } from '@/lib/zhiyu'
import type { ZhiyuPlacement } from '@/lib/zhiyu'

export default function ZhiyuNextStep({
  title,
  description,
  placement,
}: {
  title: string
  description: string
  placement: ZhiyuPlacement
}) {
  return (
    <aside className="flex flex-col gap-4 border-t border-theme-200 bg-theme-accent-soft px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white text-theme-700 shadow-sm">
          <Wand2 size={18} />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-theme-600">下一步 · 继续创作</p>
          <p className="mt-1 text-sm font-bold text-theme-950">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-theme-700">{description}</p>
        </div>
      </div>
      <a
        href={zhiyuUrl(placement)}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => trackEvent('click_zhiyu_writing', { placement })}
        className="inline-flex min-h-10 flex-none items-center justify-center gap-2 rounded-lg bg-theme-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-theme-800"
      >
        免费生成大纲 <ExternalLink size={15} />
      </a>
    </aside>
  )
}
