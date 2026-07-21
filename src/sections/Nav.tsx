import { ThemeSwitcher } from '@/components/ThemeSwitcher'

const LINKS = [
  { href: '/radar', label: '开书雷达' },
  { href: '#direction', label: '近期方向' },
  { href: '#book-recs', label: '创作切口' },
  { href: '#partners', label: '找搭子' },
  { href: '#genres', label: '题材热度' },
  { href: '#trend', label: '趋势' },
]

export default function Nav({ updatedAt }: { updatedAt: string }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-theme-200/80 bg-white/90 shadow-sm shadow-theme-950/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-2.5 md:px-8">
        <a href="#" className="flex flex-none items-center gap-2" aria-label="网文风向首页">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-theme-700 text-[11px] font-bold text-white shadow-sm">
            风
          </span>
          <span className="font-serif text-sm font-bold text-theme-950">网文风向</span>
        </a>
        <span className="hidden font-mono text-[11px] font-medium text-theme-700 sm:inline">风向 {updatedAt}</span>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <div className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium text-theme-800 transition-colors hover:bg-theme-50 hover:text-theme-950"
              >
                {l.label}
              </a>
            ))}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}
