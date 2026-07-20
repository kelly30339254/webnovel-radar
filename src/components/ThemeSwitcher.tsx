import { useTheme, type ThemeColor } from '@/hooks/useTheme'
import { Palette } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const THEMES: { key: ThemeColor; label: string; dot: string }[] = [
  { key: 'rose', label: '蔷薇粉', dot: 'bg-rose-600' },
  { key: 'blue', label: '海岸蓝', dot: 'bg-blue-600' },
  { key: 'green', label: '青叶绿', dot: 'bg-emerald-600' },
  { key: 'purple', label: '墨紫', dot: 'bg-violet-600' },
  { key: 'amber', label: '暖橙', dot: 'bg-amber-600' },
]

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-theme-300 bg-white px-2.5 py-1 text-xs font-semibold text-theme-800 shadow-sm transition-colors hover:bg-theme-50"
        aria-label="切换主题色"
        aria-expanded={open}
      >
        <Palette size={13} />
        <span className="hidden sm:inline">主题</span>
        <span
          className={`h-2.5 w-2.5 rounded-full ${THEMES.find((t) => t.key === theme)?.dot ?? 'bg-theme-500'}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-theme-200 bg-white p-1.5 shadow-xl shadow-theme-950/10">
          {THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTheme(t.key)
                setOpen(false)
              }}
              className={`flex min-h-9 w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                theme === t.key ? 'bg-theme-100 text-theme-950' : 'text-theme-800 hover:bg-theme-50'
              }`}
              aria-pressed={theme === t.key}
            >
              <span className={`h-3.5 w-3.5 rounded-full ${t.dot}`} aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
