export type Trend = 'up' | 'down' | 'flat' | 'new'

export interface GenreHeat {
  name: string
  heat: number
  trend: Trend
  note?: string
}

export interface KeywordTag {
  word: string
  weight: number
}

export interface KeywordChannel {
  summary: string
  tags: KeywordTag[]
}

export interface Keywords {
  male: KeywordChannel
  female: KeywordChannel
}

export interface BookItem {
  rank: number
  title: string
  author: string
  genre: string
  heat?: string
}

export interface Board {
  platform: string
  channel: string
  chartName: string
  sourceUrl?: string
  dataDate?: string
  books: BookItem[]
}

export interface IpHotItem {
  title: string
  genre?: string
  form: string
  note?: string
  sourceUrl?: string
}

export interface Announcement {
  platform: string
  date?: string
  title: string
  summary: string
  sourceUrl?: string
}

export interface AdaptWatchItem {
  date?: string
  title: string
  summary: string
  sourceUrl?: string
}

export interface WindData {
  updatedAt: string
  verdict: string
  genres: GenreHeat[]
  keywords: Keywords
  boards: Board[]
  ipHot?: IpHotItem[]
  announcements?: Announcement[]
  adaptWatch?: AdaptWatchItem[]
}

export interface HistoryDay {
  date: string
  genres: Array<{ name: string; heat: number }>
}

export interface HistoryData {
  days: HistoryDay[]
}
