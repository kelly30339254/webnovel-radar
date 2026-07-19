import type { ReactNode } from 'react'

export default function SectionTitle({
  id,
  title,
  hint,
  right,
}: {
  id: string
  title: string
  hint?: string
  right?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-b border-rose-200 pb-2">
      <svg width="15" height="15" viewBox="0 0 24 24" className="flex-none" aria-hidden="true">
        <path
          d="M12 3c.7 4.5 2.5 6.8 8 8-5.5 1.2-7.3 3.5-8 8-.7-4.5-2.5-6.8-8-8 5.5-1.2 7.3-3.5 8-8Z"
          fill="#fb7185"
        />
      </svg>
      <h2 id={id} className="font-serif text-2xl font-bold text-rose-950">
        {title}
      </h2>
      {hint && <span className="text-xs text-rose-400">{hint}</span>}
      {right && <span className="ml-auto">{right}</span>}
    </div>
  )
}
