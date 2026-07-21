import { useMemo, useState } from 'react'
import { Check, Copy, Dices, Download, Eye, Share2, Target, Users } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ZhiyuNextStep from '@/components/ZhiyuNextStep'
import { useWindData } from '@/hooks/useWindData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { trackEvent } from '@/hooks/useAnalytics'
import { downloadBlob } from '@/lib/posterCanvas'
import { buildStoryPrompt } from '@/lib/promptGenerator'
import { createPromptPoster } from '@/lib/promptPoster'
import type { PromptChannel } from '@/lib/promptGenerator'

export default function PromptLabPage() {
  const { data, error } = useWindData()
  const [channel, setChannel] = useState<PromptChannel>('male')
  const [genre, setGenre] = useState('auto')
  const [keyword, setKeyword] = useState('auto')
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [posterBusy, setPosterBusy] = useState(false)
  const [posterError, setPosterError] = useState('')

  usePageMeta({
    title: '今日开书命题盲盒',
    description: '用当天热榜题材、关键词和人设，生成一张可直接开写的网文命题卡。',
    path: '/prompt-lab',
  })

  const availableGenres = useMemo(() => (data?.genres ?? []).filter((item) => {
    if (channel === 'male') return !item.name.includes('女频')
    return !item.name.includes('男频')
  }), [channel, data])
  const availableKeywords = useMemo(
    () => channel === 'male' ? data?.keywords.male.tags ?? [] : data?.keywords.female.tags ?? [],
    [channel, data],
  )

  const prompt = useMemo(() => {
    if (!data || !availableGenres.length || !availableKeywords.length) return null
    const selectedGenre = genre === 'auto' ? availableGenres[seed % availableGenres.length].name : genre
    const selectedKeyword = keyword === 'auto' ? availableKeywords[(seed * 3 + 1) % availableKeywords.length].word : keyword
    return buildStoryPrompt({ channel, seed, genre: selectedGenre, keyword: selectedKeyword })
  }, [availableGenres, availableKeywords, channel, data, genre, keyword, seed])

  const drawAgain = () => {
    setSeed((value) => value + 1)
    setCopied(false)
    setPosterError('')
    trackEvent('prompt_draw', { channel, fixedGenre: genre !== 'auto', fixedKeyword: keyword !== 'auto' })
  }

  const promptText = prompt ? [
    '【今日开书命题 · 完整故事骨架】',
    `暂定书名：${prompt.title}`,
    `题材：${prompt.genre}`,
    `关键词：${prompt.keyword}`,
    `主角：${prompt.persona}`,
    `关系：${prompt.relationship}`,
    `目标：${prompt.goal}`,
    `障碍：${prompt.obstacle}`,
    `失败代价：${prompt.stakes}`,
    `隐藏真相：${prompt.secret}`,
    `一句话梗概：${prompt.logline}`,
    ...prompt.chapters.flatMap((chapter) => [
      `${chapter.label}：${chapter.beat}`,
      chapter.cliffhanger,
    ]),
  ].join('\n') : ''

  const copyPrompt = async () => {
    if (!prompt) return
    await navigator.clipboard.writeText(`${promptText}\n${window.location.origin}/prompt-lab`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
    trackEvent('prompt_copy', { channel, genre: prompt.genre })
  }

  const sharePrompt = async () => {
    if (!prompt) return
    trackEvent('prompt_share', { channel, genre: prompt.genre })
    try {
      if (navigator.share) {
        await navigator.share({ title: prompt.title, text: promptText, url: `${window.location.origin}/prompt-lab` })
      } else {
        await copyPrompt()
      }
    } catch {
      // 用户取消系统分享时保留当前命题。
    }
  }

  const handlePoster = async () => {
    if (!prompt || posterBusy) return
    setPosterBusy(true)
    setPosterError('')
    try {
      const blob = await createPromptPoster({
        ...prompt,
        number: seed + 1,
        updatedAt: data?.updatedAt,
      })
      downloadBlob(blob, `命题盲盒-${prompt.title}.png`)
      trackEvent('prompt_poster', { channel, genre: prompt.genre })
    } catch (posterFailure) {
      setPosterError(posterFailure instanceof Error ? posterFailure.message : '海报生成失败，请稍后重试')
    } finally {
      setPosterBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="今日开书命题盲盒" hint="每天的热榜，变成今天能动笔的一张题" />
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[21rem_minmax(0,1fr)] xl:gap-10">
          <section>
            <p className="text-xs font-semibold text-teal-700">DAILY PROMPT LAB</p>
            <h2 className="mt-2 text-2xl font-bold">锁定风向，重组故事</h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-500">固定题材和关键词后仍可连续抽取，人物、关系、冲突与秘密会重新组合。</p>

            <div className="mt-7 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold">频道</legend>
                <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-theme-200 bg-white">
                  {([{ key: 'male', label: '男频' }, { key: 'female', label: '女频' }] as const).map((item) => (
                    <button key={item.key} type="button" onClick={() => { setChannel(item.key); setGenre('auto'); setKeyword('auto'); setSeed(0); setPosterError('') }} className={`min-h-10 px-5 text-sm ${channel === item.key ? 'bg-theme-600 text-white' : 'text-theme-600 hover:bg-theme-50'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold">题材
                <select value={genre} onChange={(event) => { setGenre(event.target.value); setSeed((value) => value + 1); setPosterError('') }} className="mt-2 min-h-11 w-full rounded-lg border border-theme-200 bg-white px-3 text-sm font-normal outline-none focus:border-theme-400">
                  <option value="auto">跟随今日风向</option>
                  {availableGenres.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </label>

              <label className="block text-sm font-semibold">核心关键词
                <select value={keyword} onChange={(event) => { setKeyword(event.target.value); setSeed((value) => value + 1); setPosterError('') }} className="mt-2 min-h-11 w-full rounded-lg border border-theme-200 bg-white px-3 text-sm font-normal outline-none focus:border-theme-400">
                  <option value="auto">从热词中抽取</option>
                  {availableKeywords.slice(0, 12).map((item) => <option key={item.word} value={item.word}>{item.word}</option>)}
                </select>
              </label>

              <button type="button" onClick={drawAgain} disabled={!prompt} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-theme-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-theme-700 disabled:opacity-50">
                <Dices size={18} /> 抽一张新命题
              </button>
            </div>
          </section>

          <section aria-live="polite" className="min-w-0">
            {prompt ? (
              <article className="border border-theme-100 bg-white shadow-sm">
                <header className="border-b border-theme-100 bg-theme-50/70 px-5 py-5 sm:px-7 sm:py-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-theme-500">NO. {String(seed + 1).padStart(3, '0')} · {data?.updatedAt}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-theme-100 px-2.5 py-1 text-xs font-semibold text-theme-700">{prompt.genre}</span>
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{prompt.keyword}</span>
                    </div>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">{prompt.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-theme-700">{prompt.logline}</p>
                </header>

                <div className="px-5 py-6 sm:px-7">
                  <section className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div className="border-l-2 border-blue-500 pl-4">
                      <p className="flex items-center gap-2 text-xs font-semibold text-blue-700"><Users size={15} />主角与关系</p>
                      <p className="mt-2 text-sm font-semibold leading-relaxed">{prompt.persona}</p>
                      <p className="mt-2 text-sm leading-relaxed text-theme-600">{prompt.relationship}</p>
                    </div>
                    <div className="border-l-2 border-emerald-500 pl-4">
                      <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><Target size={15} />目标</p>
                      <p className="mt-2 text-sm font-semibold leading-relaxed">{prompt.goal}</p>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-4">
                      <p className="text-xs font-semibold text-amber-700">障碍与失败代价</p>
                      <p className="mt-2 text-sm font-semibold leading-relaxed">{prompt.obstacle}</p>
                      <p className="mt-2 text-sm leading-relaxed text-theme-600">失败后：{prompt.stakes}</p>
                    </div>
                    <div className="border-l-2 border-violet-500 pl-4">
                      <p className="flex items-center gap-2 text-xs font-semibold text-violet-700"><Eye size={15} />隐藏真相</p>
                      <p className="mt-2 text-sm font-semibold leading-relaxed">{prompt.secret}</p>
                    </div>
                  </section>

                  <section className="mt-7 border-t border-theme-100 pt-6">
                    <div className="flex items-center gap-2">
                      <Dices className="text-theme-500" size={18} />
                      <h3 className="text-base font-bold">黄金三章节拍</h3>
                    </div>
                    <ol className="mt-4 divide-y divide-theme-100 border-y border-theme-100">
                      {prompt.chapters.map((chapter, index) => (
                        <li key={chapter.label} className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)]">
                          <span className="font-mono text-2xl font-bold text-theme-600">0{index + 1}</span>
                          <div>
                            <h4 className="text-sm font-bold text-theme-900">{chapter.label}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-theme-700">{chapter.beat}</p>
                            <p className="mt-2 text-xs font-medium leading-relaxed text-teal-700">{chapter.cliffhanger}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>

                <footer className="flex flex-wrap justify-end gap-2 border-t border-theme-100 bg-theme-50/70 px-5 py-4 sm:px-7">
                  <button type="button" onClick={copyPrompt} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-theme-200 bg-white px-4 py-2 text-sm font-medium text-theme-700 hover:bg-theme-50">
                    {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? '命题已复制' : '复制命题'}
                  </button>
                  <button type="button" onClick={sharePrompt} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50">
                    <Share2 size={16} /> 分享文本
                  </button>
                  <button type="button" onClick={handlePoster} disabled={posterBusy} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60">
                    <Download size={16} /> {posterBusy ? '正在生成' : '下载分享海报'}
                  </button>
                </footer>
                <ZhiyuNextStep
                  title={`把《${prompt.title}》继续写成完整大纲`}
                  description="保留这张命题作为故事起点，继续扩展人物线、冲突升级和章节节拍。"
                  placement="prompt_result"
                />
              </article>
            ) : <p className="text-sm text-theme-700">风向数据加载中…</p>}
            {posterError && <p className="mt-3 text-sm text-theme-600">{posterError}</p>}
          </section>
        </div>
        {error && <p className="mt-8 text-sm text-theme-600">数据加载失败：{error}</p>}
      </main>
    </div>
  )
}
