import { Link } from 'react-router'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CircleAlert,
  Compass,
  ExternalLink,
  Feather,
  Gauge,
  ListChecks,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { trackEvent } from '@/hooks/useAnalytics'
import { buildGenreSignals, formatDelta } from '@/lib/genreSignals'
import type { GenreSignal } from '@/lib/genreSignals'
import type { Board, GenreHeat, HistoryData } from '@/types/wind'

function radarPath(name: string): string {
  const channel = /现言|青春|甜宠|宫斗|宅斗|豪门|古言|女频/.test(name) ? 'female' : 'male'
  return `/radar?channel=${channel}&genre=${encodeURIComponent(name)}`
}

function actionFor(signal: GenreSignal): string {
  if (signal.stage === 'insufficient') return '先积累至少 4 个历史样本，再判断趋势；今天只记录标题和人设变化。'
  if (signal.crowding >= 85) return '题材能写，但至少替换主角职业、核心机制、关系矛盾中的两项。'
  if (signal.delta7 >= 4) return '先写强目标开场，用前三章验证读者是否愿意追更，不急着囤长篇。'
  if (signal.delta7 < 0) return '保留题材母题，把开篇冲突换成更具体、可兑现的新承诺。'
  return '把题材优势落在人设反差与连续兑现上，不依赖题材名本身制造期待。'
}

function sampleInsight(title: string): string {
  if (/高考|出分|录取/.test(title)) return '用明确时间节点制造倒计时，再用结果反转建立第一章承诺。'
  if (/穿|成为|入宫/.test(title)) return '开头直接交代身份突变，读者能迅速判断处境、目标与风险。'
  if (/系统|兑换|破译/.test(title)) return '机制词可被一句话复述，卖点天然适合前三章连续兑现。'
  if (/财阀|太子爷|总裁|哥哥/.test(title)) return '以高识别身份配关系越界，点击点清晰，但同质化风险也高。'
  return '标题先给事件与反差，不只报题材；简介需要继续说明代价和下一步目标。'
}

function EditorialTitle({ id, title, hint }: { id: string; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-theme-400/70" aria-hidden="true" />
      <div className="text-center">
        <h2 id={id} className="font-serif text-3xl font-black tracking-[0.12em] text-theme-700">{title}</h2>
        <p className="mt-1 text-[11px] tracking-[0.18em] text-stone-500">{hint}</p>
      </div>
      <span className="h-px flex-1 bg-theme-400/70" aria-hidden="true" />
    </div>
  )
}

function metric(signal: GenreSignal) {
  return `热度 ${signal.heat} · 7日 ${formatDelta(signal.delta7)} · 拥挤 ${signal.crowding}`
}

export default function TodayDecisions({
  genres,
  history,
  boards,
  updatedAt,
  sourceDate,
}: {
  genres: GenreHeat[]
  history: HistoryData | null
  boards: Board[]
  updatedAt?: string
  sourceDate?: string
}) {
  const signals = buildGenreSignals(genres, history, boards)
  const eligible = signals.filter((signal) => signal.confidence !== '低' && signal.stage !== 'insufficient')
  const ranked = [...eligible].sort((a, b) => {
    const aScore = a.delta7 * 2 + a.acceleration + (100 - a.crowding) * 0.15
    const bScore = b.delta7 * 2 + b.acceleration + (100 - b.crowding) * 0.15
    return bScore - aScore
  })
  const opportunity = ranked[0] ?? signals[0]
  const crowded = [...eligible]
    .filter((signal) => signal.name !== opportunity?.name)
    .sort((a, b) => b.crowding - a.crowding)[0] ?? eligible[1] ?? opportunity
  const cooling = [...eligible].sort((a, b) => a.delta7 - b.delta7)[0] ?? opportunity
  if (!opportunity || !crowded || !cooling) return null

  const topBooks = boards.flatMap((board) => board.books.slice(0, 2).map((book) => ({ ...book, channel: board.channel, sourceUrl: board.sourceUrl })))
  const reliableCount = signals.filter((signal) => signal.confidence !== '低').length
  const observationCount = signals.length - reliableCount
  const opportunityNote = genres.find((genre) => genre.name === opportunity.name)?.note

  const featured = [
    {
      label: '优先研究',
      signal: opportunity,
      icon: ArrowUpRight,
      color: 'text-theme-700 border-theme-400',
      summary: opportunityNote ?? '近期动能与榜单反馈同步增强，适合进入小样验证。',
    },
    {
      label: '高热但拥挤',
      signal: crowded,
      icon: CircleAlert,
      color: 'text-[#174c43] border-[#5a867e]',
      summary: genres.find((genre) => genre.name === crowded.name)?.note ?? '有市场识别度，但需要更强的人设或机制差异。',
    },
  ]

  return (
    <div className="pb-14">
      <section id="direction" className="scroll-mt-28 pt-10" aria-labelledby="featured-title">
        <EditorialTitle id="featured-title" title="传播精选" hint="先看结论，再决定今天写什么" />
        <div className="mt-7 grid border-y border-stone-300 lg:grid-cols-2 lg:divide-x lg:divide-stone-300">
          {featured.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="grid gap-5 border-b border-stone-300 px-2 py-7 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:px-6 lg:border-b-0">
                <div className="flex items-center justify-center">
                  <div className={`flex h-28 w-28 items-center justify-center rounded-full border ${item.color}`}>
                    <Icon size={42} strokeWidth={1.25} />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className={`text-xs font-bold tracking-[0.22em] ${item.color.split(' ')[0]}`}>{item.label}</p>
                  <h3 className="mt-2 font-serif text-3xl font-black text-theme-950">{item.signal.name}</h3>
                  <p className="mt-2 font-mono text-xs text-stone-500">{metric(item.signal)} · 置信度{item.signal.confidence}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{item.summary}</p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-theme-900">{actionFor(item.signal)}</p>
                  <Link
                    to={radarPath(item.signal.name)}
                    onClick={() => trackEvent('direction_to_radar', { genre: item.signal.name })}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-bold text-theme-700 hover:text-theme-950"
                  >
                    带入开书雷达 <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="fit-title">
        <EditorialTitle id="fit-title" title="先判断是否适合你" hint="赛道不是答案，产能与切口才是" />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <article className="border-t-2 border-[#174c43] bg-white/70 p-6">
            <div className="flex items-center gap-2 text-[#174c43]"><ShieldCheck size={20} /><h3 className="font-serif text-xl font-bold">更适合这样的作者</h3></div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              <li>能在前三章讲清一条新规则，并连续兑现至少两次。</li>
              <li>愿意先完成 1.5—3 万字小样，用点击、三章追读和评论验证。</li>
              <li>能把“{opportunity.name}”落到具体职业、关系和可见代价，而非只堆标签。</li>
            </ul>
          </article>
          <article className="border-t-2 border-theme-600 bg-white/70 p-6">
            <div className="flex items-center gap-2 text-theme-700"><CircleAlert size={20} /><h3 className="font-serif text-xl font-bold">谨慎进入的情况</h3></div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              <li>只能复制榜首标题句式，尚未找到不同的人物目标与成长发动机。</li>
              <li>更新节奏偏慢，却准备直接押注正在快速变化的热点。</li>
              <li>把单日上榜当成趋势；当前另有 {observationCount} 个题材因样本不足只作观察。</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="radar-title">
        <EditorialTitle id="radar-title" title="赛道机会雷达" hint="热度 × 动能 × 拥挤度 × 样本可信度" />
        <div className="mt-7 overflow-hidden border-y border-stone-300 bg-white/55">
          {signals.map((signal, index) => (
            <article key={signal.name} className={`grid items-center gap-4 px-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)_5rem_8rem] ${index ? 'border-t border-stone-200' : ''}`}>
              <div>
                <h3 className="font-serif text-lg font-bold text-theme-950">{signal.name}</h3>
                <p className="mt-1 text-[11px] text-stone-500">{signal.stageLabel} · {signal.samples} 日样本</p>
              </div>
              <div>
                <div className="h-1.5 bg-stone-200"><div className="h-full bg-[#206b5d]" style={{ width: `${signal.heat}%` }} /></div>
                <p className="mt-2 text-xs leading-5 text-stone-600">{actionFor(signal)}</p>
              </div>
              <div className="font-mono text-sm text-theme-700">{formatDelta(signal.delta7)}</div>
              <div className="text-right text-xs text-stone-600">拥挤 {signal.crowding}<br /><b className="text-theme-900">置信度{signal.confidence}</b></div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-stone-500">可靠判断 {reliableCount} 个 · 样本不足 {observationCount} 个</p>
      </section>

      <section className="mt-14" aria-labelledby="signal-title">
        <EditorialTitle id="signal-title" title="趋势信号" hint="把数据翻译成可执行判断" />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { icon: Compass, label: '窗口信号', title: `${opportunity.name}值得先做小样`, text: `近 7 日 ${formatDelta(opportunity.delta7)}，但拥挤度 ${opportunity.crowding}；机会在差异化，不在照抄榜首。` },
            { icon: Gauge, label: '退潮信号', title: `${cooling.name}暂缓重投入`, text: `近 7 日 ${formatDelta(cooling.delta7)}。保留母题，用短篇幅先测试新的冲突承诺。` },
            { icon: Target, label: '样本信号', title: '低样本不进入排序', text: `${observationCount} 个题材的历史记录少于 4 日，页面已降级为“仅观察”，避免单日高热误导。` },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="border border-stone-300 bg-white/70 p-5">
                <div className="flex items-center gap-2 text-theme-700"><Icon size={18} /><span className="text-xs font-bold tracking-[0.16em]">{item.label}</span></div>
                <h3 className="mt-4 font-serif text-xl font-bold text-theme-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="sample-title">
        <EditorialTitle id="sample-title" title="突围样本" hint="只拆标题机制，不复制题材外壳" />
        <div className="mt-7 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {topBooks.map((book) => (
            <article key={`${book.channel}-${book.rank}`} className="border-l-2 border-theme-500 bg-white/55 py-1 pl-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] text-theme-700">{book.channel} #{book.rank} · {book.genre}</p>
                  <h3 className="mt-2 font-serif text-lg font-bold leading-7 text-theme-950">{book.title}</h3>
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-stone-500">{book.heat}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-700">{sampleInsight(book.title)}</p>
              {book.sourceUrl && <a href={book.sourceUrl} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-theme-700 hover:text-theme-950">查看榜单来源 <ExternalLink size={12} /></a>}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="writing-title">
        <EditorialTitle id="writing-title" title="书名与简介打法" hint="先卖冲突，再解释世界观" />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <article className="border border-stone-300 bg-white/60 p-6">
            <div className="flex items-center gap-2 text-theme-700"><Quote size={19} /><h3 className="font-serif text-xl font-bold">男频表达公式</h3></div>
            <p className="mt-4 font-serif text-lg font-bold leading-8 text-theme-950">现实节点 + 反常动作 + 可见结果</p>
            <p className="mt-3 text-sm leading-7 text-stone-700">简介前三句依次回答：主角今天必须完成什么、能力如何改变局面、第一次使用会付出什么代价。</p>
          </article>
          <article className="border border-stone-300 bg-white/60 p-6">
            <div className="flex items-center gap-2 text-[#174c43]"><Feather size={19} /><h3 className="font-serif text-xl font-bold">女频表达公式</h3></div>
            <p className="mt-4 font-serif text-lg font-bold leading-8 text-theme-950">身份落差 + 关系越界 + 情绪后果</p>
            <p className="mt-3 text-sm leading-7 text-stone-700">简介第一屏先放人物困境和关系张力，再交代脑洞机制；避免只排列“财阀、甜宠、万人迷”等标签。</p>
          </article>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="action-title">
        <EditorialTitle id="action-title" title="作者行动清单" hint="把今天的判断变成未来 7 天的验证" />
        <div className="mt-7 grid gap-px bg-stone-300 md:grid-cols-2">
          {[
            { icon: Sparkles, label: '今天就做', text: `围绕“${opportunity.name}”写 3 个一句话切口，删掉任何只能靠题材名成立的版本。` },
            { icon: BookOpenText, label: '前三章', text: '首章给承诺、第二章抬高代价、第三章兑现一次并制造更大的问题。' },
            { icon: CircleAlert, label: '主动避开', text: `不要复刻“${crowded.name}”榜首的身份组合、书名句式和同一套情绪钩子。` },
            { icon: ListChecks, label: '7 天验证', text: '完成 1.5—3 万字小样；点击、三章追读、有效评论至少两项正向，再扩大存稿。' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="bg-theme-bg p-6">
                <div className="flex items-center gap-2 text-theme-700"><Icon size={18} /><h3 className="font-serif text-lg font-bold">{item.label}</h3></div>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <aside className="mt-10 border-l-2 border-stone-300 bg-stone-100/70 px-5 py-4 text-xs leading-6 text-stone-600">
        <p><b className="text-stone-800">口径说明：</b>题材热度来自本地静态数据，趋势使用站内历史归档；少于 4 日的样本不计算加速度，也不参与机会排序。</p>
        <p>趋势截止 {updatedAt ?? '—'}；新书榜来源截止 {sourceDate ?? boards.map((board) => board.dataDate).filter(Boolean).sort().at(-1) ?? '—'}。所有结论仅作创作研究参考。</p>
      </aside>
    </div>
  )
}
