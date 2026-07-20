import { useEffect, useRef } from 'react'

/* 动态贴纸：爱心 / 星星 / 闪光 / 书本 / 花瓣，纯 SVG + CSS 动画 + 轻微鼠标视差 */

export function Heart({ size = 24, color = 'hsl(var(--theme-400))' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5C7 16.5 3.5 13.2 3.5 9.3 3.5 6.4 5.7 4.5 8.2 4.5c1.5 0 3 .8 3.8 2 .8-1.2 2.3-2 3.8-2 2.5 0 4.7 1.9 4.7 4.8 0 3.9-3.5 7.2-8.5 11.2Z"
        fill={color}
      />
    </svg>
  )
}

function Star({ size = 22, color = '#f9a8d4' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5 14.5 9l6.5.4-5.1 4.3 1.6 6.4L12 16.3l-5.5 3.8 1.6-6.4L3 9.4 9.5 9 12 2.5Z"
        fill={color}
      />
    </svg>
  )
}

function Sparkle({ size = 18, color = '#f472b6' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3c.7 4.5 2.5 6.8 8 8-5.5 1.2-7.3 3.5-8 8-.7-4.5-2.5-6.8-8-8 5.5-1.2 7.3-3.5 8-8Z" fill={color} />
    </svg>
  )
}

function Book({ size = 26, color = 'hsl(var(--theme-600))' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.5C10.5 5 8.3 4.3 4 4.3c-.4 0-.7.3-.7.7v12.3c0 .5.4.8.9.7 3.7-.3 5.9.3 7.8 2 1.9-1.7 4.1-2.3 7.8-2 .5 0 .9-.3.9-.7V5c0-.4-.3-.7-.7-.7-4.3 0-6.5.7-8 2.2Zm0 0V20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Petal({ size = 16, color = '#fbcfe8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c4 3.5 5.5 7.5 4.5 11.5-1 3.8-4 6.5-4.5 8-.5-1.5-3.5-4.2-4.5-8C6.5 9.5 8 5.5 12 2Z"
        fill={color}
      />
    </svg>
  )
}

type StickerSpec = {
  id: string
  node: React.ReactNode
  className: string
  depth?: number
  twinkle?: boolean
}

const HERO_STICKERS: StickerSpec[] = [
  { id: 'h1', node: <Heart size={30} />, className: 'right-[8%] top-[16%]', depth: 14 },
  { id: 's1', node: <Star size={24} />, className: 'right-[20%] top-[10%]', depth: 22, twinkle: true },
  { id: 'b1', node: <Book size={34} />, className: 'right-[6%] top-[52%]', depth: 18 },
  { id: 'k1', node: <Sparkle size={20} />, className: 'right-[26%] top-[42%]', depth: 26, twinkle: true },
  { id: 'h2', node: <Heart size={18} color="#f9a8d4" />, className: 'right-[15%] top-[68%]', depth: 10 },
  { id: 's2', node: <Star size={16} color="#fbcfe8" />, className: 'right-[32%] top-[24%]', depth: 16, twinkle: true },
]

const PETALS = [
  { id: 'p1', left: '6%', delay: '0s', dur: '17s', size: 14 },
  { id: 'p2', left: '22%', delay: '5s', dur: '21s', size: 11 },
  { id: 'p3', left: '48%', delay: '9s', dur: '19s', size: 15 },
  { id: 'p4', left: '70%', delay: '3s', dur: '23s', size: 12 },
  { id: 'p5', left: '88%', delay: '12s', dur: '18s', size: 13 },
]

export function HeroStickers() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5
      el.querySelectorAll<HTMLElement>('[data-depth]').forEach((node) => {
        const depth = Number(node.dataset.depth || 12)
        node.style.translate = `${(-nx * depth).toFixed(1)}px ${(-ny * depth).toFixed(1)}px`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {HERO_STICKERS.map((s, i) => (
        <span
          key={s.id}
          data-depth={s.depth}
          className={`absolute ${s.className} transition-transform duration-300 ease-out`}
        >
          <span
            className={`block drop-shadow-sm ${s.twinkle ? 'sticker-twinkle' : 'sticker-float'}`}
            style={{ ['--delay' as string]: `${i * 0.7}s`, ['--dur' as string]: s.twinkle ? '3.6s' : `${5 + i * 0.6}s` }}
          >
            {s.node}
          </span>
        </span>
      ))}
    </div>
  )
}

export function PetalRain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {PETALS.map((p) => (
        <span
          key={p.id}
          className="petal-drift absolute top-0"
          style={{ left: p.left, ['--delay' as string]: p.delay, ['--dur' as string]: p.dur }}
        >
          <Petal size={p.size} />
        </span>
      ))}
    </div>
  )
}
