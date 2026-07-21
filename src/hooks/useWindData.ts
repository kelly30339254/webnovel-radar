import { useEffect, useState } from 'react'
import type { HistoryData, UpdateStatus, WindData } from '@/types/wind'

export function useWindData() {
  const [data, setData] = useState<WindData | null>(null)
  const [history, setHistory] = useState<HistoryData | null>(null)
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const base = import.meta.env.BASE_URL

    fetch(`${base}data/wind.json`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (alive) setData(json as WindData)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : '数据加载失败')
      })

    fetch(`${base}data/history.json`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (alive && json && Array.isArray(json.days)) setHistory(json as HistoryData)
      })
      .catch(() => {
        /* 历史归档尚未生成时静默忽略 */
      })

    fetch(`${base}data/update-status.json`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (alive && json?.status === 'success') setUpdateStatus(json as UpdateStatus)
      })
      .catch(() => {
        /* 兼容尚未生成状态文件的旧部署 */
      })

    return () => {
      alive = false
    }
  }, [])

  return { data, history, updateStatus, error }
}
