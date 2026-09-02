# 🐱 Cat Island UI (cathi-ui)

**自研治愈系（cozy）UI 设计系统** — 纯手写 CSS 组件库，零依赖。

> 灵感来自温暖、圆润、治愈的视觉风格。所有代码 100% 手写，不依赖任何第三方 UI 库源码。
> 授权：CC BY-NC 4.0（**非商业**），见仓库根目录 `LICENSE`。

## ✨ v4 重大升级

- **shadcn 风格 Token 架构**：原始色板（HSL 通道值）→ 语义 token → 组件，三层解耦
- **透明度修饰符**：可写 `hsl(var(--cathi-primary) / .14)`，一个变量派生整组层级
- **暗色模式**：同一组语义变量换值，class 切换（`.cathi-dark` / `.cathi-theme-dark` / `data-theme="dark"`）
- **`@layer` 级联层**：业务未分层 CSS 永远胜出，覆写无需 `!important`
- **shadcn 对齐 18 个新组件**：Separator / Skeleton / Spinner / Alert / Checkbox / Radio / Slider / Table / Kbd / Tooltip / Dialog / Sheet / Accordion / Breadcrumb / Empty / Toggle / ToggleGroup / DropdownMenu / ScrollArea / AspectRatio
- **data 属性 API**：`data-variant` / `data-size` / `data-state` / `aria-pressed` 与 BEM 类并存
- **a11y**：统一 focus ring、`:disabled` 态、`aria-invalid` 红框、`prefers-reduced-motion` 降级

## 🎨 设计 Token（v4 语义层）

| 语义名（HSL 通道） | 含义 | 范例用法 |
|---|---|---|
| `--cathi-background` / `-foreground` | 页面底色与文字 | `body { background: hsl(var(--cathi-background)) }` |
| `--cathi-card` / `-card-foreground` | 卡片表面 | `.cathi-card { background: hsl(var(--cathi-card)) }` |
| `--cathi-popover` / `-popover-foreground` | 浮层 | `.cathi-dropdown__menu { background: hsl(var(--cathi-popover)) }` |
| `--cathi-primary` / `-primary-foreground` | 品牌主色 + 上层文字 | `background: hsl(var(--cathi-primary) / .14)` |
| `--cathi-secondary` / `-secondary-foreground` | 次按钮 / 弱表面 | |
| `--cathi-muted` / `-muted-foreground` | 静默区 / 辅助文字 | |
| `--cathi-accent` / `-accent-foreground` | hover / 激活底色 | |
| `--cathi-destructive` / `-foreground` | 危险操作 | |
| `--cathi-success` / `-warning` / `-info` | 状态色（v4 扩展） | |
| `--cathi-border` | 默认描边 | |
| `--cathi-input` | 表单控件描边 | |
| `--cathi-ring` | focus 环 | `outline: 3px solid hsl(var(--cathi-ring) / .55)` |
| `--cathi-radius` | 全局圆角基准 | `calc(--cathi-radius - .75rem)` |

## 🎨 三套主题预设（Themes）

cathi-ui 内置 **3 套主题预设**，机制与 shadcn 的 `:root` 变量覆盖一致：每个预设都是一个 CSS 文件，放在 `cathi-ui.css` **之后**引入，重写同一组语义 token 即可整站换肤。

| 预设 | 文件 | 风格 | 激活 |
|------|------|------|------|
| 动森 Cozy（默认） | `themes/cozy.css` | 奶油底 + 薄荷绿，治愈圆润 | `data-theme="cozy"` / `.cathi-theme-cozy` |
| 终末地 Endfield | `themes/endfield.css` | v4.3：黄绿 chartreuse 主色 + 地形等高线背景 + 斜纹按钮(左侧色块+三角) + `//`/`[]`/虚线头像符号 + 金属细描边 + 等宽读数（字体本地托管） | `data-theme="endfield"` / `.cathi-theme-endfield` |
| 液态玻璃 Liquid Glass | `themes/liquidglass.css` | v4.2 全量重做：Inter 字体 + real glass（22px blur + saturate 1.8 + 顶部镜面高光）+ 胶囊控件 + sheen 动效 | `data-theme="liquidglass"` / `.cathi-theme-liquidglass` |

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="themes/cozy.css">
<link rel="stylesheet" href="themes/endfield.css">
<link rel="stylesheet" href="themes/liquidglass.css">

<body class="cathi-root" data-theme="endfield"> ... </body>
```

**换肤彻底的关键 token**（v4.1 新增 / 修正）：

- `--cathi-primary-active`：按压态 / 深一档主色，随主题变（替代原先硬编码的 `--cathi-mint-700`）。按钮按压、进度条渐变、Alert 强调色全部改用它，否则换肤会失效。
- `--cathi-surface-alpha`：表面不透明度，默认 `1`；液态玻璃设为 `.62`。
- `--cathi-glass-blur`：背景模糊值，默认 `0px`；液态玻璃设为 `18px`。卡片 / 浮层 / 弹窗用 `hsl(var(--cathi-card) / var(--cathi-surface-alpha))` + `backdrop-filter: blur(var(--cathi-glass-blur))`，因此毛玻璃只影响液态玻璃，其余主题无感。

主题预设与「暗色模式」正交：主题决定配色气质，暗色决定明暗，可叠加。三套均已用 puppeteer + Edge 实测关键 `getComputedStyle`（endfield 按钮 `rgb(255,201,41)`、liquidglass 卡片 `rgba(255,255,255,.62)` + `blur(18px)`），控制台 0 错误。

## ⚛️ React 适配（shadcn 风格）

`react/` 是完整 shadcn 式 React 组件子工程（Vite + React 18 + TypeScript）。设计原则与 shadcn/ui 一致——**组件即源码，可复制进你的项目**，由 cathi-ui 的 class + 语义 token 驱动，不绑定任何运行时：

- `cn()` 合并 className，`forwardRef` 原语组件，`data-variant` / `data-size` 映射 cathi-ui class
- 零 JS 浮层：`<details>` 实现 Dropdown / Accordion，原生 `<dialog>` 实现 Dialog / Sheet
- 24 个原语（Button / Card / Input / Label / Checkbox / Radio / Switch / Slider / Separator / Badge / Tag / Spinner / Kbd / Skeleton / Alert / Progress / Avatar / Empty / Breadcrumb / Tooltip / Table / Toggle / Dropdown / Dialog / Sheet / Accordion / Tabs），统一从 `react/src/components/index.ts` 导出
- `react/src/App.tsx` 是带三主题切换的演示页（动森 / 终末地 / 液态玻璃 / 暗色）

```bash
cd react
npm install
npm run dev      # 本地预览（含三主题切换 demo）
npm run build    # tsc -b && vite build → react/dist/
```

`react/src/styles.css` 通过 `../../` 引用仓库根 CSS 与主题：

```css
@import url('../../cathi-ui.css');
@import url('../../themes/cozy.css');
@import url('../../themes/endfield.css');
@import url('../../themes/liquidglass.css');
```

> 发布产物 `react/dist/` 与 `react/node_modules/` 已在 `.gitignore` 中排除，仓库只存源码。

## 🚀 快速使用

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="assets/fonts/nunito.css">

<div class="cathi-root">
  <button class="cathi-btn">主按钮</button>
  <div class="cathi-card">
    <h3 class="cathi-card__title">卡片标题</h3>
    <p>内容…</p>
  </div>
</div>
```

启用暗色模式（任一即可）：

```html
<body class="cathi-root cathi-dark"> ... </body>
<!-- 或 -->
<body class="cathi-root" data-theme="dark"> ... </body>
```

## 📦 组件清单

### 表单（v4 新增）
- `.cathi-label` / `.cathi-field` / `.cathi-help` / `.cathi-error` — 字段包装与无障碍
- `.cathi-checkbox` / `.cathi-radio` — 原生复选/单选（含 `:indeterminate`）
- `.cathi-slider` — 跨浏览器滑块
- `.cathi-option` — label + 控件 + 描述的整行选项

### 反馈（v4 新增）
- `.cathi-alert` — `data-variant=default|info|success|warning|destructive`
- `.cathi-separator` — `data-orientation=horizontal|vertical`
- `.cathi-skeleton` — `data-shape=circle|text`
- `.cathi-spinner` — `data-size=sm|lg`
- `.cathi-kbd` — 键盘按键（⌘K 风格）

### 浮层（v4 新增）
- `.cathi-tooltip` — `data-side=top|bottom|left|right`（纯 CSS）
- `.cathi-dropdown` — `details/summary`，零 JS
- `.cathi-dialog` — 原生 `<dialog>` + `.cathi-sheet`（`data-side`）
- `.cathi-accordion` — `details/summary`

### 数据 / 杂项（v4 新增）
- `.cathi-table` + `.cathi-table__container`
- `.cathi-breadcrumb`
- `.cathi-empty`
- `.cathi-toggle` + `.cathi-toggle-group`
- `.cathi-scroll-area` / `.cathi-aspect-ratio`
- `.cathi-avatar-group`

### v1–v3 兼容组件
按钮、卡片（flat / soft / pop / dotted）、燕尾 Ribbon、标签（含 5 色 + 描边）、头像、表单、进度条、开关、便签、macOS 窗口、时间显示、药丸单选、图标网格、雷达图、角色卡（6 性格）、数字键盘、侧边导航、标签页、任务项、设置面板、波浪分隔线、搜索栏、操作按钮组、关系进度条、iOS 列表、角标、Toast、底部 Tab Bar。

## 🔧 自定义示例

```css
/* 换主色（HSL 通道值） */
:root, .cathi-root {
  --cathi-primary: 280 80% 55%;   /* 紫色 */
  --cathi-mint-500: 280 80% 55%;
  --cathi-mint-700: 280 90% 38%;
  --cathi-ring: 280 80% 55%;
}

/* 换圆角 */
:root { --cathi-radius: .75rem; }    /* 整体变小 */
/* 或在某个分支覆写 */
.sidebar { --cathi-radius: 0; }      /* 方形侧栏 */

/* 局部加暗色（class 策略） */
.modal { --cathi-card: 32 15% 18%; --cathi-card-foreground: 38 53% 90%; }
```

## 🔄 v3 → v4 迁移

| 变更 | 旧 | 新 |
|---|---|---|
| `--cathi-primary` | 已解析颜色 | HSL 通道值，写法加 `hsl()` |
| `--cathi-border` | 已解析颜色 | HSL 通道值，写法加 `hsl()` |
| 其余 token（`--cathi-bg / text / surface / amber / pink / sky / grape / primary-dark / primary-soft` …） | 同名 | 全部保留为已解析颜色，**无破坏** |
| 组件 | `.cathi-btn--ghost` 等 BEM | 同上 + 新增 `data-variant` / `data-size` / `data-state` |
| 暗色类名 | `.cathi-theme-dark` | 继续支持 + 新增 `.cathi-dark` / `data-theme="dark"` |

## 🏗️ 项目结构

```
Cat-Island-UI/
├── cathi-ui.css        # 完整设计系统（≈1900 行，含 @layer）
├── cathi-ui.min.css    # 压缩版（构建生成）
├── index.html          # 交互式演示页（含三主题切换）
├── themes/             # v4.1 主题预设（放在 cathi-ui.css 之后引入）
│   ├── cozy.css        # 动森（默认）
│   ├── endfield.css    # 终末地
│   └── liquidglass.css # 液态玻璃
├── react/              # v4.1 shadcn 风格 React 组件子工程（Vite+React+TS）
│   ├── src/components/ # 24 个可复制 .tsx 原语 + index.ts barrel
│   ├── src/lib/cn.ts   # className 合并工具
│   ├── src/App.tsx     # 三主题切换演示页
│   └── src/styles.css  # 引入仓库根 cathi-ui.css + 三主题
├── README-CATHI-UI.md  # 本文件
├── README.md           # 总览
├── LICENSE             # CC BY-NC 4.0
├── CHANGELOG.md        # 变更记录
└── tools/
    ├── minify.py       # cathi-ui.min.css 构建脚本（纯 Python，无依赖）
    └── _verify.mjs     # 开发用校验脚本（puppeteer，非发布物）
```

### 构建与校验

```bash
# 重新生成压缩版（改完 cathi-ui.css 后必须跑）
python tools/minify.py

# 校验 min.css 与源码是否同步（可挂进 CI）
python tools/minify.py --check

# 浏览器渲染校验（需本地 Chromium/Edge，路径可用环境变量覆盖）
PPTR_PATH=/path/to/puppeteer-core.js EDGE_PATH=/path/to/edge node tools/_verify.mjs
```

## 📄 License

CC BY-NC 4.0（署名 — 非商业性使用）。**禁止将本组件库用于任何商业目的。** 完整条款见仓库 `LICENSE` 与 https://creativecommons.org/licenses/by-nc/4.0/
