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

当前切片：
1. 终末地 contour 科技感背景（地形等高线 + 工业网格 + 黄绿能源辉光）
2. 论坛内容区透明/半透明覆盖，让 contour 从 body 透出并覆盖整个视口
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "themes" / "endfield.css"
OUT = ROOT / "flarum-theme-endfield" / "components-bridge.css"
SVG_URL = "/assets/endfield-contour.svg"  # 部署时 contour svg 也要拷到 public/assets/

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


def transform_body_background(sel: str, body: str):
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


# ── 论坛主要容器半透明覆盖：让 body 的 contour 背景完整透出 ───────────────
# 这些选择器覆盖了 forum.css 中常用实色背景区域。
# 颜色引用 tokens-bridge.css 中已导出的 --cathi-* 变量（HSL 分量），并加 alpha。

CONTAINER_SELECTOR = """#app,
.App,
.App-content,
#content,
.container,
.sideNav,
.sideNav--horizontal,
.Dropdown-menu,
.UserCard,
.UserCard-profile,
.Post,
.Post-body,
.Notification,
.Notification-content,
.Modal-header,
.Modal-body,
.Modal-footer,
.Modal-content,
.Composer,
.App-composer,
.Composer-body,
.item-excerpt,
.TagsPage .container,
.DiscussionPage-nav,
.DiscussionPage-stream,
.DiscussionPage-options-dropdown,
.IndexPage-toolbar,
.IndexPage-results,
.UserPage .container"""

CARD_SELECTOR = """.DiscussionListItem,
.DiscussionList-discussions > li,
.DiscussionListItem-content,
.DiscussionListItem-main,
.DiscussionListItem-main:hover,
.DiscussionListItem-main:focus,
.TagsPage .TagTile,
.TagsPage .TagIcon,
.UserPage .UserCard,
.PostStream-item,
.PostStream-item .Post,
.NotificationGroup-content,
.NotificationList .Notification,
.Dropdown-menu > li > a,
.Dropdown-menu > li > button,
.SelectDropdown-list > li > a,
.SelectDropdown-list > li > button"""

COUNT_SELECTOR = """.DiscussionListItem-count,
.Badge,
.UserCard .Badge"""

STICKY_SELECTOR = """.DiscussionListItem--sticky,
.DiscussionListItem--sticky:hover,
[data-theme^="dark"] .DiscussionListItem--sticky,
[data-theme^="dark"] .DiscussionListItem--sticky:hover,
.dark .DiscussionListItem--sticky,
.dark .DiscussionListItem--sticky:hover,
html.dark .DiscussionListItem--sticky,
html.dark .DiscussionListItem--sticky:hover,
body.dark .DiscussionListItem--sticky,
body.dark .DiscussionListItem--sticky:hover"""


DARK_MODES = ('[data-theme^="dark"]', '.dark', 'html.dark', 'body.dark')


def expand_dark(selectors: list[str]):
    """为每个选择器生成 data-theme + .dark + html.dark + body.dark 四组。"""
    out = []
    for s in selectors:
        for dark in DARK_MODES:
            out.append(f"{dark} {s}")
    return out


def build_transparency_block():
    card_selectors = [s.strip() for s in CARD_SELECTOR.split(",") if s.strip()]
    container_selectors = [s.strip() for s in CONTAINER_SELECTOR.split(",") if s.strip()]
    count_selectors = [s.strip() for s in COUNT_SELECTOR.split(",") if s.strip()]
    hover_selectors = [
        ".DiscussionListItem:hover",
        ".DiscussionList-discussions > li:hover",
        ".Dropdown-menu > li > a:hover",
        ".Dropdown-menu > li > button:hover",
        ".sideNav .Dropdown-menu > li.active",
        ".sideNav .Dropdown-menu > li > a:hover",
        ".sideNav .Dropdown-menu > li > button:hover",
        ".Notification:hover",
    ]
    sticky_selectors = [
        ".DiscussionListItem--sticky",
        ".DiscussionListItem--sticky:hover",
    ]

    lines = []
    lines.append("")
    lines.append("/* ── 论坛容器透明/半透明覆盖：让 body contour 完整透出 ── */")
    lines.append("")
    lines.append("/* 顶层布局容器：彻底透明 */")
    lines.append("#app,")
    lines.append(".App,")
    lines.append(".App-content,")
    lines.append("#content,")
    lines.append(".container,")
    lines.append(".sideNavContainer,")
    lines.append(".IndexPage,")
    lines.append(".IndexPage-nav,")
    lines.append(".IndexPage-results,")
    lines.append(".TagsPage,")
    lines.append(".UserPage,")
    lines.append(".DiscussionPage,")
    lines.append(".NotificationsPage { background: transparent !important; }")
    lines.append("")
    lines.append("/* 主要卡片/面板：半透明表面（透出 contour 同时保证可读） */")
    lines.append(",\n".join(card_selectors + container_selectors) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .88) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 深色档：同样 alpha（用四组选择器保证 specificity 赢过 forum.css） */")
    lines.append(",\n".join(expand_dark(card_selectors + container_selectors)) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .88) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* hover / active：稍微更不透明，保持交互反馈 */")
    lines.append(",\n".join(hover_selectors) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .95) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* hover / active 深色档 */")
    lines.append(",\n".join(expand_dark(hover_selectors)) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .95) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* count / badge：次级表面 */")
    lines.append(",\n".join(count_selectors) + " {")
    lines.append("  background: hsl(var(--cathi-muted) / .92) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* count / badge 深色档 */")
    lines.append(",\n".join(expand_dark(count_selectors)) + " {")
    lines.append("  background: hsl(var(--cathi-muted) / .92) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 置顶帖：保留黄绿渐变标识，但背景也半透明透出 contour */")
    lines.append(",\n".join(sticky_selectors) + " {")
    lines.append("  background: linear-gradient(180deg, hsl(var(--cathi-primary) / .22), hsl(var(--cathi-card) / .9)) !important;")
    lines.append("  border-left: 6px solid hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 置顶帖深色档 */")
    lines.append(",\n".join(expand_dark(sticky_selectors)) + " {")
    lines.append("  background: linear-gradient(180deg, hsl(var(--cathi-primary) / .22), hsl(var(--cathi-card) / .9)) !important;")
    lines.append("  border-left: 6px solid hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    return lines


out = []
out.append("/*")
out.append(" * cathi-ui -> Flarum 组件桥（终末地背景，编译自 themes/endfield.css 单一来源）")
out.append(" * 由 extend.php 在 endfield.css 之后注入，使 Flarum 继承终末地 contour 科技感背景")
out.append(" * 改背景只需改 themes/endfield.css 后重跑: python tools/gen_flarum_components.py")
out.append(" * 部署还需把 assets/patterns/endfield-contour.svg 拷到 public/assets/endfield-contour.svg")
out.append(" */")

for sel, body in bg_rules:
    flarum_sel, decls = transform_body_background(sel, body)
    out.append("")
    out.append(flarum_sel + " {")
    for d in decls:
        out.append("  " + d + ";")
    out.append("}")

out.extend(build_transparency_block())

OUT.write_text("\n".join(out) + "\n", encoding="utf-8")

print(f"[ok] 抽取背景规则 {len(bg_rules)} 条 -> {OUT}")
print(f"      浅色档: body")
print(f"      深色档: [data-theme^=\"dark\"] body / .dark body / html.dark body / body.dark")
print(f"      已追加论坛容器半透明覆盖，引用 tokens-bridge 导出的 --cathi-* 变量")
