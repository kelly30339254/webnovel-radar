import { useMemo, useState } from 'react'
import { Check, Copy, Dices, Share2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { useWindData } from '@/hooks/useWindData'
import { usePageMeta } from '@/hooks/usePageMeta'
import { trackEvent } from '@/hooks/useAnalytics'

type Channel = 'male' | 'female'

const PERSONAS: Record<Channel, string[]> = {
  male: ['表面摆烂、暗中满级的小人物', '毒舌但护短的冷门专业天才', '被所有人低估的前朝遗孤', '只想退休却被迫救世的老练宿主'],
  female: ['清醒果断的落魄继承人', '白切黑但极护短的嫡女', '误入豪门的古董修复师', '手握证据却装作失忆的前妻'],
}

const TROPES: Record<Channel, string[]> = {
  male: ['身份连续掉马', '规则反杀', '低调无敌', '限时任务反转'],
  female: ['先婚后爱', '以茶治茶', '追妻火葬场', '双向救赎'],
}

const OPENINGS = [
  '第一章先让主角失去最重要的东西，结尾再揭示失去本身就是入局条件。',
  '从一次公开审判开场，所有人都认为主角必输，第三章给出第一份反证。',
  '开篇给出七日倒计时，第二章出现错误盟友，第三章完成第一次身份反转。',
  '用一场看似普通的签约开场，合同最后一页藏着改变主角命运的规则。',
]

export default function PromptLabPage() {
  const { data, error } = useWindData()
  const [channel, setChannel] = useState<Channel>('male')
  const [genre, setGenre] = useState('auto')
  const [keyword, setKeyword] = useState('auto')
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)

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
    const persona = PERSONAS[channel][(seed * 5 + 2) % PERSONAS[channel].length]
    const trope = TROPES[channel][(seed * 7 + 1) % TROPES[channel].length]
    const opening = OPENINGS[(seed * 3) % OPENINGS.length]
    return {
      genre: selectedGenre,
      keyword: selectedKeyword,
      persona,
      trope,
      opening,
      title: `${selectedKeyword}入局：${persona.replace(/[、，].*$/, '')}`,
      pitch: `一个${persona}，在${selectedGenre}的世界里，借“${trope}”完成第一次逆转。`,
    }
  }, [availableGenres, availableKeywords, channel, data, genre, keyword, seed])

  const drawAgain = () => {
    setSeed((value) => value + 1)
    setCopied(false)
    trackEvent('prompt_draw', { channel })
  }

  const promptText = prompt ? `【今日开书命题】\n暂定书名：${prompt.title}\n题材：${prompt.genre}\n关键词：${prompt.keyword}\n主角：${prompt.persona}\n核心爽点：${prompt.trope}\n一句话：${prompt.pitch}\n前三章：${prompt.opening}` : ''

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
        await navigator.share({ title: '我抽到的今日开书命题', text: promptText, url: `${window.location.origin}/prompt-lab` })
      } else {
        await copyPrompt()
      }
    } catch {
      // 用户取消分享时保留当前命题。
    }
  }

  return (
    <div className="min-h-screen bg-[#fff7f8] text-rose-950">
      <PageHeader title="今日开书命题盲盒" hint="每天的热榜，变成今天能动笔的一张题" />
      <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <section>
            <p className="text-xs font-semibold text-teal-700">DAILY PROMPT LAB</p>
            <h2 className="mt-2 text-2xl font-bold">决定哪些元素交给风向</h2>
            <p className="mt-2 text-sm leading-relaxed text-rose-500">选择“跟随今日风向”时，每次抽取都会从当天榜单和关键词中重新组合。</p>

            <div className="mt-7 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold">频道</legend>
                <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-rose-200 bg-white">
                  {([{ key: 'male', label: '男频' }, { key: 'female', label: '女频' }] as const).map((item) => (
                    <button key={item.key} type="button" onClick={() => { setChannel(item.key); setGenre('auto'); setKeyword('auto'); setSeed(0) }} className={`min-h-10 px-5 text-sm ${channel === item.key ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold">题材
                <select value={genre} onChange={(event) => setGenre(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-rose-200 bg-white px-3 text-sm font-normal outline-none focus:border-rose-400">
                  <option value="auto">跟随今日风向</option>
                  {availableGenres.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </label>

              <label className="block text-sm font-semibold">核心关键词
                <select value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-rose-200 bg-white px-3 text-sm font-normal outline-none focus:border-rose-400">
                  <option value="auto">从热词中抽取</option>
                  {availableKeywords.slice(0, 12).map((item) => <option key={item.word} value={item.word}>{item.word}</option>)}
                </select>
              </label>

              <button type="button" onClick={drawAgain} disabled={!prompt} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
                <Dices size={18} /> 抽一张新命题
              </button>
            </div>
          </section>

          <section aria-live="polite">
            {prompt ? (
              <div className="border border-rose-100 bg-white shadow-sm">
                <div className="border-b border-rose-100 bg-[#fff9fa] px-5 py-4 sm:px-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-rose-500">NO. {String(seed + 1).padStart(3, '0')} · {data?.updatedAt}</p>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">今日命题</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-snug">{prompt.title}</h2>
                </div>
                <div className="space-y-5 p-5 sm:p-7">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border-l-2 border-rose-500 pl-3"><p className="text-xs text-rose-400">题材</p><p className="mt-1 text-sm font-semibold">{prompt.genre}</p></div>
                    <div className="border-l-2 border-teal-600 pl-3"><p className="text-xs text-rose-400">风向关键词</p><p className="mt-1 text-sm font-semibold">{prompt.keyword}</p></div>
                    <div className="border-l-2 border-blue-600 pl-3"><p className="text-xs text-rose-400">主角人设</p><p className="mt-1 text-sm font-semibold">{prompt.persona}</p></div>
                    <div className="border-l-2 border-amber-500 pl-3"><p className="text-xs text-rose-400">核心爽点</p><p className="mt-1 text-sm font-semibold">{prompt.trope}</p></div>
                  </div>
                  <div className="border-t border-rose-100 pt-5"><p className="text-xs font-semibold text-rose-400">一句话梗概</p><p className="mt-2 text-sm leading-relaxed text-rose-800">{prompt.pitch}</p></div>
                  <div><p className="text-xs font-semibold text-rose-400">黄金三章任务</p><p className="mt-2 text-sm leading-relaxed text-rose-800">{prompt.opening}</p></div>
                </div>
                <div className="flex flex-wrap justify-end gap-2 border-t border-rose-100 px-5 py-4 sm:px-7">
                  <button type="button" onClick={copyPrompt} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">
                    {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? '命题已复制' : '复制命题'}
                  </button>
                  <button type="button" onClick={sharePrompt} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
                    <Share2 size={16} /> 分享命题
                  </button>
                </div>
              </div>
            ) : <p className="text-sm text-rose-400">风向数据加载中…</p>}
          </section>
        </div>
        {error && <p className="mt-8 text-sm text-rose-600">数据加载失败：{error}</p>}
      </main>
    </div>
  )
}
