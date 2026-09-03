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

CONTAINER_SELECTOR = """.sideNav,
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
.DiscussionPage-options-dropdown"""

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
    lines.append(".IndexPage-toolbar,")
    lines.append(".TagsPage,")
    lines.append(".TagsPage .container,")
    lines.append(".UserPage,")
    lines.append(".UserPage .container,")
    lines.append(".DiscussionPage,")
    lines.append(".DiscussionPage-nav,")
    lines.append(".DiscussionPage-stream,")
    lines.append(".NotificationsPage { background: transparent !important; }")
    lines.append("")
    lines.append("/* 主要卡片/面板：半透明表面（透出 contour 同时保证可读） */")
    lines.append(",\n".join(card_selectors + container_selectors) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .72) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 深色档：同样 alpha（用四组选择器保证 specificity 赢过 forum.css） */")
    lines.append(",\n".join(expand_dark(card_selectors + container_selectors)) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .72) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* hover / active：稍微更不透明，保持交互反馈 */")
    lines.append(",\n".join(hover_selectors) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .85) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* hover / active 深色档 */")
    lines.append(",\n".join(expand_dark(hover_selectors)) + " {")
    lines.append("  background: hsl(var(--cathi-card) / .85) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* count / badge：次级表面 */")
    lines.append(",\n".join(count_selectors) + " {")
    lines.append("  background: hsl(var(--cathi-muted) / .85) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* count / badge 深色档 */")
    lines.append(",\n".join(expand_dark(count_selectors)) + " {")
    lines.append("  background: hsl(var(--cathi-muted) / .85) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 置顶帖：保留黄绿渐变标识，但背景也半透明透出 contour */")
    lines.append(",\n".join(sticky_selectors) + " {")
    lines.append("  background: linear-gradient(180deg, hsl(var(--cathi-primary) / .22), hsl(var(--cathi-card) / .78)) !important;")
    lines.append("  border-left: 6px solid hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 置顶帖深色档 */")
    lines.append(",\n".join(expand_dark(sticky_selectors)) + " {")
    lines.append("  background: linear-gradient(180deg, hsl(var(--cathi-primary) / .22), hsl(var(--cathi-card) / .78)) !important;")
    lines.append("  border-left: 6px solid hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* Hero / Widget：去掉 forum.css 的实心背景 + 偏移阴影矩形，让 contour 透上来 */")
    lines.append(".Hero,")
    lines.append(".WelcomeHero,")
    lines.append(".TagHero,")
    lines.append(".WidgetsContainer .Widget,")
    lines.append(".Widget-content,")
    lines.append(".item-widget,")
    lines.append(".FofWidgets-Widget-content,")
    lines.append(".NotificationList,")
    lines.append(".NotificationGroup,")
    lines.append(".NotificationGroup-header,")
    lines.append(".NotificationList-header,")
    lines.append(".NotificationGroup-content,")
    lines.append(".App-footer {")
    lines.append("  background: transparent !important;")
    lines.append("  border: none !important;")
    lines.append("  box-shadow: none !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 覆盖 forum.css 底部硬编码的柠檬黄，改回 chartreuse/白 */")
    lines.append(".Hero,")
    lines.append(".WelcomeHero,")
    lines.append(".Hero h1,")
    lines.append(".Hero h2,")
    lines.append(".Hero-title,")
    lines.append(".WelcomeHero .Hero-title {")
    lines.append("  color: hsl(var(--cathi-foreground)) !important;")
    lines.append("  text-shadow: none !important;")
    lines.append("}")
    lines.append(".Hero-subtitle,")
    lines.append(".WelcomeHero .Hero-subtitle {")
    lines.append("  color: hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append(".Hero::before,")
    lines.append(".WelcomeHero::before {")
    lines.append("  background: repeating-linear-gradient(45deg, transparent 0, transparent 24px, hsl(var(--cathi-primary) / .06) 24px, hsl(var(--cathi-primary) / .06) 48px) !important;")
    lines.append("}")
    lines.append("header .Header-secondary .Button--link:hover,")
    lines.append("header .Header-secondary .Dropdown-toggle:hover,")
    lines.append("header .Button--icon:hover,")
    lines.append(".Hero .Hero-close.Button--icon:hover {")
    lines.append("  color: hsl(var(--cathi-primary-foreground)) !important;")
    lines.append("  background: hsl(var(--cathi-primary)) !important;")
    lines.append("  border-color: hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 深色档：同上 */")
    lines.append('[data-theme^="dark"] .Hero,')
    lines.append('[data-theme^="dark"] .WelcomeHero,')
    lines.append('[data-theme^="dark"] .TagHero,')
    lines.append('[data-theme^="dark"] .WidgetsContainer .Widget,')
    lines.append('[data-theme^="dark"] .Widget-content,')
    lines.append('[data-theme^="dark"] .item-widget,')
    lines.append('[data-theme^="dark"] .FofWidgets-Widget-content,')
    lines.append('[data-theme^="dark"] .NotificationList,')
    lines.append('[data-theme^="dark"] .NotificationGroup,')
    lines.append('[data-theme^="dark"] .NotificationGroup-header,')
    lines.append('[data-theme^="dark"] .NotificationList-header,')
    lines.append('[data-theme^="dark"] .NotificationGroup-content,')
    lines.append('[data-theme^="dark"] .App-footer {')
    lines.append("  background: transparent !important;")
    lines.append("  border: none !important;")
    lines.append("  box-shadow: none !important;")
    lines.append("}")
    lines.append('[data-theme^="dark"] .Hero,')
    lines.append('[data-theme^="dark"] .WelcomeHero,')
    lines.append('[data-theme^="dark"] .Hero h1,')
    lines.append('[data-theme^="dark"] .Hero h2,')
    lines.append('[data-theme^="dark"] .Hero-title,')
    lines.append('[data-theme^="dark"] .WelcomeHero .Hero-title {')
    lines.append("  color: hsl(var(--cathi-foreground)) !important;")
    lines.append("  text-shadow: none !important;")
    lines.append("}")
    lines.append('[data-theme^="dark"] .Hero-subtitle,')
    lines.append('[data-theme^="dark"] .WelcomeHero .Hero-subtitle {')
    lines.append("  color: hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append('[data-theme^="dark"] .Hero::before,')
    lines.append('[data-theme^="dark"] .WelcomeHero::before {')
    lines.append("  background: repeating-linear-gradient(45deg, transparent 0, transparent 24px, hsl(var(--cathi-primary) / .06) 24px, hsl(var(--cathi-primary) / .06) 48px) !important;")
    lines.append("}")
    lines.append('[data-theme^="dark"] header .Header-secondary .Button--link:hover,')
    lines.append('[data-theme^="dark"] header .Header-secondary .Dropdown-toggle:hover,')
    lines.append('[data-theme^="dark"] header .Button--icon:hover,')
    lines.append('[data-theme^="dark"] .Hero .Hero-close.Button--icon:hover {')
    lines.append("  color: hsl(var(--cathi-primary-foreground)) !important;")
    lines.append("  background: hsl(var(--cathi-primary)) !important;")
    lines.append("  border-color: hsl(var(--cathi-primary)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* ── 对比度修复：透明/半透明表面上的文字必须可读 ── */")
    lines.append("/* 提高 specificity（body 前缀）强制外层卡片半透明，抵消 forum.css 的 transparent */")
    lines.append("body .DiscussionListItem,")
    lines.append("body .DiscussionList-discussions > li,")
    lines.append("body .DiscussionListItem-content,")
    lines.append("body .DiscussionListItem-main,")
    lines.append("body .DiscussionListItem-main:hover,")
    lines.append("body .DiscussionListItem-main:focus,")
    lines.append("body .sideNav,")
    lines.append("body .sideNav--horizontal,")
    lines.append("body .Dropdown-menu,")
    lines.append("body .UserCard,")
    lines.append("body .UserCard-profile,")
    lines.append("body .Post,")
    lines.append("body .Post-body,")
    lines.append("body .Notification,")
    lines.append("body .Notification-content,")
    lines.append("body .Modal-header,")
    lines.append("body .Modal-body,")
    lines.append("body .Modal-footer,")
    lines.append("body .Modal-content,")
    lines.append("body .Composer,")
    lines.append("body .App-composer,")
    lines.append("body .Composer-body,")
    lines.append("body .item-excerpt,")
    lines.append("body .DiscussionPage-options-dropdown,")
    lines.append("body .TagsPage .TagTile,")
    lines.append("body .TagsPage .TagIcon,")
    lines.append("body .UserPage .UserCard,")
    lines.append("body .PostStream-item,")
    lines.append("body .PostStream-item .Post,")
    lines.append("body .NotificationGroup-content,")
    lines.append("body .NotificationList .Notification,")
    lines.append("body .Dropdown-menu > li > a,")
    lines.append("body .Dropdown-menu > li > button,")
    lines.append("body .SelectDropdown-list > li > a,")
    lines.append("body .SelectDropdown-list > li > button {")
    lines.append("  background: hsl(var(--cathi-card) / .82) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 文字色统一提亮，避免 forum.css 默认灰/棕色在深色 contour 上失踪 */")
    lines.append("body .DiscussionListItem-title,")
    lines.append("body .DiscussionListItem .DiscussionListItem-info,")
    lines.append("body .DiscussionListItem .DiscussionListItem-info .username,")
    lines.append("body .DiscussionListItem .DiscussionListItem-info > span,")
    lines.append("body .DiscussionListItem .DiscussionListItem-info > a,")
    lines.append("body .DiscussionListItem-stats-item,")
    lines.append("body .sideNav > li > a,")
    lines.append("body .sideNav > li > button,")
    lines.append("body .sideNav .Dropdown-menu > li > a,")
    lines.append("body .sideNav .Dropdown-menu > li > button,")
    lines.append("body .sideNav .Dropdown-menu > li.active > a,")
    lines.append("body .Dropdown-menu > li > a,")
    lines.append("body .Dropdown-menu > li > button,")
    lines.append("body .SelectDropdown-list > li > a,")
    lines.append("body .SelectDropdown-list > li > button,")
    lines.append("body .TagLabel:not(.colored),")
    lines.append("body .DiscussionListItem-count,")
    lines.append("body .Badge,")
    lines.append("body .App-footer,")
    lines.append("body .App-footer a,")
    lines.append("body .App-footer span,")
    lines.append("body .App-footer li,")
    lines.append("body .App-footer p {")
    lines.append("  color: hsl(var(--cathi-foreground)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* footer 单独加一条半透明底栏，避免压 contour 看不清 */")
    lines.append("body .App-footer,")
    lines.append("body .App-footer a,")
    lines.append("body .App-footer span,")
    lines.append("body .App-footer li,")
    lines.append("body .App-footer p {")
    lines.append("  background: hsl(var(--cathi-card) / .9) !important;")
    lines.append("  color: hsl(var(--cathi-foreground)) !important;")
    lines.append("}")
    lines.append("")
    lines.append("/* 深色档：同上 */")
    lines.append('[data-theme^="dark"] body .DiscussionListItem,')
    lines.append('[data-theme^="dark"] body .DiscussionList-discussions > li,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem-content,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem-main,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem-main:hover,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem-main:focus,')
    lines.append('[data-theme^="dark"] body .sideNav,')
    lines.append('[data-theme^="dark"] body .sideNav--horizontal,')
    lines.append('[data-theme^="dark"] body .Dropdown-menu,')
    lines.append('[data-theme^="dark"] body .UserCard,')
    lines.append('[data-theme^="dark"] body .UserCard-profile,')
    lines.append('[data-theme^="dark"] body .Post,')
    lines.append('[data-theme^="dark"] body .Post-body,')
    lines.append('[data-theme^="dark"] body .Notification,')
    lines.append('[data-theme^="dark"] body .Notification-content,')
    lines.append('[data-theme^="dark"] body .Modal-header,')
    lines.append('[data-theme^="dark"] body .Modal-body,')
    lines.append('[data-theme^="dark"] body .Modal-footer,')
    lines.append('[data-theme^="dark"] body .Modal-content,')
    lines.append('[data-theme^="dark"] body .Composer,')
    lines.append('[data-theme^="dark"] body .App-composer,')
    lines.append('[data-theme^="dark"] body .Composer-body,')
    lines.append('[data-theme^="dark"] body .item-excerpt,')
    lines.append('[data-theme^="dark"] body .DiscussionPage-options-dropdown,')
    lines.append('[data-theme^="dark"] body .TagsPage .TagTile,')
    lines.append('[data-theme^="dark"] body .TagsPage .TagIcon,')
    lines.append('[data-theme^="dark"] body .UserPage .UserCard,')
    lines.append('[data-theme^="dark"] body .PostStream-item,')
    lines.append('[data-theme^="dark"] body .PostStream-item .Post,')
    lines.append('[data-theme^="dark"] body .NotificationGroup-content,')
    lines.append('[data-theme^="dark"] body .NotificationList .Notification,')
    lines.append('[data-theme^="dark"] body .Dropdown-menu > li > a,')
    lines.append('[data-theme^="dark"] body .Dropdown-menu > li > button,')
    lines.append('[data-theme^="dark"] body .SelectDropdown-list > li > a,')
    lines.append('[data-theme^="dark"] body .SelectDropdown-list > li > button {')
    lines.append("  background: hsl(var(--cathi-card) / .82) !important;")
    lines.append("}")
    lines.append("")
    lines.append('[data-theme^="dark"] body .DiscussionListItem-title,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem .DiscussionListItem-info,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem .DiscussionListItem-info .username,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem .DiscussionListItem-info > span,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem .DiscussionListItem-info > a,')
    lines.append('[data-theme^="dark"] body .DiscussionListItem-stats-item,')
    lines.append('[data-theme^="dark"] body .sideNav > li > a,')
    lines.append('[data-theme^="dark"] body .sideNav > li > button,')
    lines.append('[data-theme^="dark"] body .sideNav .Dropdown-menu > li > a,')
    lines.append('[data-theme^="dark"] body .sideNav .Dropdown-menu > li > button,')
    lines.append('[data-theme^="dark"] body .sideNav .Dropdown-menu > li.active > a,')
    lines.append('[data-theme^="dark"] body .Dropdown-menu > li > a,')
    lines.append('[data-theme^="dark"] body .Dropdown-menu > li > button,')
    lines.append('[data-theme^="dark"] body .SelectDropdown-list > li > a,')
    lines.append('[data-theme^="dark"] body .SelectDropdown-list > li > button,')
    lines.append('[data-theme^="dark"] body .TagLabel:not(.colored),')
    lines.append('[data-theme^="dark"] body .DiscussionListItem-count,')
    lines.append('[data-theme^="dark"] body .Badge,')
    lines.append('[data-theme^="dark"] body .App-footer,')
    lines.append('[data-theme^="dark"] body .App-footer a,')
    lines.append('[data-theme^="dark"] body .App-footer span,')
    lines.append('[data-theme^="dark"] body .App-footer li,')
    lines.append('[data-theme^="dark"] body .App-footer p {')
    lines.append("  color: hsl(var(--cathi-foreground)) !important;")
    lines.append("}")
    lines.append("")
    lines.append('[data-theme^="dark"] body .App-footer,')
    lines.append('[data-theme^="dark"] body .App-footer a,')
    lines.append('[data-theme^="dark"] body .App-footer span,')
    lines.append('[data-theme^="dark"] body .App-footer li,')
    lines.append('[data-theme^="dark"] body .App-footer p {')
    lines.append("  background: hsl(var(--cathi-card) / .9) !important;")
    lines.append("  color: hsl(var(--cathi-foreground)) !important;")
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
