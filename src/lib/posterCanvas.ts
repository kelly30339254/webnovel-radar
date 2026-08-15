export const POSTER_WIDTH = 1080
export const POSTER_HEIGHT = 1440

const SITE_QR_SRC = '/images/site-qr.png'
const POSTER_SEAL_SRC = '/assets/nailong-logo.svg'
let siteQrPromise: Promise<HTMLImageElement | null> | null = null
let posterSealPromise: Promise<HTMLImageElement | null> | null = null

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

export function loadSiteQr(): Promise<HTMLImageElement | null> {
  if (siteQrPromise) return siteQrPromise
  siteQrPromise = new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = SITE_QR_SRC
  })
  return siteQrPromise
}

export function loadPosterSeal(): Promise<HTMLImageElement | null> {
  if (posterSealPromise) return posterSealPromise
  posterSealPromise = new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = POSTER_SEAL_SRC
  })
  return posterSealPromise
}

export function drawEditorialBase(ctx: CanvasRenderingContext2D, seal: HTMLImageElement | null, section: string, date = '今日') {
  ctx.fillStyle = '#14101d'
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  for (let y = 10; y < POSTER_HEIGHT; y += 18) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(POSTER_WIDTH, y)
    ctx.stroke()
  }
  ctx.strokeStyle = '#e0485f'
  ctx.lineWidth = 2
  ctx.strokeRect(42, 34, POSTER_WIDTH - 84, POSTER_HEIGHT - 68)
  ctx.strokeRect(52, 44, POSTER_WIDTH - 104, POSTER_HEIGHT - 88)
  if (seal) ctx.drawImage(seal, 72, 66, 72, 72)
  ctx.fillStyle = '#e0485f'
  ctx.font = '700 30px "STSong", "SimSun", serif'
  ctx.fillText('奶龙数据站', 164, 95)
  ctx.fillStyle = '#a89fb8'
  ctx.font = '500 16px "Georgia", serif'
  ctx.fillText('NAILONG DATA STATION', 164, 125)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#e0485f'
  ctx.font = '600 18px "Microsoft YaHei", sans-serif'
  ctx.fillText(`${section}  ·  ${date}`, 1008, 102)
  ctx.textAlign = 'left'
  ctx.strokeStyle = '#e0485f'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(72, 154)
  ctx.lineTo(1008, 154)
  ctx.stroke()
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(72, 162)
  ctx.lineTo(1008, 162)
  ctx.stroke()
}

export function drawSiteQr(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  x: number,
  y: number,
  qrSize: number,
) {
  const padding = 10
  const labelHeight = 34
  const width = qrSize + padding * 2
  const height = qrSize + padding * 2 + labelHeight

  ctx.fillStyle = '#1b1626'
  ctx.fillRect(x, y, width, height)
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x, y, width, height)

  if (image) {
    const smoothing = ctx.imageSmoothingEnabled
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(image, x + padding, y + padding, qrSize, qrSize)
    ctx.imageSmoothingEnabled = smoothing
  }

  ctx.textAlign = 'center'
  ctx.fillStyle = '#e0485f'
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
  anchor.hidden = true
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 500)
}
