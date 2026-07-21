export default function PageHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="border-b border-theme-200 bg-theme-50/70">
      <div className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-9">
        <p className="text-[11px] font-bold tracking-widest text-theme-500">WEBNOVEL RADAR</p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-theme-950 sm:text-4xl">{title}</h1>
        {hint && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-theme-700 sm:text-base">{hint}</p>}
      </div>
    </header>
  )
}
