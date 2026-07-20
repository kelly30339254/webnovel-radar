export const POSTER_WIDTH = 1080
export const POSTER_HEIGHT = 1440

const SITE_QR_SRC = '/images/site-qr.png'
let siteQrPromise: Promise<HTMLImageElement> | null = null

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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

export function drawTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const lines = wrapText(ctx, text, maxWidth).slice(0, maxLines)
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight))
  return y + Math.max(0, lines.length - 1) * lineHeight
}

export function loadSiteQr(): Promise<HTMLImageElement> {
  if (siteQrPromise) return siteQrPromise
  siteQrPromise = new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('网站二维码加载失败'))
    image.src = SITE_QR_SRC
  })
  return siteQrPromise
}

export function drawSiteQr(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  qrSize: number,
) {
  const padding = 10
  const labelHeight = 34
  const width = qrSize + padding * 2
  const height = qrSize + padding * 2 + labelHeight

  roundedRect(ctx, x, y, width, height, 14)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = hslVar('--theme-300')
  ctx.lineWidth = 1.5
  ctx.stroke()

  const smoothing = ctx.imageSmoothingEnabled
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(image, x + padding, y + padding, qrSize, qrSize)
  ctx.imageSmoothingEnabled = smoothing

  ctx.textAlign = 'center'
  ctx.fillStyle = hslVar('--theme-700')
  ctx.font = '600 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('扫码进入网站', x + width / 2, y + qrSize + padding + 25)
  ctx.textAlign = 'left'

  return { width, height }
}

export function getCssVariable(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function hslVar(name: string): string {
  const val = getCssVariable(name)
  return val ? `hsl(${val})` : ''
}

export function createPosterCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = POSTER_WIDTH
  canvas.height = POSTER_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法生成分享海报')
  return { canvas, ctx }
}

export function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('海报生成失败'))), 'image/png', 0.96)
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
