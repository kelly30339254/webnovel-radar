import { useState } from 'react'
import { ExternalLink, Menu, Sparkles, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { trackEvent } from '@/hooks/useAnalytics'
import { zhiyuUrl } from '@/lib/zhiyu'

const LINKS = [
  { to: '/', label: '首页', summary: '今日判断与行动' },
  { to: '/trends', label: '风向数据', summary: '热度、趋势、关键词' },
  { to: '/boards', label: '新书榜', summary: '男频与女频榜单' },
  { to: '/tips', label: '写作技巧', summary: '结构、节奏与爽点' },
  { to: '/tools', label: '创作工具', summary: '雷达、盲盒与找搭子' },
  { to: '/ip', label: '改编观察', summary: '短剧与官方信号' },
] as const

export default function Nav() {
  const [open, setOpen] = useState(false)
  const targetUrl = zhiyuUrl('site_nav')

  return (
    <nav className="sticky top-0 z-50 border-b border-theme-200/90 bg-white/95 shadow-sm shadow-theme-950/5 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-5 md:px-8">
        <Link to="/" className="group flex flex-none items-center gap-2.5" aria-label="网文风向首页">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-theme-700 font-serif text-sm font-bold text-white shadow-sm transition-transform group-hover:-rotate-3">
            风
          </span>
          <span>
            <span className="block font-serif text-base font-bold leading-none text-theme-950">网文风向</span>
            <span className="mt-1 hidden text-[10px] font-medium tracking-wider text-theme-500 sm:block">WEBNOVEL RADAR</span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-theme-100 text-theme-950'
                    : 'text-theme-700 hover:bg-theme-50 hover:text-theme-950'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeSwitcher />
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackEvent('click_zhiyu_writing', { placement: 'site_nav' })}
            className="hidden min-h-10 items-center gap-1.5 rounded-lg bg-theme-950 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-theme-800 sm:inline-flex"
          >
            <Sparkles size={15} /> AI 写作 <ExternalLink size={13} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-theme-200 bg-white text-theme-800 lg:hidden"
            aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-theme-100 bg-theme-bg px-5 py-4 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2">
            {LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-14 items-center justify-between rounded-lg border px-4 py-3 ${
                    isActive
                      ? 'border-theme-300 bg-white text-theme-950 shadow-sm'
                      : 'border-transparent text-theme-800 hover:border-theme-200 hover:bg-white'
                  }`
                }
              >
                <span className="font-bold">{item.label}</span>
                <span className="text-[11px] text-theme-500">{item.summary}</span>
              </NavLink>
            ))}
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => {
                setOpen(false)
                trackEvent('click_zhiyu_writing', { placement: 'site_nav' })
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-theme-950 px-4 py-3 text-sm font-bold text-white sm:hidden"
            >
              <Sparkles size={16} /> 打开智语写作 <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
