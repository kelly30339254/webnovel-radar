import { useMemo, useState } from 'react'
import { Check, Clipboard, Gauge, Sparkles, Target, TrendingUp } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { useWindData } from '@/hooks/useWindData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { trackEvent } from '@/hooks/useAnalytics'
import { buildGenreSignals, formatDelta, signalTone } from '@/lib/genreSignals'
import { isResultKey, NBTI_RESULTS, NBTI_STORAGE_KEY } from '@/lib/nbti'
import type { ResultKey } from '@/lib/nbti'

type Channel = 'male' | 'female'
type Pace = 'steady' | 'sprint' | 'slow'
type Length = 'short' | 'medium' | 'long'

function readSavedPersonality(): ResultKey | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(NBTI_STORAGE_KEY) ?? '{}') as { key?: string }
    return isResultKey(parsed.key) ? parsed.key : null
  } catch {
    return null
  }
}

export default function BookRadarPage() {
  const { data, history, error } = useWindData()
  const [channel, setChannel] = useState<Channel>('male')
  const [genreName, setGenreName] = useState('')
  const [pace, setPace] = useState<Pace>('steady')
  const [length, setLength] = useState<Length>('medium')
  const [adaptation, setAdaptation] = useState(true)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
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
    return keywordChannel?.tags.slice(0, 5).map((tag) => tag.word) ?? []
  }, [channel, data])

  const report = useMemo(() => {
    if (!selected) return null
    const paceFit = pace === 'sprint' ? 12 : pace === 'steady' ? 8 : -2
    const lengthFit = selected.stage === 'surging' && length === 'short' ? 8 : selected.stage === 'steady' && length === 'long' ? 6 : 2
    const trendScore = Math.max(-10, Math.min(18, selected.delta7 * 1.4 + selected.acceleration))
    const score = Math.max(35, Math.min(95, Math.round(selected.heat * 0.55 + trendScore + (100 - selected.crowding) * 0.14 + paceFit + lengthFit)))
    const personaName = personality ? NBTI_RESULTS[personality].name : null
    const adaptationText = adaptation ? '前三章预留一个可独立成场的强反转，方便后续短剧或漫剧拆分。' : '先把阅读留存做扎实，不必为了改编过早牺牲长线世界观。'
    const paceText = pace === 'sprint' ? '你适合抢窗口期，建议 7 天内完成 3 万字样稿。' : pace === 'steady' ? '按稳定日更推进，先准备 5-7 章存稿再发布。' : '把开篇做成短篇验证，不建议一开始承诺超长连载。'
    return {
      score,
      verdict: score >= 78 ? '值得开' : score >= 62 ? '可以开，但必须差异化' : '先小样验证',
      personaName,
      paceText,
      adaptationText,
      hook: `用“${keywords[0] ?? '反差'}”切入，但避开纯跟风；把${keywords[1] ?? '身份反转'}放在首章结尾，把${keywords[2] ?? '强冲突'}放在第三章兑现。`,
    }
  }, [adaptation, keywords, length, pace, personality, selected])

  const handleGenerate = () => {
    setGenerated(true)
    trackEvent('radar_generate', { channel, genre: selectedName, adaptation })
  }

  const handleCopy = async () => {
    if (!report || !selected) return
    const text = `【我的开书雷达】\n题材：${selected.name}\n开书适配度：${report.score} / 100（${report.verdict}）\n阶段：${selected.stageLabel}，7日变化 ${formatDelta(selected.delta7)}\n建议：${selected.advice}\n开篇：${report.hook}\n${window.location.origin}/radar`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
    trackEvent('radar_copy', { genre: selected.name })
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--theme-bg))] text-theme-950">
      <PageHeader title="我的开书雷达" hint="把实时风向变成你的下一步创作决策" />
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <section aria-labelledby="radar-form-title">
            <p className="text-xs font-semibold text-theme-500">PERSONAL BOOK RADAR</p>
            <h2 id="radar-form-title" className="mt-2 text-2xl font-bold text-theme-950">先确定你的创作约束</h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-500">雷达只使用站内每日榜单和历史归档，不会上传你的创作内容。</p>

            <div className="mt-7 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold">目标频道</legend>
                <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-theme-200 bg-white">
                  {([{ key: 'male', label: '男频' }, { key: 'female', label: '女频' }] as const).map((item) => (
                    <button key={item.key} type="button" onClick={() => { setChannel(item.key); setGenreName(''); setGenerated(false) }} className={`min-h-10 px-5 text-sm ${channel === item.key ? 'bg-theme-600 text-white' : 'text-theme-600 hover:bg-theme-50'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold">
                想写的题材
                <select value={selectedName} onChange={(event) => { setGenreName(event.target.value); setGenerated(false) }} className="mt-2 min-h-11 w-full rounded-lg border border-theme-200 bg-white px-3 text-sm font-normal text-theme-900 outline-none focus:border-theme-400">
                  {channelGenres.map((signal) => <option key={signal.name} value={signal.name}>{signal.name}</option>)}
                </select>
              </label>

              <fieldset>
                <legend className="text-sm font-semibold">更新能力</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([{ key: 'sprint', label: '冲刺型' }, { key: 'steady', label: '稳定型' }, { key: 'slow', label: '慢工型' }] as const).map((item) => (
                    <button key={item.key} type="button" onClick={() => { setPace(item.key); setGenerated(false) }} className={`min-h-10 rounded-lg border px-2 text-sm ${pace === item.key ? 'border-teal-700 bg-teal-700 text-white' : 'border-theme-200 bg-white text-theme-600 hover:bg-theme-50'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold">
                计划篇幅
                <select value={length} onChange={(event) => { setLength(event.target.value as Length); setGenerated(false) }} className="mt-2 min-h-11 w-full rounded-lg border border-theme-200 bg-white px-3 text-sm font-normal text-theme-900 outline-none focus:border-theme-400">
                  <option value="short">中短篇 / 快速验证</option>
                  <option value="medium">50-100 万字</option>
                  <option value="long">百万字长篇</option>
                </select>
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={adaptation} onChange={(event) => { setAdaptation(event.target.checked); setGenerated(false) }} className="h-4 w-4 accent-theme-600" />
                考虑短剧 / 漫剧改编
              </label>

              <button type="button" onClick={handleGenerate} disabled={!selected} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-50">
                <Target size={18} /> 生成我的开书报告
              </button>
            </div>
          </section>

          <section aria-live="polite" className="min-h-[34rem] border-l-0 border-theme-100 lg:border-l lg:pl-8">
            {!generated || !report || !selected ? (
              <div className="flex min-h-[34rem] items-center justify-center border border-dashed border-theme-200 bg-white/50 p-8 text-center">
                <div>
                  <Gauge className="mx-auto text-theme-500" size={38} />
                  <h2 className="mt-4 text-lg font-bold">你的报告会显示在这里</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-theme-600">包含适配度、趋势阶段、拥挤度、开篇切口和更新策略。</p>
                </div>
              </div>
            ) : (
              <div className="border border-theme-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-theme-100 pb-6">
                  <div>
                    <p className="text-xs font-semibold text-theme-600">你的下一本</p>
                    <h2 className="mt-2 text-2xl font-bold">{selected.name}</h2>
                    <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${signalTone(selected.stage)}`}>{selected.stageLabel}期</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-5xl font-bold text-theme-600">{report.score}</p>
                    <p className="text-xs text-theme-600">开书适配度 / 100</p>
                  </div>
                </div>

                <div className="grid gap-px border-b border-theme-100 bg-theme-100 sm:grid-cols-3">
                  <div className="bg-white py-4 sm:pr-3"><p className="text-xs text-theme-600">7 日变化</p><p className="mt-1 font-mono text-lg font-bold text-emerald-700">{formatDelta(selected.delta7)}</p></div>
                  <div className="bg-white py-4 sm:px-3"><p className="text-xs text-theme-600">趋势加速度</p><p className="mt-1 font-mono text-lg font-bold text-blue-700">{formatDelta(selected.acceleration)}</p></div>
                  <div className="bg-white py-4 sm:pl-3"><p className="text-xs text-theme-600">竞争拥挤度</p><p className="mt-1 font-mono text-lg font-bold text-amber-700">{selected.crowding}</p></div>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="flex gap-3"><TrendingUp className="mt-0.5 flex-none text-emerald-600" size={18} /><div><h3 className="text-sm font-bold">结论：{report.verdict}</h3><p className="mt-1 text-sm leading-relaxed text-theme-600">{selected.advice}</p></div></div>
                  <div className="flex gap-3"><Sparkles className="mt-0.5 flex-none text-blue-600" size={18} /><div><h3 className="text-sm font-bold">开篇切口</h3><p className="mt-1 text-sm leading-relaxed text-theme-600">{report.hook}</p></div></div>
                  <div className="flex gap-3"><Check className="mt-0.5 flex-none text-teal-700" size={18} /><div><h3 className="text-sm font-bold">执行建议</h3><p className="mt-1 text-sm leading-relaxed text-theme-600">{report.paceText} {report.adaptationText}</p>{report.personaName && <p className="mt-2 text-xs font-medium text-teal-700">已结合你的创作人格：{report.personaName}</p>}</div></div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-theme-100 pt-5">
                  <p className="text-xs text-theme-600">样本：近 {selected.samples} 日归档 · 置信度 {selected.confidence}</p>
                  <button type="button" onClick={handleCopy} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
                    {copied ? <Check size={16} /> : <Clipboard size={16} />} {copied ? '报告已复制' : '复制报告'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        {error && <p className="mt-8 text-sm text-theme-600">数据加载失败：{error}</p>}
      </main>
    </div>
  )
}
