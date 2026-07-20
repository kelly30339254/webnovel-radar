import { useEffect, useState } from 'react'
import SectionTitle from '@/sections/SectionTitle'

type ShortDrama = {
  rank: number
  title: string
  heat: string
  note?: string
}

type Category = {
  name: string
  items: ShortDrama[]
}

type HongguoData = {
  updatedAt: string
  categories: Category[]
}

const RECS = {
  male: [
    { title: '都市高武·灵气复苏', persona: '表面社畜、暗中无敌的摆烂大佬', trope: '扮猪吃虎', reason: '读者就吃“你以为我很弱，其实我秒天秒地”这口反差。' },
    { title: '都市脑洞·系统科研', persona: '毒舌学霸 / 反差萌教授', trope: '马甲掉马', reason: '科研+系统+打脸，容易写出爽点和热搜梗。' },
    { title: '玄幻脑洞·宗门清流', persona: '懒癌晚期但天赋满级的小师叔', trope: '咸鱼流', reason: '反内卷人设正是当下流量密码。' },
    { title: '历史古代·权谋争霸', persona: '腹黑病弱皇子 / 白切黑谋士', trope: '权谋智斗', reason: '朝堂博弈写好了比打怪升级更上头。' },
  ],
  female: [
    { title: '现言脑洞·财阀豪门', persona: '清醒大女主 / 飒爽继承人', trope: '先婚后爱', reason: '清醒女主+契约婚姻，虐渣甜宠两手抓。' },
    { title: '宫斗宅斗·复仇嫡女', persona: '白切黑绿茶 / 重生复仇黑莲花', trope: '扮猪吃虎', reason: '宅斗要爽，核心是看女主怎么优雅地“以茶治茶”。' },
    { title: '青春甜宠·校园救赎', persona: '直球元气少女 / 阴郁天才少年', trope: '双向救赎', reason: '纯爱战神应声倒地，短篇长篇都适配。' },
    { title: '年代文·军婚养娃', persona: '独立清醒下乡知青 / 冷面宠妻军官', trope: '先婚后爱', reason: '年代+军婚+空间/锦鲤，稳定基本盘。' },
  ],
}

function RecCard({ item, index }: { item: (typeof RECS.male)[0]; index: number }) {
  return (
    <div className="card-pink rounded-xl border border-rose-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-600">
          {index + 1}
        </span>
        <h4 className="text-sm font-bold text-rose-950">{item.title}</h4>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-600">人设：{item.persona}</span>
        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs text-pink-600">套路：{item.trope}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-rose-500">{item.reason}</p>
    </div>
  )
}

const ADAPT_REASONS: Record<string, string> = {
  真人剧: '热播真人短剧验证了情绪爽点，反向改编成长篇小说可放大细节与伏笔。',
  漫剧: '漫剧自带画面感与粉丝基础，扩写成网文能蹭到原作流量。',
  AI剧: 'AI剧成本低、题材猎奇，把视觉脑洞转成文字版是降维打击。',
}

export default function BookRecs() {
  const [ipData, setIpData] = useState<HongguoData | null>(null)

  useEffect(() => {
    fetch('/data/hongguo-hot.json')
      .then((r) => r.json())
      .then((d: HongguoData) => setIpData(d))
      .catch(() => setIpData(null))
  }, [])

  return (
    <section className="mt-14">
      <SectionTitle id="book-recs" title="开书推荐" hint="近期容易出成绩的题材方向" />
      {ipData && (
        <div className="card-pink mb-6 rounded-2xl border border-rose-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-950">
            <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
            IP 改编风向标（基于红果热播榜）
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {ipData.categories.map((cat) => {
              const top = cat.items.slice(0, 3)
              return (
                <div key={cat.name} className="rounded-xl border border-rose-100 bg-white/80 p-3">
                  <span className="inline-block rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                    {cat.name}
                  </span>
                  <ol className="mt-2 space-y-1.5">
                    {top.map((it) => (
                      <li key={it.rank} className="text-xs text-rose-700">
                        <span className="font-bold text-rose-900">{it.rank}.</span> {it.title}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 text-xs leading-relaxed text-rose-400">{ADAPT_REASONS[cat.name]}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-950">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            男频方向
          </h3>
          <div className="grid gap-3">
            {RECS.male.map((item, i) => (
              <RecCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-950">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            女频方向
          </h3>
          <div className="grid gap-3">
            {RECS.female.map((item, i) => (
              <RecCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
