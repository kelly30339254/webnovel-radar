import { useState } from 'react'
import { Clapperboard, Lightbulb, Sparkles, UserRound, Zap } from 'lucide-react'
import SectionTitle from '@/sections/SectionTitle'

const CREATIVE_CUTS = {
  male: [
    {
      title: '都市高武·灵气复苏',
      persona: '表面社畜、暗中无敌的摆烂大佬',
      conflict: '身份误判 × 公开考核',
      hook: '主角被判定为废柴，却随手解决只有宗师能处理的异变。',
    },
    {
      title: '都市脑洞·系统科研',
      persona: '毒舌学霸 / 反差萌教授',
      conflict: '权威质疑 × 直播验证',
      hook: '系统第一项任务，是让主角在直播中证明一个被全行业否定的结论。',
    },
    {
      title: '玄幻脑洞·宗门清流',
      persona: '懒癌晚期但天赋满级的小师叔',
      conflict: '被迫带队 × 宗门争位',
      hook: '全宗门争夺秘境名额，主角只想睡觉，却被天道点名带队。',
    },
    {
      title: '历史古代·权谋争霸',
      persona: '腹黑病弱皇子 / 白切黑谋士',
      conflict: '必输朝局 × 多方背叛',
      hook: '病弱皇子在必输朝局中递出一份让三方同时翻脸的奏折。',
    },
  ],
  female: [
    {
      title: '现言脑洞·财阀豪门',
      persona: '清醒大女主 / 飒爽继承人',
      conflict: '契约婚姻 × 继承权反转',
      hook: '签下假结婚协议当晚，女主发现自己才是财阀真正继承人。',
    },
    {
      title: '宫斗宅斗·复仇嫡女',
      persona: '白切黑绿茶 / 重生复仇黑莲花',
      conflict: '体面规则 × 暗线清算',
      hook: '重生回被赶出家门前，女主先替仇人准备了一场体面寿宴。',
    },
    {
      title: '青春甜宠·校园救赎',
      persona: '直球元气少女 / 阴郁天才少年',
      conflict: '公开对立 × 匿名守护',
      hook: '全校都以为他们互相讨厌，只有匿名树洞记录着两人的双向救赎。',
    },
    {
      title: '年代文·军婚养娃',
      persona: '独立下乡知青 / 冷面宠妻军官',
      conflict: '陌生环境 × 家庭重建',
      hook: '随军第一天，女主用一顿饭换来整个家属院的情报网。',
    },
  ],
}

type CreativeCut = (typeof CREATIVE_CUTS.male)[number]

function CreativeCutCard({ item }: { item: CreativeCut }) {
  return (
    <article className="card-pink flex h-full flex-col rounded-lg border border-theme-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-theme-950">{item.title}</h3>
      <div className="mt-4 space-y-3 text-xs leading-relaxed">
        <div className="flex items-start gap-2">
          <UserRound className="mt-0.5 flex-none text-theme-500" size={15} />
          <p><span className="font-semibold text-theme-800">人设核：</span><span className="text-theme-700">{item.persona}</span></p>
        </div>
        <div className="flex items-start gap-2">
          <Zap className="mt-0.5 flex-none text-amber-600" size={15} />
          <p><span className="font-semibold text-theme-800">冲突机制：</span><span className="text-theme-700">{item.conflict}</span></p>
        </div>
      </div>
      <div className="mt-5 border-t border-theme-100 pt-4">
        <p className="text-[11px] font-semibold text-theme-500">开篇钩子</p>
        <p className="mt-1.5 text-sm leading-relaxed text-theme-950">{item.hook}</p>
      </div>
    </article>
  )
}

const ADAPTATION_PATTERNS = [
  {
    category: '真人剧',
    focus: '现实情绪与关系变化',
    fit: '都市逆袭 · 年代家庭 · 婚恋情感',
    method: '让关键冲突发生在可拍摄的具体场景，用动作和对话替代大段设定说明。',
  },
  {
    category: '漫剧',
    focus: '强画面与连续升级',
    fit: '玄幻修仙 · 热血升级 · 世界观冒险',
    method: '每个单元设置视觉奇观和明确胜负目标，章末留下下一场对抗。',
  },
  {
    category: 'AI 剧',
    focus: '高概念与快速反转',
    fit: '科幻奇幻 · 系统脑洞 · 身份逆袭',
    method: '一句话讲清核心规则，前三章连续展示规则带来的反差与代价。',
  },
]

export default function BookRecs() {
  const [channel, setChannel] = useState<'male' | 'female'>(() => {
    const value = new URLSearchParams(window.location.search).get('channel')
    return value === 'female' ? 'female' : 'male'
  })

  const switchChannel = (nextChannel: 'male' | 'female') => {
    setChannel(nextChannel)
    const params = new URLSearchParams(window.location.search)
    params.set('channel', nextChannel)
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  return (
    <section id="book-recs" className="mt-14 scroll-mt-24" aria-labelledby="book-recs-title">
      <SectionTitle
        id="book-recs-title"
        title="创作切口库"
        hint="选定题材后，继续拆人设、冲突和开篇钩子"
        footer={
          <>
            <span>不参与题材热度排序</span>
            <span>近期方向负责选题，本模块负责落笔</span>
          </>
        }
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-theme-accent bg-theme-accent-soft px-4 py-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-theme-950">
          <Lightbulb size={17} className="text-theme-600" /> 下一步：组合一个人设核、一组冲突机制和一句开篇钩子
        </span>
        <div className="inline-flex overflow-hidden rounded-lg border border-theme-200 bg-white text-xs shadow-sm" aria-label="创作频道">
          {([
            { key: 'male', label: '男频切口' },
            { key: 'female', label: '女频切口' },
          ] as const).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => switchChannel(item.key)}
              className={`min-h-9 px-4 font-semibold transition-colors ${channel === item.key ? 'bg-theme-700 text-white' : 'text-theme-700 hover:bg-theme-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CREATIVE_CUTS[channel].map((item) => <CreativeCutCard key={item.title} item={item} />)}
      </div>

      <div className="mt-8 border-t border-theme-200 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Clapperboard size={18} className="text-theme-500" />
          <h3 className="font-serif text-xl font-bold text-theme-950">改编形态拆解</h3>
          <span className="text-xs text-theme-600">同一题材，按不同媒介调整表达方式</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {ADAPTATION_PATTERNS.map((pattern) => (
            <article key={pattern.category} className="rounded-lg border border-theme-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-theme-950 px-2.5 py-1 text-xs font-bold text-white">{pattern.category}</span>
                <Sparkles size={16} className="text-theme-400" />
              </div>
              <p className="mt-4 text-sm font-bold text-theme-950">{pattern.focus}</p>
              <p className="mt-2 text-xs text-theme-600">适合：{pattern.fit}</p>
              <p className="mt-3 text-xs leading-relaxed text-theme-700">{pattern.method}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
