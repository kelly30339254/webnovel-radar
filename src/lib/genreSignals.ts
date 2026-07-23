import type { Board, GenreHeat, HistoryData } from '@/types/wind'

export type GenreStage = 'new' | 'surging' | 'rising' | 'crowded' | 'steady' | 'cooling' | 'insufficient'

export type GenreSignal = {
  name: string
  heat: number
  delta7: number
  acceleration: number
  crowding: number
  stage: GenreStage
  stageLabel: string
  advice: string
  confidence: '高' | '中' | '低'
  samples: number
}

const STAGE_META: Record<GenreStage, { label: string; advice: string }> = {
  new: { label: '刚出现', advice: '可以先写一小段，看看读者有没有兴趣' },
  surging: { label: '涨得很快', advice: '可以趁热试写，但开头一定要和别人不一样' },
  rising: { label: '正在变热', advice: '可以跟进，不过人物和开头不要照搬热门书' },
  crowded: { label: '同类很多', advice: '题材很火，但同类书也多，不要直接照抄榜首' },
  steady: { label: '比较稳定', advice: '这类书一直有人看，关键看人物和节奏' },
  cooling: { label: '正在变冷', advice: '先别急着跟，除非你已经想好不同写法' },
  insufficient: { label: '数据太少', advice: '再观察几天，不要因为一天很火就马上跟' },
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function genreTokens(name: string): string[] {
  return name
    .replace(/[（）()，,]/g, ' ')
    .split(/[\s/·、]+/)
    .map((token) => token.replace(/男频|女频/g, ''))
    .filter((token) => token.length >= 2)
}

function countCompetingBooks(name: string, boards: Board[]): number {
  const tokens = genreTokens(name)
  return boards.flatMap((board) => board.books).filter((book) => {
    const haystack = `${book.genre}${book.title}`
    return tokens.some((token) => haystack.includes(token) || token.includes(book.genre))
  }).length
}

function stageFor(genre: GenreHeat, delta7: number, acceleration: number, samples: number): GenreStage {
  if (genre.trend === 'new') return 'new'
  if (samples < 4) return 'insufficient'
  if (delta7 <= -6) return 'cooling'
  if (delta7 >= 8 && acceleration >= 1) return 'surging'
  if (delta7 >= 4) return 'rising'
  if (genre.heat >= 84 && delta7 <= 3) return 'crowded'
  return 'steady'
}

export function buildGenreSignals(genres: GenreHeat[], history: HistoryData | null, boards: Board[]): GenreSignal[] {
  return genres.map((genre) => {
    const points = (history?.days ?? [])
      .map((day) => day.genres.find((item) => item.name === genre.name)?.heat)
      .filter((value): value is number => typeof value === 'number')
      .slice(-7)
    const current = genre.heat
    const delta7 = points.length > 1 ? current - points[0] : 0
    const recent = points.slice(-3)
    const previous = points.slice(-6, -3)
    const acceleration = recent.length >= 3 && previous.length >= 1
      ? Math.round(average(recent) - average(previous))
      : 0
    const competingBooks = countCompetingBooks(genre.name, boards)
    const crowding = Math.min(100, Math.round(current * 0.5 + competingBooks * 14))
    const range = points.length ? Math.max(...points) - Math.min(...points) : 0
    const confidence = points.length >= 7 && range <= 25 ? '高' : points.length >= 4 ? '中' : '低'
    const stage = stageFor(genre, delta7, acceleration, points.length)
    return {
      name: genre.name,
      heat: current,
      delta7,
      acceleration,
      crowding,
      stage,
      stageLabel: STAGE_META[stage].label,
      advice: STAGE_META[stage].advice,
      confidence,
      samples: points.length,
    }
  })
}

export function signalTone(stage: GenreStage): string {
  if (stage === 'surging' || stage === 'rising') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (stage === 'cooling') return 'bg-slate-100 text-slate-600 border-slate-200'
  if (stage === 'crowded') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (stage === 'new') return 'bg-teal-50 text-teal-700 border-teal-200'
  if (stage === 'insufficient') return 'bg-stone-100 text-stone-600 border-stone-200'
  return 'bg-blue-50 text-blue-700 border-blue-200'
}

export function formatDelta(value: number): string {
  if (value > 0) return `+${value}`
  return String(value)
}
