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
  return '偏好清晰卖点、稳定节奏和阶段兑现的核心类型读者'
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
  const stagePaceFit = signal.stage === 'surging' ? (pace === 'sprint' ? 8 : pace === 'slow' ? -15 : 0) : 3
  const lengthFit = length === 'short'
    ? (signal.stage === 'surging' || signal.stage === 'new' ? 8 : 2)
    : length === 'long'
      ? (signal.stage === 'steady' ? 7 : signal.stage === 'surging' ? -9 : 0)
      : 5
  const windowScore = clamp(signal.heat * 0.68 + signal.delta7 * 1.45 + signal.acceleration * 1.8)
  const executionScore = clamp(paceBase + stagePaceFit + lengthFit)
  const differentiationScore = clamp(112 - signal.crowding + (keywords.length >= 3 ? 4 : 0))
  const score = clamp(windowScore * 0.46 + executionScore * 0.31 + differentiationScore * 0.23, 35, 95)
  const verdict = score >= 80 ? '建议立项' : score >= 66 ? '小样验证后立项' : score >= 52 ? '仅建议轻量试写' : '暂缓追高'
  const keywordAt = (offset: number, fallback: string) => keywords.length
    ? keywords[(variationSeed + offset) % keywords.length]
    : fallback
  const topKeyword = keywordAt(0, '核心类型卖点')
  const supportKeyword = keywordAt(1, '身份反差')
  const avoidKeyword = keywordAt(2, '常规升级')
  const strategyIndex = variationSeed % 3
  const strategyName = ['机制先行版', '人物反差版', '结构兑现版'][strategyIndex]
  const lengthText = length === 'short' ? '中短篇快速闭环' : length === 'long' ? '百万字长线成长' : '50-100 万字主线'
  const productionProfile = pace === 'sprint'
    ? `以 7 天冲刺为一个验证周期，先完成 3 万字样稿，再决定是否进入${lengthText}。`
    : pace === 'steady'
      ? `按稳定日更准备 7-10 章存稿，用两周完成首轮数据验证，再进入${lengthText}。`
      : `先写 1.5 万字高完成度小样，不承诺长更；通过验证后再扩展为${lengthText}。`
  const adaptationStrategy = adaptation
    ? '按可改编结构设计：每 3-5 章形成一次场景闭环，人物目标要能被动作和对白直接表达。'
    : '优先服务阅读留存：允许世界观和内心线慢铺，不为改编强行切碎叙事。'

  const risks = [
    signal.crowding >= 75
      ? `同类拥挤度 ${signal.crowding}，标题与简介若只堆“${topKeyword}”会直接落入同质化。`
      : `赛道拥挤度 ${signal.crowding}，机会尚在，但必须让核心机制在前三章可被读者复述。`,
    signal.stage === 'surging' && pace === 'slow'
      ? '题材处于加速期，但你的更新节奏偏慢，成稿时可能已经错过窗口。'
      : signal.stage === 'cooling'
        ? '热度已经转弱，不宜用长篇成本押注，应先用短样测试真实反馈。'
        : `当前处于${signal.stageLabel}期，最大风险不是没有流量，而是卖点兑现速度与榜单预期不匹配。`,
    length === 'long'
      ? '长篇计划需要第二套成长发动机，否则前期卖点兑现后容易失速。'
      : '短周期验证不能只看点击，还要确认第三章后读者是否愿意继续追更。',
  ]

  return {
    score,
    verdict,
    strategyName,
    verdictSummary: score >= 80
      ? '市场窗口与当前产能基本匹配，可以进入立项，但首屏卖点必须主动避开榜首表达。'
      : score >= 66
        ? '方向有机会，但不足以直接重投入；先用小样证明点击和追读都成立。'
        : score >= 52
          ? '现有条件只能支持低成本试写，不建议先囤大量存稿。'
          : '市场窗口、竞争强度或个人产能存在明显错配，先换切口再开。',
    marketEvidence: genreNote
      ? `${genreNote}；近 ${signal.samples} 日热度变化 ${signal.delta7 >= 0 ? '+' : ''}${signal.delta7}，趋势加速度 ${signal.acceleration >= 0 ? '+' : ''}${signal.acceleration}。`
      : `当前热度 ${signal.heat}，近 ${signal.samples} 日变化 ${signal.delta7 >= 0 ? '+' : ''}${signal.delta7}，趋势阶段为${signal.stageLabel}。`,
    factors: [
      { label: '窗口机会', score: windowScore, note: '热度、7 日变化与加速度' },
      { label: '产能匹配', score: executionScore, note: '更新速度与计划篇幅' },
      { label: '突围空间', score: differentiationScore, note: '竞争拥挤度的反向评分' },
    ],
    positioning: strategyIndex === 0
      ? `面向${audienceFor(signal.name)}，用“${topKeyword}”完成题材识别，但把真正的差异放在一条可复述、会产生代价的新规则上。`
      : strategyIndex === 1
        ? `面向${audienceFor(signal.name)}，保留“${topKeyword}”的市场识别度，用“${supportKeyword}”塑造人物选择，避免继续比拼设定规模。`
        : `面向${audienceFor(signal.name)}，把“${topKeyword}”拆成三次递进兑现，用节奏与回报密度替代标签堆砌。`,
    differentiators: strategyIndex === 0
      ? [
          '主卖点：一句话讲清能力或规则如何运转，以及每次使用需要支付什么。',
          `副卖点：让“${supportKeyword}”改变规则的使用方式，而不是只做简介标签。`,
          `避同质化：不要把“${avoidKeyword}”当万能解释，前三章必须出现一次规则反噬。`,
        ]
      : strategyIndex === 1
        ? [
            `主卖点：用“${supportKeyword}”制造一个违背类型惯性的主角选择。`,
            '关系抓手：安排一个既能帮助主角、又会因主角成功而受损的人。',
            `避同质化：保留“${topKeyword}”作为外壳，但简介第一句先写人物困境。`,
          ]
        : [
            `第一兑现：首章让“${topKeyword}”立即产生可见结果，不先解释完整世界观。`,
            `第二兑现：第三章用“${supportKeyword}”把小胜变成更大的问题。`,
            `长线区隔：采用${lengthText}，${adaptation ? '每 3-5 章形成一次场景闭环' : '每卷更换一次目标，但保留同一成长问题'}。`,
          ],
    risks,
    plan: [
      { phase: '第 1-3 天', task: '完成一句话定位、3 个书名和前三章分镜', check: '陌生读者能否在 10 秒内说出新规则' },
      { phase: '第 4-7 天', task: `写完首轮样稿并重点兑现“${topKeyword}”`, check: '首章承诺、第三章回报和简介表达是否一致' },
      { phase: '验证门槛', task: '收集点击、第三章追读和有效评论', check: '三项中至少两项正向，再扩大存稿投入' },
    ],
    productionProfile,
    adaptationStrategy,
    personaName,
    variationSeed,
  }
}
