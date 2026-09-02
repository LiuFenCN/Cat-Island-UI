# Changelog

## v4.0 — 2026-09-03

参考 shadcn/ui 设计系统做了一次底层重构，所有组件视觉保持治愈系（cozy）但工程性大幅提升。

### 重构（破坏性，迁移路径见 README）

- **Token 架构重写为三层**：
  - 原始色板（`--cathi-mint-500`、`--cathi-cocoa-700` …）以 HSL 通道值存
  - 语义 token（`--cathi-primary` / `--cathi-card` / `--cathi-ring` …）同 shadcn 命名
  - 组件层全部从语义 token 派生，无任何硬编码颜色
- **`@layer cathi.{tokens,base,components,utilities}`**：业务未分层 CSS 永远胜出，覆写无需 `!important`
- **`--cathi-primary` 与 `--cathi-border` 变更为 HSL 通道值**（破坏性）：
  - `var(--cathi-primary)` → `hsl(var(--cathi-primary))`
  - `var(--cathi-border)` → `hsl(var(--cathi-border))`
- 其它所有 token（`--cathi-bg / text / surface / amber / pink / sky / grape / primary-dark / primary-soft` …）保留为已解析颜色，**旧 HTML/CSS 零修改**
- 暗色模式扩展为多种激活方式：`.cathi-dark` / `.cathi-theme-dark` / `[data-theme="dark"]`

### 新组件

- 表单：`.cathi-label`、`.cathi-field`、`.cathi-help`、`.cathi-error`、`.cathi-checkbox`、`.cathi-radio`、`.cathi-slider`、`.cathi-option`
- 反馈：`.cathi-alert`、`.cathi-separator`、`.cathi-skeleton`、`.cathi-spinner`、`.cathi-kbd`
- 浮层：`.cathi-tooltip`、`.cathi-dropdown`、`.cathi-dialog`、`.cathi-sheet`、`.cathi-accordion`
- 数据/杂项：`.cathi-table`、`.cathi-breadcrumb`、`.cathi-empty`、`.cathi-toggle`、`.cathi-toggle-group`、`.cathi-scroll-area`、`.cathi-aspect-ratio`、`.cathi-avatar-group`

### 体验增强

- **data 属性 API**：`<button class="cathi-btn" data-variant="destructive" data-size="sm">` 与 BEM 类并存
- **统一 focus ring**（基于 `--cathi-ring`）覆盖所有交互元素
- **`:disabled` 通用降级**（`pointer-events:none; opacity:.5`）
- **`aria-invalid` 自动红框 + 错误提示**
- **`prefers-reduced-motion` 全局降级**
- **单文件 ≈1900 行，保留可读性**

### 体验增强（续）

- **修复 `.cathi-progress--striped` 丢失底色**：原来只重设 `background-image`，把薄荷渐变整个顶掉。现在底色走 `background-color`、渐变走 `background-image`，条纹叠加不再吃掉主色（`--amber` / `--pink` 变体同步修正）
- **修正 README 授权声明**：旧文档误写为 MIT，与仓库 `LICENSE`（CC BY-NC 4.0 非商业）矛盾，已改正

### 工具与构建

- 新增 `cathi-ui.min.css`（由 `tools/minify.py` 纯 Python 零依赖生成，压缩率 ≈30%）
  - `python tools/minify.py` 重新构建；`python tools/minify.py --check` 校验与源码同步
  - 压缩器会保留首个 `/*! ... */` 许可证 banner，实测不破坏 `@layer` / `hsl(var(--x) / .14)` / data-URI SVG
- 新增 `tools/_verify.mjs`（开发用，非发布物）：用 puppeteer + 本地 Edge 打开 `index.html`，在亮/暗两主题下采样关键 `getComputedStyle`，并逐项比对 `cathi-ui.css` 与 `cathi-ui.min.css` 渲染结果是否完全一致，同时收集 console / 字体 404 错误。
  - 本机实测：**17 个演示区块、2 个 dialog、console 0 错误、src 与 min 采样零差异**
- `index.html` 演示页加入 6 个 v4 区块（Token 架构、按钮变体、表单、反馈、浮层、数据展示）
- 修复 `assets/fonts/nunito.css` 的相对路径错误（`url(assets/fonts/…)` → `url(./…)`，20 处）
- `formisle/formisle-shop.css` 与 `index.html` 中 13 处 `var(--cathi-primary)` / `var(--cathi-border)` 已迁移
- 确认 `formisle/demo.html` 只用到 `--cathi-text` / `--cathi-text-soft` / `--cathi-surface-2`，均为兼容别名，无需改动

---

## v3.0 — 2026-08

- 暗色主题（`.cathi-theme-dark`）、iOS 风格设置列表、Toast 通知、底部 Tab Bar、数字角标
- SVG 雷达图重做（修复旧 `clip-path` 顶点误差，支持平滑过渡）
- 修复 .trash_tmp 残留字体文件

## v2.0

- macOS 窗口框架、时间显示、药丸单选、图标网格、角色卡、数字键盘、侧边导航、标签页、任务项、设置面板、波浪分隔线、搜索栏、操作按钮组、关系进度条

## v1.0

- 基础组件：按钮、卡片、燕尾 Ribbon、标签、头像、表单、进度条、开关、便签
