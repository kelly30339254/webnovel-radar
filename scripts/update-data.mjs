#!/usr/bin/env node
/**
 * 每日数据更新脚本
 * 抓取 novelcatch.com 的番茄新书榜，并尽力刷新辅助榜单。
 * 核心男/女频榜任一失败时立即退出，不改时间戳、不写入旧数据。
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
const TIME_ZONE = 'Asia/Shanghai'
const SOURCE_MAX_AGE_DAYS = 2
const MIN_BOOKS_PER_BOARD = 10

const today = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function dayDifference(olderDate, newerDate) {
  const older = Date.parse(`${olderDate}T00:00:00Z`)
  const newer = Date.parse(`${newerDate}T00:00:00Z`)
  if (Number.isNaN(older) || Number.isNaN(newer)) return Number.NaN
  return Math.floor((newer - older) / 86400000)
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

function extractJsonArray(text, marker) {
  const markerIndex = text.indexOf(marker)
  if (markerIndex < 0) return null
  const start = text.indexOf('[', markerIndex + marker.length)
  if (start < 0) return null

  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '[') depth += 1
    else if (char === ']') {
      depth -= 1
      if (depth === 0) return JSON.parse(text.slice(start, index + 1))
    }
  }
  return null
}

function extractNovelcatchRows(html) {
  const chunks = []
  for (const match of html.matchAll(/<script>self\.__next_f\.push\((\[1,.*?\])\)<\/script>/gs)) {
    try {
      const payload = JSON.parse(match[1])
      if (typeof payload[1] === 'string') chunks.push(payload[1])
    } catch {
      // 忽略不属于榜单数据的 Next.js Flight 片段。
    }
  }
  return extractJsonArray(chunks.join('\n'), '"initialRows":') ?? []
}

function extractSourceDate(html) {
  return html.match(/数据更新于[\s\S]{0,60}?(\d{4}-\d{2}-\d{2})/)?.[1] ?? ''
}

function formatReaders(value) {
  const count = Number(value)
  if (!Number.isFinite(count) || count <= 0) return undefined
  return count >= 10000 ? `${(count / 10000).toFixed(1)}万在读` : `${Math.round(count)}人在读`
}

function normalizeNovelcatchBook(raw, rankStart) {
  return {
    rank: Number(raw.rank) || rankStart,
    title: String(raw.book_name ?? '').trim(),
    author: String(raw.author ?? '').trim(),
    genre: String(raw.category ?? '').trim(),
    heat: formatReaders(raw.ssr),
  }
}

function validateBoard(channel, books, sourceDate) {
  if (books.length < MIN_BOOKS_PER_BOARD) {
    throw new Error(`${channel}仅解析到 ${books.length} 本书，少于最低要求 ${MIN_BOOKS_PER_BOARD}`)
  }
  if (books.some((book) => !book.title || !book.author || !book.genre)) {
    throw new Error(`${channel}存在缺少书名、作者或分类的记录`)
  }
  if (new Set(books.map((book) => book.title)).size !== books.length) {
    throw new Error(`${channel}存在重复书名`)
  }
  const age = dayDifference(sourceDate, today())
  if (!sourceDate || Number.isNaN(age) || age < -1 || age > SOURCE_MAX_AGE_DAYS) {
    throw new Error(`${channel}来源日期异常：${sourceDate || '未解析到日期'}`)
  }
}

async function updateFanqieBoards() {
  const urls = {
    male: process.env.FANQIE_MALE_SOURCE ?? 'https://novelcatch.com/rank?gender=m&list=new',
    female: process.env.FANQIE_FEMALE_SOURCE ?? 'https://novelcatch.com/rank?gender=f&list=new',
  }
  const boards = []

  for (const [channel, url] of Object.entries(urls)) {
    try {
      const html = await fetchText(url)
      const sourceDate = extractSourceDate(html)
      const list = extractNovelcatchRows(html)
        .map((book, index) => normalizeNovelcatchBook(book, index + 1))
        .slice(0, MIN_BOOKS_PER_BOARD)
      const channelName = channel === 'male' ? '男频' : '女频'
      validateBoard(channelName, list, sourceDate)
      boards.push({
        platform: '番茄小说',
        channel: channelName,
        chartName: `${channelName}新书榜`,
        sourceUrl: url,
        dataDate: sourceDate,
        books: list,
      })
      console.log(`${channelName}新书榜校验通过：${list.length} 本，来源日期 ${sourceDate}`)
    } catch (err) {
      const channelName = channel === 'male' ? '男频' : '女频'
      throw new Error(`${channelName}新书榜更新失败，已停止本次发布：${err.message}`)
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

async function updateWindBoards(boards) {
  const existing = await readJson('wind.json')
  if (!existing || !Array.isArray(existing.genres) || !existing.keywords) {
    throw new Error('wind.json 缺少现有题材或关键词数据，已停止写入')
  }

  // GitHub 任务目前只有可靠的新书榜来源；不伪造题材、关键词或趋势更新时间。
  const data = { ...existing, boards }
  await writeJson('wind.json', data)
  return data
}

async function writeUpdateStatus(boards) {
  const sourceDate = boards
    .map((board) => board.dataDate)
    .filter(Boolean)
    .sort()
    .at(-1) ?? ''
  await writeJson('update-status.json', {
    checkedAt: today(),
    sourceDate,
    status: 'success',
    boards: boards.map((board) => ({
      channel: board.channel,
      count: board.books.length,
      dataDate: board.dataDate,
    })),
  })
}

async function main() {
  console.log(`开始更新数据: ${today()} ${DRY_RUN ? '[DRY RUN]' : ''}`)

  const boards = await updateFanqieBoards()
  await Promise.all([
    updateFanqieDebut(),
    updateHongguo(),
  ])

  await updateWindBoards(boards)
  await writeUpdateStatus(boards)

  console.log('数据更新完成：已刷新并记录新书榜校验状态；题材、关键词和历史归档保持原值')
}

main().catch((err) => {
  console.error('更新脚本异常:', err)
  process.exit(1)
})
