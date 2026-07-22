import { useEffect, useState } from 'react'
import SectionTitle from '@/sections/SectionTitle'
import SourceLink from '@/sections/SourceLink'
import { freshnessLabel } from '@/lib/freshness'

type Book = {
  rank: number
  title: string
  author: string
  genre: string
  words: string
  readers: string
  readUrl: string
}

export default function FanqieDebut() {
  const [books, setBooks] = useState<Book[]>([])
  const [updatedAt, setUpdatedAt] = useState('')
  const [sourceUrl, setSourceUrl] = useState('https://novelcatch.com/rank?gender=m&list=new')
  const [sourceLabel, setSourceLabel] = useState('新书榜同步观察')

  useEffect(() => {
    fetch('/data/fanqie-debut.json')
      .then((r) => r.json())
      .then((data) => {
        setBooks(data.books ?? [])
        setUpdatedAt(data.updatedAt ?? '')
        setSourceUrl(data.sourceUrl ?? 'https://novelcatch.com/rank?gender=m&list=new')
        setSourceLabel(data.sourceLabel ?? '新书榜同步观察')
      })
      .catch(() => setBooks([]))
  }, [])

  const moduleFresh = freshnessLabel(updatedAt)

  return (
    <section className="mt-14">
      <SectionTitle
        id="fanqie-debut"
        title="番茄首秀观察"
        right={<SourceLink url={sourceUrl} label="榜单来源" />}
        footer={
          <>
            {moduleFresh && (
              <span className={moduleFresh.stale ? 'font-medium text-amber-500' : ''}>
                {moduleFresh.text}
                {moduleFresh.stale ? ' · 数据偏旧' : ''}
              </span>
            )}
            <span>每日 07:23 自动更新</span>
            <span>来源：{sourceLabel}</span>
          </>
        }
      />
      <div className="mt-4 grid gap-3">
        {books.map((book) => (
          <div
            key={book.rank}
            className="card-pink flex items-center gap-4 rounded-xl border border-theme-100 bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-all"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-theme-100 text-sm font-bold text-theme-600">
              {book.rank}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href={book.readUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="block truncate text-sm font-bold text-theme-950 hover:text-theme-600"
                title={book.title}
              >
                {book.title}
              </a>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-theme-700">
                <span>{book.author}</span>
                <span className="rounded-full bg-theme-50 px-1.5 py-0 text-[10px]">{book.genre}</span>
                <span>{book.words}</span>
                <span>在读 {book.readers}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
