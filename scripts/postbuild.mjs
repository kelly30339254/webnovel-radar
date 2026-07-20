import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIST_DIR = path.resolve('dist')
const ORIGIN = process.env.VITE_PUBLIC_ORIGIN || 'https://nailong-d4g922z6h6d9ff59e-1455870789.tcloudbaseapp.com'
const DEFAULT_IMAGE = `${ORIGIN}/images/og-cover.png`

const resultNames = {
  BSLD: '人形打字机', BSLJ: '灵感喷射机', BSQD: '狗血流水线', BSQJ: '疯燃型创作者',
  BNLD: '设定狂魔', BNLJ: '灵感喷泉', BNQD: '虐恋建筑师', BNQJ: '情绪过山车',
  GSLD: '精密拖延症', GSLJ: '灵光一闪鸽', GSQD: '悲情鸽王', GSQJ: '佛系摆烂型',
  GNLD: '完美主义鸽', GNLJ: '脑洞收藏鸽', GNQD: '深夜情绪鸽', GNQJ: '彻底躺平型',
}

const routes = [
  { path: '/', title: '网文风向 · 网文作者每日选题雷达', description: '每日题材风向、番茄新书榜、IP改编信号与可直接使用的开书工具。' },
  { path: '/nbti', title: '网文十六型人格测试', description: '20 道题测出你的网文创作人格、四维画像与适合题材。' },
  { path: '/radar', title: '我的开书雷达', description: '结合实时题材风向、更新能力和改编方向，生成个性化开书建议。' },
  { path: '/prompt-lab', title: '今日开书命题盲盒', description: '用当天热榜题材、关键词和人设生成一张可直接开写的命题卡。' },
  { path: '/tips', title: '网文写作技巧', description: '网文结构、节奏、爽点、人设和章末钩子的实用方法。' },
  { path: '/boards', title: '番茄新书榜', description: '番茄小说男频与女频新书榜，每日更新。' },
  { path: '/ip', title: 'IP 改编热点', description: '红果短剧、漫剧与 AI 剧热点及网文改编风向。' },
  ...Object.entries(resultNames).map(([key, name]) => ({
    path: `/nbti/${key}`,
    title: `我的网文创作人格是「${name}」`,
    description: `网文十六型人格结果：${name}。看看你会是哪一种创作者。`,
  })),
]

function replaceMeta(html, route) {
  const url = `${ORIGIN}${route.path}`
  return html
    .replace(/<title>.*?<\/title>/, `<title>${route.title}｜网文风向</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${DEFAULT_IMAGE}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${DEFAULT_IMAGE}" />`)
}

const indexHtml = await readFile(path.join(DIST_DIR, 'index.html'), 'utf8')
for (const route of routes) {
  if (route.path === '/') continue
  const directory = path.join(DIST_DIR, route.path.slice(1))
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.html'), replaceMeta(indexHtml, route), 'utf8')
}

const lastmod = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${ORIGIN}${route.path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>\n`
await writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8')

