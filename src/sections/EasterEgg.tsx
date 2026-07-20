import { useEffect } from 'react'
import { Heart } from '@/sections/Stickers'

function BeatHeart({ size = 64, color = '#e11d48' }: { size?: number; color?: string }) {
  return (
    <span className="heart-beat inline-block leading-none">
      <Heart size={size} color={color} />
    </span>
  )
}

export function EasterEggTrigger({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="flex justify-center pb-10 pt-4">
      <div
        className="group relative flex cursor-pointer select-none items-center justify-center"
        onDoubleClick={onActivate}
        title="双击查看彩蛋"
      >
        <BeatHeart size={88} color="#e11d48" />
        <span className="absolute z-10 text-2xl font-bold text-white drop-shadow-md">327</span>
      </div>
    </div>
  )
}

interface EasterEggProps {
  active: boolean
  onClose: () => void
}

export default function EasterEgg({ active, onClose }: EasterEggProps) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const timer = window.setTimeout(() => onClose(), 10000)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
    }
  }, [active, onClose])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fff5f7] px-6 text-center"
      onDoubleClick={onClose}
    >
      <div className="space-y-5 text-rose-950">
        <p className="flex items-center justify-center gap-3 text-5xl font-bold tracking-wider md:text-7xl">
          <span>Y</span>
          <BeatHeart size={52} />
          <span>W</span>
        </p>
        <p className="text-4xl font-bold tracking-[0.25em] md:text-6xl">FOEVER</p>
        <div className="mt-10 space-y-2 text-lg font-medium text-rose-700 md:text-2xl">
          <p>三伏天不要吃西瓜和冰的</p>
          <p>不要熬夜，早睡早起</p>
          <p>不要吃的太撑了！</p>
          <p>要天天开心！</p>
        </div>
      </div>
      <p className="absolute bottom-8 text-xs text-rose-300">10 秒后自动消失 · 双击或按 ESC 提前返回</p>
    </div>
  )
}
