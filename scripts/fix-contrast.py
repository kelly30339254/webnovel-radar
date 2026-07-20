import re
from pathlib import Path

ROOT = Path(__file__).parent.parent / 'src'

# 将 text-theme-300 / text-theme-400 整体提升两档，改善对比度
# 跳过带透明度的装饰性类，如 text-theme-300/50
REPLACEMENTS = {
    r'\btext-theme-300\b(?!/)': 'text-theme-500',
    r'\btext-theme-400\b(?!/)': 'text-theme-600',
}

changed = []
for path in ROOT.rglob('*'):
    if path.is_file() and path.suffix in {'.tsx', '.ts'}:
        text = path.read_text(encoding='utf-8')
        original = text
        for pattern, repl in REPLACEMENTS.items():
            text = re.sub(pattern, repl, text)
        if text != original:
            path.write_text(text, encoding='utf-8')
            changed.append(str(path.relative_to(ROOT.parent)))

print(f'Fixed contrast in {len(changed)} files:')
for p in changed:
    print(f'  {p}')
