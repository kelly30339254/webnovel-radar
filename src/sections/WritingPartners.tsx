import { useState } from 'react'
import { Check, Clipboard, MessageCircle, ShieldCheck, UsersRound } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { trackEvent } from '@/hooks/useAnalytics'
import SectionTitle from '@/sections/SectionTitle'

const INTRO_TEMPLATE = `频道：男频 / 女频
题材：
阶段：准备开书 / 连载中 / 完结复盘
目标：日更打卡 / 互看前三章 / 讨论大纲
日更字数：
常在线时段：
希望搭子：同题材 / 同阶段 / 互补型`

const RULES = [
  '仅限写作交流、日更打卡、开篇互评和大纲讨论。',
  '禁止广告、收费带写、账号交易、借款和私域引流。',
  '无需公开真实姓名、手机号、住址等个人信息。',
  '未经允许不得保存、转载或外传他人的稿件与设定。',
  '搭子合作与私聊必须双方自愿，禁止骚扰和持续催促。',
  '诈骗、盗稿、骚扰等严重违规行为将直接移出群聊。',
]

export default function WritingPartners() {
  const [copied, setCopied] = useState(false)

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(INTRO_TEMPLATE)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
    trackEvent('partners_intro_copy')
  }

  return (
    <section id="partners" className="mt-14 scroll-mt-24" aria-labelledby="writing-partners-title">
      <SectionTitle
        id="writing-partners-title"
        title="找写作搭子"
        hint="找同频写手，把开书计划变成稳定行动"
        footer={
          <>
            <span>无需提交社交账号</span>
            <span>网站不保存个人资料与聊天记录</span>
          </>
        }
      />

      <div className="mt-5 overflow-hidden border-y border-stone-300 bg-white/65">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="order-2 p-5 sm:p-7 lg:order-1 lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center border border-theme-400 bg-white text-theme-700">
              <UsersRound size={23} />
            </div>
            <p className="mt-6 text-xs font-semibold text-theme-600">WRITING PARTNER COMMUNITY</p>
            <h3 className="mt-2 max-w-2xl font-serif text-3xl font-bold leading-tight text-theme-950 sm:text-4xl">
              一个人容易停更，搭子负责提醒你继续写
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-theme-700 sm:text-base">
              在群内寻找同频道、同题材或同阶段的写手，一起日更打卡、交换前三章反馈、讨论大纲卡点。
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { title: '日更打卡', text: '互报目标与完成字数' },
                { title: '开篇互评', text: '聚焦前三章和留存钩子' },
                { title: '大纲讨论', text: '一起拆冲突与兑现节奏' },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-theme-300 pl-3">
                  <p className="text-sm font-bold text-theme-950">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-theme-600">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyTemplate}
                className="inline-flex min-h-11 items-center gap-2 border border-theme-800 bg-theme-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-theme-800"
              >
                {copied ? <Check size={17} /> : <Clipboard size={17} />}
                <span aria-live="polite">{copied ? '模板已复制' : '复制搭子介绍模板'}</span>
              </button>
              <span className="inline-flex items-center gap-1.5 text-xs text-theme-600">
                <ShieldCheck size={15} /> 建议只分享梗概或片段，不发送完整未发表稿件
              </span>
            </div>

            <details className="mt-7 border-t border-theme-100 pt-5">
              <summary className="cursor-pointer text-sm font-bold text-theme-800">查看群规</summary>
              <ol className="mt-4 grid gap-x-8 gap-y-2 text-xs leading-relaxed text-theme-700 sm:grid-cols-2">
                {RULES.map((rule, index) => <li key={rule}>{index + 1}. {rule}</li>)}
              </ol>
            </details>
          </div>

          <aside className="order-1 flex flex-col items-center justify-center border-b border-stone-300 bg-[#edf3ef] px-6 py-8 text-center text-theme-950 lg:order-2 lg:border-b-0 lg:border-l lg:px-8">
            <span className="flex h-12 w-12 items-center justify-center border border-[#174c43] bg-white text-[#174c43]">
              <MessageCircle size={24} />
            </span>
            <p className="mt-5 text-lg font-bold">准备好找同频写手？</p>
            <p className="mt-2 max-w-52 text-xs leading-relaxed text-theme-700">主动打开群入口，扫码后在群内发布搭子介绍。</p>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={() => trackEvent('partners_qr_open')}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[#174c43] bg-[#174c43] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0f382f]"
                >
                  <UsersRound size={18} /> 找搭子
                </button>
              </DialogTrigger>
              <DialogContent className="border-theme-200 bg-theme-bg p-5 sm:max-w-md sm:p-6">
                <DialogHeader className="pr-7 text-left">
                  <DialogTitle className="font-serif text-2xl text-theme-950">写作搭子群</DialogTitle>
                  <DialogDescription className="text-theme-700">微信扫码加入，进群后使用搭子介绍模板寻找同频写手。</DialogDescription>
                </DialogHeader>
                <div className="mx-auto mt-2 w-full max-w-64 rounded-lg border border-theme-200 bg-white p-3 shadow-sm">
                  <img
                    src={`${import.meta.env.BASE_URL}images/writing-partners-group.jpg`}
                    alt="写作搭子微信群二维码"
                    className="aspect-square w-full object-contain"
                    width="760"
                    height="760"
                  />
                </div>
                <p className="text-center text-xs leading-relaxed text-theme-600">无需向网站提交账号信息。请勿在群内公开手机号、住址等敏感资料。</p>
              </DialogContent>
            </Dialog>
          </aside>
        </div>
      </div>
    </section>
  )
}
