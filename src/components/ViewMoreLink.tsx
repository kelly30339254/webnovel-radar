import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

export default function ViewMoreLink({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-0.5 rounded-full border border-theme-200 px-2.5 py-0.5 text-xs text-theme-700 transition-colors hover:border-theme-400 hover:bg-theme-50 hover:text-theme-600"
    >
      查看完整页面
      <ArrowRight size={10} />
    </Link>
  )
}
