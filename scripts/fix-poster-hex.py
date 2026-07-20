from pathlib import Path

ROOT = Path(__file__).parent.parent / 'src/lib'

# 主题相关颜色映射到 hslVar 调用
THEME_COLORS = {
    "'#ef476f'": "hslVar('--theme-500')",
    "'#6b213b'": "hslVar('--theme-900')",
}

# 语义色保持为具体 HSL（teal/blue/amber）
SEMANTIC_COLORS = {
    "'#0f766e'": "'hsl(168 76% 31%)'",
    "'#1d4ed8'": "'hsl(224 76% 54%)'",
    "'#b45309'": "'hsl(32 95% 38%)'",
    "'#047857'": "'hsl(161 94% 30%)'",
    "'#92400e'": "'hsl(24 95% 31%)'",
    "'#ecfdf5'": "'hsl(152 82% 96%)'",
    "'#eff6ff'": "'hsl(213 100% 97%)'",
    "'#fffbeb'": "'hsl(48 100% 96%)'",
    "'#f0fdfa'": "'hsl(166 76% 97%)'",
}

for path in [ROOT / 'nbtiPoster.ts', ROOT / 'promptPoster.ts', ROOT / 'radarPoster.ts']:
    text = path.read_text(encoding='utf-8')
    for src, dst in {**THEME_COLORS, **SEMANTIC_COLORS}.items():
        text = text.replace(src, dst)
    path.write_text(text, encoding='utf-8')
    print(f'Updated {path.name}')
