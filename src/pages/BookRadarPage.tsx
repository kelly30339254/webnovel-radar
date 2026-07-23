import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  AlertTriangle,
  BarChart3,
  Check,
  Clipboard,
  Download,
  Gauge,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ZhiyuNextStep from '@/components/ZhiyuNextStep'
import { useWindData } from '@/hooks/useWindData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { trackEvent } from '@/hooks/useAnalytics'
import { buildGenreSignals, formatDelta, signalTone } from '@/lib/genreSignals'
import { isResultKey, NBTI_RESULTS, NBTI_STORAGE_KEY } from '@/lib/nbti'
import { downloadBlob } from '@/lib/posterCanvas'
import { createRadarPoster } from '@/lib/radarPoster'
import { buildRadarReport } from '@/lib/radarReport'
import type { RadarLength, RadarPace } from '@/lib/radarReport'
import type { ResultKey } from '@/lib/nbti'

type Channel = 'male' | 'female'

function readSavedPersonality(): ResultKey | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(NBTI_STORAGE_KEY) ?? '{}') as { key?: string }
    return isResultKey(parsed.key) ? parsed.key : null
  } catch {
    return null
  }
}

export default function BookRadarPage() {
  const [searchParams] = useSearchParams()
  const { data, history, error } = useWindData()
  const requestedChannel = searchParams.get('channel') === 'female' ? 'female' : 'male'
  const requestedGenre = searchParams.get('genre') ?? ''
  const [channel, setChannel] = useState<Channel>(requestedChannel)
  const [genreName, setGenreName] = useState(requestedGenre)
  const [pace, setPace] = useState<RadarPace>('steady')
  const [length, setLength] = useState<RadarLength>('medium')
  const [adaptation, setAdaptation] = useState(true)
  const [generated, setGenerated] = useState(false)
  const [variationSeed, setVariationSeed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [posterBusy, setPosterBusy] = useState(false)
  const [posterError, setPosterError] = useState('')
  const personality = useMemo(() => readSavedPersonality(), [])
  const signals = useMemo(() => data ? buildGenreSignals(data.genres, history, data.boards) : [], [data, history])

  usePageMeta({
    title: '我的开书雷达',
    description: '结合实时题材热度、更新能力、篇幅与改编方向，生成个性化开书建议。',
    path: '/radar',
  })

  const channelGenres = useMemo(() => signals.filter((signal) => {
    if (channel === 'male') return !signal.name.includes('女频')
    return !signal.name.includes('男频')
  }), [channel, signals])
  const selectedName = genreName || channelGenres[0]?.name || ''
  const selected = signals.find((signal) => signal.name === selectedName)
  const keywords = useMemo(() => {
    const keywordChannel = channel === 'male' ? data?.keywords.male : data?.keywords.female
    return keywordChannel?.tags.slice(0, 8).map((tag) => tag.word) ?? []
  }, [channel, data])
  const genreNote = data?.genres.find((genre) => genre.name === selectedName)?.note
  const personaName = personality ? NBTI_RESULTS[personality].name : null
  const report = useMemo(() => selected ? buildRadarReport({
    signal: selected,
    genreNote,
    keywords,
    pace,
    length,
    adaptation,
    personaName,
    variationSeed,
  }) : null, [adaptation, genreNote, keywords, length, pace, personaName, selected, variationSeed])

  const resetReport = () => {
    setGenerated(false)
    setVariationSeed(0)
    setCopied(false)
    setPosterError('')
  }

  const handleGenerate = () => {
    if (generated) setVariationSeed((current) => current + 1)
    else setVariationSeed(0)
    setGenerated(true)
    setCopied(false)
    setPosterError('')
    trackEvent('radar_generate', {
      channel,
      genre: selectedName,
      adaptation,
      version: generated ? (variationSeed + 1) % 3 : 0,
    })
  }

  const reportText = report && selected ? [
    '【我的开书雷达 · 专业决策报告】',
    `题材：${selected.name}`,
    `结论：${report.score} / 100（${report.verdict}）`,
    `策略版本：${report.strategyName}`,
    `市场证据：${report.marketEvidence}`,
    `突围定位：${report.positioning}`,
    `差异化：${report.differentiators.join('；')}`,
    `风险：${report.risks.join('；')}`,
    `产能方案：${report.productionProfile}`,
    `结构方案：${report.adaptationStrategy}`,
    `7 天验证：${report.plan.map((step) => `${step.phase} ${step.task}`).join('；')}`,
  ].join('\n') : ''

  const handleCopy = async () => {
    if (!report || !selected) return
    await navigator.clipboard.writeText(`${reportText}\n${window.location.origin}/radar`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
    trackEvent('radar_copy', { genre: selected.name, version: report.strategyName })
  }

  const handlePoster = async () => {
    if (!report || !selected || posterBusy) return
    setPosterBusy(true)
    setPosterError('')
    try {
      const blob = await createRadarPoster({
        genre: selected.name,
        score: report.score,
        verdict: report.verdict,
        stageLabel: selected.stageLabel,
        delta7: formatDelta(selected.delta7),
        acceleration: formatDelta(selected.acceleration),
        crowding: selected.crowding,
        strategyName: report.strategyName,
        marketEvidence: report.marketEvidence,
        positioning: report.positioning,
        differentiators: report.differentiators,
        risks: report.risks,
        plan: report.plan,
        productionProfile: report.productionProfile,
        factors: report.factors,
        updatedAt: data?.updatedAt,
      })
      downloadBlob(blob, `开书雷达-${selected.name}-${report.strategyName}.png`)
      trackEvent('radar_poster', { genre: selected.name, version: report.strategyName })
    } catch (posterFailure) {
      setPosterError(posterFailure instanceof Error ? posterFailure.message : '海报生成失败，请稍后重试')
    } finally {
      setPosterBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="我的开书雷达" hint="把实时风向变成你的下一步创作决策" />
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[21rem_minmax(0,1fr)] xl:gap-10">
          <section aria-labelledby="radar-form-title">
            <p className="text-xs font-semibold text-theme-500">PERSONAL BOOK RADAR</p>
            <h2 id="radar-form-title" className="mt-2 text-2xl font-bold text-theme-950">先确定你的创作约束</h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-500">雷达只使用站内每日榜单和历史归档，不会上传你的创作内容。</p>

            <div className="mt-7 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold">目标频道</legend>
                <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-theme-200 bg-white">
                  {([{ key: 'male', label: '男频' }, { key: 'female', label: '女频' }] as const).map((item) => (
                    <button key={item.key} type="button" onClick={() => { setChannel(item.key); setGenreName(''); resetReport() }} className={`min-h-10 px-5 text-sm ${channel === item.key ? 'bg-theme-600 text-white' : 'text-theme-600 hover:bg-theme-50'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold">
                想写的题材
                <select value={selectedName} onChange={(event) => { setGenreName(event.target.value); resetReport() }} className="mt-2 min-h-11 w-full rounded-lg border border-theme-200 bg-white px-3 text-sm font-normal text-theme-900 outline-none focus:border-theme-400">
                  {channelGenres.map((signal) => <option key={signal.name} value={signal.name}>{signal.name}</option>)}
                </select>
              </label>

              <fieldset>
                <legend className="text-sm font-semibold">更新能力</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([{ key: 'sprint', label: '冲刺型' }, { key: 'steady', label: '稳定型' }, { key: 'slow', label: '慢工型' }] as const).map((item) => (
                    <button key={item.key} type="button" onClick={() => { setPace(item.key); resetReport() }} className={`min-h-10 rounded-lg border px-2 text-sm ${pace === item.key ? 'border-teal-700 bg-teal-700 text-white' : 'border-theme-200 bg-white text-theme-600 hover:bg-theme-50'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold">
                计划篇幅
                <select value={length} onChange={(event) => { setLength(event.target.value as RadarLength); resetReport() }} className="mt-2 min-h-11 w-full rounded-lg border border-theme-200 bg-white px-3 text-sm font-normal text-theme-900 outline-none focus:border-theme-400">
                  <option value="short">中短篇 / 快速验证</option>
                  <option value="medium">50-100 万字</option>
                  <option value="long">百万字长篇</option>
                </select>
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={adaptation} onChange={(event) => { setAdaptation(event.target.checked); resetReport() }} className="h-4 w-4 accent-theme-600" />
                考虑短剧 / 漫剧改编
              </label>

              <button type="button" onClick={handleGenerate} disabled={!selected} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-50">
                {generated ? <RefreshCw size={18} /> : <Target size={18} />}
                {generated ? '切换下一版策略' : '生成专业决策报告'}
              </button>
            </div>
          </section>

          <section aria-live="polite" className="min-w-0 border-l-0 border-theme-100 lg:border-l lg:pl-8">
            {!generated || !report || !selected ? (
              <div className="flex min-h-[34rem] items-center justify-center border border-dashed border-theme-200 bg-white/50 p-8 text-center">
                <div>
                  <Gauge className="mx-auto text-theme-600" size={38} />
                  <h2 className="mt-4 text-lg font-bold">专业报告会显示在这里</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-theme-700">选择题材和创作约束后生成。</p>
                </div>
              </div>
            ) : (
              <article className="border border-theme-100 bg-white shadow-sm">
                <header className="flex flex-wrap items-start justify-between gap-5 border-b border-theme-100 px-5 py-6 sm:px-7">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${signalTone(selected.stage)}`}>{selected.stageLabel}期</span>
                      <span className="inline-flex rounded-full bg-theme-100 px-2.5 py-1 text-xs font-semibold text-theme-700">{report.strategyName}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">{selected.name}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-theme-600">{report.verdictSummary}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-5xl font-bold text-theme-600">{report.score}</p>
                    <p className="text-xs text-theme-700">开书适配度 / 100</p>
                    <p className="mt-2 text-sm font-semibold text-teal-700">{report.verdict}</p>
                  </div>
                </header>

                <div className="px-5 py-6 sm:px-7">
                  <section>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="text-theme-500" size={18} />
                      <h3 className="text-base font-bold">市场证据与三项评分</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-theme-700">{report.marketEvidence}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {report.factors.map((factor) => (
                        <div key={factor.label} className="border-t-2 border-theme-200 bg-theme-50/60 px-4 py-4">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-sm font-semibold">{factor.label}</p>
                            <p className="font-mono text-2xl font-bold text-theme-600">{factor.score}</p>
                          </div>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-theme-100">
                            <div className="h-full rounded-full bg-theme-500" style={{ width: `${factor.score}%` }} />
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-theme-500">{factor.note}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mt-7 border-t border-theme-100 pt-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-blue-600" size={18} />
                      <h3 className="text-base font-bold">本版突围定位</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-theme-800">{report.positioning}</p>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                      {report.differentiators.map((item, index) => (
                        <li key={item} className="flex gap-3 bg-blue-50/70 px-4 py-4 text-sm leading-relaxed text-blue-950">
                          <span className="font-mono font-bold text-blue-600">0{index + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="mt-7 border-t border-theme-100 pt-6">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-amber-600" size={18} />
                      <h3 className="text-base font-bold">风险清单</h3>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {report.risks.map((risk) => (
                        <li key={risk} className="flex gap-3 text-sm leading-relaxed text-theme-800">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="mt-7 border-t border-theme-100 pt-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-emerald-600" size={18} />
                      <h3 className="text-base font-bold">7 天验证路线</h3>
                    </div>
                    <ol className="mt-4 divide-y divide-emerald-100 border-y border-emerald-100">
                      {report.plan.map((step) => (
                        <li key={step.phase} className="grid gap-2 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                          <p className="text-sm font-bold text-emerald-700">{step.phase}</p>
                          <div>
                            <p className="text-sm leading-relaxed text-theme-900">{step.task}</p>
                            <p className="mt-1 text-xs leading-relaxed text-theme-500">验收：{step.check}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="mt-7 grid gap-5 border-t border-theme-100 pt-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-bold text-teal-800">产能方案</h3>
                      <p className="mt-2 text-sm leading-relaxed text-theme-700">{report.productionProfile}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-teal-800">结构方案</h3>
                      <p className="mt-2 text-sm leading-relaxed text-theme-700">{report.adaptationStrategy}</p>
                      {report.personaName && <p className="mt-2 text-xs font-medium text-teal-700">已结合创作人格：{report.personaName}</p>}
                    </div>
                  </section>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-theme-100 bg-theme-50/70 px-5 py-4 sm:px-7">
                  <p className="text-xs text-theme-700">样本：近 {selected.samples} 日归档 · 置信度 {selected.confidence}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={handleCopy} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-theme-200 bg-white px-4 py-2 text-sm font-medium text-theme-700 hover:bg-theme-50">
                      {copied ? <Check size={16} /> : <Clipboard size={16} />} {copied ? '报告已复制' : '复制报告'}
                    </button>
                    <button type="button" onClick={handlePoster} disabled={posterBusy} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60">
                      <Download size={16} /> {posterBusy ? '正在生成' : '下载分享海报'}
                    </button>
                  </div>
                </footer>
                <ZhiyuNextStep
                  title={`把这份「${selected.name}」定位继续写成大纲`}
                  description="先复制报告，再到智语写作继续拆人物关系、故事主线和章节计划。"
                  placement="radar_result"
                />
              </article>
            )}
            {posterError && <p className="mt-3 text-sm text-theme-600">{posterError}</p>}
          </section>
        </div>
        {error && <p className="mt-8 text-sm text-theme-600">数据加载失败：{error}</p>}
      </main>
    </div>
  )
}
