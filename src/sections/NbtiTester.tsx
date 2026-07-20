import { useEffect, useMemo, useState } from 'react'
import { Share2, RotateCcw, ArrowRight, Check } from 'lucide-react'
import SectionTitle from '@/sections/SectionTitle'
import { trackEvent } from '@/hooks/useAnalytics'

export const NBTI_QUESTIONS = [
  { id: 1, text: '打开文档第一件事是？', options: ['立刻开写，键盘起火', '先刷两小时视频找灵感'], dim: 'pace', sign: 1 },
  { id: 2, text: '读者催更时你的反应？', options: ['再更三章让他们跪下', '装作没看见，继续潜水'], dim: 'pace', sign: 1 },
  { id: 3, text: '你的存稿箱状态是？', options: ['未来一个月的章节已排好', '打开是空的，心里是虚的'], dim: 'pace', sign: 1 },
  { id: 4, text: '休息日的正确打开方式是？', options: ['爆更一万字然后睡觉', '睡觉，醒来再说'], dim: 'pace', sign: 1 },
  { id: 5, text: '如果编辑说今天必须交稿，你会？', options: ['三小时赶出一万字', '开始研究怎么装病'], dim: 'pace', sign: 1 },
  { id: 6, text: '新书的灵感通常来自？', options: ['把最近看的三部剧 fused 在一起', '做梦梦见的奇幻世界'], dim: 'idea', sign: 1 },
  { id: 7, text: '你更擅长写？', options: ['读者熟悉的套路但换皮', '读者看不懂但你觉得很酷的设定'], dim: 'idea', sign: 1 },
  { id: 8, text: '看到热梗时？', options: ['立刻融进下一章', '这梗太 low，我要自创一个宇宙'], dim: 'idea', sign: 1 },
  { id: 9, text: '写玄幻时世界观的构建？', options: ['参考经典设定微调', '从量子力学开始重新发明'], dim: 'idea', sign: 1 },
  { id: 10, text: '朋友说你剧情眼熟，你会？', options: ['这叫致敬，懂不懂', '那是他们看不懂我的隐喻'], dim: 'idea', sign: 1 },
  { id: 11, text: '主角被背叛了，你选择？', options: ['设计一个反转揭露幕后黑手', '让主角哭三万字读者陪我哭'], dim: 'emotion', sign: 1 },
  { id: 12, text: '写感情戏最重要的是？', options: ['动机合理，行为符合人设', '让读者心脏骤停'], dim: 'emotion', sign: 1 },
  { id: 13, text: '你更喜欢的结局？', options: ['所有伏笔回收，逻辑闭环', '开放式的，留一个让人心梗的画面'], dim: 'emotion', sign: 1 },
  { id: 14, text: '主角的强大应该靠？', options: ['严密的升级体系和努力', '爱、恨与命运'], dim: 'emotion', sign: 1 },
  { id: 15, text: '读者吐槽剧情 bug，你会？', options: ['连夜写补丁解释', '那是爱的痛，不是 bug'], dim: 'emotion', sign: 1 },
  { id: 16, text: '开新文前？', options: ['人物小传、地图、时间线一应俱全', '有一个爽点就敢发'], dim: 'plan', sign: 1 },
  { id: 17, text: '写到中段发现设定冲突，你会？', options: ['回去翻大纲改伏笔', '现场打补丁，下章再说'], dim: 'plan', sign: 1 },
  { id: 18, text: '你对细纲的态度？', options: ['没有细纲就像裸奔', '细纲会限制我的灵魂'], dim: 'plan', sign: 1 },
  { id: 19, text: '旅行时灵感来了？', options: ['记进备忘录，回家整理进大纲', '直接掏出手机开始写'], dim: 'plan', sign: 1 },
  { id: 20, text: '小说写到一半想换主角，你会？', options: ['不行，大纲不允许', '好主意，这就换'], dim: 'plan', sign: 1 },
] as const

type Dimension = 'pace' | 'idea' | 'emotion' | 'plan'
type ResultKey = string

export const NBTI_RESULTS: Record<ResultKey, { icon: string; name: string; desc: string; genres: string[]; examples: string[] }> = {
  BSLD: { icon: '🤖', name: '人形打字机', desc: '日更两万不眨眼，大纲比正文还长，设定缝合得严丝合缝，读者以为你买了机器人代写。', genres: ['系统爽文', '都市高武', '玄幻升级'], examples: ['《开局大帝：我的弟子全是逆天体质》', '《嘉豪就变强？操场雨中舞剑开天门》'] },
  BSLJ: { icon: '🚀', name: '灵感喷射机', desc: '爆更靠一时冲动，缝合靠临时起意，逻辑在线但写哪算哪，读者永远猜不到下一章。', genres: ['都市脑洞', '快穿', '沙雕文'], examples: ['《直播研发丧尸病毒，吓坏全国网友》', '《脑子一热，强吻了我哥的同窗好友》'] },
  BSQD: { icon: '🏭', name: '狗血流水线', desc: '每天稳定产出车祸、失忆、替身、追妻火葬场，大纲精确到每一滴眼泪。', genres: ['豪门总裁', '替身虐恋', '追妻火葬场'], examples: ['《穿成财阀太子爷的作精前女友》', '《妹宝假装被催眠，阴湿哥哥上瘾了》'] },
  BSQJ: { icon: '🐕', name: '疯狗型创作者', desc: '今天甜明天虐，设定东拼西凑但情绪拉满，读者一边骂一边追更。', genres: ['强制爱', '疯批男主', '情绪过山车'], examples: ['《好一个乖乖女》', '《盛夏青苹果》'] },
  BNLD: { icon: '🧠', name: '设定狂魔', desc: '脑洞大到能装下整个宇宙，大纲写了五十万字，正文还在第一章。', genres: ['玄幻修仙', '科幻', '世界观向'], examples: ['《斗罗大陆外传》', '《斗破苍穹番外》'] },
  BNLJ: { icon: '⛲', name: '灵感喷泉', desc: '脑洞一个接一个，更新也快，但每章都在挖坑，读者追着填。', genres: ['同人衍生', '无限流', '脑洞文'], examples: ['《穿越黑袍，开局成为士兵男孩》', '《崩铁，穿越成怪兽，被爻光买回家》'] },
  BNQD: { icon: '🏛️', name: '虐恋建筑师', desc: '天马行空的爱情故事，逻辑严密地刀主角，刀刀致命。', genres: ['虐恋情深', 'BE美学', '宫廷权谋'], examples: ['《入宫即高位，我是陛下表妹我怕谁》', '《发配边关，罪妻开荒养出战神》'] },
  BNQJ: { icon: '🎢', name: '情绪过山车', desc: '脑洞大、情绪猛、更新猛，但剧情走向全凭手感。', genres: ['脑洞虐恋', '反转甜宠', '疯批文'], examples: ['《顾先生，搭个伙》', '《放弃家产后，我荣耀归来》'] },
  GSLD: { icon: '🐌', name: '精密拖延症', desc: '大纲完美、设定缝合、逻辑严密，就是一年更三章。', genres: ['权谋', '历史', '正剧向'], examples: ['《军阀：大帅义子，前方过境黄桂村》', '《从纨绔到镇北侯我统领天下》'] },
  GSLJ: { icon: '💡', name: '灵光一闪鸽', desc: '平时鸽，一旦灵感来了就爆更，然后继续鸽。', genres: ['短篇', '单元剧', '灵感驱动'], examples: ['《潜龙出山，有眼不识金镶玉》', '《斩仙台AI真人版》'] },
  GSQD: { icon: '🕊️', name: '悲情鸽王', desc: '脑内已经写完三百万字虐文，实际文档空空如也。', genres: ['虐文', '救赎', '青春疼痛'], examples: ['《逃离他的岛》', '《盛夏来信》'] },
  GSQJ: { icon: '🧘', name: '佛系摆烂型', desc: '写文看缘分，更新看心情，读者等成化石。', genres: ['种田', '日常', '慢热'], examples: ['《家里家外》', '《分家只给枯井，我挖出灵泉》'] },
  GNLD: { icon: '📝', name: '完美主义鸽', desc: '脑洞超大、大纲超细，但总觉得不够好，永远在改设定。', genres: ['史诗奇幻', '科幻', '硬核设定'], examples: ['《完美世界动画版》', '《吞噬星空》'] },
  GNLJ: { icon: '📚', name: '脑洞收藏鸽', desc: '每天收藏一百个灵感，一个都没写成正文。', genres: ['无限流', '综漫', '同人'], examples: ['《神印王座》', '《一念永恒》'] },
  GNQD: { icon: '🌙', name: '深夜 emo 鸽', desc: '半夜灵感爆发写三千字虐文，天亮删了，继续鸽。', genres: ['青春救赎', '暗恋', '虐恋'], examples: ['《以爱为家第二季》', '《婚夜》'] },
  GNQJ: { icon: '🛌', name: '彻底躺平型', desc: '脑洞有，情绪有，就是不写。收藏夹里躺着我的十万字大纲。', genres: ['轻松日常', '沙雕', '咸鱼流'], examples: ['《我在AI世界当大佬》', '《凡人修仙传》'] },
}

function calculateResult(answers: Record<number, number>): ResultKey {
  const scores: Record<Dimension, number> = { pace: 0, idea: 0, emotion: 0, plan: 0 }
  NBTI_QUESTIONS.forEach((q) => {
    const v = answers[q.id] ?? 0
    scores[q.dim] += q.sign * v
  })
  const p = scores.pace >= 0 ? 'B' : 'G'
  const i = scores.idea >= 0 ? 'S' : 'N'
  const e = scores.emotion >= 0 ? 'L' : 'Q'
  const pl = scores.plan >= 0 ? 'D' : 'J'
  return `${p}${i}${e}${pl}`
}

function shareResultUrl(key: ResultKey) {
  const url = new URL(window.location.href)
  url.searchParams.set('r', key)
  return url.toString()
}

export function NbtiResult({ result, onReset }: { result: ResultKey; onReset: () => void }) {
  const info = NBTI_RESULTS[result]
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = shareResultUrl(result)
    const text = `我在网文风向测出了「${info?.name ?? result}」人格，快来测测你的网文十六型人格！`
    trackEvent('nbti_share', { result })
    try {
      if (navigator.share) {
        await navigator.share({ title: '网文十六型人格测试', text, url })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // ignore
    }
  }

  if (!info) {
    return (
      <div className="text-center">
        <p className="text-4xl">🤔</p>
        <p className="mt-3 text-xs font-medium tracking-widest text-rose-400">{result}</p>
        <h3 className="mt-1 text-xl font-bold text-rose-950">人格加载失败</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-rose-700">这个结果好像走丢啦，请再测一次。</p>
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
        >
          <RotateCcw size={14} />
          再测一次
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="text-6xl md:text-7xl">{info.icon}</p>
      <p className="mt-3 text-xs font-medium tracking-widest text-rose-400">{result}</p>
      <h3 className="mt-1 text-2xl font-bold text-rose-950 md:text-3xl">{info.name}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-rose-700 md:text-base">{info.desc}</p>

      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-left">
        <p className="text-xs font-semibold text-rose-800">适合题材</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {info.genres.map((g) => (
            <span key={g} className="rounded-full bg-white px-2.5 py-1 text-xs text-rose-600 shadow-sm">
              {g}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold text-rose-800">参考爆款</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-rose-600">
          {info.examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-600"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? '已复制链接' : '分享结果'}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
        >
          <RotateCcw size={16} />
          再测一次
        </button>
      </div>
    </div>
  )
}

export default function NbtiTester({ standalone = false, initialResult }: { standalone?: boolean; initialResult?: ResultKey | null }) {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<ResultKey | null>(initialResult ?? null)

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult)
      setStarted(true)
      setIndex(NBTI_QUESTIONS.length)
    }
  }, [initialResult])

  const progress = useMemo(() => Math.round((index / NBTI_QUESTIONS.length) * 100), [index])
  const current = NBTI_QUESTIONS[index]

  const handleAnswer = (optionIndex: number) => {
    const next = { ...answers, [current.id]: optionIndex === 0 ? 1 : -1 }
    if (index + 1 >= NBTI_QUESTIONS.length) {
      const r = calculateResult(next)
      setResult(r)
      window.history.replaceState({}, '', shareResultUrl(r))
      trackEvent('nbti_complete', { result: r })
    } else {
      setAnswers(next)
      setIndex(index + 1)
    }
  }

  const reset = () => {
    setStarted(false)
    setIndex(0)
    setAnswers({})
    setResult(null)
    window.history.replaceState({}, '', window.location.pathname)
  }

  const wrapper = standalone ? 'min-h-[70vh]' : ''

  return (
    <section className={`${wrapper} ${standalone ? 'py-6' : 'mt-10'}`}>
      {!standalone && <SectionTitle id="writer-personality" title="网文十六型人格" hint="沙雕版 NBTI 测试" />}
      <div className={`card-pink ${standalone ? 'mx-auto max-w-2xl' : 'mt-4'} rounded-2xl border border-rose-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm`}>
        {!started ? (
          <div className="text-center">
            <p className="text-4xl">📝</p>
            <h3 className="mt-2 text-lg font-bold text-rose-950">测测你的网文十六型人格</h3>
            <p className="mt-1 text-sm text-rose-400">20 道题，测出你到底是爆更狂魔还是万年鸽王</p>
            <button
              onClick={() => {
                setStarted(true)
                trackEvent('nbti_start')
              }}
              className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-600"
            >
              开始测试
              <ArrowRight size={14} />
            </button>
          </div>
        ) : result ? (
          <NbtiResult result={result} onReset={reset} />
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-rose-400">
              <span>
                第 {index + 1} / {NBTI_QUESTIONS.length} 题
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-rose-100">
              <div
                className="h-full rounded-full bg-rose-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-5 text-lg font-medium text-rose-950">{current.text}</p>
            <div className="mt-5 grid gap-3">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="rounded-xl border border-rose-100 bg-white px-4 py-3 text-left text-sm text-rose-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
