/* eslint-disable @typescript-eslint/no-explicit-any */

type AnalyticsProps = Record<string, string | number | boolean>

export function initAnalytics() {
  const umamiId = import.meta.env.VITE_UMAMI_ID
  const umamiHost = import.meta.env.VITE_UMAMI_HOST || 'https://cloud.umami.is'
  if (!umamiId) return

  if (document.querySelector(`script[data-website-id="${umamiId}"]`)) return

  const script = document.createElement('script')
  script.defer = true
  script.src = `${umamiHost}/script.js`
  script.setAttribute('data-website-id', umamiId)
  document.head.appendChild(script)
}

export function trackEvent(event: string, props?: AnalyticsProps) {
  try {
    const umami = (window as any).umami
    if (umami?.track) {
      umami.track(event, props)
      return
    }
  } catch {
    // ignore
  }
  // fallback：开发时打印，生产环境静默
  if (import.meta.env.DEV) {
    console.log('[analytics]', event, props)
  }
}

export function useAnalytics() {
  return { trackEvent }
}
