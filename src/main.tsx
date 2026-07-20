import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from '@/hooks/useAnalytics'

function Bootstrap() {
  useEffect(() => {
    initAnalytics()
  }, [])
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Bootstrap />
    </HashRouter>
  </StrictMode>,
)
