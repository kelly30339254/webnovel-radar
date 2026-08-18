import type { ComponentType } from 'react'
import {
  BoxSelect,
  ImageDown,
  Layers,
  LayoutTemplate,
  ListTree,
  Magnet,
  Network,
  Wand2,
} from 'lucide-react'

interface CanvasFeature {
  icon: ComponentType<{ size?: number | string; className?: string }>
  title: string
  description: string
}

const FEATURES: CanvasFeature[] = [
  {
    icon: Layers,
    title: '多视图切换',
    description: '自由画布、时间线、角色关系、伏笔看板、章节节拍、出场矩阵，一块画布多种看法。',
  },
  {
    icon: BoxSelect,
    title: '框选与多选拖动',
    description: '框选一片节点，整体拖动调整布局，整理大场面不费力。',
  },
  {
    icon: Magnet,
    title: '吸附对齐与连线编辑',
    description: '节点靠近自动吸附对齐，连线随手编辑，关系图谱整整齐齐。',
  },
  {
    icon: LayoutTemplate,
    title: '画布模板',
    description: '三幕结构、英雄之旅、单元剧模板一键铺开，开局就有骨架。',
  },
  {
    icon: Wand2,
    title: '自动成画',
    description: '按卷或按人物自动生成画布，已有章节秒变可视化结构。',
  },
  {
    icon: ListTree,
    title: '画布 → 大纲',
    description: '摆好的节点一键生成大纲，从脑洞到细纲不再重来一遍。',
  },
  {
    icon: Network,
    title: '多画布门户节点',
    description: '用门户节点串联多块画布，世界观再大也能分层管理。',
  },
  {
    icon: ImageDown,
    title: '导出 PNG 与 AI 整理',
    description: '画布一键导出成图分享，也可交给 AI 自动整理归类。',
  },
]

export default function CanvasFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-rose-400">CANVAS</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-theme-950 sm:text-4xl">
          画布，不止一块白板
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
          灵感画布是工作台的核心：人物、剧情、伏笔、地点、世界规则……所有资料都是节点，随你摆、随你连。
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group glass glass-sheen rounded-2xl p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-rose-400 transition-colors group-hover:text-rose-300">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 text-base font-semibold text-theme-950">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
