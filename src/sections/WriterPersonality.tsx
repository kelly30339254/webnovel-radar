import { useMemo, useState } from 'react'
import SectionTitle from '@/sections/SectionTitle'

type Dimension = 'pace' | 'idea' | 'emotion' | 'plan'

type Option = {
  text: string
  score: Partial<Record<Dimension, number>>
}

type Question = {
  id: number
  text: string
  options: [Option, Option]
}

const QUESTIONS: Question[] = [
  // pace: B vs G
  { id: 1, text: '打开文档第一件事是？', options: [{ text: '立刻开写，键盘起火', score: { pace: 1 } }, { text: '先刷两小时视频找灵感', score: { pace: -1 } }] },
  { id: 2, text: '读者催更时你的反应？', options: [{ text: '再更三章让他们跪下', score: { pace: 1 } }, { text: '装作没看见，继续潜水', score: { pace: -1 } }] },
  { id: 3, text: '你的存稿箱状态是？', options: [{ text: '未来一个月的章节已排好', score: { pace: 1 } }, { text: '打开是空的，心里是虚的', score: { pace: -1 } }] },
  { id: 4, text: '休息日的正确打开方式是？', options: [{ text: '爆更一万字然后睡觉', score: { pace: 1 } }, { text: '睡觉，醒来再说', score: { pace: -1 } }] },
  { id: 5, text: '如果编辑说今天必须交稿，你会？', options: [{ text: '三小时赶出一万字', score: { pace: 1 } }, { text: '开始研究怎么装病', score: { pace: -1 } }] },
  // idea: S vs N
  { id: 6, text: '新书的灵感通常来自？', options: [{ text: '把最近看的三部剧 fused 在一起', score: { idea: 1 } }, { text: '做梦梦见的奇幻世界', score: { idea: -1 } }] },
  { id: 7, text: '你更擅长写？', options: [{ text: '读者熟悉的套路但换皮', score: { idea: 1 } }, { text: '读者看不懂但你觉得很酷的设定', score: { idea: -1 } }] },
  { id: 8, text: '看到热梗时？', options: [{ text: '立刻融进下一章', score: { idea: 1 } }, { text: '这梗太 low，我要自创一个宇宙', score: { idea: -1 } }] },
  { id: 9, text: '写玄幻时世界观的构建？', options: [{ text: '参考经典设定微调', score: { idea: 1 } }, { text: '从量子力学开始重新发明', score: { idea: -1 } }] },
  { id: 10, text: '朋友说你剧情眼熟，你会？', options: [{ text: '这叫致敬，懂不懂', score: { idea: 1 } }, { text: '那是他们看不懂我的隐喻', score: { idea: -1 } }] },
  // emotion: L vs Q
  { id: 11, text: '主角被背叛了，你选择？', options: [{ text: '设计一个反转揭露幕后黑手', score: { emotion: 1 } }, { text: '让主角哭三万字读者陪我哭', score: { emotion: -1 } }] },
  { id: 12, text: '写感情戏最重要的是？', options: [{ text: '动机合理，行为符合人设', score: { emotion: 1 } }, { text: '让读者心脏骤停', score: { emotion: -1 } }] },
  { id: 13, text: '你更喜欢的结局？', options: [{ text: '所有伏笔回收，逻辑闭环', score: { emotion: 1 } }, { text: '开放式的，留一个让人心梗的画面', score: { emotion: -1 } }] },
  { id: 14, text: '主角的强大应该靠？', options: [{ text: '严密的升级体系和努力', score: { emotion: 1 } }, { text: '爱、恨与命运', score: { emotion: -1 } }] },
  { id: 15, text: '读者吐槽剧情 bug，你会？', options: [{ text: '连夜写补丁解释', score: { emotion: 1 } }, { text: '那是爱的痛，不是 bug', score: { emotion: -1 } }] },
  // plan: D vs J
  { id: 16, text: '开新文前？', options: [{ text: '人物小传、地图、时间线一应俱全', score: { plan: 1 } }, { text: '有一个爽点就敢发', score: { plan: -1 } }] },
  { id: 17, text: '写到中段发现设定冲突，你会？', options: [{ text: '回去翻大纲改伏笔', score: { plan: 1 } }, { text: '现场打补丁，下章再说', score: { plan: -1 } }] },
  { id: 18, text: '你对细纲的态度？', options: [{ text: '没有细纲就像裸奔', score: { plan: 1 } }, { text: '细纲会限制我的灵魂', score: { plan: -1 } }] },
  { id: 19, text: '旅行时灵感来了？', options: [{ text: '记进备忘录，回家整理进大纲', score: { plan: 1 } }, { text: '直接掏出手机开始写', score: { plan: -1 } }] },
  { id: 20, text: '小说写到一半想换主角，你会？', options: [{ text: '不行，大纲不允许', score: { plan: 1 } }, { text: '好主意，这就换', score: { plan: -1 } }] },
]

type ResultKey = 'BSLD' | 'BSLJ' | 'BSQD' | 'BSQJ' | 'BNLD' | 'BNLJ' | 'BNQD' | 'BNQJ' | 'GSLD' | 'GSLJ' | 'GSQD' | 'GSQJ' | 'GNLD' | 'GNLJ' | 'GNQD' | 'GNQJ'

const RESULTS: Record<ResultKey, { icon: string; name: string; desc: string }> = {
  BSLD: { icon: '🤖', name: '人形打字机', desc: '日更两万不眨眼，大纲比正文还长，设定缝合得严丝合缝，读者以为你买了机器人代写。' },
  BSLJ: { icon: '🚀', name: '灵感喷射机', desc: '爆更靠一时冲动，缝合靠临时起意，逻辑在线但写哪算哪，读者永远猜不到下一章。' },
  BSQD: { icon: '🏭', name: '狗血流水线', desc: '每天稳定产出车祸、失忆、替身、追妻火葬场，大纲精确到每一滴眼泪。' },
  BSQJ: { icon: '🐕', name: '疯狗型创作者', desc: '今天甜明天虐，设定东拼西凑但情绪拉满，读者一边骂一边追更。' },
  BNLD: { icon: '🧠', name: '设定狂魔', desc: '脑洞大到能装下整个宇宙，大纲写了五十万字，正文还在第一章。' },
  BNLJ: { icon: '⛲', name: '灵感喷泉', desc: '脑洞一个接一个，更新也快，但每章都在挖坑，读者追着填。' },
  BNQD: { icon: '🏛️', name: '虐恋建筑师', desc: '天马行空的爱情故事，逻辑严密地刀主角，刀刀致命。' },
  BNQJ: { icon: '🎢', name: '情绪过山车', desc: '脑洞大、情绪猛、更新猛，但剧情走向全凭手感。' },
  GSLD: { icon: '🐌', name: '精密拖延症', desc: '大纲完美、设定缝合、逻辑严密，就是一年更三章。' },
  GSLJ: { icon: '💡', name: '灵光一闪鸽', desc: '平时鸽，一旦灵感来了就爆更，然后继续鸽。' },
  GSQD: { icon: '🕊️', name: '悲情鸽王', desc: '脑内已经写完三百万字虐文，实际文档空空如也。' },
  GSQJ: { icon: '🧘', name: '佛系摆烂型', desc: '写文看缘分，更新看心情，读者等成化石。' },
  GNLD: { icon: '📝', name: '完美主义鸽', desc: '脑洞超大、大纲超细，但总觉得不够好，永远在改设定。' },
  GNLJ: { icon: '📚', name: '脑洞收藏鸽', desc: '每天收藏一百个灵感，一个都没写成正文。' },
  GNQD: { icon: '🌙', name: '深夜 emo 鸽', desc: '半夜灵感爆发写三千字虐文，天亮删了，继续鸽。' },
  GNQJ: { icon: '🛌', name: '彻底躺平型', desc: '脑洞有，情绪有，就是不写。收藏夹里躺着我的十万字大纲。' },
}

function calculateResult(scores: Record<Dimension, number>): ResultKey {
  const p = scores.pace >= 0 ? 'B' : 'G'
  const i = scores.idea >= 0 ? 'S' : 'N'
  const e = scores.emotion >= 0 ? 'L' : 'Q'
  const pl = scores.plan >= 0 ? 'D' : 'J'
  return `${p}${i}${e}${pl}` as ResultKey
}

export default function WriterPersonality() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<Dimension, number>>({ pace: 0, idea: 0, emotion: 0, plan: 0 })
  const [result, setResult] = useState<ResultKey | null>(null)

  const progress = useMemo(() => Math.round((index / QUESTIONS.length) * 100), [index])
  const current = QUESTIONS[index]

  const handleAnswer = (option: Option) => {
    const next = { ...answers }
    Object.entries(option.score).forEach(([k, v]) => {
      next[k as Dimension] += v
    })
    if (index + 1 >= QUESTIONS.length) {
      setResult(calculateResult(next))
    } else {
      setAnswers(next)
      setIndex(index + 1)
    }
  }

  const reset = () => {
    setStarted(false)
    setIndex(0)
    setAnswers({ pace: 0, idea: 0, emotion: 0, plan: 0 })
    setResult(null)
  }

  return (
    <section className="mt-10">
      <SectionTitle id="writer-personality" title="网文十六型人格" hint="沙雕版 NBTI 测试" />
      <div className="card-pink mt-4 rounded-2xl border border-rose-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
        {!started ? (
          <div className="text-center">
            <p className="text-4xl">📝</p>
            <h3 className="mt-2 text-lg font-bold text-rose-950">测测你的网文十六型人格</h3>
            <p className="mt-1 text-sm text-rose-400">20 道题，测出你到底是爆更狂魔还是万年鸽王</p>
            <button
              onClick={() => setStarted(true)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-600"
            >
              开始测试
            </button>
          </div>
        ) : result ? (
          <div className="text-center">
            {RESULTS[result] ? (
              <>
                <p className="text-6xl">{RESULTS[result].icon}</p>
                <p className="mt-3 text-xs font-medium tracking-widest text-rose-400">{result}</p>
                <h3 className="mt-1 text-2xl font-bold text-rose-950">{RESULTS[result].name}</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-rose-700">{RESULTS[result].desc}</p>
              </>
            ) : (
              <>
                <p className="text-4xl">🤔</p>
                <p className="mt-3 text-xs font-medium tracking-widest text-rose-400">{result}</p>
                <h3 className="mt-1 text-xl font-bold text-rose-950">人格加载失败</h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-rose-700">这个结果好像走丢啦，请再测一次。</p>
              </>
            )}
            <button
              onClick={reset}
              className="mt-5 inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
            >
              再测一次
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-rose-400">
              <span>
                第 {index + 1} / {QUESTIONS.length} 题
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
                  onClick={() => handleAnswer(opt)}
                  className="rounded-xl border border-rose-100 bg-white px-4 py-3 text-left text-sm text-rose-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
