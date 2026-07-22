import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import NbtiPage from './pages/NbtiPage'
import TipsPage from './pages/TipsPage'
import BoardsPage from './pages/BoardsPage'
import IpPage from './pages/IpPage'
import BookRadarPage from './pages/BookRadarPage'
import PromptLabPage from './pages/PromptLabPage'
import TrendsPage from './pages/TrendsPage'
import ToolsPage from './pages/ToolsPage'
import SubmissionGuidePage from './pages/SubmissionGuidePage'
import Nav from '@/sections/Nav'
import { trackEvent } from '@/hooks/useAnalytics'

function RouteObserver() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    trackEvent('page_view', { path: location.pathname })
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <>
      <RouteObserver />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nbti" element={<NbtiPage />} />
        <Route path="/nbti/:result" element={<NbtiPage />} />
        <Route path="/radar" element={<BookRadarPage />} />
        <Route path="/prompt-lab" element={<PromptLabPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/ip" element={<IpPage />} />
        <Route path="/submissions" element={<SubmissionGuidePage />} />
      </Routes>
    </>
  )
}
