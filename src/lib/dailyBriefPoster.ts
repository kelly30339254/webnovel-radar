import { canvasToPng, createPosterCanvas, downloadBlob, drawTextLines, wrapText } from '@/lib/posterCanvas'

const ART_SRC = '/assets/daily-report-poster-art.png'
const SEAL_SRC = '/assets/webnovel-radar-seal.png'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`图片加载失败：${src}`))
    image.src = src
  })
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, minSize: number) {
  let size = startSize
  while (size > minSize) {
    ctx.font = `700 ${size}px "Songti SC", "STSong", serif`
    if (wrapText(ctx, text, maxWidth).length <= 4) break
    size -= 2
  }
  return size
}

export async function downloadDailyBriefPoster({
  date,
  verdict,
  primaryGenre,
  crowdedGenre,
}: {
  date: string
  verdict: string
  primaryGenre: string
  crowdedGenre: string
}) {
  const [{ canvas, ctx }, art, seal] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadImage(ART_SRC),
    loadImage(SEAL_SRC),
  ])

  ctx.fillStyle = '#f8f4ec'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#8f151b'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96)
  ctx.strokeRect(64, 64, canvas.width - 128, canvas.height - 128)

  ctx.drawImage(seal, 86, 86, 104, 104)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#211c18'
  ctx.font = '500 28px "Times New Roman", serif'
  ctx.fillText(date, 990, 145)
  ctx.textAlign = 'left'

  ctx.strokeStyle = '#b67f77'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(86, 214)
  ctx.lineTo(994, 214)
  ctx.stroke()

  ctx.fillStyle = '#94151b'
  ctx.font = '700 78px "Songti SC", "STSong", serif'
  ctx.fillText('今日', 90, 326)
  ctx.fillStyle = '#111111'
  ctx.fillText('网文风向', 255, 326)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#55443d'
  ctx.font = '500 22px "Songti SC", "STSong", serif'
  ctx.fillText('圈  速  览  ·  趋  势  洞  察  ·  创  作  参  考', canvas.width / 2, 382)
  ctx.textAlign = 'left'

  const fontSize = fitText(ctx, verdict, 880, 46, 36)
  ctx.fillStyle = '#171513'
  ctx.font = `700 ${fontSize}px "Songti SC", "STSong", serif`
  drawTextLines(ctx, verdict, 96, 474, 880, 66, 4)

  ctx.fillStyle = '#8f151b'
  ctx.font = '700 25px "Microsoft YaHei", sans-serif'
  ctx.fillText(`优先观察：${primaryGenre}`, 96, 742)
  ctx.fillStyle = '#174c43'
  ctx.fillText(`拥挤提醒：${crowdedGenre}`, 96, 785)

  const artTop = 814
  const artHeight = 536
  const targetWidth = canvas.width - 132
  const scale = Math.max(targetWidth / art.width, artHeight / art.height)
  const sourceWidth = targetWidth / scale
  const sourceHeight = artHeight / scale
  ctx.save()
  ctx.beginPath()
  ctx.rect(66, artTop, canvas.width - 132, artHeight)
  ctx.clip()
  ctx.drawImage(
    art,
    (art.width - sourceWidth) / 2,
    Math.max(0, art.height - sourceHeight),
    sourceWidth,
    sourceHeight,
    66,
    artTop,
    targetWidth,
    artHeight,
  )
  ctx.restore()

  const blob = await canvasToPng(canvas)
  downloadBlob(blob, `网文风向-${date}.png`)
}
