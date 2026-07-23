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
  if (signal.stage === 'insufficient') return '数据还不够，先多看几天；今天只记下热门书名、人物设定和读者评论。'
  if (signal.crowding >= 85) return '这个题材能写，但主角职业、特殊能力和人物关系，至少要改两项。'
  if (signal.delta7 >= 4) return '先把前三章写出来，看读者愿不愿意追，不用一开始就囤几十万字。'
  if (signal.delta7 < 0) return '核心故事可以保留，但开头要换成更具体的难题，并尽快让读者看到结果。'
  return '把亮点写到人物反差和连续结果里，不要只靠题材名称吸引人。'
}

function sampleInsight(title: string): string {
  if (/高考|出分|录取/.test(title)) return '明确时间节点制造倒计时，再用结果反转建立第一章承诺。'
  if (/穿|成为|入宫/.test(title)) return '身份突变让处境、目标和风险同时可见，读者能迅速判断故事方向。'
  if (/系统|兑换|破解/.test(title)) return '特殊能力一句话就能讲清，前三章可以连续展示效果，但也要尽快写清使用代价。'
  if (/财阀|太子爷|总裁|哥哥/.test(title)) return '高识别身份叠加关系越界，点击点清晰；真正的区分度要靠人物选择。'
  return '标题先交代事件与反差，不只报题材；简介继续说明代价、目标和下一步升级。'
}

function openingMove(title: string): string {
  if (/恋综|直播|全网|爆火/.test(title)) return '首章直接进入公开场合的失控事件，第二章展示舆论扩散，第三章让关系付出代价。'
  if (/入宫|太子|财阀|豪门/.test(title)) return '首章完成身份碰撞，第二章抛出不可拒绝的关系任务，第三章公开站队或决裂。'
  if (/系统|兑换|破译|觉醒/.test(title)) return '第一章获得能力，第二章用它解决小难题，第三章再次使用，并因此遇到更大的限制。'
  return '首章给事件，第二章让事件改变关系，第三章把一次胜利转换成下一轮更大的问题。'
}

function copyRisk(title: string): string {
  if (/总裁|太子爷|财阀|哥哥/.test(title)) return '只复制这些身份，读起来很容易和别的书一样；要给主角不同的目标和人物关系。'
  if (/系统|觉醒|兑换/.test(title)) return '只展示能力说明书会拖慢阅读；每次解释都应伴随一个可见结果。'
  return '不要照搬书名和人物组合。可以借用故事规则，但主角目标和付出的代价必须不同。'
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
  return `现在有多火 ${signal.heat} · 一周涨跌 ${formatDelta(signal.delta7)} · 同类书多少 ${signal.crowding}`
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
      summary: opportunityNote ?? '最近热度和榜单表现都在变好，适合先写一小段试试。',
      analysis: [
        `为什么：一周变化 ${formatDelta(opportunity.delta7)}，目前是“${opportunity.stageLabel}”，参考了 ${opportunity.samples} 天数据。`,
        `怎么写：保留“${opportunity.name}”最吸引人的部分，换一个职业、人物目标和能力代价。`,
        '怎么试：先看书名有没有人点，再看前三章有没有人追；两项都不错再多写。',
      ],
    },
    {
      label: '很火，但同类书很多',
      signal: crowded,
      icon: CircleAlert,
      color: 'text-[#174c43] border-[#5a867e]',
      summary: genres.find((genre) => genre.name === crowded.name)?.note ?? '读者一眼能看懂，但人物或特殊能力必须有明显不同。',
      analysis: [
        `为什么：现在有多火 ${crowded.heat}、同类书多少 ${crowded.crowding}，相似作品已经很多。`,
        '怎么写：别再堆身份标签，给主角一个具体愿望、一次不能反悔的选择和一项现实代价。',
        '怎么试：让 5 位目标读者只看书名和简介；如果说不出这本书哪里不同，就继续改。',
      ],
    },
  ]

  const trendSignals = [
    { icon: Compass, label: '现在适合写吗', title: `${opportunity.name}可以先写一小段`, evidence: `一周变化 ${formatDelta(opportunity.delta7)}，最近几天还在${opportunity.acceleration >= 0 ? '变热' : '变冷'}，数据${opportunity.confidence === '高' ? '比较稳' : '可作参考'}。`, action: '先写 1.5—3 万字，不用马上定成长篇；重点是写出不同，不是照抄榜首。' },
    { icon: Gauge, label: '最近在变冷', title: `${cooling.name}先别投入太多`, evidence: `一周变化 ${formatDelta(cooling.delta7)}，目前是“${cooling.stageLabel}”。`, action: '核心故事可以留着，先用短篇试一个新开头；已有存稿先改前三章，不用马上放弃。' },
    { icon: Target, label: '同类书太多', title: `${crowded.name}要写出明显不同`, evidence: `同类书多少 ${crowded.crowding}，现在有多火 ${crowded.heat}，想被看见会更难。`, action: '书名、人物、特殊能力至少改两项，别让读者只记住题材标签。' },
    { icon: ShieldCheck, label: '数据还不够', title: '记录太少的题材先观察', evidence: `${observationCount} 个题材只记录了不到 4 天，现在还看不准。`, action: '继续看书名和榜单位置，等记录满一周后，再判断是在变热还是变冷。' },
    { icon: BookOpenText, label: '前三章要讲清', title: '连续回答三个问题', evidence: '主角想要什么、为什么能做到、做到后要付出什么。', action: '每章都让事情发生变化，别连续三章只解释背景和设定。' },
    { icon: ListChecks, label: '看读者反应', title: '别只凭自己觉得好', evidence: '点击看书名和简介，追读看前三章，评论看读者有没有看懂亮点。', action: '至少两项表现不错再多写；如果只有点击高，就先改正文。' },
  ]

  return (
    <div className="pb-14">
      <section id="direction" className="scroll-mt-28 pt-10" aria-labelledby="featured-title">
        <EditorialTitle id="featured-title" title="今天先看什么" hint="先看结论，再决定今天写什么" />
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
                  <p className="mt-2 font-mono text-xs text-stone-500">{metric(item.signal)} · 数据{item.signal.confidence === '高' ? '比较稳' : item.signal.confidence === '中' ? '可作参考' : '还太少'}</p>
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
        <EditorialTitle id="fit-title" title="这个题材适不适合你" hint="不只看题材火不火，也要看你能不能写好" />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <article className="border-t-2 border-[#174c43] bg-white/70 p-6">
            <div className="flex items-center gap-2 text-[#174c43]"><ShieldCheck size={20} /><h3 className="font-serif text-xl font-bold">更适合这样的作者</h3></div>
            <ul className="mt-4 grid gap-x-6 gap-y-3 text-sm leading-7 text-stone-700 sm:grid-cols-2">
              {[
                '能在前三章讲清一条新规则，并至少展示两次效果。',
                '愿意先写 1.5—3 万字，用点击、追读和评论看看读者反应。',
                `能把“${opportunity.name}”落到具体职业、关系与可见代价。`,
                '能连续 7 天稳定更新，并预留至少两轮开篇修改时间。',
                '能说出自己的故事和同题材榜首至少有哪两点不同。',
                '愿意看读者真实反应，而不是只凭自己喜欢不喜欢来判断。',
              ].map((line) => <li key={line} className="flex gap-2"><span className="text-[#174c43]">✓</span><span>{line}</span></li>)}
            </ul>
          </article>
          <article className="border-t-2 border-theme-600 bg-white/70 p-6">
            <div className="flex items-center gap-2 text-theme-700"><CircleAlert size={20} /><h3 className="font-serif text-xl font-bold">谨慎进入的情况</h3></div>
            <ul className="mt-4 grid gap-x-6 gap-y-3 text-sm leading-7 text-stone-700 sm:grid-cols-2">
              {[
                '只能复制榜首书名，还没想好主角为什么要一直往前走。',
                '更新节奏偏慢，却准备直接押注快速变化的热点。',
                `只看一天就认定题材会火；当前另有 ${observationCount} 个题材数据还太少。`,
                '设定要解释很久，前三章还看不到第一次实际效果。',
                '只有特殊能力，没有主角今天必须完成的具体目标。',
                '书名只堆“系统、豪门、甜宠”等标签，没有事件与结果。',
              ].map((line) => <li key={line} className="flex gap-2"><span className="text-theme-600">!</span><span>{line}</span></li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="radar-title">
        <EditorialTitle id="radar-title" title="题材怎么选" hint="现在有多火 × 最近涨跌 × 同类书多少 × 数据够不够" />
        <div className="mt-7 overflow-hidden border-y border-stone-300 bg-white/55">
          {signals.map((signal, index) => (
            <article key={signal.name} className={`grid items-center gap-4 px-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)_5rem_8rem] ${index ? 'border-t border-stone-200' : ''}`}>
              <div><h3 className="font-serif text-lg font-bold text-theme-950">{signal.name}</h3><p className="mt-1 text-[11px] text-stone-500">{signal.stageLabel} · 看了 {signal.samples} 天</p></div>
              <div><div className="h-1.5 bg-stone-200"><div className="h-full bg-[#206b5d]" style={{ width: `${signal.heat}%` }} /></div><p className="mt-2 text-xs leading-5 text-stone-600">{actionFor(signal)}</p></div>
              <div className="font-mono text-sm text-theme-700">{formatDelta(signal.delta7)}</div>
              <div className="text-right text-xs text-stone-600">同类书 {signal.crowding}<br /><b className="text-theme-900">数据{signal.confidence === '高' ? '较稳' : signal.confidence === '中' ? '可参考' : '太少'}</b></div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-stone-500">比较看得准 {reliableCount} 个 · 还要再观察 {observationCount} 个</p>
      </section>

      <section className="mt-14" aria-labelledby="signal-title">
        <EditorialTitle id="signal-title" title="最近有什么变化" hint="把数字说成人话，告诉你下一步怎么做" />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trendSignals.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="border border-stone-300 bg-white/70 p-5">
                <div className="flex items-center gap-2 text-theme-700"><Icon size={18} /><span className="text-xs font-bold tracking-[0.16em]">{item.label}</span></div>
                <h3 className="mt-4 font-serif text-xl font-bold text-theme-950">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-stone-500">为什么这样说｜{item.evidence}</p>
                <p className="mt-2 border-l-2 border-theme-500 pl-3 text-sm font-medium leading-7 text-stone-700">你可以这样做｜{item.action}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="sample-title">
        <EditorialTitle id="sample-title" title="热门书为什么能火" hint="看书名为什么想点、前三章怎么留人、哪里不能照抄" />
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {topBooks.map((book) => (
            <article key={`${book.channel}-${book.rank}`} className="border border-stone-300 bg-white/60 p-5">
              <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-3">
                <div><p className="text-[11px] font-bold tracking-[0.14em] text-theme-700">{book.channel} #{book.rank} · {book.genre}</p><h3 className="mt-2 font-serif text-lg font-bold leading-7 text-theme-950">{book.title}</h3></div>
                <span className="whitespace-nowrap font-mono text-xs text-stone-500">{book.heat}</span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm leading-6 text-stone-700">
                <div><dt className="text-xs font-bold text-theme-700">书名为什么想点</dt><dd>{sampleInsight(book.title)}</dd></div>
                <div><dt className="text-xs font-bold text-[#174c43]">前三章怎么留人</dt><dd>{openingMove(book.title)}</dd></div>
                <div><dt className="text-xs font-bold text-stone-500">哪里不能照抄</dt><dd>{copyRisk(book.title)}</dd></div>
              </dl>
              {book.sourceUrl && <a href={book.sourceUrl} target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-theme-700 hover:text-theme-950">查看榜单来源 <ExternalLink size={12} /></a>}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="writing-title">
        <EditorialTitle id="writing-title" title="书名和简介怎么写" hint="先告诉读者发生了什么，再解释世界设定" />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {[
            {
              channel: '男频表达公式', icon: Quote, tone: 'text-theme-700', formula: '现实节点 + 反常动作 + 可见结果',
              titles: ['我在____当天，突然能____', '别人还在____，我已经____', '被迫接手____后，我让____'],
              intro: ['第一句：主角今天必须完成什么现实目标。', '第二句：新能力如何第一次改变局面。', '第三句：这次使用会付出什么代价。'],
              chapters: ['第1章在具体现场得到能力。', '第2章用能力解决一次小难题。', '第3章让读者看到结果，同时出现更大的限制。'],
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
        <EditorialTitle id="action-title" title="今天具体做什么" hint="用 7 天看看这个想法值不值得继续写" />
        <div className="mt-7 grid gap-px bg-stone-300 md:grid-cols-2">
          {[
            { icon: Sparkles, label: '今天就做', text: `围绕“${opportunity.name}”写 3 个一句话故事，删掉那些只换题材名也成立的版本。` },
            { icon: BookOpenText, label: '前三章', text: '第一章告诉读者会看到什么，第二章让事情更难，第三章给一次结果并带出更大的问题。' },
            { icon: CircleAlert, label: '主动避开', text: `不要复刻“${crowded.name}”榜首的身份组合、书名句式和同一套情绪钩子。` },
            { icon: ListChecks, label: '7 天试写', text: '先写 1.5—3 万字；点击、三章追读、有效评论至少两项不错，再多准备存稿。' },
          ].map((item) => {
            const Icon = item.icon
            return <article key={item.label} className="bg-theme-bg p-6"><div className="flex items-center gap-2 text-theme-700"><Icon size={18} /><h3 className="font-serif text-lg font-bold">{item.label}</h3></div><p className="mt-3 text-sm leading-7 text-stone-700">{item.text}</p></article>
          })}
        </div>
      </section>

      <aside className="mt-10 border-l-2 border-stone-300 bg-stone-100/70 px-5 py-4 text-xs leading-6 text-stone-600">
        <p><b className="text-stone-800">数据怎么来的：</b>题材热度来自站内每日数据；记录不到 4 天的题材还看不准，只展示，不参加推荐排序。</p>
        <p>趋势截止 {updatedAt ?? '—'}；新书榜来源截止 {sourceDate ?? boards.map((board) => board.dataDate).filter(Boolean).sort().at(-1) ?? '—'}。所有结论仅作创作研究参考。</p>
      </aside>
    </div>
  )
}
