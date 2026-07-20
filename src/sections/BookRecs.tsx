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

export default function BookRecs() {
  return (
    <section className="mt-14">
      <SectionTitle id="book-recs" title="开书推荐" hint="近期容易出成绩的题材方向" />
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
