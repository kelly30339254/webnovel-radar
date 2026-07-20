import re
from pathlib import Path

ROOT = Path(__file__).parent.parent / 'src'

# 把 'hsl(var(--theme-xxx))' 字符串替换为 hslVar('--theme-xxx') 函数调用
PATTERN = re.compile(r"'hsl\(var\((--theme-[0-9a-zA-Z_-]+)\)\)'")

# 将部分语义色映射为主题色或保留
COLOR_MAP = {
    "'#ef476f'": "hslVar('--theme-500')",
    "'#0f766e'": "hsl(168 76% 31%)",  # teal-700，保持语义
    "'#ffffff'": "'#ffffff'",
    "'#6b213b'": "hslVar('--theme-900')",
}

FILES = [
    ROOT / 'lib/posterCanvas.ts',
    ROOT / 'lib/nbtiPoster.ts',
    ROOT / 'lib/promptPoster.ts',
    ROOT / 'lib/radarPoster.ts',
]

for path in FILES:
    text = path.read_text(encoding='utf-8')
    original = text

    # 替换 hsl(var()) 字符串
    text = PATTERN.sub(lambda m: f"hslVar('{m.group(1)}')", text)

    # 确保导入了 hslVar
    if 'hslVar' in text and 'import' in text.split('\n')[0]:
        # 检查是否从 posterCanvas 导入 hslVar
        pass

    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'Updated {path.relative_to(ROOT.parent)}')

# 为海报文件添加 hslVar 导入
for path in [ROOT / 'lib/nbtiPoster.ts', ROOT / 'lib/promptPoster.ts', ROOT / 'lib/radarPoster.ts']:
    text = path.read_text(encoding='utf-8')
    if 'hslVar' in text and "hslVar" not in text.split('\n')[0]:
        # 在已有的 posterCanvas 导入中加入 hslVar
        text = re.sub(
            r"(import\s+\{[^}]*)(canvasToPng,\s*createPosterCanvas,\s*drawSiteQr,[^}]*\}\s+from\s+'@/lib/posterCanvas')",
            lambda m: f"{m.group(1).strip()} hslVar, {m.group(2)[1:].lstrip()}",
            text,
        )
        # 兜底：如果上面没匹配到，直接替换 from 行
        if 'hslVar' not in text.split('\n')[0]:
            text = re.sub(
                r"from '@/lib/posterCanvas'",
                "hslVar } from '@/lib/posterCanvas'",
                text,
            )
            text = re.sub(
                r"import\s+\{\s*hslVar\s*\}\s+hslVar\s*\}\s+from\s+'@/lib/posterCanvas'",
                "import { canvasToPng, createPosterCanvas, drawSiteQr, drawTextLines, hslVar, loadSiteQr, roundedRect } from '@/lib/posterCanvas'",
                text,
            )
        path.write_text(text, encoding='utf-8')
