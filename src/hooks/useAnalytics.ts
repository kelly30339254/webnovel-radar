type AnalyticsProps = Record<string, string | number | boolean>

declare global {
  interface Window {
    _hmt?: Array<Array<string | number>>
    umami?: {
      track: (event: string, props?: AnalyticsProps) => void
    }
  }
}

export function initAnalytics() {
  const umamiId = import.meta.env.VITE_UMAMI_ID
  const umamiHost = import.meta.env.VITE_UMAMI_HOST || 'https://cloud.umami.is'
  const baiduId = import.meta.env.VITE_BAIDU_TONGJI_ID

  if (umamiId && !document.querySelector(`script[data-website-id="${umamiId}"]`)) {
    const script = document.createElement('script')
    script.defer = true
    script.src = `${umamiHost}/script.js`
    script.setAttribute('data-website-id', umamiId)
    document.head.appendChild(script)
  }

  if (baiduId && !document.querySelector(`script[data-baidu-tongji-id="${baiduId}"]`)) {
    window._hmt = window._hmt || []
    const script = document.createElement('script')
    script.async = true
    script.src = `https://hm.baidu.com/hm.js?${baiduId}`
    script.setAttribute('data-baidu-tongji-id', baiduId)
    document.head.appendChild(script)
  }
}

export function trackPageView(path: string) {
  window._hmt?.push(['_trackPageview', path])
}

export function trackEvent(event: string, props?: AnalyticsProps) {
  try {
    window.umami?.track(event, props)
    const label = props ? JSON.stringify(props) : ''
    window._hmt?.push(['_trackEvent', 'webnovel-radar', event, label])
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
