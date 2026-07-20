import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import SectionTitle from '@/sections/SectionTitle'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'done'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    // 暂存 localStorage，后续可对接邮件服务或后端
    const list = JSON.parse(localStorage.getItem('webnovel-radar-subscribers') || '[]')
    if (!list.includes(email)) {
      list.push(email)
      localStorage.setItem('webnovel-radar-subscribers', JSON.stringify(list))
    }
    setStatus('done')
    setEmail('')
  }

  return (
    <section className="mt-14">
      <SectionTitle id="subscribe" title="订阅每日更新" hint="每天早晨 07:23 收到最新风向" />
      <div className="card-pink mt-4 rounded-2xl border border-rose-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
        {status === 'done' ? (
          <div className="flex items-center gap-3 text-sm text-rose-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={16} />
            </span>
            订阅成功！我们会在每日更新后第一时间提醒你。
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2">
              <Mail size={16} className="text-rose-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入你的邮箱"
                className="flex-1 bg-transparent text-sm text-rose-950 placeholder:text-rose-300 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-600"
            >
              订阅
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-rose-400">仅用于发送每日更新提醒，不会泄露或用于其他用途。</p>
      </div>
    </section>
  )
}
