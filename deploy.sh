#!/usr/bin/env bash
# 一键部署：拉最新数据 → 构建 → 部署 CloudBase → 推送 GitHub
# 用法: ./deploy.sh "提交说明"
set -euo pipefail
cd "$(dirname "$0")"

ENV_ID="nailong-d4g922z6h6d9ff59e"
TCB="tcb"
command -v tcb >/dev/null 2>&1 || TCB="/c/Users/20440/AppData/Roaming/kimi-desktop/daimon-share/daimon/npm-global/tcb.cmd"

echo "== 1/4 拉取仓库最新数据（防止回滚每日任务推送的 JSON）=="
git pull --rebase origin main || echo "（拉取失败，继续用本地文件）"

echo "== 2/4 构建 =="
npm run build

echo "== 3/4 部署到 CloudBase =="
"$TCB" hosting deploy ./dist -e "$ENV_ID"

echo "== 4/4 推送 GitHub 备份 =="
git add -A
git diff --cached --quiet || git commit -m "${1:-update}"
git push origin main

echo "✅ 完成：https://nailong-d4g922z6h6d9ff59e-1455870789.tcloudbaseapp.com"
