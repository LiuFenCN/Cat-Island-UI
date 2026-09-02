#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
抽取 cathi-ui 的设计 token 到 src/tokens.css（单一事实来源）。

规则：
- cathi-ui.css 的 @layer cathi.tokens { ... } 整块 → tokens.css
- 三套主题里「规则体内每一行声明都是 --cathi-*」的规则（即主题 token 块）→ tokens.css
- 其余（@font-face、背景 background-*、组件级覆盖）一律保留在原文件
- cathi-ui.css 顶部改为 @import "./src/tokens.css"
"""
import pathlib, re

ROOT = pathlib.Path(r"F:/缓存/软件缓存/workboddy/2026-07-23-14-54-24/Cat-Island-UI")
SRC = ROOT / "src"
SRC.mkdir(exist_ok=True)

def skip_string_comment(s, i):
    if s[i:i+2] == '/*':
        j = s.find('*/', i+2)
        return j + 2 if j != -1 else len(s)
    if s[i] in ('"', "'"):
        q = s[i]; j = i + 1
        while j < len(s):
            if s[j] == '\\':
                j += 2; continue
            if s[j] == q:
                return j + 1
            j += 1
        return len(s)
    return i

def find_matching_brace(s, open_idx):
    depth = 0; i = open_idx; n = len(s)
    while i < n:
        c = s[i]
        if c == '/' and i+1 < n and s[i+1] == '*':
            i = skip_string_comment(s, i); continue
        if c in ('"', "'"):
            i = skip_string_comment(s, i); continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return n - 1

def split_top_level(s):
    segs = []; depth = 0; start = 0; i = 0; n = len(s)
    while i < n:
        c = s[i]
        if c == '/' and i+1 < n and s[i+1] == '*':
            i = skip_string_comment(s, i); continue
        if c in ('"', "'"):
            i = skip_string_comment(s, i); continue
        if c == '{':
            depth += 1; i += 1
        elif c == '}':
            depth -= 1; i += 1
            if depth == 0:
                segs.append((start, i)); start = i
        else:
            i += 1
    if start < n:
        segs.append((start, n))
    return segs

TOKEN_DECL = re.compile(r'^--[\w-]+\s*:')

def is_token_rule(seg):
    stripped = seg.strip()
    if stripped.startswith('@'):
        return None
    ob = stripped.find('{'); cb = stripped.rfind('}')
    if ob == -1 or cb <= ob:
        return None
    selector = stripped[:ob].strip()
    body = stripped[ob+1:cb]
    body_nc = re.sub(r'/\*.*?\*/', '', body, flags=re.S)
    decls = [d.strip() for d in body_nc.split(';') if d.strip()]
    if not decls:
        return None
    for d in decls:
        if not TOKEN_DECL.match(d):
            return None
    return (selector, body)

def extract_from_style_rules(css):
    out = []; extracted = []
    for (a, b) in split_top_level(css):
        seg = css[a:b]
        tr = is_token_rule(seg)
        if tr:
            extracted.append(tr)
            out.append("/* tokens → src/tokens.css */\n")
        else:
            out.append(seg)
    return ''.join(out), extracted

# ---------- cathi-ui.css ----------
cathi_path = ROOT / "cathi-ui.css"
css = cathi_path.read_text(encoding='utf-8')
marker = '@layer cathi.tokens {'
idx = css.find(marker)
assert idx != -1, "cathi-ui.css 未发现 @layer cathi.tokens"
open_idx = idx + len(marker) - 1
close_idx = find_matching_brace(css, open_idx)
base_inner = css[open_idx+1:close_idx]

nl = '@layer cathi.tokens, cathi.base, cathi.components, cathi.utilities;'
nl_idx = css.find(nl)
remove_start = nl_idx if (nl_idx != -1 and nl_idx < idx) else idx
header = css[:remove_start]
if not header.endswith('\n'):
    header += '\n'
new_cathi = header + '@import "./src/tokens.css";\n' + css[close_idx+1:]
cathi_path.write_text(new_cathi, encoding='utf-8')
print(f"[cathi-ui.css] token 层已抽离，文件大小 {len(css)} → {len(new_cathi)}")

# ---------- 三主题 ----------
theme_extracted = []
for name in ("cozy", "endfield", "liquidglass"):
    p = ROOT / "themes" / f"{name}.css"
    txt = p.read_text(encoding='utf-8')
    new_txt, ext = extract_from_style_rules(txt)
    p.write_text(new_txt, encoding='utf-8')
    theme_extracted.extend(ext)
    print(f"[themes/{name}.css] 抽到 token 规则 {len(ext)} 条，保留其余；大小 {len(txt)} → {len(new_txt)}")

# ---------- 写 tokens.css ----------
header_css = """/*!
 * cathi-ui v4 — 设计 Token 单一来源（SINGLE SOURCE OF TRUTH）
 * 所有 --cathi-* 变量集中定义于此。cathi-ui.css 与 themes/*.css 均 @import 本文件。
 * 改主题色 / 圆角 / 阴影只改这里；Flarum 桥由 tools/gen_flarum_tokens.py 从本文件生成。
 * 禁止在 cathi-ui.css 或 themes/*.css 内联重复定义 --cathi-*。
 */

@layer cathi.tokens, cathi.base, cathi.components, cathi.utilities;

@layer cathi.tokens {
"""
footer_css = "}\n"

tokens_parts = [header_css]
tokens_parts.append(base_inner.strip())
tokens_parts.append("\n")
for (sel, body) in theme_extracted:
    tokens_parts.append(f"{sel} {{{body}}}\n")
tokens_parts.append(footer_css)
(SRC / "tokens.css").write_text("".join(tokens_parts), encoding='utf-8')
print(f"[src/tokens.css] 已生成，共 {len(theme_extracted)+2} 个 token 规则块（base + 三主题浅/深）")
print("done")
