export function freshnessLabel(dateText?: string): { text: string; stale: boolean } | null {
  if (!dateText) return null
  const t = Date.parse(dateText.replace(/-/g, '/'))
  if (Number.isNaN(t)) return { text: `数据截止 ${dateText}`, stale: false }
  const days = Math.floor((Date.now() - t) / 86400000)
  return { text: `数据截止 ${dateText}${days > 0 ? `（${days} 天前）` : ''}`, stale: days > 3 }
}

export function todayLabel(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
