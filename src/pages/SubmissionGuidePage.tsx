import { useDeferredValue, useMemo, useRef, useState } from 'react'
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Copy,
  FileText,
  Layers3,
  Mail,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import { Link } from 'react-router'
import PageHeader from '@/components/PageHeader'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { trackEvent } from '@/hooks/useAnalytics'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useSubmissionData } from '@/hooks/useSubmissionData'
import type { SubmissionEditor, SubmissionStatus } from '@/types/submission'

const PAGE_SIZE = 12
const DATA_DATE = '2026-07-22'
const STATUS_OPTIONS: Array<{ value: 'all' | SubmissionStatus; label: string }> = [
  { value: '正常收稿', label: '正常收稿' },
  { value: 'all', label: '全部状态' },
  { value: '未核实', label: '待核实' },
  { value: '停止收稿', label: '已停收' },
]

type SortKey = 'recommended' | 'platform' | 'name' | 'date'

function statusClasses(status: SubmissionStatus) {
  if (status === '正常收稿') return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
  if (status === '未核实') return 'border-amber-400/30 bg-amber-400/10 text-amber-300'
  return 'border-slate-400/30 bg-slate-400/10 text-slate-300'
}

function copyText(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value)
  const input = document.createElement('textarea')
  input.value = value
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
  return Promise.resolve()
}

function PromoBanner() {
  const [copied, setCopied] = useState(false)

  const copyWechat = async () => {
    await copyText('nailong327')
    setCopied(true)
    trackEvent('submission_promo_wechat_copy')
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section
      aria-label="一键自动投稿软件宣传"
      className="mt-8 flex flex-col gap-5 border border-theme-700 bg-gradient-to-r from-theme-800 via-theme-700 to-theme-800 px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7"
    >
      <div className="flex items-start gap-4 sm:items-center">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white/15">
          <MessageCircle size={24} />
        </span>
        <div>
          <p className="font-serif text-xl font-bold sm:text-2xl">一键自动投稿软件</p>
          <p className="mt-1 text-sm leading-relaxed text-white/85 sm:text-base">
            内置编辑两千多位，收稿信息每天更新。咨询请添加微信：<strong className="text-lg font-bold tracking-wide text-white">nailong327</strong>
          </p>
        </div>
      </div>
      <div className="flex flex-none flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          to="/assistant"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/20"
        >
          <Send size={16} />
          了解投稿助手
        </Link>
        <button
          type="button"
          onClick={copyWechat}
          className="inline-flex min-h-11 flex-none items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-theme-800 transition-colors hover:bg-theme-bg"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          <span aria-live="polite">{copied ? '微信号已复制' : '复制微信号咨询'}</span>
        </button>
      </div>
    </section>
  )
}

function ContactRow({ label, value, editorId }: { label: string; value: string; editorId: number }) {
  const [copied, setCopied] = useState(false)

  if (!value) return null

  const handleCopy = async () => {
    await copyText(value)
    setCopied(true)
    trackEvent('submission_copy_contact', { type: label, editorId })
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-white/10 py-3 last:border-0">
      <span className="w-12 flex-none text-xs font-bold text-theme-500">{label}</span>
      <span className="min-w-0 flex-1 break-all text-sm font-semibold text-theme-950">{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border border-white/10 bg-white/5 text-theme-700 transition-colors hover:border-theme-400 hover:text-theme-950"
        aria-label={`复制${label}`}
        title={`复制${label}`}
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
      </button>
    </div>
  )
}

function EditorDialog({ editor, open, onOpenChange }: { editor: SubmissionEditor | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!editor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-white/10 bg-theme-bg p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-white/10 bg-white/5 px-5 py-5 pr-12 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-1 text-[11px] font-bold ${statusClasses(editor.status)}`}>{editor.status}</span>
            {editor.workTypes.map((type) => <span key={type} className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-theme-700">{type}</span>)}
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-theme-950">{editor.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5 text-theme-600">
            <Building2 size={14} /> {editor.platform || '平台未标注'} · {editor.role || '编辑'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-5 pb-6 sm:px-6">
          <section>
            <h2 className="mb-2 text-xs font-bold tracking-wider text-theme-500">收稿要求</h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{editor.requirements || '暂无详细收稿要求，请联系前再次确认。'}</p>
          </section>

          {(editor.email || editor.qq || editor.wechat) && (
            <section className="rounded-lg border border-white/10 bg-white/5 px-4">
              <ContactRow label="邮箱" value={editor.email} editorId={editor.id} />
              <ContactRow label="QQ" value={editor.qq} editorId={editor.id} />
              <ContactRow label="微信" value={editor.wechat} editorId={editor.id} />
            </section>
          )}

          <section className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-xs leading-6 text-amber-200">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 flex-none" size={17} />
              <p>联系方式来自公开渠道，收稿状态可能变化。投稿前请通过平台官网或官方公告复核，不支付押金、培训费或任何形式的签约前费用。</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SubmissionGuidePage() {
  const { data, error } = useSubmissionData()
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const [status, setStatus] = useState<'all' | SubmissionStatus>('正常收稿')
  const [workType, setWorkType] = useState('all')
  const [platform, setPlatform] = useState('all')
  const [sort, setSort] = useState<SortKey>('recommended')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SubmissionEditor | null>(null)
  const resultsRef = useRef<HTMLElement>(null)

  usePageMeta({
    title: '网文投稿导航',
    description: '按平台、文稿类型与收稿状态筛选公开投稿渠道，查看编辑要求与投稿联系方式。',
    path: '/submissions',
  })

  const stats = useMemo(() => {
    if (!data) return { total: 0, active: 0, email: 0, types: 0 }
    return {
      total: data.length,
      active: data.filter((item) => item.status === '正常收稿').length,
      email: data.filter((item) => item.email).length,
      types: new Set(data.flatMap((item) => item.workTypes)).size,
    }
  }, [data])

  const workTypes = useMemo(() => {
    if (!data) return []
    const counts = new Map<string, number>()
    data.forEach((editor) => editor.workTypes.forEach((type) => counts.set(type, (counts.get(type) || 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [data])

  const platforms = useMemo(() => {
    if (!data) return []
    const counts = new Map<string, number>()
    data.forEach((editor) => {
      if (editor.platform) counts.set(editor.platform, (counts.get(editor.platform) || 0) + 1)
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 80)
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    const result = data.filter((editor) => {
      if (status !== 'all' && editor.status !== status) return false
      if (workType !== 'all' && !editor.workTypes.includes(workType)) return false
      if (platform !== 'all' && editor.platform !== platform) return false
      if (!deferredSearch) return true
      const searchable = [editor.name, editor.platform, editor.role, editor.requirements, editor.email, ...editor.workTypes].join(' ').toLowerCase()
      return searchable.includes(deferredSearch)
    })

    return result.sort((a, b) => {
      if (sort === 'platform') return a.platform.localeCompare(b.platform, 'zh-CN') || a.name.localeCompare(b.name, 'zh-CN')
      if (sort === 'name') return a.name.localeCompare(b.name, 'zh-CN')
      if (sort === 'date') return (b.更新日期 || b.收录日期).localeCompare(a.更新日期 || a.收录日期)
      return b.status_code - a.status_code || b.likes - a.likes || a.id - b.id
    })
  }, [data, deferredSearch, platform, sort, status, workType])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const choosePage = (nextPage: number) => {
    setPage(nextPage)
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const resetFilters = () => {
    setSearch('')
    setStatus('正常收稿')
    setWorkType('all')
    setPlatform('all')
    setSort('recommended')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-950">
      <PageHeader title="投稿导航" hint="先按文稿类型和平台缩小范围，再查看编辑要求与投稿方式。" />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 md:px-8">
        <section className="-mt-px grid grid-cols-2 border-x border-b border-white/10 bg-white/5 lg:grid-cols-4">
          {[
            { label: '收录投稿渠道', value: stats.total, icon: FileText },
            { label: '标记正常收稿', value: stats.active, icon: Send },
            { label: '提供公开邮箱', value: stats.email, icon: Mail },
            { label: '覆盖文稿类型', value: stats.types, icon: Layers3 },
          ].map((item) => (
            <div key={item.label} className="flex min-h-20 items-center gap-3 border-b border-white/10 px-4 py-4 [&:nth-child(odd)]:border-r [&:nth-last-child(-n+2)]:border-b-0 lg:min-h-24 lg:border-b-0 lg:border-r lg:px-5 lg:last:border-r-0">
              <item.icon className="text-theme-500" size={20} />
              <div>
                <strong className="block font-serif text-2xl text-theme-950">{data ? item.value.toLocaleString('zh-CN') : '—'}</strong>
                <span className="text-xs font-semibold text-theme-600">{item.label}</span>
              </div>
            </div>
          ))}
        </section>

        <PromoBanner />

        <section className="mt-8 border-y border-white/10 py-6" aria-labelledby="work-type-heading">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-theme-500">STEP 01</p>
              <h2 id="work-type-heading" className="mt-1 font-serif text-xl font-bold text-theme-950">选择你的文稿形态</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setWorkType('all')
                  setPage(1)
                }}
                className={`min-h-10 rounded-md border px-3 py-2 text-xs font-bold transition-colors ${workType === 'all' ? 'border-theme-800 bg-theme-800 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-theme-400'}`}
              >
                全部
              </button>
              {workTypes.map(([type, count]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setWorkType(type)
                    setPage(1)
                  }}
                  className={`min-h-10 rounded-md border px-3 py-2 text-xs font-bold transition-colors ${workType === type ? 'border-theme-800 bg-theme-800 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-theme-400'}`}
                >
                  {type} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section ref={resultsRef} className="scroll-mt-32 pt-8" aria-labelledby="submission-results-heading">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-theme-500">STEP 02</p>
              <h2 id="submission-results-heading" className="mt-1 font-serif text-2xl font-bold text-theme-950">筛选投稿渠道</h2>
            </div>
            <p className="text-xs font-semibold text-theme-600">数据整理于 {DATA_DATE} · 当前匹配 {filtered.length.toLocaleString('zh-CN')} 条</p>
          </div>

          <div className="border-y border-white/10 bg-white/5 py-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1.8fr)_1fr_1fr_1fr]">
              <label className="relative block">
                <span className="sr-only">搜索投稿渠道</span>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-400" size={17} />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="搜索编辑、平台或题材要求"
                  className="h-11 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-theme-500 focus:ring-2 focus:ring-theme-500/30"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); setPage(1) }} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-theme-500" aria-label="清空搜索">
                    <X size={16} />
                  </button>
                )}
              </label>

              <label>
                <span className="sr-only">收稿状态</span>
                <select value={status} onChange={(event) => { setStatus(event.target.value as 'all' | SubmissionStatus); setPage(1) }} className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none focus:border-theme-500">
                  {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>

              <label>
                <span className="sr-only">投稿平台</span>
                <select value={platform} onChange={(event) => { setPlatform(event.target.value); setPage(1) }} className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none focus:border-theme-500">
                  <option value="all">全部平台</option>
                  {platforms.map(([name, count]) => <option key={name} value={name}>{name}（{count}）</option>)}
                </select>
              </label>

              <label>
                <span className="sr-only">排序方式</span>
                <select value={sort} onChange={(event) => { setSort(event.target.value as SortKey); setPage(1) }} className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none focus:border-theme-500">
                  <option value="recommended">状态优先</option>
                  <option value="platform">按平台排序</option>
                  <option value="name">按编辑名排序</option>
                  <option value="date">按收录日期排序</option>
                </select>
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
              <CircleAlert className="mt-0.5 flex-none" size={18} /> 投稿数据加载失败：{error}
            </div>
          )}

          {!data && !error && <p className="py-20 text-center text-sm text-theme-600">投稿渠道加载中…</p>}

          {data && pageItems.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((editor) => (
                <article key={editor.id} className="glass-soft flex min-h-64 flex-col border-t-2 border-theme-500 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-theme-500">{editor.platform || '平台未标注'}</p>
                      <h3 className="mt-1 truncate font-serif text-xl font-bold text-theme-950">{editor.name}</h3>
                    </div>
                    <span className={`flex-none rounded-md border px-2 py-1 text-[10px] font-bold ${statusClasses(editor.status)}`}>{editor.status}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {editor.workTypes.length > 0 ? editor.workTypes.map((type) => <span key={type} className="rounded bg-white/10 px-2 py-1 text-[11px] font-semibold text-theme-700">{type}</span>) : <span className="text-xs text-theme-500">类型未标注</span>}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{editor.requirements || '暂无详细收稿要求，请联系前再次确认。'}</p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-theme-500">
                      <FileText size={14} /> 收稿要求已整理
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(editor)
                        trackEvent('submission_open_editor', { editorId: editor.id, platform: editor.platform })
                      }}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-theme-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-theme-600"
                    >
                      查看投稿方式 <ChevronRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {data && pageItems.length === 0 && (
            <div className="py-20 text-center">
              <CircleAlert className="mx-auto text-theme-300" size={28} />
              <p className="mt-3 font-bold text-theme-950">没有找到匹配的投稿渠道</p>
              <button type="button" onClick={resetFilters} className="mt-4 text-sm font-bold text-theme-600 underline underline-offset-4">恢复默认筛选</button>
            </div>
          )}

          {data && filtered.length > PAGE_SIZE && (
            <nav className="mt-8 flex items-center justify-center gap-3" aria-label="投稿渠道分页">
              <button type="button" disabled={currentPage === 1} onClick={() => choosePage(currentPage - 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-theme-950 disabled:cursor-not-allowed disabled:opacity-35" aria-label="上一页"><ChevronLeft size={18} /></button>
              <span className="min-w-24 text-center text-xs font-bold text-theme-700">{currentPage} / {pageCount}</span>
              <button type="button" disabled={currentPage === pageCount} onClick={() => choosePage(currentPage + 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-theme-950 disabled:cursor-not-allowed disabled:opacity-35" aria-label="下一页"><ChevronRight size={18} /></button>
            </nav>
          )}
        </section>

        <section className="mt-10 border-t border-white/10 pt-6 text-xs leading-6 text-theme-600">
          <div className="flex items-start gap-2">
            <CircleAlert className="mt-1 flex-none text-theme-500" size={16} />
            <p>本页只整理公开渠道，不代表平台或编辑背书。请自行核验合同、版权范围、稿酬与结算周期；遇到收费投稿、代签约或索要敏感信息时立即停止联系。</p>
          </div>
        </section>
      </main>

      <EditorDialog editor={selected} open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null) }} />
    </div>
  )
}
