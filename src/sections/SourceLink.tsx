export default function SourceLink({ url, label = '来源' }: { url?: string; label?: string }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex flex-none items-center gap-0.5 rounded-full border border-rose-200 px-2 py-0.5 text-xs text-rose-400 transition-colors hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  )
}
