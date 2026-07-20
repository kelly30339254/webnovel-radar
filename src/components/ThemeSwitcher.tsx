import { useTheme, type ThemeColor } from '@/hooks/useTheme'
import { Palette } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const THEMES: { key: ThemeColor; label: string; dot: string }[] = [
  { key: 'rose', label: '粉', dot: 'bg-rose-500' },
  { key: 'blue', label: '蓝', dot: 'bg-blue-500' },
  { key: 'green', label: '绿', dot: 'bg-emerald-500' },
  { key: 'purple', label: '紫', dot: 'bg-violet-500' },
  { key: 'amber', label: '橙', dot: 'bg-amber-500' },
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
        className="inline-flex items-center gap-1.5 rounded-full border border-theme-200 bg-white/80 px-2.5 py-1 text-xs text-theme-600 backdrop-blur-sm transition-colors hover:bg-theme-50"
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
        <div className="absolute right-0 top-full z-50 mt-2 w-28 rounded-xl border border-theme-200 bg-white/95 p-1.5 shadow-lg shadow-theme-900/5 backdrop-blur-md">
          {THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTheme(t.key)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                theme === t.key ? 'bg-theme-50 text-theme-700' : 'text-theme-600 hover:bg-theme-50/70'
              }`}
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
