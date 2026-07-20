import os
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent / 'src'

# rose-* 直接映射到 theme-*
ROSE_MAP = {f'rose-{i}': f'theme-{i}' for i in [50,100,200,300,400,500,600,700,800,900,950]}

# pink-* 映射到相近的 theme 色阶
PINK_MAP = {
    'pink-50': 'theme-100',
    'pink-100': 'theme-200',
    'pink-200': 'theme-300',
    'pink-300': 'theme-300',
    'pink-400': 'theme-400',
    'pink-500': 'theme-500',
    'pink-600': 'theme-600',
    'pink-700': 'theme-700',
    'pink-800': 'theme-800',
    'pink-900': 'theme-900',
    'pink-950': 'theme-950',
}

# 十六进制颜色替换为 theme 类或变量
HEX_REPLACEMENTS = {
    '#fff5f7': 'hsl(var(--theme-bg))',
    '#FFF5F7': 'hsl(var(--theme-bg))',
    '#fff7f8': 'hsl(var(--theme-bg))',
    '#FFF7F8': 'hsl(var(--theme-bg))',
    '#fff9fa': 'hsl(var(--theme-50))',
    '#FFF9FA': 'hsl(var(--theme-50))',
    '#fff1f2': 'hsl(var(--theme-100))',
    '#FFF1F2': 'hsl(var(--theme-100))',
    '#ffe4e6': 'hsl(var(--theme-200))',
    '#FFE4E6': 'hsl(var(--theme-200))',
    '#fecdd3': 'hsl(var(--theme-300))',
    '#FECDD3': 'hsl(var(--theme-300))',
    '#fda4af': 'hsl(var(--theme-400))',
    '#FDA4AF': 'hsl(var(--theme-400))',
    '#fb7185': 'hsl(var(--theme-400))',
    '#FB7185': 'hsl(var(--theme-400))',
    '#f43f5e': 'hsl(var(--theme-500))',
    '#F43F5E': 'hsl(var(--theme-500))',
    '#e11d48': 'hsl(var(--theme-600))',
    '#E11D48': 'hsl(var(--theme-600))',
    '#be123c': 'hsl(var(--theme-700))',
    '#BE123C': 'hsl(var(--theme-700))',
    '#9f1239': 'hsl(var(--theme-800))',
    '#9F1239': 'hsl(var(--theme-800))',
    '#881337': 'hsl(var(--theme-900))',
    '#881337': 'hsl(var(--theme-900))',
    '#4c0519': 'hsl(var(--theme-950))',
    '#4C0519': 'hsl(var(--theme-950))',
}

def replace_in_file(path: Path):
    text = path.read_text(encoding='utf-8')
    original = text

    # 替换 rose-*
    for src, dst in ROSE_MAP.items():
        text = re.sub(rf'\b{src}\b', dst, text)

    # 替换 pink-*
    for src, dst in PINK_MAP.items():
        text = re.sub(rf'\b{src}\b', dst, text)

    # 替换十六进制（字符串字面量、fill、stroke 等）
    for src, dst in HEX_REPLACEMENTS.items():
        text = text.replace(src, dst)

    if text != original:
        path.write_text(text, encoding='utf-8')
        return True
    return False

changed = []
for path in ROOT.rglob('*'):
    if path.is_file() and path.suffix in {'.tsx', '.ts', '.css'}:
        if replace_in_file(path):
            changed.append(str(path.relative_to(ROOT.parent)))

print(f'Replaced in {len(changed)} files:')
for p in changed:
    print(f'  {p}')
