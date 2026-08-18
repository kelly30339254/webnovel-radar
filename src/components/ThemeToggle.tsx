import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const LIGHT_THEME_COLOR = '#fff5f7'
const DARK_THEME_COLOR = '#0d0a14'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  useEffect(() => {
    if (!resolvedTheme) return
    const color = resolvedTheme === 'light' ? LIGHT_THEME_COLOR : DARK_THEME_COLOR
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }, [resolvedTheme])

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 text-theme-700 transition-colors hover:bg-white/10"
      aria-label={isLight ? '切换到深色模式' : '切换到浅色模式'}
      title={isLight ? '切换到深色模式' : '切换到浅色模式'}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
