import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export default function PageHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="border-b border-rose-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4 md:px-8">
        <Link to="/" className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50">
          <ArrowLeft size={14} /> 返回首页
        </Link>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-lg font-bold text-rose-950 sm:text-xl">{title}</h1>
          {hint && <p className="mt-0.5 hidden text-xs text-rose-400 sm:block">{hint}</p>}
        </div>
      </div>
    </header>
  )
}

