import SectionTitle from '@/sections/SectionTitle'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export default function WriterPersonality() {
  return (
    <section className="mt-10">
      <SectionTitle id="writer-personality" title="网文十六型人格" hint="沙雕版 NBTI 测试" />
      <Link
        to="/nbti"
        className="card-pink mt-4 flex items-center gap-5 rounded-2xl border border-theme-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-theme-200 hover:bg-white"
      >
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-gradient-to-br from-theme-100 to-pink-100 text-3xl shadow-inner">
          📝
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-theme-950">测测你的网文十六型人格</h3>
          <p className="mt-1 text-sm text-theme-700">20 道题，测出你到底是爆更狂魔还是万年鸽王</p>
        </div>
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-theme-500 text-white shadow-sm">
          <ArrowRight size={16} />
        </span>
      </Link>
    </section>
  )
}
