import { useState } from 'react'
import { CalendarDays, ExternalLink, Menu, Sparkles, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { trackEvent } from '@/hooks/useAnalytics'
import { zhiyuUrl } from '@/lib/zhiyu'

const LINKS = [
  { to: '/', label: '今日风向', mobileLabel: '今日', summary: '今日判断与作者行动' },
  { to: '/trends', label: '风向数据', mobileLabel: '风向', summary: '热度、趋势与关键词' },
  { to: '/boards', label: '新书榜', mobileLabel: '榜单', summary: '男频与女频新书样本' },
  { to: '/tips', label: '写作技巧', mobileLabel: '技巧', summary: '结构、节奏与爽点' },
  { to: '/tools', label: '创作工具', mobileLabel: '工具', summary: '雷达、盲盒与找搭子' },
  { to: '/submissions', label: '投稿导航', mobileLabel: '投稿', summary: '编辑、平台与收稿要求' },
  { to: '/ip', label: '改编观察', mobileLabel: '改编', summary: '短剧与官方信号' },
] as const

const today = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date()).replaceAll('/', '-')

export default function Nav() {
  const [open, setOpen] = useState(false)
  const targetUrl = zhiyuUrl('site_nav')

  return (
    <nav className="sticky top-0 z-50 bg-theme-bg/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-5 pt-3 md:px-8 md:pt-5">
        <div className="flex min-h-16 items-center gap-4 pb-3 lg:gap-8">
          <Link to="/" className="group flex flex-none items-center gap-3" aria-label="网文风向首页">
            <img src="/assets/webnovel-radar-seal.png" alt="" className="h-12 w-12 border border-theme-700 object-cover sm:h-14 sm:w-14" />
            <span>
              <span className="block font-serif text-xl font-black leading-none tracking-[0.08em] text-theme-950 sm:text-2xl">网文风向</span>
              <span className="mt-1.5 hidden font-serif text-[9px] tracking-[0.3em] text-stone-700 sm:block">WEBNOVEL RADAR</span>
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {LINKS.slice(1).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `relative whitespace-nowrap px-3 py-3 font-serif text-base font-bold transition-colors ${isActive ? 'text-theme-700' : 'text-stone-800 hover:text-theme-700'}`}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && <span className="absolute inset-x-3 bottom-1 h-px bg-theme-600" aria-hidden="true" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-3 border-l border-stone-300 pl-7 text-theme-700 lg:flex">
              <CalendarDays size={21} />
              <time className="font-serif text-lg font-bold" dateTime={today}>{today}</time>
            </div>
            <ThemeSwitcher className="hidden sm:block" />
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center border border-theme-300 bg-transparent text-theme-800 xl:hidden"
              aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
              aria-expanded={open}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        <div className="space-y-1 pb-1" aria-hidden="true">
          <div className="h-0.5 bg-theme-600" />
          <div className="h-px bg-theme-600" />
        </div>
      </div>

      <div className="border-b border-theme-200 bg-theme-bg xl:hidden" aria-label="内容快捷导航">
        <div className="nav-scrollbar-hidden mx-auto flex max-w-[1440px] overflow-x-auto px-2">
          {LINKS.map((item) => (
            <NavLink
              key={`mobile-quick-${item.to}`}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `relative flex min-h-10 min-w-[3.25rem] flex-1 items-center justify-center px-1 text-[11px] font-bold transition-colors ${isActive ? 'text-theme-800' : 'text-stone-600 hover:text-theme-800'}`}
            >
              {({ isActive }) => (
                <>
                  <span>{item.mobileLabel}</span>
                  {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-theme-600" aria-hidden="true" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {open && (
        <div className="border-b border-theme-200 bg-theme-bg px-5 py-4 shadow-lg xl:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-2 sm:grid-cols-2">
            {LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex min-h-14 items-center justify-between border px-4 py-3 ${isActive ? 'border-theme-400 bg-white text-theme-950' : 'border-stone-200 text-theme-800 hover:border-theme-300 hover:bg-white'}`}
              >
                <span className="font-serif font-bold">{item.label}</span>
                <span className="text-[11px] text-stone-500">{item.summary}</span>
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
              className="flex min-h-12 items-center justify-center gap-2 bg-theme-800 px-4 py-3 text-sm font-bold text-white"
            >
              <Sparkles size={16} /> 打开智语写作 <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
