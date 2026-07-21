export type ZhiyuPlacement = 'home_bridge' | 'radar_result' | 'prompt_result' | 'nbti_result'

const ZHIYU_BASE_URL = 'https://zhiyuxiezuo.com/login?invited=HKMLyO'

export function zhiyuUrl(placement: ZhiyuPlacement): string {
  const params = new URLSearchParams({
    utm_source: 'webnovel-radar',
    utm_medium: 'referral',
    utm_content: placement,
  })
  return `${ZHIYU_BASE_URL}&${params.toString()}`
}
