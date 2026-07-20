import { useEffect, useState } from 'react'
import SectionTitle from '@/sections/SectionTitle'
import SourceLink from '@/sections/SourceLink'

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

  useEffect(() => {
    fetch('/data/fanqie-debut.json')
      .then((r) => r.json())
      .then((data) => {
        setBooks(data.books ?? [])
        setUpdatedAt(data.updatedAt ?? '')
      })
      .catch(() => setBooks([]))
  }, [])

  return (
    <section className="mt-14">
      <SectionTitle
        id="fanqie-debut"
        title="番茄首秀榜"
        hint={updatedAt ? `数据 ${updatedAt}` : undefined}
        right={<SourceLink url="https://wangwendashuju.com/fq/debut?gender=male" label="网文大数据" />}
      />
      <div className="mt-4 grid gap-3">
        {books.map((book) => (
          <div
            key={book.rank}
            className="card-pink flex items-center gap-4 rounded-xl border border-rose-100 bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-all"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
              {book.rank}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href={book.readUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="block truncate text-sm font-bold text-rose-950 hover:text-rose-600"
                title={book.title}
              >
                {book.title}
              </a>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-rose-400">
                <span>{book.author}</span>
                <span className="rounded-full bg-rose-50 px-1.5 py-0 text-[10px]">{book.genre}</span>
                <span>{book.words}字</span>
                <span>在读 {book.readers}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
