import IpHot from '@/sections/IpHot'
import { usePageMeta } from '@/hooks/usePageMeta'
import PageHeader from '@/components/PageHeader'

export default function IpPage() {
  usePageMeta({ title: 'IP 改编热点', description: '红果短剧、漫剧与 AI 剧热播信号，以及网文改编方向。', path: '/ip' })
  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="IP 改编热点" hint="短剧、漫剧与 AI 剧的改编方向" />
      <main className="mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-8">
        <IpHot />
      </main>
    </div>
  )
}
