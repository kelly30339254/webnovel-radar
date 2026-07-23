export default function PageHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="border-b border-stone-300 bg-theme-bg">
      <div className="mx-auto max-w-[1440px] px-5 py-9 md:px-8 md:py-12">
        <div className="flex items-center gap-5">
          <span className="hidden h-16 w-1 bg-theme-600 sm:block" aria-hidden="true" />
          <div>
            <h1 className="font-serif text-4xl font-black leading-tight tracking-[-0.04em] text-theme-950 sm:text-5xl">{title}</h1>
            {hint && <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">{hint}</p>}
          </div>
        </div>
        <div className="mt-7 space-y-1" aria-hidden="true"><div className="h-0.5 bg-theme-600" /><div className="h-px bg-theme-600" /></div>
      </div>
    </header>
  )
}
