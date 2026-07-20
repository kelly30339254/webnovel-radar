import { useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, Download, RotateCcw, Share2, Users } from 'lucide-react'
import SectionTitle from '@/sections/SectionTitle'
import { trackEvent } from '@/hooks/useAnalytics'
import {
  NBTI_DIMENSIONS,
  NBTI_QUESTIONS,
  NBTI_RESULTS,
  NBTI_STORAGE_KEY,
  calculateNbti,
  defaultScores,
  resultPath,
  resultUrl,
} from '@/lib/nbti'
import type { NbtiScores, ResultKey } from '@/lib/nbti'
import { createNbtiPoster } from '@/lib/nbtiPoster'
import { downloadBlob } from '@/lib/posterCanvas'

type Feedback = 'copied' | 'saved' | 'challenged' | null

function DimensionProfile({ scores }: { scores: NbtiScores }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {NBTI_DIMENSIONS.map((dimension) => {
        const score = scores[dimension.key]
        return (
          <div key={dimension.key}>
            <div className="flex items-center justify-between text-xs font-medium text-theme-900">
              <span>{dimension.left} {score}%</span>
              <span className="text-theme-700">{100 - score}% {dimension.right}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-theme-100" role="img" aria-label={`${dimension.left} ${score}%，${dimension.right} ${100 - score}%`}>
              <span className="block h-full rounded-full" style={{ width: `${score}%`, backgroundColor: dimension.color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
export function NbtiResult({ result, scores, onReset }: { result: ResultKey; scores: NbtiScores; onReset: () => void }) {
  const info = NBTI_RESULTS[result]
  const [feedback, setFeedback] = useState<Feedback>(null)
  const shareText = `我的网文创作人格是「${info.name}」：${info.desc} 适合题材：${info.genres.join('、')}。来看看我们适不适合一起写文。`

  const showFeedback = (value: Feedback) => {
    setFeedback(value)
    window.setTimeout(() => setFeedback(null), 2200)
  }

  const handleShare = async () => {
    const url = resultUrl(result, 'result_share')
    trackEvent('nbti_share', { result })
    try {
      if (navigator.share) {
        await navigator.share({ title: `我是${info.name}｜网文十六型人格`, text: shareText, url })
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${url}`)
        showFeedback('copied')
      }
    } catch {
      // 用户取消分享时保持当前结果页。
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${resultUrl(result, 'copy')}`)
    trackEvent('nbti_copy', { result })
    showFeedback('copied')
  }

  const handlePoster = async () => {
    const blob = await createNbtiPoster(info, result, scores)
    downloadBlob(blob, `网文创作人格-${info.name}.png`)
    trackEvent('nbti_poster_save', { result })
    showFeedback('saved')
  }

  const handleChallenge = async () => {
    const text = `我测出了「${info.name}」，你会是哪一种网文作者？测完看看我们适不适合合写。`
    const url = resultUrl(result, 'friend_challenge')
    trackEvent('nbti_challenge', { result })
    try {
      if (navigator.share) {
        await navigator.share({ title: '网文创作人格好友挑战', text, url })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        showFeedback('challenged')
      }
    } catch {
      // 用户取消分享时保持当前结果页。
    }
  }

  return (
    <div>
      <div className="text-center">
        <p className="text-6xl md:text-7xl">{info.icon}</p>
        <p className="mt-3 text-xs font-semibold text-theme-700">{result}</p>
        <h2 className="mt-1 text-2xl font-bold text-theme-950 md:text-3xl">{info.name}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-theme-700 md:text-base">{info.desc}</p>
      </div>

      <DimensionProfile scores={scores} />

      <div className="mt-6 border-t border-theme-100 pt-5">
        <p className="text-xs font-semibold text-theme-800">适合题材</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {info.genres.map((genre, index) => (
            <span
              key={genre}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${index === 1 ? 'bg-teal-50 text-teal-700' : index === 2 ? 'bg-amber-50 text-amber-700' : 'bg-theme-50 text-theme-700'}`}
            >
              {genre}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold text-theme-800">参考爆款</p>
        <ul className="mt-2 grid gap-1 text-xs text-theme-600 sm:grid-cols-2">
          {info.examples.map((example) => <li key={example}>{example}</li>)}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
        <button onClick={handlePoster} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-theme-600 px-4 py-2 text-sm font-medium text-white hover:bg-theme-700">
          <Download size={16} />
          {feedback === 'saved' ? '海报已保存' : '保存海报'}
        </button>
        <button onClick={handleShare} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
          <Share2 size={16} /> 分享结果
        </button>
        <button onClick={handleCopy} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-theme-200 bg-white px-4 py-2 text-sm font-medium text-theme-700 hover:bg-theme-50">
          {feedback === 'copied' ? <Check size={16} /> : <Copy size={16} />}
          {feedback === 'copied' ? '文案已复制' : '复制文案'}
        </button>
        <button onClick={handleChallenge} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">
          <Users size={16} />
          {feedback === 'challenged' ? '挑战已复制' : '好友挑战'}
        </button>
      </div>
      <div className="mt-4 text-center">
        <button onClick={onReset} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-theme-500 hover:text-theme-700">
          <RotateCcw size={14} /> 再测一次
        </button>
      </div>
    </div>
  )
}

export default function NbtiTester({ standalone = false, initialResult }: { standalone?: boolean; initialResult?: ResultKey | null }) {
  const [started, setStarted] = useState(Boolean(initialResult))
  const [index, setIndex] = useState(initialResult ? NBTI_QUESTIONS.length : 0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<ResultKey | null>(initialResult ?? null)
  const [scores, setScores] = useState<NbtiScores>(() => initialResult ? defaultScores(initialResult) : { pace: 50, idea: 50, emotion: 50, plan: 50 })

  const progress = useMemo(() => Math.round((index / NBTI_QUESTIONS.length) * 100), [index])
  const current = NBTI_QUESTIONS[index]

  const handleAnswer = (optionIndex: number) => {
    if (!current) return
    const next = { ...answers, [current.id]: optionIndex === 0 ? 1 : -1 }
    if (index + 1 >= NBTI_QUESTIONS.length) {
      const calculated = calculateNbti(next)
      setResult(calculated.key)
      setScores(calculated.scores)
      window.localStorage.setItem(NBTI_STORAGE_KEY, JSON.stringify(calculated))
      window.history.replaceState({}, '', resultPath(calculated.key, 'completed'))
      trackEvent('nbti_complete', { result: calculated.key })
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
    window.history.replaceState({}, '', '/nbti')
  }

  return (
    <section className={`${standalone ? 'min-h-[70vh] py-4' : 'mt-10'}`}>
      {!standalone && <SectionTitle id="writer-personality" title="网文十六型人格" hint="创作人格测试" />}
      <div className={`card-pink border border-theme-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-7 ${standalone ? 'mx-auto max-w-2xl rounded-lg' : 'mt-4 rounded-lg'}`}>
        {!started ? (
          <div className="py-3 text-center">
            <p className="text-4xl">📝</p>
            <h2 className="mt-3 text-lg font-bold text-theme-950">60 秒测出你的网文创作人格</h2>
            <p className="mt-1 text-sm text-theme-500">20 道二选一，看看你是爆更派、脑洞派，还是精密鸽王</p>
            <button
              onClick={() => {
                setStarted(true)
                trackEvent('nbti_start')
              }}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-theme-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-theme-700"
            >
              开始测试 <ArrowRight size={16} />
            </button>
          </div>
        ) : result ? (
          <NbtiResult result={result} scores={scores} onReset={reset} />
        ) : current ? (
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-theme-500">
              <span>第 {index + 1} / {NBTI_QUESTIONS.length} 题</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-theme-100">
              <div className="h-full rounded-full bg-theme-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-6 text-lg font-semibold text-theme-950">{current.text}</p>
            <div className="mt-5 grid gap-3">
              {current.options.map((option, optionIndex) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(optionIndex)}
                  className="min-h-12 rounded-lg border border-theme-100 bg-white px-4 py-3 text-left text-sm text-theme-800 shadow-sm hover:border-theme-300 hover:bg-theme-50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
