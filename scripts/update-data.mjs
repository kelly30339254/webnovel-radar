#!/usr/bin/env node
/**
 * 每日数据更新脚本
 * 抓取 wangwendashuju.com 的榜单数据，更新 public/data/ 下的 JSON 文件，
 * 并增量追加到 history.json。
 *
 * 用法:
 *   node scripts/update-data.mjs           # 正常更新
 *   DRY_RUN=1 node scripts/update-data.mjs # 只打印，不写入
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'public', 'data')
const DRY_RUN = process.env.DRY_RUN === '1'

const today = () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

async function readJson(name) {
  try {
    const text = await fs.readFile(path.join(DATA_DIR, name), 'utf-8')
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function writeJson(name, data) {
  const file = path.join(DATA_DIR, name)
  if (DRY_RUN) {
    console.log(`[DRY RUN] 将写入 ${file}`)
    return
  }
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  console.log(`已写入 ${file}`)
}

async function fetchText(url, opts = {}) {
  const res = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'zh-CN,zh;q=0.9',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      ...opts.headers,
    },
    ...opts,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

function extractBooksFromHtml(html) {
  // 网文大数据页面通常把榜单数据以 JSON 形式注入到 window.__INITIAL_STATE__ 或 <script> 中
  // 这里先尝试多种常见模式，如果都失败则返回空数组
  const patterns = [
    /window\.__INITIAL_STATE__\s*=\s*({.*?});?\s*<\/script>/s,
    /window\.__DATA__\s*=\s*({.*?});?\s*<\/script>/s,
    /<script[^>]*>.*?"books"\s*:\s*(\[.*?\]).*?<\/script>/s,
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) {
      try {
        const data = JSON.parse(m[1])
        const list = data.books ?? data.list ?? data.rankList ?? data.data?.list ?? []
        if (Array.isArray(list) && list.length) return list
      } catch {
        // continue
      }
    }
  }
  return []
}

function normalizeBook(raw, rankStart = 1) {
  return {
    rank: raw.rank ?? raw.no ?? rankStart,
    title: String(raw.title ?? raw.bookName ?? raw.name ?? '').trim(),
    author: String(raw.author ?? raw.authorName ?? '').trim(),
    genre: String(raw.genre ?? raw.categoryName ?? raw.tag ?? '').trim(),
    heat: raw.heat ?? raw.readCount ?? raw.followCount ?? undefined,
  }
}

async function updateFanqieBoards() {
  const urls = {
    male: 'https://wangwendashuju.com/fq/rank?gender=male&list=new',
    female: 'https://wangwendashuju.com/fq/rank?gender=female&list=new',
  }
  const existing = (await readJson('wind.json')) ?? {}
  const boards = []

  for (const [channel, url] of Object.entries(urls)) {
    try {
      const html = await fetchText(url)
      const list = extractBooksFromHtml(html).map((b, i) => normalizeBook(b, i + 1)).filter((b) => b.title)
      if (!list.length) throw new Error('未解析到书籍')
      boards.push({
        platform: '番茄小说',
        channel: channel === 'male' ? '男频' : '女频',
        chartName: `${channel === 'male' ? '男频' : '女频'}新书榜`,
        sourceUrl: url,
        dataDate: today(),
        books: list.slice(0, 10),
      })
    } catch (err) {
      console.warn(`抓取番茄新书榜 ${channel} 失败:`, err.message)
      // 保留旧数据
      const old = existing.boards?.find((b) => b.channel === (channel === 'male' ? '男频' : '女频'))
      if (old) boards.push(old)
    }
  }

  return boards
}

async function updateFanqieDebut() {
  const url = 'https://wangwendashuju.com/fq/debut?gender=male'
  const existing = await readJson('fanqie-debut.json')
  try {
    const html = await fetchText(url)
    const list = extractBooksFromHtml(html)
      .map((b, i) => ({
        rank: b.rank ?? b.no ?? i + 1,
        title: String(b.title ?? b.bookName ?? '').trim(),
        author: String(b.author ?? '').trim(),
        genre: String(b.genre ?? '').trim(),
        words: String(b.words ?? b.wordCount ?? '').trim(),
        readers: String(b.readers ?? b.readCount ?? '').trim(),
        readUrl: b.readUrl ?? `https://fanqienovel.com/search/${encodeURIComponent(String(b.title ?? '').trim())}`,
      }))
      .filter((b) => b.title)
    if (!list.length) throw new Error('未解析到书籍')
    const data = {
      updatedAt: today(),
      sourceUrl: url,
      books: list.slice(0, 10),
    }
    await writeJson('fanqie-debut.json', data)
    return data
  } catch (err) {
    console.warn('抓取番茄首秀榜失败:', err.message)
    return existing
  }
}

async function updateHongguo() {
  const url = 'https://wangwendashuju.com/hongguo'
  const existing = await readJson('hongguo-hot.json')
  try {
    const html = await fetchText(url)
    // 尝试从页面提取三类榜单数据，结构未知时返回旧数据
    const categories = []
    const names = ['真人剧', '漫剧', 'AI剧']
    for (const name of names) {
      const section = html.match(new RegExp(`${name}[\\s\\S]{0,2000}?<table[\\s\\S]*?</table>`, 'i'))
      if (!section) continue
      const rows = section[0].match(/<tr[\s\S]*?<\/tr>/gi) || []
      const items = []
      rows.forEach((row, idx) => {
        const cells = row.match(/<td[\s\S]*?<\/td>/gi) || []
        if (!cells.length) return
        const text = (cells.map((c) => c.replace(/<[^>]+>/g, '').trim()).filter(Boolean))
        if (text.length >= 2) {
          items.push({
            rank: idx,
            title: text[1],
            heat: text[2] ?? '',
            note: text[3] ?? '',
            playUrl: 'https://hongguoduanju.com/',
          })
        }
      })
      if (items.length) {
        categories.push({ name, items: items.slice(0, 10) })
      }
    }
    if (!categories.length) throw new Error('未解析到红果榜单')
    const data = {
      updatedAt: today(),
      sourceUrl: url,
      officialBase: 'https://hongguoduanju.com/',
      categories,
    }
    await writeJson('hongguo-hot.json', data)
    return data
  } catch (err) {
    console.warn('抓取红果热播榜失败:', err.message)
    return existing
  }
}

async function updateHistory(genres) {
  const existing = (await readJson('history.json')) ?? { days: [] }
  const date = today()
  const already = existing.days.some((d) => d.date === date)
  if (already) {
    console.log(`history.json 已包含 ${date}，跳过追加`)
    return existing
  }
  const day = { date, genres: genres.map((g) => ({ name: g.name, heat: g.heat })) }
  const days = [...existing.days, day].slice(-90)
  const data = { days }
  await writeJson('history.json', data)
  return data
}

async function updateWind(boards, debut, hongguo) {
  const existing = (await readJson('wind.json')) ?? {}
  const updatedAt = today()

  // 如果榜单抓取失败，保留原 boards
  const mergedBoards = boards?.length ? boards : existing.boards

  // 历史数据里的 genre heat 用于趋势图；如果当前 genres 为空则保留原值
  const genres = existing.genres?.length ? existing.genres : []

  // 简单生成 verdict：取男频/女频 top 题材
  const male = genres.filter((g) => g.name.includes('男频') || g.name.includes('都市') || g.name.includes('玄幻'))
  const female = genres.filter((g) => !male.includes(g))
  const topMale = male.slice(0, 2).map((g) => g.name.replace(/（.*?）/g, '')).join('、')
  const topFemale = female.slice(0, 2).map((g) => g.name.replace(/（.*?）/g, '')).join('、')
  const verdict = `男频${topMale}领跑，女频${topFemale}霸榜，短剧改编向${existing.ipHot?.[0]?.genre ?? '热榜题材'}集中`

  const data = {
    ...existing,
    updatedAt,
    verdict,
    boards: mergedBoards,
  }
  await writeJson('wind.json', data)
  return data
}

async function main() {
  console.log(`开始更新数据: ${today()} ${DRY_RUN ? '[DRY RUN]' : ''}`)

  const [boards, debut, hongguo] = await Promise.all([
    updateFanqieBoards(),
    updateFanqieDebut(),
    updateHongguo(),
  ])

  const wind = await updateWind(boards, debut, hongguo)
  await updateHistory(wind.genres ?? [])

  console.log('数据更新完成')
}

main().catch((err) => {
  console.error('更新脚本异常:', err)
  process.exit(1)
})
