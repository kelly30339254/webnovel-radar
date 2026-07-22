#!/usr/bin/env node
/**
 * 每日全量数据更新脚本。
 *
 * 核心原则：
 * - 新书榜、题材、关键词、趋势、工具输入使用同一批榜单数据生成。
 * - 公告、征文、改编与短剧只读取番茄/红果公开页面。
 * - 任一必需来源失败时整次退出，所有文件均保持上一版，避免混合新旧数据。
 * - writing-tips.json 为人工整理资料，不参与每日更新。
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
const HISTORY_LIMIT = 60

const SOURCES = {
  maleBoard: process.env.FANQIE_MALE_SOURCE ?? 'https://novelcatch.com/rank?gender=m&list=new',
  femaleBoard: process.env.FANQIE_FEMALE_SOURCE ?? 'https://novelcatch.com/rank?gender=f&list=new',
  notices: 'https://fanqienovel.com/writer/zone/notice',
  activities: 'https://fanqienovel.com/writer/zone/solicit-activity',
  hongguo: 'https://hongguoduanju.com/',
}

const KEYWORD_LEXICON = [
  '脑洞', '系统', '高武', '灵气', '修仙', '玄幻', '异能', '末世', '规则怪谈', '悬疑',
  '推理', '直播', '科研', '都市', '日常', '神医', '战神', '年代', '种田', '穿越',
  '穿书', '重生', '快穿', '宫斗', '宅斗', '权谋', '甜宠', '先婚后爱', '追妻', '暗恋',
  '豪门', '总裁', '财阀', '娱乐圈', '校园', '救赎', '复仇', '打脸', '逆袭', '马甲',
  '团宠', '大女主', '女强', '双强', '萌宝', '同人', '衍生', '历史', '科幻', '无限流',
]

const today = () => formatDate(new Date())

function formatDate(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function dayDifference(olderDate, newerDate) {
  const older = Date.parse(`${olderDate}T00:00:00Z`)
  const newer = Date.parse(`${newerDate}T00:00:00Z`)
  if (Number.isNaN(older) || Number.isNaN(newer)) return Number.NaN
  return Math.floor((newer - older) / 86400000)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
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
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')
  console.log(`已写入 ${file}`)
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'zh-CN,zh;q=0.9',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.text()
}

function extractBalancedJson(text, marker, opening = '{', closing = '}') {
  const markerIndex = text.indexOf(marker)
  if (markerIndex < 0) return null
  const start = text.indexOf(opening, markerIndex + marker.length)
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
    else if (char === opening) depth += 1
    else if (char === closing) {
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
      // 忽略非榜单 Flight 片段。
    }
  }
  return extractBalancedJson(chunks.join('\n'), '"initialRows":', '[', ']') ?? []
}

function extractSourceDate(html) {
  return html.match(/数据更新于[\s\S]{0,60}?(\d{4}-\d{2}-\d{2})/)?.[1] ?? ''
}

function formatReaders(value) {
  const count = Number(value)
  if (!Number.isFinite(count) || count <= 0) return undefined
  return count >= 10000 ? `${(count / 10000).toFixed(1)}万在读` : `${Math.round(count)}人在读`
}

function readerCount(text = '') {
  const value = Number.parseFloat(String(text).replace(/[^\d.]/g, ''))
  if (!Number.isFinite(value)) return 0
  if (String(text).includes('亿')) return value * 100000000
  if (String(text).includes('万')) return value * 10000
  return value
}

function compactCount(value) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
  return `${Math.round(value)}`
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

async function fetchBoard(channel, url) {
  const html = await fetchText(url)
  const sourceDate = extractSourceDate(html)
  const rawRows = extractNovelcatchRows(html).slice(0, MIN_BOOKS_PER_BOARD)
  const books = rawRows.map((book, index) => normalizeNovelcatchBook(book, index + 1))
  validateBoard(channel, books, sourceDate)
  console.log(`${channel}新书榜校验通过：${books.length} 本，来源日期 ${sourceDate}`)
  return {
    board: {
      platform: '番茄小说',
      channel,
      chartName: `${channel}新书榜`,
      sourceUrl: url,
      dataDate: sourceDate,
      books,
    },
    rawRows,
  }
}

async function updateFanqieBoards() {
  const [male, female] = await Promise.all([
    fetchBoard('男频', SOURCES.maleBoard),
    fetchBoard('女频', SOURCES.femaleBoard),
  ])
  if (male.board.dataDate !== female.board.dataDate) {
    throw new Error(`男、女频榜单日期不一致：${male.board.dataDate} / ${female.board.dataDate}`)
  }
  return { boards: [male.board, female.board], maleRows: male.rawRows }
}

function deriveGenres(boards, previousGenres = []) {
  const previousHeat = (name) => previousGenres.find((item) => item.name === name || item.name.includes(name) || name.includes(item.name))?.heat
  const aggregate = new Map()

  for (const board of boards) {
    for (const book of board.books) {
      const current = aggregate.get(book.genre) ?? {
        name: book.genre,
        score: 0,
        count: 0,
        readers: 0,
        bestRank: Number.POSITIVE_INFINITY,
        channels: new Set(),
      }
      const readers = readerCount(book.heat)
      current.score += Math.max(1, 12 - book.rank) * 8 + Math.log10(readers + 10) * 9
      current.count += 1
      current.readers += readers
      current.bestRank = Math.min(current.bestRank, book.rank)
      current.channels.add(board.channel)
      aggregate.set(book.genre, current)
    }
  }

  const ranked = [...aggregate.values()].sort((a, b) => b.score - a.score).slice(0, 8)
  const maxScore = ranked[0]?.score ?? 1
  return ranked.map((item) => {
    const heat = Math.max(45, Math.round(45 + (item.score / maxScore) * 55))
    const oldHeat = previousHeat(item.name)
    const trend = oldHeat === undefined ? 'new' : heat > oldHeat + 2 ? 'up' : heat < oldHeat - 2 ? 'down' : 'flat'
    const channel = item.channels.size > 1 ? '男、女频' : [...item.channels][0]
    const averageReaders = item.count ? item.readers / item.count : 0
    return {
      name: item.name,
      heat,
      trend,
      note: `${channel}新书榜出现 ${item.count} 本，最高第 ${item.bestRank}；平均在读 ${compactCount(averageReaders)}`,
    }
  })
}

function deriveKeywordChannel(board) {
  const scores = new Map()
  const add = (word, score) => scores.set(word, (scores.get(word) ?? 0) + score)

  for (const book of board.books) {
    const rankScore = Math.max(3, 13 - book.rank)
    add(book.genre, rankScore * 3)
    const text = `${book.title} ${book.genre}`
    for (const keyword of KEYWORD_LEXICON) {
      if (text.includes(keyword)) add(keyword, rankScore * (book.title.includes(keyword) ? 2 : 1))
    }
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18)
  const maxScore = ranked[0]?.[1] ?? 1
  const tags = ranked.map(([word, score]) => ({
    word,
    weight: Math.max(35, Math.round(35 + (score / maxScore) * 65)),
  }))
  return {
    summary: `${tags.slice(0, 4).map((item) => item.word).join('、')}成为当日新书高频信号`,
    tags,
  }
}

function deriveKeywords(boards) {
  const male = boards.find((board) => board.channel === '男频')
  const female = boards.find((board) => board.channel === '女频')
  if (!male || !female) throw new Error('缺少男频或女频榜单，无法生成关键词')
  return { male: deriveKeywordChannel(male), female: deriveKeywordChannel(female) }
}

function deriveVerdict(boards, keywords) {
  const male = boards.find((board) => board.channel === '男频')
  const female = boards.find((board) => board.channel === '女频')
  const maleTop = male?.books[0]?.genre ?? keywords.male.tags[0]?.word ?? '男频新题材'
  const femaleTop = female?.books[0]?.genre ?? keywords.female.tags[0]?.word ?? '女频新题材'
  const maleHook = keywords.male.tags.find((tag) => tag.word !== maleTop)?.word ?? '强钩子'
  const femaleHook = keywords.female.tags.find((tag) => tag.word !== femaleTop)?.word ?? '强情绪'
  return `男频${maleTop}领跑，${maleHook}提供突围切口；女频${femaleTop}居前，${femaleHook}信号集中`
}

function updateHistory(existing, date, genres) {
  const currentNames = genres.map((genre) => genre.name)
  const days = Array.isArray(existing?.days) ? existing.days.filter((day) => day.date !== date).map((day) => ({
    ...day,
    genres: day.genres.map((genre) => {
      const normalizedName = currentNames.find((name) => genre.name === name || genre.name.includes(name) || name.includes(genre.name))
      return normalizedName ? { ...genre, name: normalizedName } : genre
    }),
  })) : []
  days.push({
    date,
    genres: genres.map(({ name, heat }) => ({ name, heat })),
  })
  days.sort((a, b) => a.date.localeCompare(b.date))
  return { days: days.slice(-HISTORY_LIMIT) }
}

function formatWords(raw) {
  const value = Number(raw.word_count ?? raw.wordCount ?? raw.words)
  if (!Number.isFinite(value) || value <= 0) return '新书期'
  return value >= 10000 ? `${(value / 10000).toFixed(1)}万字` : `${Math.round(value)}字`
}

function buildFanqieDebut(board, rawRows) {
  return {
    updatedAt: board.dataDate,
    sourceUrl: board.sourceUrl,
    sourceLabel: '新书榜同步观察',
    books: board.books.map((book, index) => ({
      rank: book.rank,
      title: book.title,
      author: book.author,
      genre: book.genre,
      words: formatWords(rawRows[index] ?? {}),
      readers: book.heat?.replace('在读', '') ?? '未披露',
      readUrl: `https://fanqienovel.com/search/${encodeURIComponent(book.title)}`,
    })),
  }
}

function routerPage(html, expectedKey) {
  const routerData = extractBalancedJson(html, 'window._ROUTER_DATA')
  const loaderData = routerData?.loaderData
  if (!loaderData || typeof loaderData !== 'object') return null
  if (expectedKey && loaderData[expectedKey]) return loaderData[expectedKey]
  return Object.values(loaderData).find((value) => value && typeof value === 'object') ?? null
}

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function concise(text, maxLength = 110) {
  const cleaned = stripHtml(text)
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength).replace(/[，。；、\s]+$/g, '')}…` : cleaned
}

async function fetchArticleSummary(url, fallback) {
  try {
    const html = await fetchText(url)
    const page = routerPage(html)
    return concise(page?.content, 120) || fallback
  } catch (error) {
    console.warn(`文章摘要读取失败，使用官方列表摘要：${url} ${errorMessage(error)}`)
    return fallback
  }
}

async function fetchOfficialContent() {
  const [noticeHtml, activityHtml] = await Promise.all([
    fetchText(SOURCES.notices),
    fetchText(SOURCES.activities),
  ])
  const noticePage = routerPage(noticeHtml, 'notice/page')
  const activityPage = routerPage(activityHtml, 'solicit-activity/page')
  const notices = noticePage?.notice_list
  const activities = activityPage?.activity_list
  if (!Array.isArray(notices) || notices.length < 5) throw new Error('番茄官方公告列表解析失败')
  if (!Array.isArray(activities) || activities.length < 3) throw new Error('番茄官方活动列表解析失败')

  const announcements = activities.slice(0, 6).map((activity) => ({
    platform: '番茄小说',
    date: activity.is_permanent ? '长期' : `${activity.start_time ?? ''} 至 ${activity.end_time ?? ''}`,
    title: String(activity.title ?? '').trim(),
    summary: concise(Array.isArray(activity.introduction) ? activity.introduction.join(' ') : activity.introduction, 120),
    sourceUrl: activity.link ?? SOURCES.activities,
  })).filter((item) => item.title && item.summary)

  const relevant = notices
    .filter((notice) => /改编|短剧|漫剧|IP|版权|题材|创作指南|脑洞/.test(String(notice.title)))
    .slice(0, 5)
  if (relevant.length < 3) throw new Error('番茄改编风向公告数量不足')

  const summaries = await Promise.all(relevant.map((notice) => fetchArticleSummary(notice.url, notice.abstract ?? '番茄作家专区最新创作信号')))
  const adaptWatch = relevant.map((notice, index) => ({
    date: notice.notice_time ? formatDate(new Date(Number(notice.notice_time) * 1000)) : today(),
    title: String(notice.title ?? '').trim(),
    summary: summaries[index],
    sourceUrl: notice.url ?? SOURCES.notices,
  }))
  return { announcements, adaptWatch }
}

function toDramaItem(item, rank) {
  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : []
  return {
    rank,
    title: String(item.series_name ?? '').trim(),
    heat: String(item.episode_right_text ?? '官网推荐'),
    note: tags.slice(0, 3).join(' · '),
    playUrl: SOURCES.hongguo,
    tags,
  }
}

function pickDramas(items, matcher, limit = 8) {
  return items.filter((item) => matcher(item.tags)).slice(0, limit).map((item, index) => toDramaItem(item, index + 1))
}

async function fetchHongguo() {
  const html = await fetchText(SOURCES.hongguo)
  const page = routerPage(html, 'page')
  const videoList = page?.videoList
  if (!Array.isArray(videoList) || videoList.length < 20) throw new Error('红果官网推荐列表解析失败')

  const featured = videoList.slice(0, 8).map((item, index) => toDramaItem(item, index + 1))
  const female = pickDramas(videoList, (tags) => Array.isArray(tags) && tags.some((tag) => /女性成长|女强|大女主|爱情|宫斗宅斗/.test(tag)))
  const male = pickDramas(videoList, (tags) => Array.isArray(tags) && tags.some((tag) => /大男主|都市脑洞|超凡逆袭|朝堂权谋|强者回归/.test(tag)))
  if (featured.length < 6 || female.length < 6 || male.length < 6) throw new Error('红果官网分类推荐数量不足')

  return {
    updatedAt: today(),
    sourceUrl: SOURCES.hongguo,
    officialBase: SOURCES.hongguo,
    categories: [
      { name: '首页精选', items: featured.map(({ tags, ...item }) => item) },
      { name: '女频改编', items: female.map(({ tags, ...item }) => item) },
      { name: '男频改编', items: male.map(({ tags, ...item }) => item) },
    ],
    rawFeatured: featured,
  }
}

function buildIpHot(hongguo) {
  return hongguo.rawFeatured.slice(0, 6).map((item) => ({
    title: item.title,
    genre: item.tags.slice(0, 2).join(' / '),
    form: '短剧',
    note: `红果官网首页推荐 · ${item.note}`,
    sourceUrl: SOURCES.hongguo,
  }))
}

async function main() {
  console.log(`开始全量更新数据：${today()} ${DRY_RUN ? '[DRY RUN]' : ''}`)
  const [existingWind, existingHistory, existingTips] = await Promise.all([
    readJson('wind.json'),
    readJson('history.json'),
    readJson('writing-tips.json'),
  ])
  if (!existingWind || !Array.isArray(existingWind.genres)) throw new Error('wind.json 结构异常')

  const [{ boards, maleRows }, official, hongguo] = await Promise.all([
    updateFanqieBoards(),
    fetchOfficialContent(),
    fetchHongguo(),
  ])

  const sourceDate = boards[0].dataDate
  const genres = deriveGenres(boards, existingWind.genres)
  const keywords = deriveKeywords(boards)
  const wind = {
    updatedAt: sourceDate,
    verdict: deriveVerdict(boards, keywords),
    genres,
    keywords,
    boards,
    ipHot: buildIpHot(hongguo),
    announcements: official.announcements,
    adaptWatch: official.adaptWatch,
  }
  const history = updateHistory(existingHistory, sourceDate, genres)
  const debut = buildFanqieDebut(boards[0], maleRows)
  const { rawFeatured: _rawFeatured, ...hongguoData } = hongguo
  const updateStatus = {
    checkedAt: today(),
    sourceDate,
    status: 'success',
    boards: boards.map((board) => ({
      channel: board.channel,
      count: board.books.length,
      dataDate: board.dataDate,
    })),
    modules: [
      { key: 'boards', label: '番茄新书榜', status: 'updated', dataDate: sourceDate, itemCount: boards.flatMap((board) => board.books).length, sourceUrl: SOURCES.maleBoard },
      { key: 'trends', label: '题材、关键词与趋势', status: 'updated', dataDate: sourceDate, itemCount: genres.length + keywords.male.tags.length + keywords.female.tags.length },
      { key: 'debut', label: '首秀观察', status: 'updated', dataDate: sourceDate, itemCount: debut.books.length, sourceUrl: debut.sourceUrl },
      { key: 'hongguo', label: '红果改编热点', status: 'updated', dataDate: hongguoData.updatedAt, itemCount: hongguoData.categories.flatMap((category) => category.items).length, sourceUrl: SOURCES.hongguo },
      { key: 'official', label: '官方公告与改编风向', status: 'updated', dataDate: today(), itemCount: official.announcements.length + official.adaptWatch.length, sourceUrl: SOURCES.notices },
      { key: 'tools', label: '开书雷达与命题盲盒输入', status: 'updated', dataDate: sourceDate, itemCount: genres.length + keywords.male.tags.length + keywords.female.tags.length },
      { key: 'writing-tips', label: '写作技巧', status: 'static', dataDate: existingTips?.updatedAt ?? '' },
    ],
  }

  await Promise.all([
    writeJson('wind.json', wind),
    writeJson('history.json', history),
    writeJson('fanqie-debut.json', debut),
    writeJson('hongguo-hot.json', hongguoData),
    writeJson('update-status.json', updateStatus),
  ])

  console.log(`全量更新完成：榜单 ${sourceDate}，趋势 ${genres.length} 项，公告/改编 ${official.announcements.length + official.adaptWatch.length} 项，红果推荐 ${hongguoData.categories.flatMap((category) => category.items).length} 项`)
}

main().catch((error) => {
  console.error('更新脚本异常：', errorMessage(error))
  process.exit(1)
})
