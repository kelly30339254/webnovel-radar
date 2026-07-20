import SectionTitle from '@/sections/SectionTitle'

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

const ADAPT_GUIDES = [
  {
    category: '真人剧',
    type: '现实向情感 / 都市逆袭 / 年代家庭',
    persona: '坚韧清醒女主 · 外冷内热男主 · 逆袭型小人物',
    trope: '情绪拉扯 · 打脸逆袭 · 家庭和解',
    tip: '真人剧靠真实情绪打动观众，写小说时把短剧的高光片段扩写成细腻的日常与心理戏，强化代入感。',
  },
  {
    category: '漫剧',
    type: '玄幻修仙 / 热血升级 / 经典IP同人',
    persona: '天赋异禀但低调的主角 · 反差萌配角 · 亦正亦邪的师父',
    trope: '金手指 · 宗门争霸 · 师徒情深',
    tip: '漫剧观众习惯强画面感，小说要把打斗、法术、世界观细节做足，章节结尾留钩子。',
  },
  {
    category: 'AI剧',
    type: '脑洞大开 / 科幻奇幻 / 女频逆袭',
    persona: '觉醒型女主 · 反差系统宿主 · 高智商反派',
    trope: '系统开挂 · 身份反转 · 快节奏打脸',
    tip: 'AI剧以猎奇和爽感取胜，文字版可以放大脑洞设定，用密集爽点留住读者。',
  },
]

export default function BookRecs() {
  return (
    <section className="mt-14">
      <SectionTitle id="book-recs" title="开书推荐" hint="近期容易出成绩的题材方向" />
      <div className="card-pink mb-6 rounded-2xl border border-rose-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-rose-950">
          <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
          IP 改编风向标（基于红果热播榜）
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {ADAPT_GUIDES.map((g) => (
            <div key={g.category} className="rounded-xl border border-rose-100 bg-white/80 p-4 transition-all hover:border-rose-200">
              <span className="inline-block rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                {g.category}
              </span>
              <p className="mt-3 text-sm font-bold text-rose-950">{g.type}</p>
              <div className="mt-2 space-y-1 text-xs text-rose-600">
                <p>
                  <span className="text-rose-300">人设：</span>
                  {g.persona}
                </p>
                <p>
                  <span className="text-rose-300">套路：</span>
                  {g.trope}
                </p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-rose-400">{g.tip}</p>
            </div>
          ))}
        </div>
      </div>
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
