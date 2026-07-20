# AGENTS.md — 网文风向（webnovel-radar）

给 AI 编码助手（Kimi Code 等）的项目说明书。改动前先读我。

## 这是什么

「网文风向」是一个中文网文题材风向静态站点，聚焦番茄小说男频 / 女频新书榜、题材热度与趋势、内容关键词词云、IP 改编热点、改编风向标、官方公告与征文。纯前端单页应用，无后端服务，所有数据来自本地静态 JSON，由每日定时任务生成。

线上地址：`https://nailong-d4g922z6h6d9ff59e-1455870789.tcloudbaseapp.com`

## 技术栈

- **框架 / 运行时**：React 19.2.0 + React DOM 19.2.0，TypeScript ~5.9.3
- **构建工具**：Vite 7.2.4（`base: './'`，支持相对路径部署）
- **路由**：react-router 7（BrowserRouter，目前仅 `/` 一个路由）
- **样式**：Tailwind CSS 3.4.19 + autoprefixer + tailwindcss-animate
- **组件库**：shadcn/ui（new-york 风格，CSS 变量主题），图标使用 lucide-react
- **开发插件**：`@vitejs/plugin-react`、`kimi-plugin-inspect-react`
- **代码检查**：ESLint 9 + `@eslint/js` + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`

## 项目结构

```
├── index.html                 # HTML 入口
├── vite.config.ts             # Vite 配置（含 @/ -> ./src 别名）
├── tailwind.config.js         # Tailwind 主题、颜色、动画
├── postcss.config.js          # PostCSS 插件
├── eslint.config.js           # ESLint 配置
├── tsconfig.json              # 项目引用根配置
├── tsconfig.app.json          # 应用 TS 配置（src，严格模式）
├── tsconfig.node.json         # 构建工具 TS 配置（vite.config.ts）
├── components.json            # shadcn/ui 配置
├── deploy.sh                  # 一键部署脚本
├── public/
│   └── data/
│       ├── wind.json          # 当日风向数据
│       └── history.json       # 历史归档（最多 60 天）
└── src/
    ├── main.tsx               # React 应用挂载入口
    ├── App.tsx                # 路由顶层组件
    ├── App.css                # 全局附加样式（::selection、scroll-behavior）
    ├── index.css              # Tailwind 指令 + CSS 变量 + 自定义淡粉动效
    ├── pages/
    │   └── Home.tsx           # 唯一页面，组合所有 sections
    ├── sections/              # 页面板块组件
    │   ├── Nav.tsx            # 吸顶毛玻璃导航 + 锚点
    │   ├── Hero.tsx           # 顶部主视觉 + 数据胶囊
    │   ├── GenreBoard.tsx     # 题材热度榜
    │   ├── TrendChart.tsx     # 手写 SVG 热度趋势图（含右侧标签防重叠）
    │   ├── KeywordClouds.tsx  # 男 / 女频关键词词云
    │   ├── FanqieBoards.tsx   # 番茄新书榜（男 / 女频）
    │   ├── IpHot.tsx          # IP 改编热点
    │   ├── AdaptWatch.tsx     # 改编风向标
    │   ├── Announcements.tsx  # 官方公告 / 征文
    │   ├── Footer.tsx         # 页脚
    │   ├── SectionTitle.tsx   # 统一板块标题组件
    │   ├── SourceLink.tsx     # 来源链接按钮
    │   └── Stickers.tsx       # 动态贴纸与花瓣雨
    ├── hooks/
    │   ├── useWindData.ts     # 加载 wind.json / history.json
    │   └── use-mobile.ts      # shadcn 生成的移动端检测 hook
    ├── types/
    │   └── wind.ts            # 静态数据类型定义
    ├── lib/
    │   └── utils.ts           # cn() 工具函数（clsx + tailwind-merge）
    └── components/ui/         # shadcn/ui 组件（约 50 个，tsc 全量检查，勿乱删）
```

## 数据契约（重要）

页面**只读本地静态 JSON**，禁止在页面代码里直接 fetch 第三方 API（避免 sandbox / 跨域 / 来源不稳定问题）。数据由每日定时任务生成并写入仓库。

### wind.json

路径：`public/data/wind.json`

```ts
{
  updatedAt: string              // 数据日期，如 "2026-07-20"
  verdict: string                // 一句话风向总结
  genres: GenreHeat[]            // 题材热度榜
  keywords: Keywords             // 男 / 女频关键词
  boards: Board[]                // 番茄新书榜（男频 + 女频）
  ipHot?: IpHotItem[]            // IP 改编热点
  announcements?: Announcement[] // 官方公告 / 征文
  adaptWatch?: AdaptWatchItem[]  // 改编风向标
}

interface GenreHeat {
  name: string
  heat: number        // 0-100 相对热度
  trend: 'up' | 'down' | 'flat' | 'new'
  note?: string
}

interface KeywordTag { word: string; weight: number }
interface KeywordChannel { summary: string; tags: KeywordTag[] }
interface Keywords { male: KeywordChannel; female: KeywordChannel }

interface BookItem {
  rank: number
  title: string
  author: string
  genre: string
  heat?: string       // 如 "133.5万在读"
}

interface Board {
  platform: string
  channel: string     // "男频" | "女频"
  chartName: string
  sourceUrl?: string  // 榜单来源链接
  dataDate?: string   // 榜单数据日期
  books: BookItem[]
}

interface IpHotItem { title: string; genre?: string; form: string; note?: string; sourceUrl?: string }
interface Announcement { platform: string; date?: string; title: string; summary: string; sourceUrl?: string }
interface AdaptWatchItem { date?: string; title: string; summary: string; sourceUrl?: string }
```

### history.json

路径：`public/data/history.json`

```ts
{
  days: Array<{
    date: string
    genres: Array<{ name: string; heat: number }>
  }>
}
```

最多保留 60 天，供 `TrendChart` 绘制题材热度趋势。

### 改动原则

- 类型定义在 `src/types/wind.ts`，**不要私自修改字段结构**。
- 如需改结构，必须同步改每日定时任务输出 schema（找主 Agent 改 Automation，不要本地硬编）。
- 新增板块应尽量消费已有字段；如需新增顶层字段，先确认自动化任务能否输出。

## 每日自动更新（已存在，别重复造）

Blueprint 定时任务 `automation_ae0cf981`「网文风向 · 每日抓取」每天 07:23（Asia/Shanghai）执行：

1. 抓取番茄新书榜（优先来源 `novelcatch.com/rank?gender=m|f&list=new`，回退 `fanqienovel.com/rank`）。
2. **男 / 女频各只取 1 个综合新书榜**，不要分类榜、不要总榜。
3. IP 改编与改编风向标**只用番茄 / 红果官方域名**。
4. 重写 `wind.json`、追加 `history.json`。
5. 推送 GitHub 备份 → CloudBase 部署 `/data`。

## 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（Vite 默认端口 3000，Kimi Work 预览常用 7100）
npm run build      # tsc 类型检查 + vite 构建，产物到 dist/
npm run lint       # ESLint 检查
npm run preview    # 预览 dist/ 产物
./deploy.sh "提交说明"  # 一键：git pull → build → CloudBase 部署 → git push
```

### 部署相关

- 静态托管平台：**CloudBase**，环境 ID：`nailong-d4g922z6h6d9ff59e`
- `tcb` CLI 若不在 PATH，脚本会回退到：`/c/Users/20440/AppData/Roaming/kimi-desktop/daimon-share/daimon/npm-global/tcb.cmd`
- 仅更新数据（不常用，定时任务会做）：`tcb hosting deploy ./public/data /data -e nailong-d4g922z6h6d9ff59e`
- GitHub 仓库：`kelly30339254/webnovel-radar`，remote 已配置凭据与代理，可直接 `git push`

## 代码风格与约定

- **语言**：源码与注释主要使用中文；标识符、文件路径、技术术语保持原样。
- **TypeScript**：启用严格模式，`noUnusedLocals`、`noUnusedParameters` 为 `true`。新增代码必须类型安全，避免 `any`。
- **模块**：使用 ES Module，`verbatimModuleSyntax: true`；导入类型请用 `import type ...`。
- **路径别名**：统一使用 `@/` 指向 `src/`。
- **组件**：
  - 每个 section 都是默认导出的函数组件。
  - 新板块优先复用 `SectionTitle`（玫瑰闪光图标 + hint + 右侧槽位）。
  - 任何展示外部数据的模块都要提供 `sourceUrl`，并通过 `SourceLink` 渲染可点击来源。
- **样式**：
  - 主色调为 rose / pink 系，背景 `#fff5f7`。
  - 卡片悬停统一使用 `card-pink` 类（定义在 `src/index.css`）。
  - 入场动画使用 `rise-in` 类，并配合 `animationDelay` 形成错落。
  - 动态效果必须适配 `prefers-reduced-motion: reduce`（已有 `@media` 覆盖）。
- **SVG 趋势图**：`TrendChart` 手写 SVG，右侧标签需保留：短名 ≤8 字、两行排列、纵向防重叠算法、白色描边光晕。重绘时不要丢失这些特性。

## 测试策略

当前项目**没有单元测试或 E2E 测试**（无 `vitest`、`jest`、`playwright` 等配置）。

验证改动的标准流程：

```bash
npm run lint       # 确保 ESLint 通过
npm run build      # 确保 TypeScript 与 Vite 构建通过
```

本地开发时可运行 `npm run dev` 查看页面效果；构建后可用 `npm run preview` 验证生产产物。

## 安全与合规

- **无后端 / 无 secrets**：站点纯静态，不处理用户登录、支付、Cookie 等敏感逻辑。
- **不暴露 API 密钥**：页面代码禁止直接调用第三方 API，避免把密钥或代理配置写进仓库。
- **外部链接**：`SourceLink` 统一使用 `target="_blank" rel="noreferrer noopener"`，防止标签页通过 `window.opener` 操纵原页面。
- **数据安全**：`public/data/*.json` 是公开数据，可直接托管。不要把 `.env`、SSH 私钥等凭证放入仓库。
- **内容合规**：IP 改编、官方公告等板块仅引用番茄 / 红果官方域名内容，避免爬取或转载未授权来源。

## 坑（都踩过，别再踩）

1. **全量部署前必须 `git pull`**：每日任务会推送新数据 JSON 到仓库，本地可能是旧的；用旧数据全量部署会回滚线上数据（`deploy.sh` 已内置 `git pull --rebase`）。
2. 构建后资源文件名带 hash，代码任何改动都需要**整站重新部署**（不是只传 data）。
3. 趋势图右侧标签区经过多轮修复：短名 ≤8 字、两行排列、纵向防重叠、白描边光晕——重画图表时保留这些特性。
4. 本机直连不了 `github.com`（走 gh-proxy 代理，已配好）；EdgeOne 默认域名有 401 合规限制，**线上环境是 CloudBase**，别再往 EdgeOne 部署。
5. `tcb` 登录态若失效：跑 `tcb login` 重新授权（浏览器微信扫码）。
