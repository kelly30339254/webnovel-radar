import { canvasToPng, createPosterCanvas, drawSiteQr, drawTextLines, hslVar, loadSiteQr, roundedRect } from '@/lib/posterCanvas'
import type { RadarFactor } from '@/lib/radarReport'

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
  risk: string
  nextStep: string
  factors: RadarFactor[]
  updatedAt?: string
}

export async function createRadarPoster(data: RadarPosterData): Promise<Blob> {
  const [{ canvas, ctx }, qrImage] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadSiteQr(),
  ])

  // 背景
  ctx.fillStyle = hslVar('--theme-bg')
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 双品牌色顶栏
  ctx.fillStyle = hslVar('--theme-500')
  ctx.fillRect(0, 0, 760, 8)
  ctx.fillStyle = hslVar('--theme-accent')
  ctx.fillRect(760, 0, 320, 8)

  // 深色顶部信息区
  ctx.fillStyle = hslVar('--theme-900')
  ctx.fillRect(0, 8, canvas.width, 300)

  // 标题
  ctx.textAlign = 'left'
  ctx.fillStyle = hslVar('--theme-300')
  ctx.font = '700 20px "Microsoft YaHei", sans-serif'
  ctx.fillText('网文风向 · 我的开书雷达', 76, 62)

  // 题材
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 52px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.genre, 76, 110, 620, 64, 2)

  // 副标题
  ctx.fillStyle = hslVar('--theme-400')
  ctx.font = '500 20px "Microsoft YaHei", sans-serif'
  ctx.fillText(`${data.stageLabel}期 · ${data.strategyName} · 数据更新 ${data.updatedAt ?? '今日'}`, 78, 260)

  // 分数
  ctx.textAlign = 'right'
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 110px "Arial", sans-serif'
  ctx.fillText(String(data.score), 1004, 185)
  ctx.fillStyle = hslVar('--theme-400')
  ctx.font = '600 20px "Microsoft YaHei", sans-serif'
  ctx.fillText('开书适配度 / 100', 1004, 228)
  ctx.textAlign = 'left'

  // 主卡片
  ctx.save()
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)'
  ctx.shadowBlur = 28
  ctx.shadowOffsetY = 12
  roundedRect(ctx, 76, 340, 928, 980, 28)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.restore()
  roundedRect(ctx, 76, 340, 928, 980, 28)
  ctx.strokeStyle = hslVar('--theme-200')
  ctx.lineWidth = 1.5
  ctx.stroke()

  // 结论
  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 30px "Microsoft YaHei", sans-serif'
  ctx.fillText(`结论：${data.verdict}`, 120, 400)

  // 三个评分因素
  data.factors.forEach((factor, index) => {
    const x = 120 + index * 285
    roundedRect(ctx, x, 435, 248, 112, 14)
    ctx.fillStyle = index === 0 ? 'hsl(152 82% 96%)' : index === 1 ? 'hsl(213 100% 97%)' : 'hsl(48 100% 96%)'
    ctx.fill()
    ctx.fillStyle = hslVar('--theme-800')
    ctx.font = '500 17px "Microsoft YaHei", sans-serif'
    ctx.fillText(factor.label, x + 18, 470)
    ctx.fillStyle = index === 0 ? 'hsl(161 94% 30%)' : index === 1 ? 'hsl(224 76% 54%)' : 'hsl(32 95% 38%)'
    ctx.font = '700 32px "Arial", sans-serif'
    ctx.fillText(String(factor.score), x + 18, 515)
  })

  // 市场证据
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '700 20px "Microsoft YaHei", sans-serif'
  ctx.fillText('市场证据', 120, 600)
  ctx.fillStyle = hslVar('--theme-900')
  ctx.font = '500 23px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.marketEvidence, 120, 635, 840, 32, 3)

  // 突围定位
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '700 20px "Microsoft YaHei", sans-serif'
  ctx.fillText('本版突围定位', 120, 755)
  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '500 24px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.positioning, 120, 790, 840, 32, 3)

  // 首要风险（左侧）
  roundedRect(ctx, 120, 915, 540, 88, 14)
  ctx.fillStyle = 'hsl(48 100% 96%)'
  ctx.fill()
  ctx.fillStyle = 'hsl(24 95% 31%)'
  ctx.font = '700 17px "Microsoft YaHei", sans-serif'
  ctx.fillText('首要风险', 144, 950)
  ctx.font = '500 19px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.risk, 144, 978, 490, 25, 2)

  // 现在就做（左侧）
  roundedRect(ctx, 120, 1025, 540, 82, 14)
  ctx.fillStyle = 'hsl(166 76% 97%)'
  ctx.fill()
  ctx.fillStyle = 'hsl(168 76% 31%)'
  ctx.font = '700 17px "Microsoft YaHei", sans-serif'
  ctx.fillText('现在就做', 144, 1057)
  ctx.font = '500 19px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.nextStep, 255, 1057, 390, 25, 2)

  // 二维码（右下，与左侧内容水平不重叠）
  drawSiteQr(ctx, qrImage, 760, 930, 168)

  // 底部 slogan
  ctx.textAlign = 'center'
  ctx.fillStyle = hslVar('--theme-500')
  ctx.font = '500 22px "Microsoft YaHei", sans-serif'
  ctx.fillText('看懂趋势，再决定下一本写什么', 540, 1375)

  return canvasToPng(canvas)
}
