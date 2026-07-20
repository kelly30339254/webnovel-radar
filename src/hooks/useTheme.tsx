/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeColor = 'rose' | 'blue' | 'green' | 'purple' | 'amber'

interface ThemeContextValue {
  theme: ThemeColor
  setTheme: (theme: ThemeColor) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'webnovel-radar-theme'
const THEMES: ThemeColor[] = ['rose', 'blue', 'green', 'purple', 'amber']

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'rose'
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeColor | null
    return saved && THEMES.includes(saved) ? saved : 'rose'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (next: ThemeColor) => setThemeState(next)

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
