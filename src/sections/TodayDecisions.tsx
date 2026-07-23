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
  if (signal.stage === 'insufficient') return '先积累至少 4 个历史样本，再判断趋势；今天只记录标题、人设与评论变化。'
  if (signal.crowding >= 85) return '题材能写，但至少替换主角职业、核心机制、关系矛盾中的两项。'
  if (signal.delta7 >= 4) return '先写强目标开场，用前三章验证读者是否愿意追更，不急着囤长篇。'
  if (signal.delta7 < 0) return '保留题材母题，把开篇冲突换成更具体、可兑现的新承诺。'
  return '把题材优势落在人设反差与连续兑现上，不依赖题材名本身制造期待。'
}

function sampleInsight(title: string): string {
  if (/高考|出分|录取/.test(title)) return '明确时间节点制造倒计时，再用结果反转建立第一章承诺。'
  if (/穿|成为|入宫/.test(title)) return '身份突变让处境、目标和风险同时可见，读者能迅速判断故事方向。'
  if (/系统|兑换|破解/.test(title)) return '机制可以一句话复述，适合在前三章连续兑现，但要尽快补上使用代价。'
  if (/财阀|太子爷|总裁|哥哥/.test(title)) return '高识别身份叠加关系越界，点击点清晰；真正的区分度要靠人物选择。'
  return '标题先交代事件与反差，不只报题材；简介继续说明代价、目标和下一步升级。'
}

function openingMove(title: string): string {
  if (/恋综|直播|全网|爆火/.test(title)) return '首章直接进入公开场合的失控事件，第二章展示舆论扩散，第三章让关系付出代价。'
  if (/入宫|太子|财阀|豪门/.test(title)) return '首章完成身份碰撞，第二章抛出不可拒绝的关系任务，第三章公开站队或决裂。'
  if (/系统|兑换|破译|觉醒/.test(title)) return '首章获得规则，第二章用一次解决小难题，第三章用第二次兑现换来更大的限制。'
  return '首章给事件，第二章让事件改变关系，第三章把一次胜利转换成下一轮更大的问题。'
}

function copyRisk(title: string): string {
  if (/总裁|太子爷|财阀|哥哥/.test(title)) return '只复制身份标签会迅速同质化；必须改写主角主动目标与关系权力结构。'
  if (/系统|觉醒|兑换/.test(title)) return '只展示能力说明书会拖慢阅读；每次解释都应伴随一个可见结果。'
  return '不要照搬标题句式和人物组合，要保留机制、替换目标，并让结果有自己的代价。'
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

  const topBooks = boards.flatMap((board) => board.books.slice(0, 4).map((book) => ({ ...book, channel: board.channel, sourceUrl: board.sourceUrl })))
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
      analysis: [
        `证据：近 7 日 ${formatDelta(opportunity.delta7)}，阶段为“${opportunity.stageLabel}”，当前样本 ${opportunity.samples} 日。`,
        `切口：保留“${opportunity.name}”的读者预期，替换职业现场、关系目标与能力代价。`,
        '验证：先测标题点击，再看前三章追读；两项同时正向才扩大存稿。',
      ],
    },
    {
      label: '高热但拥挤',
      signal: crowded,
      icon: CircleAlert,
      color: 'text-[#174c43] border-[#5a867e]',
      summary: genres.find((genre) => genre.name === crowded.name)?.note ?? '有市场识别度，但需要更强的人设或机制差异。',
      analysis: [
        `证据：热度 ${crowded.heat}、拥挤度 ${crowded.crowding}，同标签竞争已经可见。`,
        '切口：不要继续叠身份；改成一个具体愿望、一次不可撤销选择和一项现实代价。',
        '验证：让 5 位目标读者只看书名与简介，若复述不出差异点，继续改题。',
      ],
    },
  ]

  const trendSignals = [
    { icon: Compass, label: '窗口信号', title: `${opportunity.name}值得先做小样`, evidence: `近 7 日 ${formatDelta(opportunity.delta7)}，加速度 ${formatDelta(opportunity.acceleration)}，置信度${opportunity.confidence}。`, action: '先写 1.5—3 万字，不先承诺长篇；机会在差异化，不在照抄榜首。' },
    { icon: Gauge, label: '退潮信号', title: `${cooling.name}暂缓重投入`, evidence: `近 7 日 ${formatDelta(cooling.delta7)}，当前阶段“${cooling.stageLabel}”。`, action: '保留母题，用短篇幅测试新的冲突承诺；已有存稿先改开篇，不急着弃题。' },
    { icon: Target, label: '拥挤信号', title: `${crowded.name}要先证明区分度`, evidence: `拥挤度 ${crowded.crowding}，热度 ${crowded.heat}，进入成本高于普通赛道。`, action: '书名、人设、能力机制三项至少换两项，避免读者只记住题材标签。' },
    { icon: ShieldCheck, label: '样本信号', title: '低样本不进入机会排序', evidence: `${observationCount} 个题材的历史记录少于 4 日，当前仅作观察。`, action: '连续记录标题与榜位，等样本覆盖一周后再判断上升或退潮。' },
    { icon: BookOpenText, label: '兑现信号', title: '前三章必须连续回答三个问题', evidence: '读者依次确认：主角要什么、凭什么做到、做到后要付出什么。', action: '每章安排一次状态变化，避免三章都在解释背景或展示设定。' },
    { icon: ListChecks, label: '验证信号', title: '用行为数据替代主观兴奋', evidence: '点击验证包装，三章追读验证开篇，评论验证读者是否看懂卖点。', action: '至少两项指标正向再扩写；只有点击高时，优先改正文兑现。' },
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
                <div className="flex items-start justify-center pt-2">
                  <div className={`flex h-28 w-28 items-center justify-center rounded-full border ${item.color}`}><Icon size={42} strokeWidth={1.25} /></div>
                </div>
                <div>
                  <p className={`text-xs font-bold tracking-[0.22em] ${item.color.split(' ')[0]}`}>{item.label}</p>
                  <h3 className="mt-2 font-serif text-3xl font-black text-theme-950">{item.signal.name}</h3>
                  <p className="mt-2 font-mono text-xs text-stone-500">{metric(item.signal)} · 置信度{item.signal.confidence}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{item.summary}</p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-theme-900">{actionFor(item.signal)}</p>
                  <ul className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-xs leading-6 text-stone-600">
                    {item.analysis.map((line) => <li key={line} className="flex gap-2"><span className="text-theme-600">◆</span><span>{line}</span></li>)}
                  </ul>
                  <Link to={radarPath(item.signal.name)} onClick={() => trackEvent('direction_to_radar', { genre: item.signal.name })} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-theme-700 hover:text-theme-950">
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
            <ul className="mt-4 grid gap-x-6 gap-y-3 text-sm leading-7 text-stone-700 sm:grid-cols-2">
              {[
                '能在前三章讲清一条新规则，并连续兑现至少两次。',
                '愿意先完成 1.5—3 万字小样，用点击、追读和评论验证。',
                `能把“${opportunity.name}”落到具体职业、关系与可见代价。`,
                '能连续 7 天稳定更新，并预留至少两轮开篇修改时间。',
                '能明确说出自己与同题材榜首的两个本质差异。',
                '愿意复盘读者行为，而不是只凭个人偏好判断卖点。',
              ].map((line) => <li key={line} className="flex gap-2"><span className="text-[#174c43]">✓</span><span>{line}</span></li>)}
            </ul>
          </article>
          <article className="border-t-2 border-theme-600 bg-white/70 p-6">
            <div className="flex items-center gap-2 text-theme-700"><CircleAlert size={20} /><h3 className="font-serif text-xl font-bold">谨慎进入的情况</h3></div>
            <ul className="mt-4 grid gap-x-6 gap-y-3 text-sm leading-7 text-stone-700 sm:grid-cols-2">
              {[
                '只能复制榜首标题句式，尚未找到不同的成长发动机。',
                '更新节奏偏慢，却准备直接押注快速变化的热点。',
                `把单日上榜当成趋势；当前另有 ${observationCount} 个题材样本不足。`,
                '设定需要大量解释，前三章仍无法出现第一次有效兑现。',
                '只有能力机制，没有主角必须完成的现实目标。',
                '书名只堆“系统、豪门、甜宠”等标签，没有事件与结果。',
              ].map((line) => <li key={line} className="flex gap-2"><span className="text-theme-600">!</span><span>{line}</span></li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="radar-title">
        <EditorialTitle id="radar-title" title="赛道机会雷达" hint="热度 × 动能 × 拥挤度 × 样本可信度" />
        <div className="mt-7 overflow-hidden border-y border-stone-300 bg-white/55">
          {signals.map((signal, index) => (
            <article key={signal.name} className={`grid items-center gap-4 px-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)_5rem_8rem] ${index ? 'border-t border-stone-200' : ''}`}>
              <div><h3 className="font-serif text-lg font-bold text-theme-950">{signal.name}</h3><p className="mt-1 text-[11px] text-stone-500">{signal.stageLabel} · {signal.samples} 日样本</p></div>
              <div><div className="h-1.5 bg-stone-200"><div className="h-full bg-[#206b5d]" style={{ width: `${signal.heat}%` }} /></div><p className="mt-2 text-xs leading-5 text-stone-600">{actionFor(signal)}</p></div>
              <div className="font-mono text-sm text-theme-700">{formatDelta(signal.delta7)}</div>
              <div className="text-right text-xs text-stone-600">拥挤 {signal.crowding}<br /><b className="text-theme-900">置信度{signal.confidence}</b></div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-stone-500">可靠判断 {reliableCount} 个 · 样本不足 {observationCount} 个</p>
      </section>

      <section className="mt-14" aria-labelledby="signal-title">
        <EditorialTitle id="signal-title" title="趋势信号" hint="把数据翻译成可执行判断" />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trendSignals.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="border border-stone-300 bg-white/70 p-5">
                <div className="flex items-center gap-2 text-theme-700"><Icon size={18} /><span className="text-xs font-bold tracking-[0.16em]">{item.label}</span></div>
                <h3 className="mt-4 font-serif text-xl font-bold text-theme-950">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-stone-500">数据依据｜{item.evidence}</p>
                <p className="mt-2 border-l-2 border-theme-500 pl-3 text-sm font-medium leading-7 text-stone-700">执行动作｜{item.action}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="sample-title">
        <EditorialTitle id="sample-title" title="爆款解析" hint="拆标题、点击钩子、前三章兑现与同质化风险" />
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {topBooks.map((book) => (
            <article key={`${book.channel}-${book.rank}`} className="border border-stone-300 bg-white/60 p-5">
              <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-3">
                <div><p className="text-[11px] font-bold tracking-[0.14em] text-theme-700">{book.channel} #{book.rank} · {book.genre}</p><h3 className="mt-2 font-serif text-lg font-bold leading-7 text-theme-950">{book.title}</h3></div>
                <span className="whitespace-nowrap font-mono text-xs text-stone-500">{book.heat}</span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm leading-6 text-stone-700">
                <div><dt className="text-xs font-bold text-theme-700">标题机制</dt><dd>{sampleInsight(book.title)}</dd></div>
                <div><dt className="text-xs font-bold text-[#174c43]">前三章兑现</dt><dd>{openingMove(book.title)}</dd></div>
                <div><dt className="text-xs font-bold text-stone-500">复制风险</dt><dd>{copyRisk(book.title)}</dd></div>
              </dl>
              {book.sourceUrl && <a href={book.sourceUrl} target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-theme-700 hover:text-theme-950">查看榜单来源 <ExternalLink size={12} /></a>}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="writing-title">
        <EditorialTitle id="writing-title" title="书名与简介打法" hint="先卖冲突，再解释世界观" />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {[
            {
              channel: '男频表达公式', icon: Quote, tone: 'text-theme-700', formula: '现实节点 + 反常动作 + 可见结果',
              titles: ['我在____当天，突然能____', '别人还在____，我已经____', '被迫接手____后，我让____'],
              intro: ['第一句：主角今天必须完成什么现实目标。', '第二句：新能力如何第一次改变局面。', '第三句：这次使用会付出什么代价。'],
              chapters: ['第1章在具体现场触发机制。', '第2章用机制解决一次小难题。', '第3章兑现结果，同时抬高限制。'],
              avoid: '避免先写世界观沿革、能力等级表和长段身份介绍。',
            },
            {
              channel: '女频表达公式', icon: Feather, tone: 'text-[#174c43]', formula: '身份落差 + 关系越界 + 情绪后果',
              titles: ['离开____后，____却失控了', '误入____，我成了____唯一例外', '所有人等我低头，____先替我撑腰'],
              intro: ['第一句：人物正在承受怎样的关系困境。', '第二句：谁做了一个越界但不可逆的选择。', '第三句：这次选择改变了谁的处境与情绪。'],
              chapters: ['第1章把关系矛盾放到公开现场。', '第2章用一次选择改变双方位置。', '第3章给甜点或爽点，再留下新误解。'],
              avoid: '避免只排列“财阀、甜宠、万人迷”等身份与情绪标签。',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.channel} className="border border-stone-300 bg-white/60 p-6">
                <div className={`flex items-center gap-2 ${item.tone}`}><Icon size={19} /><h3 className="font-serif text-xl font-bold">{item.channel}</h3></div>
                <p className="mt-4 border-y border-stone-200 py-3 font-serif text-lg font-bold leading-8 text-theme-950">{item.formula}</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div><h4 className="text-xs font-bold tracking-[0.12em] text-theme-700">书名模板</h4><ol className="mt-2 space-y-2 text-sm leading-6 text-stone-700">{item.titles.map((line, index) => <li key={line}>{index + 1}. {line}</li>)}</ol></div>
                  <div><h4 className="text-xs font-bold tracking-[0.12em] text-theme-700">简介前三句</h4><ol className="mt-2 space-y-2 text-sm leading-6 text-stone-700">{item.intro.map((line) => <li key={line}>{line}</li>)}</ol></div>
                </div>
                <div className="mt-5 border-l-2 border-[#174c43] pl-4"><h4 className="text-xs font-bold tracking-[0.12em] text-[#174c43]">前三章结构</h4><ul className="mt-2 space-y-1 text-sm leading-6 text-stone-700">{item.chapters.map((line) => <li key={line}>· {line}</li>)}</ul></div>
                <p className="mt-4 text-xs leading-6 text-stone-500"><b>避坑：</b>{item.avoid}</p>
              </article>
            )
          })}
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
            return <article key={item.label} className="bg-theme-bg p-6"><div className="flex items-center gap-2 text-theme-700"><Icon size={18} /><h3 className="font-serif text-lg font-bold">{item.label}</h3></div><p className="mt-3 text-sm leading-7 text-stone-700">{item.text}</p></article>
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
