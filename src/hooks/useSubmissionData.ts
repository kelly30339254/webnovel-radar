import { useEffect, useState } from 'react'
import type { SubmissionEditor } from '@/types/submission'

const DATA_URL = `${import.meta.env.BASE_URL}data/submission-editors.json`

export function useSubmissionData() {
  const [data, setData] = useState<SubmissionEditor[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(DATA_URL, { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<SubmissionEditor[]>
      })
      .then(setData)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setError(reason instanceof Error ? reason.message : '未知错误')
      })

    return () => controller.abort()
  }, [])

  return { data, error }
}
