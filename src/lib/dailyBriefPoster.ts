import { canvasToPng, createPosterCanvas, downloadBlob, drawTextLines, roundedRect } from '@/lib/posterCanvas'
import type { Board, GenreHeat } from '@/types/wind'

const SEAL_SRC = '/assets/nailong-logo.svg'

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function drawRule(ctx: CanvasRenderingContext2D, y: number) {
  ctx.strokeStyle = '#e0485f'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(78, y)
  ctx.lineTo(1002, y)
  ctx.stroke()
}

function drawMetric(ctx: CanvasRenderingContext2D, x: number, label: string, value: string) {
  ctx.fillStyle = '#1b1626'
  ctx.fillRect(x, 382, 272, 82)
  ctx.fillStyle = '#e0485f'
  ctx.font = '700 27px "Microsoft YaHei", sans-serif'
  ctx.fillText(value, x + 18, 418)
  ctx.fillStyle = '#a89fb8'
  ctx.font = '500 16px "Microsoft YaHei", sans-serif'
  ctx.fillText(label, x + 18, 446)
}

export async function downloadDailyBriefPoster({
  date,
  verdict,
  genres,
  boards,
  historyDays,
}: {
  date: string
  verdict: string
  genres: GenreHeat[]
  boards: Board[]
  historyDays: number
}) {
  const [{ canvas, ctx }, seal] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadImage(SEAL_SRC),
  ])
  const books = boards.flatMap((board) => board.books)
  const topMale = boards.find((board) => board.channel === '男频')?.books[0]
  const topFemale = boards.find((board) => board.channel === '女频')?.books[0]

  ctx.fillStyle = '#14101d'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#e0485f'
  ctx.lineWidth = 2
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84)
  ctx.strokeRect(56, 56, canvas.width - 112, canvas.height - 112)

  if (seal) ctx.drawImage(seal, 78, 76, 88, 88)
  ctx.fillStyle = '#f5f1e8'
  ctx.font = '700 28px "Songti SC", "STSong", serif'
  ctx.fillText('奶龙数据站', 184, 112)
  ctx.fillStyle = '#a89fb8'
  ctx.font = '500 15px "Times New Roman", serif'
  ctx.fillText('WEBNOVEL RADAR · DAILY REPORT', 184, 140)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#f5f1e8'
  ctx.font = '500 25px "Times New Roman", serif'
  ctx.fillText(date, 994, 122)
  ctx.textAlign = 'left'
  drawRule(ctx, 184)

  ctx.fillStyle = '#e0485f'
  ctx.font = '700 64px "Songti SC", "STSong", serif'
  ctx.fillText('今日', 78, 270)
  ctx.fillStyle = '#f5f1e8'
  ctx.fillText('网文风向', 224, 270)
  ctx.fillStyle = '#f5f1e8'
  ctx.font = '700 29px "Songti SC", "STSong", serif'
  drawTextLines(ctx, verdict, 82, 326, 910, 40, 2)

  drawMetric(ctx, 82, '看了多少天', `${historyDays} 天`)
  drawMetric(ctx, 364, '对比了多少题材', `${genres.length} 个`)
  drawMetric(ctx, 646, '看了多少本新书', `${books.length} 本`)

  ctx.fillStyle = '#e0485f'
  ctx.font = '700 24px "Songti SC", "STSong", serif'
  ctx.fillText('题材一眼看懂', 82, 518)
  drawRule(ctx, 535)
  genres.slice(0, 4).forEach((genre, index) => {
    const y = 574 + index * 72
    ctx.fillStyle = '#f5f1e8'
    ctx.font = '700 22px "Microsoft YaHei", sans-serif'
    ctx.fillText(`${index + 1}. ${genre.name}`, 88, y)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fillRect(286, y - 16, 410, 10)
    ctx.fillStyle = index === 0 ? '#e0485f' : '#4cc2ac'
    ctx.fillRect(286, y - 16, 410 * (genre.heat / 100), 10)
    ctx.fillStyle = '#e0485f'
    ctx.font = '700 20px "Arial", sans-serif'
    ctx.fillText(String(genre.heat), 716, y)
    ctx.fillStyle = '#a89fb8'
    ctx.font = '500 16px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, genre.note ?? '继续看看榜单和读者反应。', 770, y, 220, 23, 2)
  })

  ctx.fillStyle = '#e0485f'
  ctx.font = '700 24px "Songti SC", "STSong", serif'
  ctx.fillText('榜首新书', 82, 868)
  drawRule(ctx, 885)
  const samples = [
    { label: '男频', book: topMale },
    { label: '女频', book: topFemale },
  ]
  samples.forEach((sample, index) => {
    const x = 82 + index * 464
    ctx.fillStyle = index === 0 ? '#e0485f' : '#4cc2ac'
    ctx.fillRect(x, 918, 6, 112)
    ctx.fillStyle = '#a89fb8'
    ctx.font = '700 16px "Microsoft YaHei", sans-serif'
    ctx.fillText(`${sample.label} #1 · ${sample.book?.genre ?? '—'}`, x + 20, 944)
    ctx.fillStyle = '#f5f1e8'
    ctx.font = '700 21px "Songti SC", "STSong", serif'
    drawTextLines(ctx, sample.book?.title ?? '榜单暂时没有数据', x + 20, 978, 420, 29, 2)
    ctx.fillStyle = '#e0485f'
    ctx.font = '500 16px "Microsoft YaHei", sans-serif'
    ctx.fillText(sample.book?.heat ?? '等待更新', x + 20, 1016)
  })

  roundedRect(ctx, 82, 1060, 916, 180, 8)
  ctx.fillStyle = '#1b1626'
  ctx.fill()
  ctx.fillStyle = '#4cc2ac'
  ctx.font = '700 23px "Songti SC", "STSong", serif'
  ctx.fillText('作者今天就做', 108, 1098)
  ctx.fillStyle = '#f5f1e8'
  ctx.font = '500 18px "Microsoft YaHei", sans-serif'
  const primary = genres[0]?.name ?? '核心题材'
  const actions = [
    `围绕“${primary}”写 3 个不同职业、特殊能力和人物关系。`,
    '第一章告诉读者会看到什么，第三章必须给一次明确结果。',
    '点击、三章追读、有效评论至少两项不错，再多准备存稿。',
  ]
  actions.forEach((action, index) => ctx.fillText(`${index + 1}. ${action}`, 110, 1134 + index * 31))

  // 底部装饰分隔线（原浅色水墨插画已随深色化移除）
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.fillRect(82, 1298, 916, 1)
  ctx.fillStyle = '#e0485f'
  ctx.fillRect(82, 1296, 120, 3)
  ctx.fillStyle = '#a89fb8'
  ctx.font = '500 14px "Microsoft YaHei", sans-serif'
  ctx.fillText(`数据截止 ${date} · 本地静态榜单与历史归档 · 仅供创作研究参考`, 92, 1382)

  const blob = await canvasToPng(canvas)
  downloadBlob(blob, `网文风向-作者决策简报-${date}.png`)
}
