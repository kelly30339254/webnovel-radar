import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export default function PageHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="border-b border-theme-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4 md:px-8">
        <Link to="/" className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-theme-300 bg-white px-3 py-1.5 text-xs font-semibold text-theme-800 hover:bg-theme-50">
          <ArrowLeft size={14} /> 返回首页
        </Link>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-lg font-bold text-theme-950 sm:text-xl">{title}</h1>
          {hint && <p className="mt-0.5 hidden text-xs font-medium text-theme-700 sm:block">{hint}</p>}
        </div>
        <ThemeSwitcher className="ml-auto flex-none" />
      </div>
    </header>
  )
}
