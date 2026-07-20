import SectionTitle from '@/sections/SectionTitle'
import SourceLink from '@/sections/SourceLink'

const SLOGANS = [
  'AI 辅助，高效写作！',
  '灵感不卡壳，日更更轻松',
  '从大纲到成文，一路智能陪伴',
]

export default function ZhiyuWriting() {
  return (
    <section className="mt-14">
      <SectionTitle
        id="zhiyu-writing"
        title="智语写作"
        hint="AI 辅助创作工具"
        right={<SourceLink url="https://zhiyuxiezuo.com/login?invited=HKMLyO" label="前往" />}
      />
      <a
        href="https://zhiyuxiezuo.com/login?invited=HKMLyO"
        target="_blank"
        rel="noreferrer noopener"
        className="card-pink mt-4 flex items-center gap-5 rounded-2xl border border-rose-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-rose-200 hover:bg-white"
      >
        <div className="flex-none">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-pink-100 p-1 shadow-inner">
            <img
              src="/images/zhiyuxiezuo.png"
              alt="智语写作"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-rose-950">智语写作</h3>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {SLOGANS.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-rose-400">点击跳转，开启 AI 写作新体验 ↗</p>
        </div>
      </a>
    </section>
  )
}
