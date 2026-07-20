import { NBTI_DIMENSIONS } from '@/lib/nbti'
import type { NbtiResultInfo, NbtiScores, ResultKey } from '@/lib/nbti'
import {
  canvasToPng,
  createPosterCanvas,
  drawSiteQr,
  drawTextLines,
  hslVar,
  loadSiteQr,
  roundedRect,
} from '@/lib/posterCanvas'

export async function createNbtiPoster(info: NbtiResultInfo, key: ResultKey, scores: NbtiScores): Promise<Blob> {
  const [{ canvas, ctx }, qrImage] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadSiteQr(),
  ])

  ctx.fillStyle = hslVar('--theme-bg')
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = hslVar('--theme-500')
  ctx.fillRect(0, 0, 760, 8)
  ctx.fillStyle = hslVar('--theme-accent')
  ctx.fillRect(760, 0, 320, 8)

  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 34px "Microsoft YaHei", sans-serif'
  ctx.fillText('网文风向 · 创作人格档案', 76, 72)
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '600 19px "Arial", sans-serif'
  ctx.fillText('WEBNOVEL RADAR · NBTI PROFILE', 78, 106)

  ctx.save()
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)'
  ctx.shadowBlur = 28
  ctx.shadowOffsetY = 12
  roundedRect(ctx, 76, 140, 928, 1175, 28)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.restore()
  roundedRect(ctx, 76, 140, 928, 1175, 28)
  ctx.strokeStyle = hslVar('--theme-200')
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.font = '82px "Segoe UI Emoji", sans-serif'
  ctx.fillText(info.icon, 540, 285)
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '700 25px "Arial", sans-serif'
  ctx.fillText(key, 540, 340)
  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 58px "Microsoft YaHei", sans-serif'
  ctx.fillText(info.name, 540, 410)
  ctx.fillStyle = hslVar('--theme-800')
  ctx.font = '500 27px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, info.desc, 540, 466, 760, 40, 2)

  ctx.textAlign = 'left'
  let y = 610
  NBTI_DIMENSIONS.forEach((dimension) => {
    const score = scores[dimension.key]
    ctx.fillStyle = hslVar('--theme-950')
    ctx.font = '600 22px "Microsoft YaHei", sans-serif'
    ctx.fillText(`${dimension.left} ${score}%`, 120, y)
    ctx.textAlign = 'right'
    ctx.fillText(`${100 - score}% ${dimension.right}`, 960, y)
    ctx.textAlign = 'left'

    roundedRect(ctx, 120, y + 18, 840, 15, 8)
    ctx.fillStyle = hslVar('--theme-100')
    ctx.fill()
    roundedRect(ctx, 120, y + 18, Math.max(16, 840 * (score / 100)), 15, 8)
    ctx.fillStyle = dimension.color
    ctx.fill()
    y += 103
  })

  roundedRect(ctx, 120, 1050, 560, 150, 16)
  ctx.fillStyle = hslVar('--theme-50')
  ctx.fill()
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '700 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('适合题材', 148, 1090)
  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 25px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, info.genres.join('  ·  '), 148, 1135, 500, 36, 2)

  drawSiteQr(ctx, qrImage, 760, 1040, 168)

  ctx.textAlign = 'center'
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '600 21px "Microsoft YaHei", sans-serif'
  ctx.fillText('测出你的创作人格，找到下一本该写的题材', 540, 1375)

  return canvasToPng(canvas)
}
