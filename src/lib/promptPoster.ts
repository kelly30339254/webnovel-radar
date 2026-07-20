import { canvasToPng, createPosterCanvas, drawSiteQr, drawTextLines, hslVar, loadSiteQr, roundedRect } from '@/lib/posterCanvas'
import type { StoryPrompt } from '@/lib/promptGenerator'

export interface PromptPosterData extends StoryPrompt {
  number: number
  updatedAt?: string
}

export async function createPromptPoster(data: PromptPosterData): Promise<Blob> {
  const [{ canvas, ctx }, qrImage] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadSiteQr(),
  ])

  // 背景
  ctx.fillStyle = hslVar('--theme-bg')
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 顶部渐变条
  const topGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  topGradient.addColorStop(0, hslVar('--theme-500'))
  topGradient.addColorStop(1, hslVar('--theme-400'))
  ctx.fillStyle = topGradient
  ctx.fillRect(0, 0, canvas.width, 8)

  // 标题
  ctx.textAlign = 'left'
  ctx.fillStyle = hslVar('--theme-900')
  ctx.font = '700 32px "Microsoft YaHei", sans-serif'
  ctx.fillText('网文风向 · 今日开书命题', 76, 72)
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '500 20px "Microsoft YaHei", sans-serif'
  ctx.fillText(`NO. ${String(data.number).padStart(3, '0')} · ${data.updatedAt ?? '今日'}`, 78, 104)

  // 主卡片
  roundedRect(ctx, 76, 130, 928, 1180, 28)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = hslVar('--theme-200')
  ctx.lineWidth = 1.5
  ctx.stroke()

  // 标签
  roundedRect(ctx, 120, 170, 190, 40, 20)
  ctx.fillStyle = hslVar('--theme-900')
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 18px "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('今天就写这一题', 215, 197)
  ctx.textAlign = 'left'

  // 书名
  ctx.fillStyle = hslVar('--theme-950')
  ctx.font = '700 48px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.title, 120, 255, 840, 58, 2)

  // 四个 chip
  const chips = [
    { label: '题材', value: data.genre, color: hslVar('--theme-600'), bg: hslVar('--theme-100') },
    { label: '风向关键词', value: data.keyword, color: 'hsl(168 76% 31%)', bg: 'hsl(166 76% 97%)' },
    { label: '主角人设', value: data.persona, color: 'hsl(224 76% 54%)', bg: 'hsl(213 100% 97%)' },
    { label: '关系钩子', value: data.relationship, color: 'hsl(32 95% 38%)', bg: 'hsl(48 100% 96%)' },
  ]
  chips.forEach((chip, index) => {
    const x = 120 + (index % 2) * 445
    const y = 360 + Math.floor(index / 2) * 120
    roundedRect(ctx, x, y, 415, 104, 14)
    ctx.fillStyle = chip.bg
    ctx.fill()
    ctx.fillStyle = chip.color
    ctx.font = '700 16px "Microsoft YaHei", sans-serif'
    ctx.fillText(chip.label, x + 18, y + 32)
    ctx.fillStyle = hslVar('--theme-950')
    ctx.font = '600 22px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, chip.value, x + 18, y + 66, 375, 26, 2)
  })

  // 一句话梗概
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '700 20px "Microsoft YaHei", sans-serif'
  ctx.fillText('一句话梗概', 120, 640)
  ctx.fillStyle = hslVar('--theme-900')
  ctx.font = '500 24px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.logline, 120, 675, 840, 32, 3)

  // 隐藏真相
  roundedRect(ctx, 120, 790, 840, 72, 14)
  ctx.fillStyle = hslVar('--theme-950')
  ctx.fill()
  ctx.fillStyle = hslVar('--theme-300')
  ctx.font = '700 16px "Microsoft YaHei", sans-serif'
  ctx.fillText('隐藏真相', 145, 817)
  ctx.fillStyle = '#ffffff'
  ctx.font = '500 20px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, data.secret, 145, 845, 790, 26, 1)

  // 黄金三章（左侧，不覆盖二维码区域）
  ctx.fillStyle = hslVar('--theme-600')
  ctx.font = '700 20px "Microsoft YaHei", sans-serif'
  ctx.fillText('黄金三章剧情节拍', 120, 905)
  data.chapters.forEach((chapter, index) => {
    ctx.fillStyle = hslVar('--theme-600')
    ctx.font = '700 18px "Microsoft YaHei", sans-serif'
    ctx.fillText(`0${index + 1}`, 120, 940 + index * 48)
    ctx.fillStyle = hslVar('--theme-950')
    ctx.font = '500 19px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, chapter.beat, 175, 940 + index * 48, 540, 24, 2)
  })

  // 二维码（右下）
  drawSiteQr(ctx, qrImage, 760, 905, 168)

  // 底部 slogan
  ctx.textAlign = 'center'
  ctx.fillStyle = hslVar('--theme-500')
  ctx.font = '500 22px "Microsoft YaHei", sans-serif'
  ctx.fillText('抽一张命题，把今天的灵感写成开篇', 540, 1365)

  return canvasToPng(canvas)
}
