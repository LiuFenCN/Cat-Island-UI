#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_flarum_components.py — Flarum 组件桥生成器（cathi-ui v4.5+）

把 themes/endfield.css 里"终末地视觉优化"编译成 Flarum 原生选择器覆盖，
生成 flarum-theme-endfield/components-bridge.css，由 extend.php 在 endfield.css 之后注入。

设计原则（回答"分支如何继承优化后效果"）：
- themes/endfield.css 是终末地"视觉事实来源"（单一来源的一部分）
- 此脚本是"编译"步骤：源改了 -> 重跑 -> Flarum 自动继承（下行闭环）
- Flarum 端若发现更好的处理，先提回 themes/endfield.css，再由此脚本下发（上行闭环）

当前切片：终末地 contour 科技感背景（地形等高线 + 工业网格 + 黄绿能源辉光），
浅/深两档，从 themes/endfield.css 的 .cathi-root 背景块抽取。
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "themes" / "endfield.css"
OUT = ROOT / "flarum-theme-endfield" / "components-bridge.css"
SVG_URL = "/assets/endfield-contour.svg"  # 部署时 conour svg 也要拷到 public/assets/

text = SRC.read_text(encoding="utf-8")

# 抽取所有规则：selector { body }
rule_re = re.compile(r"([^{}]+)\{([^{}]*)\}")
rules = []
for m in rule_re.finditer(text):
    sel = m.group(1).strip()
    body = m.group(2).strip()
    rules.append((sel, body))

# 只保留针对 .cathi-root 且含 background-image 的背景规则（浅 + 深两档）
bg_rules = [(s, b) for s, b in rules if ".cathi-root" in s and "background-image" in b]

KEEP_PREFIXES = ("background-image", "background-size", "background-position",
                 "background-repeat", "background-attachment")


def transform(sel: str, body: str):
    is_dark = "[data-dark]" in sel
    decls = []
    for line in body.split(";"):
        line = line.strip()
        if not line or line.startswith("/*"):
            continue
        # 只保留背景图栈相关声明；丢弃 background-color / color（Flarum 用 --body-bg，避免抢文本色）
        if not any(line.startswith(p) for p in KEEP_PREFIXES):
            continue
        line = line.replace("../assets/patterns/endfield-contour.svg", SVG_URL)
        decls.append(line)
    flarum_sel = (
        '[data-theme^="dark"] body,\n.dark body,\nhtml.dark body,\nbody.dark'
        if is_dark else "body"
    )
    return flarum_sel, decls


out = []
out.append("/*")
out.append(" * cathi-ui -> Flarum 组件桥（终末地背景，编译自 themes/endfield.css 单一来源）")
out.append(" * 由 extend.php 在 endfield.css 之后注入，使 Flarum 继承终末地 contour 科技感背景")
out.append(" * 改背景只需改 themes/endfield.css 后重跑: python tools/gen_flarum_components.py")
out.append(" * 部署还需把 assets/patterns/endfield-contour.svg 拷到 public/assets/endfield-contour.svg")
out.append(" */")

for sel, body in bg_rules:
    flarum_sel, decls = transform(sel, body)
    out.append("")
    out.append(flarum_sel + " {")
    for d in decls:
        out.append("  " + d + ";")
    out.append("}")

OUT.write_text("\n".join(out) + "\n", encoding="utf-8")

print(f"[ok] 抽取背景规则 {len(bg_rules)} 条 -> {OUT}")
print(f"      浅色档: body")
print(f"      深色档: [data-theme^=\"dark\"] body / .dark body / html.dark body / body.dark")
