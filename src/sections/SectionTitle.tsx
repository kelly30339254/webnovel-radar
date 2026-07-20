import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

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
        <div className="absolute bottom-0 left-0 h-0.5 w-16 rounded-full bg-theme-500" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-theme-200" />
        <Sparkles size={17} className="flex-none text-theme-500" aria-hidden="true" />
        <h2 id={id} className="font-serif text-2xl font-bold text-theme-950">
          {title}
        </h2>
        {hint && <span className="text-xs font-medium text-theme-700">{hint}</span>}
        {right && <span className="ml-auto">{right}</span>}
      </div>
      {footer && <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-theme-700">{footer}</div>}
    </div>
  )
}
