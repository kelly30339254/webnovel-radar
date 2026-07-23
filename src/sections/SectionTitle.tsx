import type { ReactNode } from 'react'
import { Feather } from 'lucide-react'

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
    <div className="relative pb-4">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-theme-400/70" aria-hidden="true" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h2 id={id} className="font-serif text-2xl font-black tracking-[0.08em] text-theme-700 sm:text-3xl">{title}</h2>
            <Feather size={20} className="hidden text-theme-700 sm:block" aria-hidden="true" />
          </div>
          {hint && <p className="mt-1 text-[11px] tracking-[0.12em] text-stone-500">{hint}</p>}
        </div>
        <span className="h-px flex-1 bg-theme-400/70" aria-hidden="true" />
      </div>
      {right && <div className="mt-3 flex justify-center sm:absolute sm:right-0 sm:top-0 sm:mt-0">{right}</div>}
      {footer && <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-500">{footer}</div>}
    </div>
  )
}
