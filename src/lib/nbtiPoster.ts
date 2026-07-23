import { NBTI_DIMENSIONS } from '@/lib/nbti'
import type { NbtiResultInfo, NbtiScores, ResultKey } from '@/lib/nbti'
import {
  canvasToPng,
  createPosterCanvas,
  drawEditorialBase,
  drawSiteQr,
  drawTextLines,
  loadPosterSeal,
  loadSiteQr,
} from '@/lib/posterCanvas'

function profileAdvice(key: ResultKey): string[] {
  return [
    key[0] === 'B' ? '产能优势：把爆更拆成固定交付节点，预留一次修文缓冲。' : '产能策略：使用短周期和小目标，每次只承诺下一章。',
    key[1] === 'S' ? '选题策略：熟悉类型中替换一个关键规则，避免只做套路换皮。' : '选题策略：先用一句话讲清脑洞，再删除不影响冲突的设定。',
    key[2] === 'L' ? '阅读体验：在逻辑闭环之外，每三章补一次人物情绪回报。' : '阅读体验：保留情绪爆点，同时让每次反转都能找到前置证据。',
    key[3] === 'D' ? '推进方式：大纲写到阶段目标即可，避免用规划代替正文。' : '推进方式：即兴前先锁定本章目标、阻力与章末状态。',
  ]
}

export async function createNbtiPoster(info: NbtiResultInfo, key: ResultKey, scores: NbtiScores): Promise<Blob> {
  const [{ canvas, ctx }, qrImage, seal] = await Promise.all([
    Promise.resolve(createPosterCanvas()),
    loadSiteQr(),
    loadPosterSeal(),
  ])
  const advice = profileAdvice(key)

  drawEditorialBase(ctx, seal, '网文十六型人格', '创作档案')

  ctx.font = '70px "Segoe UI Emoji", sans-serif'
  ctx.fillText(info.icon, 72, 253)
  ctx.fillStyle = '#8f101c'
  ctx.font = '900 26px "Georgia", serif'
  ctx.fillText(key, 168, 214)
  ctx.fillStyle = '#151311'
  ctx.font = '900 52px "STSong", "SimSun", serif'
  ctx.fillText(info.name, 168, 268)
  ctx.fillStyle = '#4c443e'
  ctx.font = '500 20px "Microsoft YaHei", sans-serif'
  drawTextLines(ctx, info.desc, 168, 310, 828, 29, 3)

  ctx.strokeStyle = '#9e1220'
  ctx.beginPath()
  ctx.moveTo(72, 390)
  ctx.lineTo(1008, 390)
  ctx.stroke()
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('四维创作画像', 72, 426)

  let y = 466
  NBTI_DIMENSIONS.forEach((dimension, index) => {
    const score = scores[dimension.key]
    ctx.fillStyle = '#302b27'
    ctx.font = '700 17px "Microsoft YaHei", sans-serif'
    ctx.fillText(`${dimension.left} ${score}%`, 72, y)
    ctx.textAlign = 'right'
    ctx.fillText(`${100 - score}% ${dimension.right}`, 1008, y)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#d8cec3'
    ctx.fillRect(72, y + 14, 936, 12)
    ctx.fillStyle = index % 2 ? '#174c43' : '#8f101c'
    ctx.fillRect(72, y + 14, Math.max(14, 936 * (score / 100)), 12)
    y += 67
  })

  ctx.strokeStyle = '#b7aa9d'
  ctx.strokeRect(72, 756, 448, 150)
  ctx.strokeRect(560, 756, 448, 150)
  ctx.fillStyle = '#8f101c'
  ctx.font = '800 17px "Microsoft YaHei", sans-serif'
  ctx.fillText('适合题材', 92, 790)
  ctx.fillStyle = '#211d1a'
  ctx.font = '800 23px "STSong", "SimSun", serif'
  drawTextLines(ctx, info.genres.join(' · '), 92, 830, 408, 32, 3)
  ctx.fillStyle = '#174c43'
  ctx.font = '800 17px "Microsoft YaHei", sans-serif'
  ctx.fillText('同类气质参考', 580, 790)
  ctx.fillStyle = '#3e3833'
  ctx.font = '500 17px "Microsoft YaHei", sans-serif'
  info.examples.slice(0, 2).forEach((example, index) => drawTextLines(ctx, `${index + 1}. ${example}`, 580, 828 + index * 38, 408, 23, 2))

  ctx.fillStyle = '#8f101c'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('你的创作使用说明', 72, 958)
  advice.forEach((line, index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const x = 72 + column * 488
    const cellY = 986 + row * 94
    ctx.fillStyle = column ? '#174c43' : '#8f101c'
    ctx.font = '900 18px "Georgia", serif'
    ctx.fillText(`0${index + 1}`, x, cellY + 22)
    ctx.fillStyle = '#423b36'
    ctx.font = '500 17px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, line, x + 42, cellY + 22, 400, 24, 3)
  })

  ctx.strokeStyle = '#b7aa9d'
  ctx.beginPath()
  ctx.moveTo(72, 1180)
  ctx.lineTo(1008, 1180)
  ctx.stroke()
  ctx.fillStyle = '#174c43'
  ctx.font = '800 18px "Microsoft YaHei", sans-serif'
  ctx.fillText('未来 7 天行动清单', 72, 1218)
  const plan = [
    '第 1 天：选一个适配题材，写出一句话卖点与三种书名。',
    '第 2—4 天：完成前三章，每章只解决一个关键问题。',
    '第 5—7 天：找目标读者复述卖点，按反馈只改最弱一项。',
  ]
  plan.forEach((line, index) => {
    ctx.fillStyle = '#3e3833'
    ctx.font = '500 16px "Microsoft YaHei", sans-serif'
    drawTextLines(ctx, `${index + 1}. ${line}`, 72, 1254 + index * 35, 650, 22, 1)
  })

  drawSiteQr(ctx, qrImage, 820, 1198, 110)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#8f101c'
  ctx.font = '600 17px "Microsoft YaHei", sans-serif'
  ctx.fillText('认识自己的创作惯性，再决定下一本怎样写得更稳', 540, 1390)

  return canvasToPng(canvas)
}
