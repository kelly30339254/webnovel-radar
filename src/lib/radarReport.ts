import type { GenreSignal } from '@/lib/genreSignals'

export type RadarPace = 'steady' | 'sprint' | 'slow'
export type RadarLength = 'short' | 'medium' | 'long'

export interface RadarFactor {
  label: string
  score: number
  note: string
}

export interface RadarPlanStep {
  phase: string
  task: string
  check: string
}

export interface RadarReport {
  score: number
  verdict: string
  strategyName: string
  verdictSummary: string
  marketEvidence: string
  factors: RadarFactor[]
  positioning: string
  differentiators: string[]
  risks: string[]
  plan: RadarPlanStep[]
  productionProfile: string
  adaptationStrategy: string
  personaName: string | null
  variationSeed: number
}

interface RadarReportInput {
  signal: GenreSignal
  genreNote?: string
  keywords: string[]
  pace: RadarPace
  length: RadarLength
  adaptation: boolean
  personaName: string | null
  variationSeed: number
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function audienceFor(genre: string) {
  if (/高武|灵气|同人|抗战|谍战|权谋/.test(genre)) return '偏好强目标、快反馈和连续升级的读者'
  if (/宫斗|宅斗|财阀|现言/.test(genre)) return '偏好关系张力、身份落差和连续反转的读者'
  if (/青春|甜宠|校园/.test(genre)) return '偏好情绪陪伴、细节互动和关系推进的读者'
  if (/年代|复仇|军婚/.test(genre)) return '偏好生活质感、命运翻盘和长期成长的读者'
  return '喜欢亮点说得清楚、故事推进稳定、每隔几章就有新结果的读者'
}

export function buildRadarReport({
  signal,
  genreNote,
  keywords,
  pace,
  length,
  adaptation,
  personaName,
  variationSeed,
}: RadarReportInput): RadarReport {
  const paceBase = pace === 'sprint' ? 90 : pace === 'steady' ? 76 : 58
  const stagePaceFit = signal.stage === 'insufficient'
    ? -12
    : signal.stage === 'surging'
      ? (pace === 'sprint' ? 8 : pace === 'slow' ? -15 : 0)
      : 3
  const lengthFit = length === 'short'
    ? (signal.stage === 'surging' || signal.stage === 'new' ? 8 : 2)
    : length === 'long'
      ? (signal.stage === 'steady' ? 7 : signal.stage === 'surging' ? -9 : 0)
      : 5
  const confidencePenalty = signal.confidence === '低' ? 18 : signal.confidence === '中' ? 5 : 0
  const windowScore = clamp(signal.heat * 0.68 + signal.delta7 * 1.45 + signal.acceleration * 1.8 - confidencePenalty)
  const executionScore = clamp(paceBase + stagePaceFit + lengthFit)
  const differentiationScore = clamp(112 - signal.crowding + (keywords.length >= 3 ? 4 : 0))
  const score = clamp(windowScore * 0.46 + executionScore * 0.31 + differentiationScore * 0.23, 35, 95)
  const verdict = score >= 80 ? '可以正式开写' : score >= 66 ? '先写一小段再决定' : score >= 52 ? '只建议先试写' : '先别急着跟'
  const keywordAt = (offset: number, fallback: string) => keywords.length
    ? keywords[(variationSeed + offset) % keywords.length]
    : fallback
  const topKeyword = keywordAt(0, '核心类型卖点')
  const supportKeyword = keywordAt(1, '身份反差')
  const avoidKeyword = keywordAt(2, '常规升级')
  const strategyIndex = variationSeed % 3
  const strategyName = ['先讲清特殊能力', '先写出人物反差', '先让读者看到爽点'][strategyIndex]
  const lengthText = length === 'short' ? '中短篇快速闭环' : length === 'long' ? '百万字长线成长' : '50-100 万字主线'
  const productionProfile = pace === 'sprint'
    ? `先用 7 天冲刺写完 3 万字，再看读者反应，决定是否继续写成${lengthText}。`
    : pace === 'steady'
      ? `先准备 7—10 章存稿，稳定更新两周，读者反应不错再继续写成${lengthText}。`
      : `先认真写好 1.5 万字，不急着承诺长期更新；读者愿意看，再扩展为${lengthText}。`
  const adaptationStrategy = adaptation
    ? '按可改编结构设计：每 3-5 章形成一次场景闭环，人物目标要能被动作和对白直接表达。'
    : '优先服务阅读留存：允许世界观和内心线慢铺，不为改编强行切碎叙事。'

  const risks = [
    signal.crowding >= 75
      ? `同类书数量达到 ${signal.crowding}，书名和简介如果只堆“${topKeyword}”，会和别的书很像。`
      : `同类书数量为 ${signal.crowding}，还有机会，但前三章必须让读者说得清你的特殊能力。`,
    signal.stage === 'surging' && pace === 'slow'
      ? '这个题材最近涨得很快，但你的更新速度偏慢，等写完时可能已经不热了。'
      : signal.stage === 'insufficient'
        ? '记录天数太少，所以分数会更保守；不要因为某一天很火就认定它会一直火。'
        : signal.stage === 'cooling'
        ? '热度已经在下降，不要一开始就写成长篇，先用短内容看看真实反应。'
        : `现在是“${signal.stageLabel}”。最大风险不是没人点，而是亮点出现得太慢，读者等不到。`,
    length === 'long'
      ? '长篇还要准备第二条成长线，不然前面的亮点写完后，故事容易没劲。'
      : '短周期验证不能只看点击，还要确认第三章后读者是否愿意继续追更。',
  ]

  return {
    score,
    verdict,
    strategyName,
    verdictSummary: score >= 80
      ? '现在的热度和你的更新能力比较合适，可以正式开写，但书名和简介不要像榜首。'
      : score >= 66
        ? '这个方向有机会，但先别囤太多稿；写一小段，看看有没有人点、有没有人追。'
        : score >= 52
          ? '目前只适合花少量时间试写，不建议先准备大量存稿。'
          : '题材热度、同类竞争或你的更新能力不太合适，先换个写法再开书。',
    marketEvidence: genreNote
      ? `${genreNote}；参考了最近 ${signal.samples} 天，一共${signal.delta7 >= 0 ? '上涨' : '下降'} ${Math.abs(signal.delta7)}，最近几天${signal.acceleration >= 0 ? '还在变热' : '开始变冷'}。`
      : `现在有多火：${signal.heat}；参考了最近 ${signal.samples} 天，一共${signal.delta7 >= 0 ? '上涨' : '下降'} ${Math.abs(signal.delta7)}，目前是“${signal.stageLabel}”。`,
    factors: [
      { label: '现在好不好写', score: windowScore, note: '看现在有多火，以及最近是涨还是跌' },
      { label: '你能不能跟上', score: executionScore, note: '看你的更新速度和准备写多长' },
      { label: '能否写出不同', score: differentiationScore, note: '同类书越多，写出不同就越难' },
    ],
    positioning: strategyIndex === 0
      ? `面向${audienceFor(signal.name)}，用“${topKeyword}”完成题材识别，但把真正的差异放在一条可复述、会产生代价的新规则上。`
      : strategyIndex === 1
        ? `面向${audienceFor(signal.name)}，保留“${topKeyword}”的市场识别度，用“${supportKeyword}”塑造人物选择，避免继续比拼设定规模。`
        : `面向${audienceFor(signal.name)}，把“${topKeyword}”分三次写出效果，让读者不断看到新结果，不要只堆标签。`,
    differentiators: strategyIndex === 0
      ? [
          '主卖点：一句话讲清能力或规则如何运转，以及每次使用需要支付什么。',
          `副卖点：让“${supportKeyword}”改变规则的使用方式，而不是只做简介标签。`,
          `避免写得太像：不要用“${avoidKeyword}”解释所有问题，前三章要让这项能力至少带来一次麻烦。`,
        ]
      : strategyIndex === 1
        ? [
            `主卖点：用“${supportKeyword}”制造一个违背类型惯性的主角选择。`,
            '关系抓手：安排一个既能帮助主角、又会因主角成功而受损的人。',
            `避免写得太像：可以保留“${topKeyword}”，但简介第一句先写人物正在面对的难题。`,
          ]
        : [
            `第一次给结果：第一章就让“${topKeyword}”产生效果，不要先长篇解释世界观。`,
            `第二次给结果：第三章用“${supportKeyword}”把一次小胜变成更大的问题。`,
            `长线区隔：采用${lengthText}，${adaptation ? '每 3-5 章形成一次场景闭环' : '每卷更换一次目标，但保留同一成长问题'}。`,
          ],
    risks,
    plan: [
      { phase: '第 1-3 天', task: '完成一句话定位、3 个书名和前三章分镜', check: '陌生读者能否在 10 秒内说出新规则' },
      { phase: '第 4-7 天', task: `写完第一版，并重点写出“${topKeyword}”的效果`, check: '简介说的亮点，第一章和第三章有没有真正写出来' },
      { phase: '决定要不要继续', task: '看点击、第三章追读和有效评论', check: '三项中至少两项不错，再多准备存稿' },
    ],
    productionProfile,
    adaptationStrategy,
    personaName,
    variationSeed,
  }
}
