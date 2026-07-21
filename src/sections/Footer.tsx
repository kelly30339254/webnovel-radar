import type { UpdateStatus } from '@/types/wind'

export default function Footer({ updatedAt, updateStatus, onEasterEgg }: { updatedAt: string; updateStatus?: UpdateStatus | null; onEasterEgg?: () => void }) {
  return (
    <footer className="mt-16 border-t border-theme-100 bg-gradient-to-r from-theme-50 via-pink-50 to-theme-50">
      <div className="mx-auto flex max-w-6xl flex-col flex-wrap items-start gap-x-8 gap-y-2 px-5 py-6 text-xs text-theme-700 sm:flex-row sm:items-center md:px-8">
        <span className="inline-flex items-center gap-1.5 font-medium text-theme-500">
          <span className="h-1.5 w-1.5 rounded-full bg-theme-400" />
          网文风向 · Webnovel Radar
        </span>
        <span>
          每日 07:23（Asia/Shanghai）自动检索 · 核心风向 {updatedAt}
          {updateStatus ? ` · 最近校验 ${updateStatus.checkedAt} · 榜单来源 ${updateStatus.sourceDate}` : ''}
        </span>
        <span>来源：网文情报站番茄新书榜、番茄作家专区与红果短剧公开数据（各模块附来源链接）</span>
        <span className="inline-flex items-center gap-2 sm:ml-auto">
          仅供网文创作与选题参考
          <button
            onDoubleClick={onEasterEgg}
            className="heart-beat inline-flex h-5 w-5 items-center justify-center rounded-full bg-theme-200/60 text-[9px] font-bold text-white opacity-40 transition-all hover:scale-110 hover:opacity-90"
            title="双击有惊喜"
            aria-label="双击查看彩蛋"
            type="button"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 20.5C7 16.5 3.5 13.2 3.5 9.3 3.5 6.4 5.7 4.5 8.2 4.5c1.5 0 3 .8 3.8 2 .8-1.2 2.3-2 3.8-2 2.5 0 4.7 1.9 4.7 4.8 0 3.9-3.5 7.2-8.5 11.2Z" />
            </svg>
          </button>
        </span>
      </div>
    </footer>
  )
}
