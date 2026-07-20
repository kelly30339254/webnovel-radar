import type { ReactNode } from 'react'

export default function SectionTitle({
  id,
  title,
  hint,
  right,
  footer,
}: {
  id: string
  title: string
  hint?: string
  right?: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative pb-3">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <div className="absolute bottom-0 left-0 h-0.5 w-16 rounded-full bg-gradient-to-r from-theme-400 to-theme-300" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-theme-100" />
        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-none" aria-hidden="true">
          <path
            d="M12 3c.7 4.5 2.5 6.8 8 8-5.5 1.2-7.3 3.5-8 8-.7-4.5-2.5-6.8-8-8 5.5-1.2 7.3-3.5 8-8Z"
            fill="hsl(var(--theme-400))"
          />
        </svg>
        <h2 id={id} className="font-serif text-2xl font-bold text-theme-950">
          {title}
        </h2>
        {hint && <span className="text-xs text-theme-600">{hint}</span>}
        {right && <span className="ml-auto">{right}</span>}
      </div>
      {footer && <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-theme-600">{footer}</div>}
    </div>
  )
}
