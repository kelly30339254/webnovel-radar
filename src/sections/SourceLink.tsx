import { trackEvent } from '@/hooks/useAnalytics'

export default function SourceLink({ url, label = '来源' }: { url?: string; label?: string }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      onClick={() => trackEvent('click_source', { url, label })}
      className="inline-flex flex-none items-center gap-0.5 rounded-full border border-theme-200 px-2 py-0.5 text-xs text-theme-600 transition-colors hover:border-theme-400 hover:bg-theme-50 hover:text-theme-600"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  )
}
