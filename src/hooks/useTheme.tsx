import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeColor = 'rose' | 'blue' | 'green' | 'purple' | 'amber'

interface ThemeContextValue {
  theme: ThemeColor
  setTheme: (theme: ThemeColor) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'webnovel-radar-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>(() => {
    if (typeof window === 'undefined') return 'rose'
    return (localStorage.getItem(STORAGE_KEY) as ThemeColor) || 'rose'
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
