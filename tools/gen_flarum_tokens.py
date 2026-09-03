#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_flarum_tokens.py — 从 cathi-ui 设计 Token 单一来源（src/tokens.css）生成
Flarum 终末地主题的「token 桥」(flarum-theme-endfield/tokens-bridge.css)。

设计目的
--------
cathi-ui 的 endfield 主题色已定为 chartreuse（黄绿），但 Flarum 线上 forum.css
仍手写死 `--primary-color: #fffa00`（柠檬黄），造成「cathi-ui ↔ Flarum 漂移」。

本脚本把 tokens.css 里 endfield 的浅/深两块 token 编译成 Flarum 原生变量
（--primary-color / --button-primary-bg / --body-bg ...）的覆盖值，输出到一个
**独立文件** tokens-bridge.css，由 extend.php 在 endfield.css 之后注入即可生效，
**不改动线上 forum.css**。

Token 仍是单一事实来源：改色只动 src/tokens.css，重跑本脚本即可同步 Flarum。

用法
----
    python tools/gen_flarum_tokens.py
    python tools/gen_flarum_tokens.py <tokens.css 路径> <输出 css 路径>

依赖：仅标准库。
"""

import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_TOKENS = os.path.join(REPO_ROOT, "src", "tokens.css")
DEFAULT_OUT = os.path.join(REPO_ROOT, "flarum-theme-endfield", "tokens-bridge.css")

# 需要额外以 --cathi-* 形式保留在桥文件中的变量，供 components-bridge.css 引用
CATHI_EXPORTS = [
    "--cathi-card",
    "--cathi-muted",
    "--cathi-field",
    "--cathi-field-2",
    "--cathi-background",
    "--cathi-foreground",
    "--cathi-primary",
    "--cathi-primary-active",
    "--cathi-primary-foreground",
    "--cathi-secondary",
    "--cathi-line",
    "--cathi-accent-line",
    "--cathi-border",
    "--cathi-input",
    "--cathi-ring",
    "--cathi-radius",
    "--cathi-r-sm",
    "--cathi-r-md",
]

# ── CSS 块提取：定位选择器锚点，返回其后匹配的第一个 {...} 内容 ──────────────
def extract_block(text: str, anchor: str):
    i = text.find(anchor)
    if i < 0:
        raise RuntimeError(f"找不到锚点: {anchor!r}")
    # 从锚点之后找第一个 {
    bi = text.find("{", i)
    if bi < 0:
        raise RuntimeError(f"锚点后无 '{{' : {anchor!r}")
    depth = 0
    for j in range(bi, len(text)):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                return text[bi + 1:j]
    raise RuntimeError(f"括号不匹配: {anchor!r}")


def parse_decls(body: str):
    """把一块 CSS 体解析成 {--name: value} 字典（忽略注释）。"""
    out = {}
    for raw in body.splitlines():
        line = re.sub(r"/\*.*?\*/", "", raw).strip()  # 去内联注释
        if not line:
            continue
        m = re.match(r"^--[\w-]+\s*:", line)
        if not m:
            continue
        name = line[: line.index(":")].strip()
        val = line[line.index(":") + 1:].strip()
        val = val.rstrip(";").strip()  # 去掉行尾分号
        out[name] = val
    return out


def merge(base: dict, over: dict):
    d = dict(base)
    d.update(over)
    return d


def resolve(name: str, scope: dict, _seen=None):
    """把 --cathi-x 解析成具体 HSL 通道串（如 '68 95% 36%'）。"""
    _seen = _seen or set()
    if name in _seen:
        raise RuntimeError(f"var 循环引用: {name}")
    _seen.add(name)
    if name not in scope:
        raise RuntimeError(f"未定义的 token: {name}（scope 缺失）")
    v = scope[name].strip()
    m = re.match(r"^var\(\s*(--[\w-]+)\s*\)$", v)
    if m:
        return resolve(m.group(1), scope, _seen)
    # 去掉可能的 hsl(...) 包装，只取通道
    m2 = re.match(r"^hsl\(\s*(.+?)\s*\)$", v)
    if m2:
        return m2.group(1).strip()
    return v  # 假定已是通道串


def hsl(channels: str, alpha=None):
    channels = channels.strip()
    if alpha is not None:
        return f"hsl({channels} / {alpha})"
    return f"hsl({channels})"


# ── Flarum 原生变量 ← cathi token 映射表 ──────────────────────────────────────
# 每项: (flarum_var, light_token_or_const, dark_token_or_const, alpha?)
#   token 形式 "--cathi-x"  → 从对应 scope 解析为 hsl(...)
#   const 形式 "hsl(...)" / "rgba(...)" / "#fff" → 原样输出（浅深同值可省第二列）
# 顺序大致对齐 forum.css，便于人工核对。
MAP = [
    # —— 强调 / 状态色 ——
    ("--primary-color", "--cathi-primary", "--cathi-primary"),
    ("--secondary-color", "--cathi-accent-foreground", "--cathi-accent-foreground"),
    ("--accent-color", "--cathi-primary", "--cathi-primary"),
    ("--danger-color", "--cathi-destructive", "--cathi-destructive"),
    # —— 背景 / 表面 ——
    ("--body-bg", "--cathi-background", "--cathi-background"),
    ("--body-bg-light", "--cathi-card", "--cathi-card"),
    ("--body-bg-shaded", "--cathi-muted", "--cathi-muted"),
    ("--body-bg-faded", "--cathi-background", "--cathi-background", ".94"),
    ("--body-bg-fade-70", "--cathi-background", "--cathi-background", ".70"),
    # —— 文字 ——
    ("--text-color", "--cathi-foreground", "--cathi-foreground"),
    ("--text-color-fade-70", "--cathi-foreground", "--cathi-foreground", ".70"),
    ("--heading-color", "--cathi-foreground", "--cathi-foreground"),
    ("--muted-color", "--cathi-muted-foreground", "--cathi-muted-foreground"),
    ("--muted-color-light", "--cathi-muted-foreground", "--cathi-muted-foreground"),
    ("--muted-color-dark", "--cathi-foreground", "--cathi-foreground"),
    ("--link-color", "--cathi-primary", "--cathi-primary"),
    ("--discussion-title-color", "--cathi-foreground", "--cathi-foreground"),
    # —— 控件 ——
    ("--control-bg", "--cathi-card", "--cathi-card"),
    ("--control-bg-light", "--cathi-card", "--cathi-card"),
    ("--control-bg-shaded", "--cathi-muted", "--cathi-muted"),
    ("--control-bg-darken-5", "--cathi-muted", "--cathi-muted"),
    ("--control-bg-darken-10", "--cathi-secondary", "--cathi-secondary"),
    ("--control-color", "--cathi-foreground", "--cathi-foreground"),
    ("--control-muted-color", "--cathi-muted-foreground", "--cathi-muted-foreground"),
    ("--form-control-bg", "--cathi-field", "--cathi-field"),
    ("--form-control-color", "--cathi-on-field", "--cathi-on-field"),
    # —— 按钮 ——
    ("--button-bg", "--cathi-card", "--cathi-card"),
    ("--button-color", "--cathi-foreground", "--cathi-foreground"),
    ("--button-primary-bg", "--cathi-primary", "--cathi-primary"),
    ("--button-primary-color", "--cathi-primary-foreground", "--cathi-primary-foreground"),
    ("--on-primary-color", "--cathi-primary-foreground", "--cathi-primary-foreground"),
    # —— 顶栏 / Hero（终末地工业风：恒定近黑）——
    ("--header-bg", "hsl(220 8% 11%)", "hsl(0 0% 0%)"),
    ("--header-color", "#ffffff", "#ffffff"),
    ("--header-control-bg", "hsl(220 8% 14%)", "hsl(0 0% 0%)"),
    ("--header-control-color", "#ffffff", "#ffffff"),
    ("--hero-bg", "hsl(220 8% 11%)", "hsl(0 0% 0%)"),
    ("--hero-color", "#ffffff", "#ffffff"),
    # —— 用户卡 / 代码 ——
    ("--usercard-bg", "--cathi-card", "--cathi-card"),
    ("--code-bg", "hsl(220 10% 12%)", "hsl(0 0% 0%)"),
    ("--code-color", "--cathi-primary", "--cathi-primary"),
    # —— 标签 / 胶囊 / 提示 ——
    ("--tag-bg", "--cathi-primary", "--cathi-primary"),
    ("--tag-color", "--cathi-primary-foreground", "--cathi-primary-foreground"),
    ("--pill-bg", "--cathi-muted", "--cathi-muted"),
    ("--overlay-bg", "rgba(12,12,12,.55)", "rgba(0,0,0,.7)"),
    ("--tooltip-bg", "--cathi-primary", "--cathi-primary"),
    ("--tooltip-color", "--cathi-primary-foreground", "--cathi-primary-foreground"),
    # —— 告警 ——
    ("--alert-bg", "--cathi-muted", "--cathi-muted"),
    ("--alert-color", "--cathi-foreground", "--cathi-foreground"),
    ("--alert-success-bg", "--cathi-success", "--cathi-success", ".16"),
    ("--alert-success-color", "--cathi-success-foreground", "--cathi-success-foreground"),
    ("--alert-error-bg", "--cathi-destructive", "--cathi-destructive", ".14"),
    ("--alert-error-color", "--cathi-destructive-foreground", "--cathi-destructive-foreground"),
    # —— 列表 / 阴影 / 圆角 ——
    ("--discussion-list-item-bg-hover", "--cathi-secondary", "--cathi-secondary"),
    ("--shadow-color", "--cathi-shadow-color", "--cathi-shadow-color", ".18"),
    ("--shadow-color-darken-5", "--cathi-shadow-color", "--cathi-shadow-color", ".25"),
    ("--border-radius", "3px", "3px"),
    ("--border-radius-rounded", "6px", "6px"),
    ("--border-radius-circle", "999px", "999px"),
    # —— 高亮 / 指示 ——
    ("--highlight-color", "--cathi-primary", "--cathi-primary", ".45"),
    ("--loading-indicator-color", "--cathi-primary", "--cathi-primary"),
    ("--online-user-circle-color", "--cathi-primary", "--cathi-primary"),
    ("--switch-on-color", "--cathi-primary", "--cathi-primary"),
    ("--switch-off-color", "--cathi-muted", "--cathi-muted"),
]


def emit_scope(title, scope, is_dark):
    lines = [f"/* {title} */"]
    for var, light_src, dark_src, *rest in MAP:
        alpha = rest[0] if rest else None
        src = dark_src if is_dark else light_src
        if src.startswith("--"):
            ch = resolve(src, scope)
            val = hsl(ch, alpha)
        else:
            val = src  # 常量原样
        lines.append(f"  {var}: {val};")
    # 额外导出 cathi token 供组件桥引用（保持单一来源）
    lines.append("  /* cathi tokens export for components-bridge */")
    for name in CATHI_EXPORTS:
        if name in scope:
            val = scope[name]
            # 若值仍是 var(...) 则解析到最终字面量，避免桥内无定义
            if val.startswith("var("):
                val = resolve(name, scope)
                val = hsl(val)
            lines.append(f"  {name}: {val};")
    return "\n".join(lines)


def main():
    tokens_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_TOKENS
    out_path = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUT
    with open(tokens_path, encoding="utf-8") as f:
        text = f.read()

    base_light = parse_decls(extract_block(text, ".cathi-root {"))
    base_dark = parse_decls(extract_block(text, '[data-theme^="dark"]'))
    ef_light = parse_decls(extract_block(text, '[data-theme="endfield"],'))
    ef_dark = parse_decls(extract_block(text, '[data-theme="endfield"][data-dark],'))

    scope_light = merge(base_light, ef_light)
    scope_dark = merge(base_dark, ef_dark)

    header = """/*!
 * tokens-bridge.css — 自动生成，禁止手改。
 * 源文件：src/tokens.css（终末地 endfield 浅/深两块）
 * 生成器：tools/gen_flarum_tokens.py
 * 作用：把 cathi-ui 的 --cathi-* token 编译为 Flarum 原生变量覆盖，
 *       根治 --primary-color 柠檬黄 (#fffa00) 与 cathi-ui chartreuse 的漂移。
 * 应用：由 extend.php 在 endfield.css 之后注入本文件（独立 <link>），不改动 forum.css。
 */
"""
    light_block = ":root {\n" + emit_scope("浅色（覆盖 forum.css :root）", scope_light, False) + "\n}\n"
    dark_block = '[data-theme^="dark"] {\n' + emit_scope('深色（覆盖 forum.css [data-theme^="dark"]）', scope_dark, True) + "\n}\n"

    out = header + "\n" + light_block + "\n" + dark_block

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(out)

    print(f"[ok] 生成桥文件: {out_path}")
    print(f"     浅色 token 数={len(scope_light)}  深色 token 数={len(scope_dark)}  映射 Flarum 变量={len(MAP)}")
    # 关键漂移核对
    print(f"     浅色 --primary-color = {resolve('--cathi-primary', scope_light) and hsl(resolve('--cathi-primary', scope_light))}")
    print(f"     深色 --primary-color = {hsl(resolve('--cathi-primary', scope_dark))}")


if __name__ == "__main__":
    main()
