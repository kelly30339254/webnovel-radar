import PageHeader from '@/components/PageHeader'
import IpHot from '@/sections/IpHot'
import AdaptWatch from '@/sections/AdaptWatch'
import Announcements from '@/sections/Announcements'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useWindData } from '@/hooks/useWindData'

export default function IpPage() {
  const { data } = useWindData()
  usePageMeta({ title: 'IP 改编热点', description: '红果短剧、漫剧与 AI 剧热播信号，以及网文改编方向。', path: '/ip' })
  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="改编观察" hint="从短剧热播、官方扶持和征文信号，判断哪些故事更适合被看见。" />
      <main className="mx-auto max-w-6xl px-5 pb-14 md:px-8">
        <IpHot showViewMore={false} />
        {data && (
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <AdaptWatch items={data.adaptWatch ?? []} />
            <Announcements items={data.announcements ?? []} />
          </div>
        )}
      </main>
    </div>
  )
}
