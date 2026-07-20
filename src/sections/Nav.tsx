const LINKS = [
  { href: '/radar', label: '开书雷达' },
  { href: '/prompt-lab', label: '命题盲盒' },
  { href: '#genres', label: '题材热度' },
  { href: '#trend', label: '趋势' },
  { href: '/nbti', label: '创作人格' },
]

export default function Nav({ updatedAt }: { updatedAt: string }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-rose-100/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-2.5 md:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-400 text-[11px] font-bold text-white shadow-sm">
            风
          </span>
          <span className="font-serif text-sm font-bold text-rose-950">网文风向</span>
        </a>
        <span className="hidden font-mono text-[11px] text-rose-300 sm:inline">{updatedAt}</span>
        <div className="ml-auto flex items-center gap-1 overflow-x-auto">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
