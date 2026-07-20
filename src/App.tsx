import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import NbtiPage from './pages/NbtiPage'
import TipsPage from './pages/TipsPage'
import BoardsPage from './pages/BoardsPage'
import IpPage from './pages/IpPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nbti" element={<NbtiPage />} />
      <Route path="/tips" element={<TipsPage />} />
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/ip" element={<IpPage />} />
    </Routes>
  )
}
