import { useEffect } from 'react'
import { CalendarDays, X } from 'lucide-react'
import { Heart } from '@/sections/Stickers'

function BeatHeart({ size = 64, color = '#e11d48' }: { size?: number; color?: string }) {
  return (
    <span className="heart-beat inline-block leading-none">
      <Heart size={size} color={color} />
    </span>
  )
}

interface EasterEggProps {
  active: boolean
  onClose: () => void
  date: string
}

const LOVE_LINES = [
  '今天也还是，很喜欢你。',
  '见不到你的时候，也会认真想你。',
  '和你分享日常，是我每天的小期待。',
  '你不用特别完美，我就是很喜欢你。',
  '遇见你之后，普通的日子也有了纪念意义。',
  '想把今天遇到的好心情，也分一半给你。',
  '你一开心，我的世界就跟着亮一点。',
  '不管今天怎样，你一直都是我偏爱的人。',
  '喜欢你这件事，今天也没有请假。',
  '每天都会有新的事发生，我喜欢你这件事不变。',
  '你在我的生活里，本身就是一件很好的事。',
  '想陪你看很多次日落，也想陪你过普通的一天。',
  '今天的心动额度，也全部留给你。',
]

const CARE_LINES = [
  '忙的时候记得喝水，别把自己排在最后。',
  '三餐要按时吃，胃不舒服就别硬撑。',
  '累了就停一会儿，今天不用什么都做完。',
  '出门慢一点，平平安安最重要。',
  '空调不要开得太低，记得照顾好自己。',
  '坐久了起来走一走，眼睛也休息一下。',
  '不开心可以说出来，不必一个人消化。',
  '困了就早点睡，明天的事交给明天。',
  '别因为忙就随便应付一顿饭。',
  '回家路上注意安全，到家就好好休息。',
  '天气再热也别贪凉，舒服比痛快更重要。',
  '今天也要记得，对自己温柔一点。',
  '事情很多也别着急，一件一件来就好。',
  '如果感觉疲惫，就允许自己慢半拍。',
  '照顾别人之前，也要先照顾好你自己。',
  '别把小情绪憋太久，我愿意认真听。',
  '工作再忙，也给自己留一点喘气的时间。',
]

const COMFORT_LINES = [
  '做得不够完美也没关系，你已经很认真了。',
  '偶尔没有状态，不代表你不够好。',
  '难过的时候不用装作没事，我会站在你这边。',
  '今天没有完成的事，不会减少你的可爱。',
  '别用一件不顺心的小事，否定认真生活的自己。',
  '你可以有小脾气，也可以放心做真实的自己。',
  '慢一点没关系，我们不是在和谁比赛。',
  '有些答案会晚一点来，先好好过今天。',
  '你已经走了很远，记得偶尔回头夸夸自己。',
  '遇到麻烦就一起想办法，不要先责怪自己。',
  '今天如果有点糟，也只是一天，不是全部。',
  '不用时时坚强，在我这里可以放心松一口气。',
  '哪怕只是完成一件小事，也值得被肯定。',
  '允许自己休息，是认真生活的一部分。',
  '不确定的时候先别怕，我会陪你慢慢想。',
  '你的感受很重要，不需要为它道歉。',
  '生活偶尔打结，我们就耐心一点把它解开。',
  '今天辛苦了，剩下的时间留给轻松和开心。',
  '不用急着成为更好的人，你现在就很好。',
]

const WISH_LINES = [
  '愿今天的小事，都刚好让你开心。',
  '愿你今天被好消息和好心情轻轻接住。',
  '希望今天的风温柔，遇见的人也温柔。',
  '愿所有认真，都在合适的时候得到回应。',
  '希望你今天笑得比昨天更多一点。',
  '愿烦恼少一点，喜欢的事多发生一点。',
  '希望今天有惊喜，也有稳稳的安心。',
  '愿你想吃的都好吃，想做的都顺利。',
  '希望你带着轻松出门，带着好心情回家。',
  '愿今天没有为难你的事，只有偏爱你的我。',
  '希望所有等待，都慢慢变成值得。',
  '愿你的努力有结果，疲惫也有人心疼。',
  '希望今天的你，自在、安心、被爱。',
  '愿普通的一天，也藏着一个小小的幸运。',
  '希望你今天睡得香，醒来就有好心情。',
  '愿你被世界温柔对待，也被自己好好珍惜。',
  '希望今天结束时，你会觉得这一日还不错。',
  '愿我们还有很多很多个这样平常又珍贵的今天。',
  '祝你今天顺顺利利，也祝我们一直好好的。',
  '愿你所到之处都有光，回头时我也在。',
  '希望你的每一份期待，都有人认真珍惜。',
  '愿今晚的梦柔软，明早的阳光刚刚好。',
  '希望今天比昨天轻松，明天比今天更开心。',
]

function dayNumber(date: string): number {
  const [year, month, day] = date.split('-').map(Number)
  const timestamp = Date.UTC(year || 2026, (month || 1) - 1, day || 1)
  return Math.floor(timestamp / 86400000)
}

function dailyLines(date: string): string[] {
  const seed = dayNumber(date)
  return [
    LOVE_LINES[seed % LOVE_LINES.length],
    CARE_LINES[(seed * 3 + 5) % CARE_LINES.length],
    COMFORT_LINES[(seed * 5 + 7) % COMFORT_LINES.length],
    WISH_LINES[(seed * 7 + 11) % WISH_LINES.length],
  ]
}

function displayDate(date: string): string {
  const [, month, day] = date.split('-').map(Number)
  return `${month || ''} 月 ${day || ''} 日`
}

export default function EasterEgg({ active, onClose, date }: EasterEggProps) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const timer = window.setTimeout(() => onClose(), 16000)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
    }
  }, [active, onClose])

  if (!active) return null
  const lines = dailyLines(date)

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#fff7f8] px-5 text-center text-rose-950"
      role="dialog"
      aria-modal="true"
      aria-label="今日彩蛋"
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-white/90 text-rose-700 shadow-sm transition-colors hover:bg-rose-50"
        aria-label="关闭彩蛋"
      >
        <X size={20} />
      </button>

      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center py-16">
        <p className="rise-in inline-flex items-center gap-2 border-b border-rose-200 pb-3 text-xs font-bold tracking-[0.2em] text-rose-500">
          <CalendarDays size={14} /> {displayDate(date)} · 今日份小纸条
        </p>

        <div className="rise-in mt-8" style={{ animationDelay: '0.08s' }}>
          <p className="flex items-center justify-center gap-3 font-serif text-5xl font-bold tracking-wider sm:text-7xl">
            <span>Y</span>
            <BeatHeart size={58} />
            <span>W</span>
          </p>
          <p className="mt-3 pl-[0.25em] font-serif text-3xl font-bold tracking-[0.25em] sm:text-5xl">FOEVER</p>
        </div>

        <div className="mt-10 w-full border-y border-rose-200 bg-white/70 px-5 py-7 sm:px-10 sm:py-9">
          {lines.map((line, index) => (
            <p
              key={line}
              className="rise-in text-base font-medium leading-relaxed text-rose-800 sm:text-xl"
              style={{ animationDelay: `${0.16 + index * 0.08}s` }}
            >
              {line}
            </p>
          ))}
        </div>

        <p className="rise-in mt-8 font-serif text-sm font-bold text-rose-500 sm:text-base" style={{ animationDelay: '0.5s' }}>
          今天也要好好吃饭，好好生活，好好开心。
        </p>
      </div>
      <p className="fixed bottom-4 left-0 right-0 text-[11px] text-rose-300">16 秒后自动返回 · 按 ESC 或点右上角关闭</p>
    </div>
  )
}
