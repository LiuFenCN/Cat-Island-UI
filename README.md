# Cat Island UI

自研治愈系 CSS 组件库。**AGPL-3.0-or-later 许可，零外部依赖。**
A self-built cozy CSS component library. **AGPL-3.0-or-later, zero external dependencies.**

引入一个 CSS 文件即可使用全部组件。
One CSS file is all it takes to use every component.

[→ 在线预览 Demo](./index.html) · [→ Live preview demo](./index.html)

## 快速开始 · Quick start

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="assets/fonts/nunito.css">

<div class="cathi-root">
  <button class="cathi-btn">Hello</button>
</div>
```

所有组件必须放在 `.cathi-root` 内（它定义了 Design Token）。启用暗色：
All components must live inside `.cathi-root` (it defines the design tokens). Enable dark mode:

```html
<body class="cathi-root cathi-dark"> ... </body>
<!-- 或 / or -->
<body class="cathi-root" data-theme="dark"> ... </body>
```

## 三套主题预设 · Three theme presets

cathi-ui 不只一套皮肤。仓库内置 **3 套主题预设**，都只是「重写同一组语义 token」的 CSS 文件，放在 `cathi-ui.css` **之后**引入即可换肤：
cathi-ui ships more than one skin. **3 theme presets** are bundled — each is simply a CSS file that rewrites the same set of semantic tokens; include it **after** `cathi-ui.css` to switch skins:

| 预设 Preset | 文件 File | 风格 Style | 激活方式 Activation |
|------|------|------|----------|
| 动森 Cozy（默认） | `themes/cozy.css` | 奶油底 + 薄荷绿，治愈圆润 · cream base + mint green, cozy and rounded | `data-theme="cozy"` / `.cathi-theme-cozy` |
| 终末地 Endfield | `themes/endfield.css` | v4.4：浅色工业基+深色炭黑双档；黄绿 chartreuse 主色 + 地形等高线背景 + 斜纹按钮(左侧色块+三角) + `//`/`[]`/虚线头像符号 + 金属细描边 + 等宽读数（字体本地托管） | `data-theme="endfield"` / `.cathi-theme-endfield` |
| 液态玻璃 Liquid Glass | `themes/liquidglass.css` | v4.4：浅色玻璃 + 深色玻璃双档；Inter 字体 + real glass（22px blur + saturate 1.8 + 顶部镜面高光）+ 胶囊控件 + sheen 动效 | `data-theme="liquidglass"` / `.cathi-theme-liquidglass` |

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="themes/cozy.css">
<link rel="stylesheet" href="themes/endfield.css">
<link rel="stylesheet" href="themes/liquidglass.css">

<!-- 切到终末地：给任意祖先节点加 data-theme / class 即可 -->
<!-- switch to Endfield: add data-theme / class to any ancestor node -->
<body class="cathi-root" data-theme="endfield"> ... </body>
```

- 主题预设与「暗色模式」是正交的两套机制：主题决定配色气质，暗色决定明暗。可叠加使用。
- 液态玻璃通过两个专属 token 实现毛玻璃且不影响其它主题：`--cathi-surface-alpha`（表面不透明度 <.62）+ `--cathi-glass-blur`（18px 背景模糊）。
- 三者均经过 puppeteer + Edge 实测：关键 `getComputedStyle` 正确、控制台 0 错误。

- Theme presets and dark mode are two orthogonal mechanisms: the theme decides the palette character, dark mode decides light vs dark. They stack.
- Liquid glass achieves frosted glass through two dedicated tokens without affecting other themes: `--cathi-surface-alpha` (surface opacity < .62) and `--cathi-glass-blur` (18px backdrop blur).
- All three were verified with puppeteer + Edge: key `getComputedStyle` values are correct and the console stays error-free.

## React 适配（shadcn 风格） · React adapter (shadcn-style)

`react/` 是完整 shadcn 式 React 组件子工程（Vite + React 18 + TS）。核心组件写成**可复制的 `.tsx`**，沿用 cathi-ui 的 `cathi-*` class 与语义 token 驱动，零运行时依赖、零 JS 浮层（`<details>` 下拉/手风琴、原生 `<dialog>` 弹窗）。

`react/` is a complete shadcn-style React component subproject (Vite + React 18 + TS). Core components are written as **copy-pasteable `.tsx`**, reusing cathi-ui's `cathi-*` classes and semantic tokens: zero runtime dependencies, zero JS overlays (`<details>` dropdowns/accordions, native `<dialog>` modals).

```bash
cd react
npm install
npm run dev      # 本地预览（含三主题切换 demo） · local preview (with three-theme switching demo)
npm run build    # tsc -b && vite build → dist/
```

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from './components';

<Button data-variant="primary" data-size="lg">动森主按钮</Button>
<div data-theme="liquidglass">  {/* 局部切主题 · switch theme locally */}
  <Card><CardHeader><CardTitle>毛玻璃卡片</CardTitle></CardHeader>
    <CardContent>...</CardContent></Card>
</div>
```

组件清单（24 个原语）：Button / Card / Input / Textarea / Select / Label / Field / Checkbox / Radio / Option / Switch / Slider / Separator / Badge / Tag / Spinner / Kbd / Skeleton / Alert / Progress / Avatar / AvatarGroup / Empty / Breadcrumb / Tooltip / Table / Toggle / ToggleGroup / Dropdown / Dialog / Sheet / Accordion / Tabs。详见 `react/src/components/`。

Component list (24 primitives): Button / Card / Input / Textarea / Select / Label / Field / Checkbox / Radio / Option / Switch / Slider / Separator / Badge / Tag / Spinner / Kbd / Skeleton / Alert / Progress / Avatar / AvatarGroup / Empty / Breadcrumb / Tooltip / Table / Toggle / ToggleGroup / Dropdown / Dialog / Sheet / Accordion / Tabs. See `react/src/components/`.

## Flarum 主题桥接（endfield / liquidglass） · Flarum theme bridge (endfield / liquidglass)

cathi-ui 的 token 是框架无关的纯 CSS。Flarum 主题的 DOM 由 Mithril 渲染、无法加 `.cathi-*` class，因此用「**token 桥**」把 cathi-ui 的 `--cathi-*` 编译成 Flarum 原生变量（`--primary-color` / `--body-bg` / `--button-primary-bg` …），由主题扩展的 `extend.php` 在 `forum.css` 之后注入，**不改动线上 `forum.css`**。

cathi-ui's tokens are framework-agnostic pure CSS. Flarum theme DOM is rendered by Mithril and cannot take `.cathi-*` classes, so a **token bridge** compiles cathi-ui's `--cathi-*` into native Flarum variables (`--primary-color` / `--body-bg` / `--button-primary-bg` …), injected by the theme extension's `extend.php` right after `forum.css` — **the live `forum.css` stays untouched**.

```bash
# 1) 改色只动单一来源 src/tokens.css 的 endfield 浅/深两块，然后重跑生成器：
#    recolor only the endfield light/dark blocks in src/tokens.css, then re-run the generator:
python tools/gen_flarum_tokens.py
# 2) 生成物 flarum-theme-endfield/tokens-bridge.css 复制到论坛 public/assets/
#    copy the generated flarum-theme-endfield/tokens-bridge.css to the forum's public/assets/
cp flarum-theme-endfield/tokens-bridge.css \
   <flarum>/public/assets/endfield-tokens.css
# 3) extend.php 在 endfield.css 之后注入桥（独立 <link>，须晚于 forum.css 才能覆盖）：
#    extend.php injects the bridge after endfield.css (separate <link>, must come after forum.css to override):
#     $document->head[] = '<link rel="stylesheet" href="/assets/endfield.css?v=22">';
#     $document->head[] = '<link rel="stylesheet" href="/assets/endfield-tokens.css?v=1">';
# 4) 改色后重新 cp + 把 ?v=1 改成 ?v=2 破缓存即可。
#    after recoloring, re-cp and bump ?v=1 to ?v=2 to bust the cache.
```

桥的作用域是 Flarum 原生选择器 `:root`（浅）+ `[data-theme^="dark"]`（深）——终末地扩展只给 `<html>` 设 `data-theme="dark"`，不设 `data-theme="endfield"`，故桥不能用 `[data-theme="endfield"]` 作用域。生成器见 `tools/gen_flarum_tokens.py`，映射表（Flarum 变量 ← cathi token）集中在该文件顶部 `MAP`，需要微调（如 secondary 色）改 `MAP` 重跑即可。

The bridge scopes to the native Flarum selectors `:root` (light) + `[data-theme^="dark"]` (dark) — the Endfield extension only sets `data-theme="dark"` on `<html>`, never `data-theme="endfield"`, so the bridge cannot use a `[data-theme="endfield"]` scope. The generator lives in `tools/gen_flarum_tokens.py`; the mapping table (Flarum variable ← cathi token) is the `MAP` at the top of that file — tweak `MAP` (e.g. the secondary color) and re-run.

## v4 新版重点 · v4 highlights

- **shadcn 风格 Token 架构**（HSL 通道值 + 透明度修饰符 + 单一圆角基准）
- **`@layer` 级联层**，业务未分层 CSS 自动胜出
- **18 个 shadcn 对齐新组件**：Separator / Skeleton / Spinner / Alert / Checkbox / Radio / Slider / Table / Kbd / Tooltip / Dialog / Sheet / Accordion / Breadcrumb / Empty / Toggle / DropdownMenu / ScrollArea …
- **data 属性 API**（`data-variant` / `data-size` / `data-state`）与 BEM 类并存
- **a11y**：统一 focus ring / `:disabled` / `aria-invalid` / `prefers-reduced-motion`
- 完整组件清单与 v3→v4 迁移见 [`README-CATHI-UI.md`](./README-CATHI-UI.md)

- **shadcn-style token architecture** (HSL channel values + opacity modifiers + a single radius base)
- **`@layer` cascade layers** — unlayered business CSS wins automatically
- **18 new shadcn-aligned components**: Separator / Skeleton / Spinner / Alert / Checkbox / Radio / Slider / Table / Kbd / Tooltip / Dialog / Sheet / Accordion / Breadcrumb / Empty / Toggle / DropdownMenu / ScrollArea …
- **data-attribute API** (`data-variant` / `data-size` / `data-state`) alongside BEM classes
- **a11y**: unified focus ring / `:disabled` / `aria-invalid` / `prefers-reduced-motion`
- Full component list and the v3→v4 migration guide: [`README-CATHI-UI.md`](./README-CATHI-UI.md)

## 组件清单 · Component list

| 分类 Category | 组件 Component | 说明 Description |
|------|------|------|
| 基础 Basic | `.cathi-btn` | 按钮（5 色 + 5 variant + 3 尺寸，含 data-variant API） · button (5 colors + 5 variants + 3 sizes, with data-variant API) |
| 基础 Basic | `.cathi-card` | 圆角卡片（4 variant + header / body / footer 插槽） · rounded card (4 variants + header/body/footer slots) |
| 基础 Basic | `.cathi-tag` | 标签（7 variant + 描边） · tag (7 variants + outline) |
| 基础 Basic | `.cathi-avatar` / `.cathi-avatar-group` | 头像 / 头像组 · avatar / avatar group |
| 表单 Form | `.cathi-input` / `.cathi-textarea` / `.cathi-select` | 表单（带 aria-invalid 态） · form controls (with aria-invalid state) |
| 表单 Form | `.cathi-checkbox` / `.cathi-radio` | 复选 / 单选（含 `:indeterminate`） · checkbox / radio (incl. `:indeterminate`) |
| 表单 Form | `.cathi-slider` | 滑块（跨浏览器） · slider (cross-browser) |
| 表单 Form | `.cathi-switch` | 开关（iOS 风格） · switch (iOS style) |
| 表单 Form | `.cathi-radio-pills` | 药丸单选组 · pill radio group |
| 表单 Form | `.cathi-numpad` | 数字键盘 · numeric keypad |
| 表单 Form | `.cathi-icon-grid` | 图标网格选择器 · icon grid picker |
| 表单 Form | `.cathi-search-bar` | 搜索栏 · search bar |
| 反馈 Feedback | `.cathi-alert` | 提示条（5 语义 variant） · alert (5 semantic variants) |
| 反馈 Feedback | `.cathi-progress` | 进度条（直线 / 条纹） · progress bar (solid / striped) |
| 反馈 Feedback | `.cathi-toast` | Toast 通知 · toast notification |
| 反馈 Feedback | `.cathi-badge` | 数字角标 / 状态点 · numeric badge / status dot |
| 反馈 Feedback | `.cathi-skeleton` / `.cathi-spinner` | 骨架屏 / 加载圈 · skeleton / spinner |
| 反馈 Feedback | `.cathi-separator` | 分隔线（横 / 竖） · separator (horizontal / vertical) |
| 反馈 Feedback | `.cathi-kbd` | 键盘按键 · keyboard key |
| 浮层 Overlay | `.cathi-tooltip` | 气泡（4 side，纯 CSS） · tooltip (4 sides, pure CSS) |
| 浮层 Overlay | `.cathi-dropdown` | 下拉（details，零 JS） · dropdown (details, zero JS) |
| 浮层 Overlay | `.cathi-dialog` / `.cathi-sheet` | 对话框 / 抽屉（原生 `<dialog>`） · dialog / sheet (native `<dialog>`) |
| 浮层 Overlay | `.cathi-accordion` | 手风琴（details） · accordion (details) |
| 浮层 Overlay | `.cathi-toggle` / `.cathi-toggle-group` | 切换按钮组 · toggle button group |
| 数据 Data | `.cathi-table` | 表格（含 thead / tfoot / hover） · table (with thead/tfoot/hover) |
| 数据 Data | `.cathi-radar` | SVG 五维雷达图 · SVG five-axis radar chart |
| 数据 Data | `.cathi-relation-bar` | 关系进度条 · relation progress bar |
| 数据 Data | `.cathi-breadcrumb` | 面包屑 · breadcrumb |
| 数据 Data | `.cathi-empty` | 空状态 · empty state |
| 展示 Display | `.cathi-char-card` | 角色卡（6 色性格，含雷达图） · character card (6 personality colors, with radar chart) |
| 展示 Display | `.cathi-ribbon` | 燕尾 Ribbon 角标 · swallow-tail ribbon corner |
| 展示 Display | `.cathi-note` | 便签纸（4 色） · sticky note (4 colors) |
| 展示 Display | `.cathi-window` | 窗口框架（macOS 风格标题栏） · window frame (macOS-style title bar) |
| 展示 Display | `.cathi-time-display` | 时间显示（数字时钟） · time display (digital clock) |
| 展示 Display | `.cathi-scroll-area` / `.cathi-aspect-ratio` | 滚动区 / 比例容器 · scroll area / aspect-ratio container |
| 导航 Nav | `.cathi-sidebar` | 侧边导航栏 · sidebar navigation |
| 导航 Nav | `.cathi-tabs` | 标签页切换 · tab switching |
| 导航 Nav | `.cathi-tabbar` | 移动端底部 Tab Bar · mobile bottom tab bar |
| 布局 Layout | `.cathi-task-item` | 任务项（勾选状态） · task item (checked state) |
| 布局 Layout | `.cathi-settings-panel` | 设置面板分组 · settings panel group |
| 布局 Layout | `.cathi-action-group` | 操作按钮组 · action button group |
| 布局 Layout | `.cathi-list` | iOS 风格设置列表项 · iOS-style settings list item |
| 主题预设 Theme presets | `data-theme="cozy\|endfield\|liquidglass"` / `.cathi-theme-X` | 三套主题：动森(默认) / 终末地 / 液态玻璃 · three themes: Cozy (default) / Endfield / Liquid Glass |
| 暗色 Dark | `data-dark`（推荐，与 `data-theme` 同元素）/ `.cathi-dark` / `.cathi-theme-dark` / `.cathi-theme-X.cathi-dark` / `data-theme="dark"` | 全局暗色（任选其一，独立于主题预设，与三套主题正交叠加） · global dark mode (pick one; independent of theme presets, stacks orthogonally with all three) |

## Design Token

v4 改用三层架构（原始色板 → 语义 token → 组件），完整列表与自定义示例见 [`README-CATHI-UI.md`](./README-CATHI-UI.md#-设计-tokenv4-语义层)。

v4 adopts a three-layer architecture (raw palette → semantic tokens → components). The full list and customization examples: [`README-CATHI-UI.md`](./README-CATHI-UI.md#-设计-tokenv4-语义层).

快速换主色（HSL 通道值）：
Quick primary-color swap (HSL channel values):

```css
:root, .cathi-root {
  --cathi-primary: 280 80% 55%;   /* 紫色 · purple */
  --cathi-mint-500: 280 80% 55%;
  --cathi-mint-700: 280 90% 38%;
  --cathi-ring: 280 80% 55%;
}
```

## 字体 · Fonts

默认使用 **Nunito**（SIL Open Font License，已随仓库本地托管于 `assets/fonts/`）。无需任何外部 CDN：
The default font is **Nunito** (SIL Open Font License, self-hosted in `assets/fonts/`). No external CDN needed:

```html
<link rel="stylesheet" href="assets/fonts/nunito.css">
```

## 浏览器支持 · Browser support

现代浏览器（Chrome / Firefox / Safari / Edge 近两个版本）。雷达图组件依赖 SVG。
Modern browsers (recent two versions of Chrome / Firefox / Safari / Edge). The radar chart component requires SVG.

## 商城扩展（Formisle Shop Kit） · Shop extension (Formisle Shop Kit)

`formisle/` 是「形屿 FORMISLE」治愈风 3D 资产商城的组件扩展层，**构建在 Cat-Island-UI 之上**：
复用本库全部设计令牌，仅补充商城场景的语义令牌与组件类（作品卡 / 订单行 / 退款药丸 /
进度时间线 / 表单面板等）。含可运行 `demo.html`、组件规范 `COMPONENTS.md`、经验手册
`EXPERIENCE.md` 与多格式令牌（`design-tokens.json` / `tailwind.theme.js`）。

`formisle/` is the component extension layer for "形屿 FORMISLE", a cozy-style 3D asset marketplace, **built on top of Cat-Island-UI**: it reuses every design token of this library and only adds marketplace-specific semantic tokens and component classes (artwork card / order row / refund pill / progress timeline / form panel…). It ships a runnable `demo.html`, the component spec `COMPONENTS.md`, an experience handbook `EXPERIENCE.md` and multi-format tokens (`design-tokens.json` / `tailwind.theme.js`).

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="formisle/formisle-shop.css">
<div class="cathi-root formisle-root"> ... </div>
```

详见 [`formisle/README.md`](./formisle/README.md)。
See [`formisle/README.md`](./formisle/README.md).

## License

AGPL-3.0-or-later（GNU Affero 通用公共许可证 v3.0 或更高版本）。可自由使用、修改与商用；但若你修改后对外提供服务（网络服务），必须以相同许可开源你的改动。完整条款见仓库 `LICENSE` 文件。

AGPL-3.0-or-later (GNU Affero General Public License v3.0 or later). Free to use, modify and commercialize; however, if you modify it and offer it to others as a (network) service, your changes must be released under the same license. Full terms in the repository's `LICENSE` file.

> React 适配层基于 [shadcn/ui](https://ui.shadcn.com)（MIT）的组件设计思路重写，见 `NOTICE`。
> The React adapter is a rewrite based on the component design ideas of [shadcn/ui](https://ui.shadcn.com) (MIT); see `NOTICE`.

---

## 联系作者 / Contact

| 渠道 Channel | 地址 Address |
|---|---|
| 🏝️ 论坛（CatIsland） | https://bbs.cathi.cn |
| 💬 QQ 交流群 | 369748859 |
| 📮 邮箱 | 792818521@qq.com |
