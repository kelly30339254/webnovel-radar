import {
  canvasToPng,
  createPosterCanvas,
  drawEditorialBase,
  drawSiteQr,
  drawTextLines,
  loadPosterSeal,
  loadSiteQr,
} from '@/lib/posterCanvas'
import type { StoryPrompt } from '@/lib/promptGenerator'

export interface PromptPosterData extends StoryPrompt {
  number: number
  updatedAt?: string
}

function drawStoryCell(ctx: CanvasRenderingContext2D, label: string, text: string, x: number, y: number, color: string) {
  ctx.strokeStyle = '#b7aa9d'
  ctx.strokeRect(x, y, 448, 126)
  ctx.fillStyle = color
  ctx.font = '800 16px "Microsoft YaHei", sans-serif'
  ctx.fillText(label, x + 18, y + 30)
  ctx.fillStyle = '#332e2a'
  ctx.font = '500 18px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, text, x + 18, y + 62, 412, 25, 3)
}

export async function createPromptPoster(data: PromptPosterData): Promise<Blob> {
  const [{ canvas, ctx }, qrImage, seal] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadSiteQr(),
    loadPosterSeal(),
  ])

  drawEditorialBase(ctx, seal, `命题盲盒 NO.${String(data.number).padStart(3, '0')}`, data.updatedAt ?? '今日')

  ctx.fillStyle = '#8f101c'
  ctx.font = '900 24px "Microsoft YaHei", sans-serif'
  ctx.fillText('今日开书命题', 72, 214)
  ctx.fillStyle = '#151311'
  ctx.font = '900 43px "STSong", "SimSun", serif'
  drawTextLines(ctx, data.title, 72, 266, 936, 50, 2)

  const tags = [`题材｜${data.genre}`, `风向词｜${data.keyword}`, `人设｜${data.persona}`, `关系｜${data.relationship}`]
  tags.forEach((tag, index) => {
    const x = 72 + (index % 2) * 468
    const y = 370 + Math.floor(index / 2) * 49
    ctx.fillStyle = index % 2 ? '#174c43' : '#8f101c'
    ctx.font = '700 16px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, tag, x, y, 440, 22, 1)
  })

  ctx.strokeStyle = '#9e1220'
  ctx.beginPath()
  ctx.moveTo(72, 456)
  ctx.lineTo(1008, 456)
  ctx.stroke()
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('一句话梗概', 72, 492)
  ctx.fillStyle = '#292522'
  ctx.font = '600 22px "STSong", "SimSun", serif'
  drawTextLines(ctx, data.logline, 72, 528, 936, 31, 4)

  drawStoryCell(ctx, '主角目标', data.goal, 72, 650, '#8f101c')
  drawStoryCell(ctx, '核心阻力', data.obstacle, 560, 650, '#174c43')
  drawStoryCell(ctx, '失败代价', data.stakes, 72, 792, '#174c43')
  drawStoryCell(ctx, '隐藏真相', data.secret, 560, 792, '#8f101c')

  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('黄金三章 · 节拍与章末钩子', 72, 964)
  data.chapters.slice(0, 3).forEach((chapter, index) => {
    const y = 994 + index * 105
    ctx.fillStyle = index === 1 ? '#174c43' : '#8f101c'
    ctx.font = '900 22px "Georgia", serif'
    ctx.fillText(`0${index + 1}`, 72, y + 28)
    ctx.fillStyle = '#211d1a'
    ctx.font = '800 17px "Microsoft YaHei", sans-serif'
    ctx.fillText(chapter.label, 124, y + 27)
    ctx.fillStyle = '#4b433d'
    ctx.font = '500 16px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, chapter.beat, 124, y + 54, 620, 22, 2)
    ctx.fillStyle = '#8f101c'
    ctx.font = '600 15px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, chapter.cliffhanger, 124, y + 98, 620, 20, 1)
    ctx.strokeStyle = '#d0c5b9'
    ctx.beginPath()
    ctx.moveTo(124, y + 104)
    ctx.lineTo(744, y + 104)
    ctx.stroke()
  })

  drawSiteQr(ctx, qrImage, 792, 1036, 138)
  ctx.fillStyle = '#174c43'
  ctx.font = '800 16px "Microsoft YaHei", sans-serif'
  ctx.fillText('写作提醒', 790, 1296)
  ctx.fillStyle = '#4b433d'
  ctx.font = '500 15px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, '先让角色在现场做选择，再解释设定；每章都要改变目标、关系或代价。', 790, 1324, 194, 21, 3)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#8f101c'
  ctx.font = '600 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('抽一张命题，把今天的灵感写成可验证的前三章', 540, 1390)

  return canvasToPng(canvas)
}
