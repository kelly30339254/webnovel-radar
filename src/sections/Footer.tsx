export default function Footer({ updatedAt }: { updatedAt: string }) {
  return (
    <footer className="mt-16 border-t border-rose-100 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-2 px-5 py-6 text-xs text-rose-400 md:px-8">
        <span className="inline-flex items-center gap-1.5 font-medium text-rose-500">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          网文风向 · Webnovel Radar
        </span>
        <span>每日 07:23（Asia/Shanghai）自动检索更新，本期数据 {updatedAt}</span>
        <span>来源：番茄小说官方榜单、番茄作家专区官方栏目、红果短剧官方排行榜（各模块附来源链接）</span>
        <span className="ml-auto">仅供网文创作与选题参考</span>
      </div>
    </footer>
  )
}
