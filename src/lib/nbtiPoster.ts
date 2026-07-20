import { NBTI_DIMENSIONS } from '@/lib/nbti'
import type { NbtiResultInfo, NbtiScores, ResultKey } from '@/lib/nbti'

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const char of text) {
    const next = current + char
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = char
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

export async function createNbtiPoster(info: NbtiResultInfo, key: ResultKey, scores: NbtiScores): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1440
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法生成分享海报')

  ctx.fillStyle = '#fff7f8'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#ef476f'
  ctx.fillRect(0, 0, 22, canvas.height)
  ctx.fillStyle = '#0f766e'
  ctx.fillRect(22, 0, 9, canvas.height)

  ctx.fillStyle = '#881337'
  ctx.font = '700 40px "Microsoft YaHei", sans-serif'
  ctx.fillText('网文风向 · 创作人格档案', 90, 105)
  ctx.fillStyle = '#9f1239'
  ctx.font = '500 24px "Microsoft YaHei", sans-serif'
  ctx.fillText('WEBNOVEL RADAR', 90, 150)

  roundedRect(ctx, 76, 210, 928, 1080, 28)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = '#fecdd3'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.font = '96px "Segoe UI Emoji", sans-serif'
  ctx.fillText(info.icon, 540, 355)
  ctx.fillStyle = '#e11d48'
  ctx.font = '600 27px "Microsoft YaHei", sans-serif'
  ctx.fillText(key, 540, 420)
  ctx.fillStyle = '#4c0519'
  ctx.font = '700 66px "Microsoft YaHei", sans-serif'
  ctx.fillText(info.name, 540, 505)

  ctx.fillStyle = '#9f1239'
  ctx.font = '400 30px "Microsoft YaHei", sans-serif'
  const descriptionLines = wrapText(ctx, info.desc, 760).slice(0, 3)
  descriptionLines.forEach((line, index) => ctx.fillText(line, 540, 570 + index * 44))

  ctx.textAlign = 'left'
  let y = 755
  NBTI_DIMENSIONS.forEach((dimension) => {
    const score = scores[dimension.key]
    ctx.fillStyle = '#4c0519'
    ctx.font = '600 25px "Microsoft YaHei", sans-serif'
    ctx.fillText(`${dimension.left} ${score}%`, 150, y)
    ctx.textAlign = 'right'
    ctx.fillText(`${100 - score}% ${dimension.right}`, 930, y)
    ctx.textAlign = 'left'
    roundedRect(ctx, 150, y + 20, 780, 18, 9)
    ctx.fillStyle = '#ffe4e6'
    ctx.fill()
    roundedRect(ctx, 150, y + 20, 780 * (score / 100), 18, 9)
    ctx.fillStyle = dimension.color
    ctx.fill()
    y += 105
  })

  ctx.fillStyle = '#4c0519'
  ctx.font = '700 28px "Microsoft YaHei", sans-serif'
  ctx.fillText('适合题材', 150, 1195)
  ctx.fillStyle = '#0f766e'
  ctx.font = '600 25px "Microsoft YaHei", sans-serif'
  ctx.fillText(info.genres.join('  ·  '), 150, 1245)

  ctx.fillStyle = '#881337'
  ctx.font = '500 24px "Microsoft YaHei", sans-serif'
  ctx.fillText('测出你的创作人格，找到下一本该写的题材', 90, 1360)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#0f766e'
  ctx.font = '700 24px "Microsoft YaHei", sans-serif'
  ctx.fillText(window.location.host, 990, 1360)

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('海报生成失败'))), 'image/png', 0.96)
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

