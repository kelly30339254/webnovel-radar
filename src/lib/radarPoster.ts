import {
  canvasToPng,
  createPosterCanvas,
  drawEditorialBase,
  drawSiteQr,
  drawTextLines,
  loadPosterSeal,
  loadSiteQr,
} from '@/lib/posterCanvas'
import type { RadarFactor, RadarPlanStep } from '@/lib/radarReport'

export interface RadarPosterData {
  genre: string
  score: number
  verdict: string
  stageLabel: string
  delta7: string
  acceleration: string
  crowding: number
  strategyName: string
  marketEvidence: string
  positioning: string
  differentiators: string[]
  risks: string[]
  plan: RadarPlanStep[]
  productionProfile: string
  factors: RadarFactor[]
  updatedAt?: string
}

function drawRule(ctx: CanvasRenderingContext2D, y: number, color = '#b7aa9d') {
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(72, y)
  ctx.lineTo(1008, y)
  ctx.stroke()
}

export async function createRadarPoster(data: RadarPosterData): Promise<Blob> {
  const [{ canvas, ctx }, qrImage, seal] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadSiteQr(),
    loadPosterSeal(),
  ])

  drawEditorialBase(ctx, seal, '开书雷达', data.updatedAt ?? '今日')

  ctx.textAlign = 'left'
  ctx.fillStyle = '#151311'
  ctx.font = '900 50px "STSong", "SimSun", serif'
  ctx.fillText('我的开书雷达', 72, 226)
  ctx.fillStyle = '#8f101c'
  ctx.font = '900 56px "STSong", "SimSun", serif'
  drawTextLines(ctx, data.genre, 72, 292, 670, 62, 1)
  ctx.fillStyle = '#49413b'
  ctx.font = '500 19px "Microsoft YaHei", sans-serif'
  ctx.fillText(`${data.stageLabel} · ${data.strategyName} · 一周 ${data.delta7} · 最近 ${data.acceleration}`, 74, 330)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#8f101c'
  ctx.font = '900 112px "Georgia", serif'
  ctx.fillText(String(data.score), 1006, 286)
  ctx.fillStyle = '#49413b'
  ctx.font = '600 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('适合开写程度 / 100', 1004, 324)
  ctx.textAlign = 'left'

  ctx.fillStyle = '#8f101c'
  ctx.fillRect(72, 360, 10, 92)
  ctx.fillStyle = '#f0e7dc'
  ctx.fillRect(82, 360, 926, 92)
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText(`结论｜${data.verdict}`, 108, 394)
  ctx.fillStyle = '#211d1a'
  ctx.font = '700 25px "STSong", "SimSun", serif'
  drawTextLines(ctx, data.productionProfile, 108, 428, 860, 29, 1)

  data.factors.slice(0, 3).forEach((factor, index) => {
    const x = 72 + index * 312
    const tone = index === 1 ? '#174c43' : '#8f101c'
    ctx.strokeStyle = '#b7aa9d'
    ctx.strokeRect(x, 480, 288, 92)
    ctx.fillStyle = tone
    ctx.font = '800 17px "Microsoft YaHei", sans-serif'
    ctx.fillText(factor.label, x + 18, 514)
    ctx.font = '900 33px "Georgia", serif'
    ctx.fillText(String(factor.score), x + 18, 552)
    ctx.fillStyle = '#6b625b'
    ctx.font = '500 14px "Microsoft YaHei", sans-serif'
    ctx.fillText(factor.note, x + 82, 549)
  })

  drawRule(ctx, 606)
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('01  为什么这样判断', 72, 640)
  ctx.fillStyle = '#332e2a'
  ctx.font = '500 21px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.marketEvidence, 72, 675, 936, 30, 3)

  ctx.fillStyle = '#174c43'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('02  怎么写得不一样', 72, 790)
  ctx.fillStyle = '#211d1a'
  ctx.font = '700 23px "STSong", "SimSun", serif'
  drawTextLines(ctx, data.positioning, 72, 826, 936, 32, 3)

  drawRule(ctx, 922)
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('03  三个写法建议', 72, 958)
  data.differentiators.slice(0, 3).forEach((item, index) => {
    const y = 994 + index * 48
    ctx.fillStyle = index === 1 ? '#174c43' : '#8f101c'
    ctx.font = '900 18px "Georgia", serif'
    ctx.fillText(`0${index + 1}`, 72, y)
    ctx.fillStyle = '#3d3732'
    ctx.font = '500 18px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, item, 116, y, 870, 25, 1)
  })

  drawRule(ctx, 1142)
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('04  容易踩的坑和 7 天试写', 72, 1178)
  data.risks.slice(0, 2).forEach((risk, index) => {
    ctx.fillStyle = '#3d3732'
    ctx.font = '500 16px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, `风险${index + 1}｜${risk}`, 72, 1212 + index * 46, 620, 22, 2)
  })
  data.plan.slice(0, 3).forEach((step, index) => {
    ctx.fillStyle = index === 2 ? '#174c43' : '#8f101c'
    ctx.font = '800 15px "Microsoft YaHei", sans-serif'
    ctx.fillText(step.phase, 72, 1312 + index * 28)
    ctx.fillStyle = '#3d3732'
    ctx.font = '500 15px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, step.task, 170, 1312 + index * 28, 530, 20, 1)
  })

  drawSiteQr(ctx, qrImage, 790, 1174, 140)
  ctx.fillStyle = '#756b63'
  ctx.font = '500 13px "Microsoft YaHei", sans-serif'
  ctx.fillText(`同类书多少 ${data.crowding} · 扫码进入奶龙数据站查看完整建议`, 704, 1390)

  return canvasToPng(canvas)
}
