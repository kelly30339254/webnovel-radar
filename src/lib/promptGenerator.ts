export type PromptChannel = 'male' | 'female'

export interface PromptChapter {
  label: string
  beat: string
  cliffhanger: string
}

export interface StoryPrompt {
  genre: string
  keyword: string
  title: string
  persona: string
  relationship: string
  goal: string
  obstacle: string
  stakes: string
  secret: string
  logline: string
  chapters: PromptChapter[]
}

interface GenreProfile {
  settings: string[]
  goals: string[]
  obstacles: string[]
  stakes: string[]
  secrets: string[]
  titleHooks: string[]
}

const PERSONAS: Record<PromptChannel, string[]> = {
  male: [
    '被所有人低估、却能看见规则漏洞的边缘人',
    '主动藏起真实实力的冷门专业天才',
    '背着家族污名、只相信证据的前任精英',
    '只想平稳退休、却被迫再次入局的老练执行者',
    '被取消资格后从底层重返赛场的替补',
    '每次使用能力都会失去一段记忆的普通人',
  ],
  female: [
    '刚失去退路、却握有唯一筹码的落魄继承人',
    '表面顺从、暗中记录所有证据的局内人',
    '能读懂人心交易、却不再相信承诺的专业女性',
    '主动隐藏身份、准备完成最后一次清算的前妻',
    '被当作替代品、却掌握原版秘密的旁观者',
    '看似柔软、每一步都在重建秩序的异乡人',
  ],
}

const RELATIONSHIPS: Record<PromptChannel, string[]> = {
  male: [
    '与唯一知道他旧身份的竞争对手被迫结盟',
    '被曾经背叛他的导师重新招入局中',
    '保护一个立场相反、却掌握关键证据的人',
    '和处处抢先一步的宿敌共享同一个限时目标',
    '被自己曾经救下的人当成最大嫌疑人',
  ],
  female: [
    '与最不该信任的利益对手签下一份临时盟约',
    '被曾经放弃她的人请求共同保守一个秘密',
    '保护一个敌视她、却能证明真相的人',
    '和看穿她伪装的旧识维持一段互相利用的关系',
    '被名义上的盟友推到所有矛盾的中心',
  ],
}

const CHAPTER_TURNS = [
  ['公开失败', '错误证据被所有人当成真相', '一份不该存在的记录出现'],
  ['限时任务', '主角选择了风险最高的路径', '倒计时被幕后人提前'],
  ['身份质疑', '盟友拿出无法解释的旧物', '主角发现自己的记忆被改写'],
  ['规则惩罚', '第一次破局反而触发更大代价', '真正的受益者主动现身'],
] as const

const PROFILES: Array<{ match: RegExp; value: GenreProfile }> = [
  {
    match: /高武|灵气/,
    value: {
      settings: ['全民觉醒前夜的封锁城区', '只允许失败者参加的地下评级场', '灵气潮汐即将抵达的边境学校'],
      goals: ['在七日评级中拿回被取消的晋级资格', '找到城市异变名单上被抹去的第一个名字', '在下一次灵气潮汐前救出被判定为污染者的家人'],
      obstacles: ['每次变强都会同步唤醒一只更危险的巨兽', '官方规则正在刻意淘汰拥有同类能力的人', '最强战力来自敌方，而主角必须隐藏真正等级'],
      stakes: ['失败会让整座城区成为下一轮试验场', '失败会失去能力，也会让被保护者替他承担惩罚', '失败会证明所有关于家族叛变的指控都是真的'],
      secrets: ['所谓觉醒并不是奖励，而是一场筛选', '榜首选手早已死去，现在的他只是一段被复制的意识', '主角的能力不是升级，而是在取回被删除的权限'],
      titleHooks: ['第七码头没有普通人', '觉醒名单上少了一个名字', '我把禁区规则练成了本能'],
    },
  },
  {
    match: /宫斗|宅斗/,
    value: {
      settings: ['新后入宫前的最后一场家宴', '所有人都在等她失宠的册封夜', '一份族谱突然多出名字的宗祠'],
      goals: ['在三次请安内找出伪造诏书的人', '保住被当作弃子的幼弟并夺回家族话语权', '让一桩被压下十年的旧案重新进入御前'],
      obstacles: ['每一位证人都从谎言中得利', '她必须借对手的势，才能扳倒共同的敌人', '真相一旦公开，最亲近的人会先被定罪'],
      stakes: ['失败会让全族成为权力交换的筹码', '失败不仅失去位置，还会亲手成全真正的幕后者', '失败会让旧案唯一的幸存者永远闭嘴'],
      secrets: ['她以为要救的人才是最早的布局者', '诏书是真的，但传诏的人故意改了时间', '当年的受害者一直用另一个身份留在宫中'],
      titleHooks: ['入宫第三日，我改了所有人的棋局', '族谱多出的名字', '请安之前先翻旧案'],
    },
  },
  {
    match: /财阀|现言/,
    value: {
      settings: ['一场决定继承权的公开订婚宴', '集团危机爆发后的深夜董事会', '旧城区拆迁协议签署前的最后一天'],
      goals: ['在七天内夺回被冒名签走的核心项目', '找到母亲遗嘱中被替换的最后一页', '让所有人相信她会退出，再反向收购对手的筹码'],
      obstacles: ['她的每一步自救都会抬高对手的股价', '唯一证人正是她必须公开切割的人', '对手掌握她最想保护之人的真实身份'],
      stakes: ['失败会失去继承权，也会让整个团队替她背债', '失败会让真相变成一场精心营销的丑闻', '失败会把她重新变成家族交易中的替代品'],
      secrets: ['最想赶她出局的人一直在暗中替她保留证据', '那场背叛本来是为了让她活着离开', '所谓遗嘱争夺只是在掩护一次更大的资产转移'],
      titleHooks: ['签字之前，她先收购了退路', '继承人从不等宣判', '所有人都以为她会退场'],
    },
  },
  {
    match: /青春|甜宠|校园/,
    value: {
      settings: ['毕业演出名单公布的雨夜', '旧校舍封存前的最后一周', '全校都在追查匿名投稿人的早晨'],
      goals: ['在毕业前完成一场只有两个人知道意义的演出', '找回被冒名提交的作品并保护真正作者', '证明那场改变两人关系的误会来自第三封信'],
      obstacles: ['越接近真相，越会暴露主角曾经主动离开的原因', '两个人都在保护对方，因此持续做出相反选择', '公开证据会同时毁掉最珍贵的一段友情'],
      stakes: ['失败意味着两个人会带着错误答案彻底告别', '失败会让真正的创作者失去最后一次被看见的机会', '失败会让沉默变成所有人认定的事实'],
      secrets: ['对方从第一天就知道她在说谎，只是不愿拆穿', '匿名投稿每一段开头都藏着同一个人的名字', '被误解的告白其实是一次迟到的道歉'],
      titleHooks: ['毕业之前别拆穿我', '第三封信没有署名', '旧校舍只剩一盏灯'],
    },
  },
  {
    match: /抗战|谍战|权谋/,
    value: {
      settings: ['封城前十二小时的旧火车站', '双方情报同时失真的边境小城', '一场人人都带着假身份的停战谈判'],
      goals: ['在天亮前确认一份名单里唯一真实的名字', '护送假情报抵达终点并找出真正泄密者', '让敌人主动执行一项看似有利的错误命令'],
      obstacles: ['主角收到的每条指令都来自已经牺牲的人', '最可信的同伴必须在公开场合背叛他', '完成任务与救下知情者只能选择一个'],
      stakes: ['失败会让整条秘密交通线提前暴露', '失败会让一座城为错误情报付出代价', '失败会让真正的计划永远被当成一次叛变'],
      secrets: ['名单不是用来抓内鬼，而是用来筛选下一位联络人', '任务从一开始就没有终点，只有必须被看见的过程', '主角要保护的情报本身就是诱饵'],
      titleHooks: ['天亮以前不要相信名单', '停战桌上的第三个名字', '最后一封电报来自昨天'],
    },
  },
  {
    match: /年代|军婚|复仇/,
    value: {
      settings: ['返城名额公布前的家属院', '一封迟到十年的调令送达那天', '供销社旧账本被重新翻出的夏天'],
      goals: ['用旧账本洗清母亲背了十年的污名', '在名额被顶替前找到当年的经手人', '带着被拆散的小家庭重新争回生活选择权'],
      obstacles: ['所有证人都依赖同一个既得利益者生活', '最关键的证据会牵连一直帮助主角的人', '时代规则允许不公发生，却不给受害者解释机会'],
      stakes: ['失败会让下一代继续承担上一代的污名', '失败会永远失去离开和重新开始的机会', '失败会让真正获利的人以受害者身份被记住'],
      secrets: ['当年主动认错的人是在替另一个孩子换前程', '被顶替的不只是名额，还有一段被故意改写的婚姻关系', '旧账本缺失的一页一直藏在最普通的生活用品里'],
      titleHooks: ['调令迟到了十年', '旧账本翻到最后一页', '返城之前先把名字还给她'],
    },
  },
  {
    match: /直播|科研|脑洞/,
    value: {
      settings: ['一场意外连上未来频道的公开直播', '全网围观的失败实验现场', '被平台判定为虚假的灾难预警倒计时'],
      goals: ['在直播被永久关闭前证明下一场灾难真实存在', '用三次公开实验找出混入团队的伪造数据', '让所有嘲笑者亲手完成拯救城市的关键步骤'],
      obstacles: ['越多人相信直播，未来灾难发生得越早', '系统只奖励争议，不奖励正确答案', '主角必须公开一个会毁掉自己信誉的半真相'],
      stakes: ['失败会让真实预警被当成最后一次炒作', '失败会让团队成为灾难的第一责任人', '失败会让未来唯一能被改变的节点彻底消失'],
      secrets: ['直播间里最沉默的观众来自灾难发生之后', '所谓失败数据其实记录了另一个时间线', '平台算法一直在替幕后人筛选能看懂预警的人'],
      titleHooks: ['直播间连到了灾难之后', '全网都说实验失败了', '这条预警只有未来点赞'],
    },
  },
]

const FALLBACK_PROFILE: GenreProfile = {
  settings: ['所有人都在等待结果公布的封闭场所', '一份旧规则即将失效的最后一天', '主角被迫重新回到失败现场的夜晚'],
  goals: ['在倒计时结束前夺回被拿走的选择权', '找出规则中唯一能被普通人利用的漏洞', '让错误结论在所有人面前被重新审理'],
  obstacles: ['每一次接近真相都会失去一位盟友', '主角必须使用自己最不愿承认的能力', '真正的对手不阻止他，只不断提供错误捷径'],
  stakes: ['失败会让被保护的人承担全部后果', '失败会让真相永远变成胜利者的版本', '失败会失去最后一次重新开始的资格'],
  secrets: ['主角从来不是偶然入局，而是规则留下的例外', '最大的敌人一直在等待主角完成前半段计划', '看似失败的选择才是唯一没有被预测的路径'],
  titleHooks: ['倒计时结束前别相信规则', '所有人都在等错误答案', '局外人拿到了最后一票'],
}

function pick<T>(items: readonly T[], seed: number, salt: number): T {
  return items[Math.abs(seed * 17 + salt * 31) % items.length]
}

function profileFor(genre: string) {
  return PROFILES.find((profile) => profile.match.test(genre))?.value ?? FALLBACK_PROFILE
}

interface BuildStoryPromptInput {
  channel: PromptChannel
  seed: number
  genre: string
  keyword: string
}

export function buildStoryPrompt({ channel, seed, genre, keyword }: BuildStoryPromptInput): StoryPrompt {
  const profile = profileFor(genre)
  const persona = pick(PERSONAS[channel], seed, 1)
  const relationship = pick(RELATIONSHIPS[channel], seed, 2)
  const setting = pick(profile.settings, seed, 3)
  const goal = pick(profile.goals, seed, 4)
  const obstacle = pick(profile.obstacles, seed, 5)
  const stakes = pick(profile.stakes, seed, 6)
  const secret = pick(profile.secrets, seed, 7)
  const titleHook = pick(profile.titleHooks, seed, 8)
  const chapterTurn = pick(CHAPTER_TURNS, seed, 9)
  const title = seed % 2 === 0 ? `${keyword}入局：${titleHook}` : `${titleHook}，只有我知道${keyword}是真的`
  const pronoun = channel === 'male' ? '他' : '她'

  return {
    genre,
    keyword,
    title,
    persona,
    relationship,
    goal,
    obstacle,
    stakes,
    secret,
    logline: `在${setting}，一个${persona}为了${goal}，不得不${relationship}；但${obstacle}。更糟的是，${pronoun}尚不知道：${secret}。`,
    chapters: [
      {
        label: '第一章 · 逼入局',
        beat: `以“${chapterTurn[0]}”开场，让主角在${setting}失去退路，并明确眼前目标：${goal}。`,
        cliffhanger: `章末钩子：${chapterTurn[2]}。`,
      },
      {
        label: '第二章 · 错结盟',
        beat: `主角${relationship}，第一次尝试破局，却发现${chapterTurn[1]}。`,
        cliffhanger: `章末钩子：${obstacle}。`,
      },
      {
        label: '第三章 · 小胜大坑',
        beat: `让“${keyword}”完成一次看得见的小胜，兑现读者预期，同时付出不可逆代价。`,
        cliffhanger: `章末揭示：${secret}。`,
      },
    ],
  }
}
