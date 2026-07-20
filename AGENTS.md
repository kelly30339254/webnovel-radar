# AGENTS.md — 网文风向（webnovel-radar）

给 AI 编码助手（Kimi Code 等）的项目说明书。改动前先读我。

## 这是什么

中文网文题材风向网站：番茄小说男频/女频新书榜、题材热度趋势、内容关键词词云、IP 改编热点、改编风向标、官方公告。纯静态站点，无后端。

## 技术栈与结构

- React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- 入口 `src/pages/Home.tsx`（由 `src/main.tsx`/`App.tsx` 挂载）
- 页面板块全在 `src/sections/`，每个板块一个组件：
  - `Hero` 顶部主视觉 + 数据统计胶囊；`Nav` 毛玻璃吸顶导航（锚点跳转）
  - `GenreBoard` 题材热度榜；`TrendChart` 热度趋势（手写 SVG，**右侧标签带防重叠算法和白描边光晕，改动时保留**）
  - `KeywordClouds` 男/女频关键词词云；`FanqieBoards` 番茄新书榜（男/女频）
  - `IpHot` IP 改编热点；`AdaptWatch` 改编风向标；`Announcements` 官方公告
  - `SectionTitle` 统一板块标题（玫瑰闪光图标 + hint + 右侧槽位），新板块请复用
  - `SourceLink` 来源链接（**每个数据模块都要带 sourceUrl 可点击跳转**）
  - `Stickers` 动态贴图（鼠标视差 + 花瓣雨，需适配 prefers-reduced-motion）
- 设计：淡粉主题（rose/pink 系），`src/index.css` 末尾有自定义动效 keyframes（float-soft/fade-up/twinkle/drift-petal、card-pink hover、粉色滚动条）
- shadcn 组件在 `src/components/ui/`，大多未使用，不要乱删（tsc 全量检查）

## 数据契约（重要）

页面只读本地静态 JSON，**禁止在页面里 fetch 第三方 API**（sandbox/跨域问题），数据由每日定时任务生成：

- `public/data/wind.json`：{ updatedAt, verdict, genres[{name,heat,trend,note}], keywords{male,female}{summary,tags[{word,weight}]}, boards[{platform,channel,chartName,sourceUrl,dataDate,books[{rank,title,author,genre,heat}]}], ipHot[], announcements[], adaptWatch[] }
- `public/data/history.json`：{ days:[{date, genres:[{name,heat}]}] }（最多 60 天，趋势图数据源）
- 类型定义在 `src/types/wind.ts`。**不要改字段结构**；要改结构必须同步改定时任务输出 schema（找主 Agent 改 Automation，不要本地硬编）

## 每日自动更新（已存在，别重复造）

Blueprint 定时任务 `automation_ae0cf981`「网文风向 · 每日抓取」每天 07:23（Asia/Shanghai）：
抓取番茄新书榜（指定来源 novelcatch.com/rank?gender=m|f&list=new，回退 fanqienovel.com/rank；**男/女频各 1 个综合新书榜，不要分类榜、不要总榜**；IP 改编与改编风向标**只用番茄/红果官方域名**）
→ 重写 wind.json、追加 history.json → 推送 GitHub 备份 → CloudBase 部署 /data。

## 常用命令

```bash
npm run dev        # 本地开发（Kimi Work 预览端口 7100）
npm run build      # 产物到 dist/
./deploy.sh "提交说明"   # 一键：拉最新数据 → 构建 → 部署 CloudBase → 推送 GitHub
```

- CloudBase 环境 ID：`nailong-d4g922z6h6d9ff59e`
- 只更新数据（不常用，定时任务会做）：`tcb hosting deploy ./public/data /data -e nailong-d4g922z6h6d9ff59e`
- 若 `tcb` 找不到：`/c/Users/20440/AppData/Roaming/kimi-desktop/daimon-share/daimon/npm-global/tcb.cmd`
- GitHub 仓库 `kelly30339254/webnovel-radar`，remote 已配置好凭据和代理，直接 `git push` 即可

## 坑（都踩过，别再踩）

1. **全量部署前必须 `git pull`**：每日任务会推送新数据 JSON 到仓库，本地可能是旧的；用旧数据全量部署会回滚线上数据（deploy.sh 已处理）
2. 构建后资源文件名带 hash，代码任何改动都需要**整站重新部署**（不是只传 data）
3. 趋势图右侧标签区是经过两轮修复的：短名 ≤8 字、两行排列、纵向防重叠、白描边——重画图表时保留这些特性
4. 本机直连不了 github.com（走 gh-proxy 代理，已配好）；EdgeOne 默认域名有 401 合规限制，**线上环境是 CloudBase**，别再往 EdgeOne 部
5. tcb 登录态若失效：跑 `tcb login` 重新授权（浏览器微信扫码）
