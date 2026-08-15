import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  Clock3,
  Flag,
  LayoutGrid,
  Maximize2,
  Minus,
  Plus,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NodeType = '人物' | '剧情' | '伏笔' | '地点' | '世界规则';
type ViewMode = 'free' | 'timeline' | 'characters' | 'foreshadow';

interface Point {
  x: number;
  y: number;
}

interface CanvasNode {
  id: string;
  title: string;
  type: NodeType;
  note: string;
}

interface CanvasEdge {
  from: string;
  to: string;
  label: string;
  dashed?: boolean;
}

/** 画布世界坐标尺寸（节点布局在此坐标系内定义） */
const WORLD_W = 920;
const WORLD_H = 480;
const NODE_W = 150;
const NODE_H = 76;

const TYPE_STYLE: Record<NodeType, { dot: string; tape: string; tag: string }> = {
  人物: { dot: 'bg-rose-400', tape: 'bg-rose-400/50', tag: 'text-rose-300' },
  剧情: { dot: 'bg-amber-400', tape: 'bg-amber-400/50', tag: 'text-amber-300' },
  伏笔: { dot: 'bg-violet-400', tape: 'bg-violet-400/50', tag: 'text-violet-300' },
  地点: { dot: 'bg-emerald-400', tape: 'bg-emerald-400/50', tag: 'text-emerald-300' },
  世界规则: { dot: 'bg-sky-400', tape: 'bg-sky-400/50', tag: 'text-sky-300' },
};

const NODES: CanvasNode[] = [
  { id: 'lin-wan', title: '林晚', type: '人物', note: '失忆的女记者' },
  { id: 'chen-ye', title: '陈野', type: '人物', note: '旧港修表匠' },
  { id: 'car-crash', title: '雨夜车祸', type: '剧情', note: '第一卷开篇事件' },
  { id: 'pocket-watch', title: '旧怀表', type: '伏笔', note: '指针停在 23:47' },
  { id: 'old-harbor', title: '临海旧港', type: '地点', note: '故事主舞台' },
  { id: 'tide-rule', title: '潮汐法则', type: '世界规则', note: '满月夜记忆回溯' },
  { id: 'rooftop', title: '天台对峙', type: '剧情', note: '第三卷高潮' },
];

const EDGES: CanvasEdge[] = [
  { from: 'lin-wan', to: 'chen-ye', label: '牵涉' },
  { from: 'car-crash', to: 'pocket-watch', label: '引发' },
  { from: 'pocket-watch', to: 'rooftop', label: '伏笔回收', dashed: true },
  { from: 'car-crash', to: 'old-harbor', label: '发生于' },
  { from: 'tide-rule', to: 'pocket-watch', label: '制约' },
];

type LayoutMap = Record<ViewMode, Record<string, Point>>;

const LAYOUTS: LayoutMap = {
  free: {
    'lin-wan': { x: 180, y: 120 },
    'chen-ye': { x: 620, y: 180 },
    'car-crash': { x: 170, y: 330 },
    'pocket-watch': { x: 420, y: 150 },
    'old-harbor': { x: 700, y: 330 },
    'tide-rule': { x: 760, y: 100 },
    rooftop: { x: 400, y: 340 },
  },
  timeline: {
    'car-crash': { x: 110, y: 130 },
    'pocket-watch': { x: 230, y: 350 },
    'lin-wan': { x: 350, y: 130 },
    'old-harbor': { x: 470, y: 350 },
    'tide-rule': { x: 590, y: 130 },
    'chen-ye': { x: 710, y: 350 },
    rooftop: { x: 830, y: 130 },
  },
  characters: {
    'lin-wan': { x: 460, y: 240 },
    'chen-ye': { x: 640, y: 240 },
    'car-crash': { x: 550, y: 375 },
    'pocket-watch': { x: 370, y: 375 },
    'old-harbor': { x: 280, y: 240 },
    'tide-rule': { x: 370, y: 105 },
    rooftop: { x: 550, y: 105 },
  },
  foreshadow: {
    'pocket-watch': { x: 250, y: 130 },
    'car-crash': { x: 250, y: 225 },
    'tide-rule': { x: 250, y: 320 },
    'old-harbor': { x: 250, y: 415 },
    rooftop: { x: 670, y: 130 },
    'lin-wan': { x: 670, y: 225 },
    'chen-ye': { x: 670, y: 320 },
  },
};

const VIEWS: { id: ViewMode; label: string; icon: LucideIcon }[] = [
  { id: 'free', label: '自由画布', icon: LayoutGrid },
  { id: 'timeline', label: '时间线', icon: Clock3 },
  { id: 'characters', label: '角色关系', icon: Users },
  { id: 'foreshadow', label: '伏笔看板', icon: Flag },
];

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.6;
const PAN_MARGIN = 160;
const TIMELINE_AXIS_Y = 240;

const GRID_STYLE = {
  backgroundImage:
    'radial-gradient(circle, rgba(148,163,184,0.12) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

interface EdgeView {
  key: string;
  d: string;
  dashed: boolean;
  mid: Point;
  label: string;
}

export default function InteractiveCanvas() {
  const [view, setView] = useState<ViewMode>('free');
  const [positions, setPositions] = useState<Record<string, Point>>(() => ({
    ...LAYOUTS.free,
  }));
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const nodeDragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const panDragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const clampPan = useCallback((p: Point, z: number): Point => {
    const el = containerRef.current;
    if (!el) return p;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.min(
        PAN_MARGIN,
        Math.max(rect.width - WORLD_W * z - PAN_MARGIN, p.x),
      ),
      y: Math.min(
        PAN_MARGIN,
        Math.max(rect.height - WORLD_H * z - PAN_MARGIN, p.y),
      ),
    };
  }, []);

  const commitPan = useCallback((p: Point) => {
    panRef.current = p;
    setPan(p);
  }, []);

  /** 将世界内容适配到可视区域（初始加载与「重置视图」使用） */
  const fitView = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const z = Math.min(1, rect.width / WORLD_W, rect.height / WORLD_H);
    const p = {
      x: (rect.width - WORLD_W * z) / 2,
      y: (rect.height - WORLD_H * z) / 2,
    };
    zoomRef.current = z;
    setZoom(z);
    commitPan(p);
  }, [commitPan]);

  useEffect(() => {
    fitView();
  }, [fitView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      commitPan(clampPan(panRef.current, zoomRef.current));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [clampPan, commitPan]);

  const toWorld = useCallback((clientX: number, clientY: number): Point => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: (clientX - rect.left - panRef.current.x) / zoomRef.current,
      y: (clientY - rect.top - panRef.current.y) / zoomRef.current,
    };
  }, []);

  const switchView = (next: ViewMode) => {
    setView(next);
    setPositions({ ...LAYOUTS[next] });
  };

  const zoomBy = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const prev = zoomRef.current;
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * factor));
    if (next === prev) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const p = panRef.current;
    zoomRef.current = next;
    setZoom(next);
    commitPan(
      clampPan(
        {
          x: cx - ((cx - p.x) * next) / prev,
          y: cy - ((cy - p.y) * next) / prev,
        },
        next,
      ),
    );
  };

  const handleNodeDown = (
    e: ReactPointerEvent<HTMLDivElement>,
    id: string,
  ) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const w = toWorld(e.clientX, e.clientY);
    const pos = positions[id] ?? { x: 0, y: 0 };
    nodeDragRef.current = { id, dx: w.x - pos.x, dy: w.y - pos.y };
    setDraggingId(id);
  };

  const handleNodeMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = nodeDragRef.current;
    if (!drag) return;
    const w = toWorld(e.clientX, e.clientY);
    const nx = Math.min(
      WORLD_W - NODE_W / 2 - 8,
      Math.max(NODE_W / 2 + 8, w.x - drag.dx),
    );
    const ny = Math.min(
      WORLD_H - NODE_H / 2 - 8,
      Math.max(NODE_H / 2 + 8, w.y - drag.dy),
    );
    setPositions((prev) => ({ ...prev, [drag.id]: { x: nx, y: ny } }));
  };

  const handleNodeUp = () => {
    nodeDragRef.current = null;
    setDraggingId(null);
  };

  const handlePanDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    panDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
    setPanning(true);
  };

  const handlePanMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = panDragRef.current;
    if (!drag) return;
    commitPan(
      clampPan(
        {
          x: drag.panX + (e.clientX - drag.startX),
          y: drag.panY + (e.clientY - drag.startY),
        },
        zoomRef.current,
      ),
    );
  };

  const handlePanUp = () => {
    panDragRef.current = null;
    setPanning(false);
  };

  const edgeViews: EdgeView[] = [];
  for (const edge of EDGES) {
    const a = positions[edge.from];
    const b = positions[edge.to];
    if (!a || !b) continue;
    const dx =
      Math.max(60, Math.abs(b.x - a.x) * 0.5) * Math.sign(b.x - a.x || 1);
    const c1 = { x: a.x + dx, y: a.y };
    const c2 = { x: b.x - dx, y: b.y };
    edgeViews.push({
      key: `${edge.from}-${edge.to}`,
      d: `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`,
      dashed: edge.dashed === true,
      mid: {
        x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8,
        y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8,
      },
      label: edge.label,
    });
  }

  return (
    <div className="relative">
      {/* 容器背后的玫瑰-紫罗兰环境光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 h-48 w-[85%] -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500/25 via-violet-500/20 to-rose-500/25 blur-3xl"
      />
      <div className="glass glass-sheen relative overflow-hidden rounded-2xl">
      {/* 头部：标题 + 视图切换 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div>
          <h3 className="font-serif text-lg text-white">灵感画布 · 在线体验</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            奶龙作者工作台核心功能的微缩演示
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {VIEWS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => switchView(item.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-rose-400/50 bg-rose-500/20 text-rose-200'
                    : 'border-white/15 bg-white/10 text-slate-300 hover:border-white/25 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 画布区 */}
      <div className="px-5 py-4">
        <div
          ref={containerRef}
          role="application"
          aria-label="灵感画布交互演示"
          className={`relative h-[400px] touch-none overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-violet-950/50 ${
            panning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={GRID_STYLE}
          onPointerDown={handlePanDown}
          onPointerMove={handlePanMove}
          onPointerUp={handlePanUp}
          onPointerCancel={handlePanUp}
        >
          {/* 世界坐标层：平移 + 缩放 */}
          <div
            className="absolute left-0 top-0"
            style={{
              width: WORLD_W,
              height: WORLD_H,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <svg
              className="pointer-events-none absolute left-0 top-0 overflow-visible"
              width={WORLD_W}
              height={WORLD_H}
            >
              {view === 'timeline' && (
                <g>
                  <line
                    x1={60}
                    y1={TIMELINE_AXIS_Y}
                    x2={WORLD_W - 60}
                    y2={TIMELINE_AXIS_Y}
                    className="stroke-white/15"
                    strokeWidth={1.5}
                  />
                  {NODES.map((node) => {
                    const pos = LAYOUTS.timeline[node.id];
                    if (!pos) return null;
                    return (
                      <circle
                        key={node.id}
                        cx={pos.x}
                        cy={TIMELINE_AXIS_Y}
                        r={3}
                        className="fill-rose-400/70"
                      />
                    );
                  })}
                </g>
              )}
              {edgeViews.map((edge) => (
                <path
                  key={edge.key}
                  d={edge.d}
                  fill="none"
                  className="stroke-white/25"
                  strokeWidth={1.5}
                  strokeDasharray={edge.dashed ? '5 4' : undefined}
                />
              ))}
            </svg>

            {/* 伏笔看板分组列标题 */}
            {view === 'foreshadow' && (
              <>
                <div
                  className="pointer-events-none absolute left-0 top-0 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[11px] text-violet-200"
                  style={{ transform: `translate(${250}px, ${64}px) translate(-50%, -50%)` }}
                >
                  已埋下
                </div>
                <div
                  className="pointer-events-none absolute left-0 top-0 rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1 text-[11px] text-rose-200"
                  style={{ transform: `translate(${670}px, ${64}px) translate(-50%, -50%)` }}
                >
                  待回收
                </div>
              </>
            )}

            {/* 连线中点关系标签 */}
            {edgeViews.map((edge) => (
              <div
                key={`${edge.key}-label`}
                className="pointer-events-none absolute left-0 top-0 rounded-full border border-white/15 bg-slate-900/70 px-1.5 py-0.5 text-[10px] text-slate-300 backdrop-blur-sm"
                style={{
                  transform: `translate(${edge.mid.x}px, ${edge.mid.y}px) translate(-50%, -50%)`,
                }}
              >
                {edge.label}
              </div>
            ))}

            {/* 便签节点 */}
            {NODES.map((node) => {
              const pos = positions[node.id] ?? { x: 0, y: 0 };
              const style = TYPE_STYLE[node.type];
              const dragging = draggingId === node.id;
              return (
                <div
                  key={node.id}
                  className={`absolute left-0 top-0 ${
                    dragging
                      ? 'z-20 cursor-grabbing'
                      : 'z-10 cursor-grab motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out'
                  }`}
                  style={{
                    width: NODE_W,
                    height: NODE_H,
                    transform: `translate(${pos.x - NODE_W / 2}px, ${pos.y - NODE_H / 2}px)`,
                    touchAction: 'none',
                  }}
                  onPointerDown={(e) => handleNodeDown(e, node.id)}
                  onPointerMove={handleNodeMove}
                  onPointerUp={handleNodeUp}
                  onPointerCancel={handleNodeUp}
                >
                  <div className="relative h-full select-none rounded-xl border border-white/15 bg-white/10 px-3 pb-2 pt-3 shadow-lg shadow-black/40 backdrop-blur-md">
                    {/* 顶部胶带条 */}
                    <div
                      className={`absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-2 rounded-[3px] ${style.tape} shadow-sm`}
                    />
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-[10px] ${style.tag}`}>{node.type}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-white">
                      {node.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {node.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 缩放控制 */}
          <div className="absolute right-3 top-3 z-30 flex flex-col gap-1.5">
            <button
              type="button"
              aria-label="放大"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => zoomBy(1.2)}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="缩小"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => zoomBy(1 / 1.2)}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="重置视图"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={fitView}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 底部操作提示 */}
      <div className="flex items-center justify-between px-5 pb-4 text-[11px] text-slate-500">
        <span>拖动节点 · 空白处平移 · 切换上方视图</span>
        <span>缩放 {Math.round(zoom * 100)}%</span>
      </div>
      </div>
    </div>
  );
}
