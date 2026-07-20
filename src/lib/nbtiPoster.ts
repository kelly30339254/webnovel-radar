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
  const [{ canvas, ctx }, qrImage] = await Promise.all([createPosterCanvas(), loadSiteQr()])

  ctx.fillStyle = hslVar('--theme-bg')
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = hslVar('--theme-500')
  ctx.fillRect(0, 0, 22, canvas.height)
  ctx.fillStyle = 'hsl(168 76% 31%)'
  ctx.fillRect(22, 0, 9, canvas.height)

  ctx.fillStyle = hslVar('--theme-900')
  ctx.font = '700 40px "Microsoft YaHei", sans-serif'
  ctx.fillText('网文风向 · 创作人格档案', 90, 105)
  ctx.fillStyle = hslVar('--theme-800')
  ctx.font = '500 24px "Microsoft YaHei", sans-serif'
  ctx.fillText('WEBNOVEL RADAR', 90, 150)

  roundedRect(ctx, 76, 210, 928, 1080, 28)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = hslVar('--theme-300')
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.font = '96px "Segoe UI Emoji", sans-serif'
  ctx.fillText(info.icon, 540, 355)
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '600 27px "Microsoft YaHei", sans-serif'
  ctx.fillText(key, 540, 420)
  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 66px "Microsoft YaHei", sans-serif'
  ctx.fillText(info.name, 540, 505)

  ctx.fillStyle = hslVar('--theme-800')
  ctx.font = '400 30px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, info.desc, 540, 570, 760, 44, 3)

  ctx.textAlign = 'left'
  let y = 755
  NBTI_DIMENSIONS.forEach((dimension) => {
    const score = scores[dimension.key]
    ctx.fillStyle = hslVar('--theme-950')
    ctx.font = '600 25px "Microsoft YaHei", sans-serif'
    ctx.fillText(`${dimension.left} ${score}%`, 150, y)
    ctx.textAlign = 'right'
    ctx.fillText(`${100 - score}% ${dimension.right}`, 930, y)
    ctx.textAlign = 'left'
    roundedRect(ctx, 150, y + 20, 780, 18, 9)
    ctx.fillStyle = hslVar('--theme-200')
    ctx.fill()
    roundedRect(ctx, 150, y + 20, 780 * (score / 100), 18, 9)
    ctx.fillStyle = dimension.color
    ctx.fill()
    y += 105
  })

  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 28px "Microsoft YaHei", sans-serif'
  ctx.fillText('适合题材', 150, 1195)
  ctx.fillStyle = 'hsl(168 76% 31%)'
  ctx.font = '600 25px "Microsoft YaHei", sans-serif'
  ctx.fillText(info.genres.join('  ·  '), 150, 1245)

  ctx.fillStyle = hslVar('--theme-900')
  ctx.font = '500 24px "Microsoft YaHei", sans-serif'
  ctx.fillText('测出你的创作人格，找到下一本该写的题材', 90, 1360)

  // 右下角二维码
  drawSiteQr(ctx, qrImage, 834, 1266, 112)

  return canvasToPng(canvas)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
