# Changelog

## v4.2 — 2026-09-03

按用户反馈对终末地 / 液态玻璃两套主题做「全量重做」，从「仅覆盖 token」升级为「token + 组件几何 + 材质 + 动效 + 专属字体」的完整设计系统。

### 终末地（Endfield）完整重做

- 参考依据：基于真实资料确认的核心视觉——黑白灰工业机能底 + 柠檬黄 Pantone 107C（非荧光）点缀；三角/六边形几何符号；半透明全息悬浮面板；扁平信息化、大面积留白、金属色细描边；按压回弹；HUD 式等宽读数。
- 字体：新增本地托管 `Cathi Endfield`（Chakra Petch，工业机械感）+ `Cathi Mono EF`（Share Tech Mono，数据读数）。
- 圆角：从动森系的 `1.5rem` 改为 `0.25rem` 基调，卡片/按钮/输入/徽章全部锐利化。
- 描边/投影：重写 `--cathi-border` / `--cathi-shadow-*` 为金属冷灰细描边 + 纯黑硬投影，移除治愈系彩色 offset 软阴影。
- 标志性 HUD 直角：在 `.cathi-card` / `.cathi-dialog` / `.cathi-sheet` / `.cathi-dropdown__menu` 四角叠加柠檬黄 L 形几何符号，并在 body 背景加入淡工业网格 + 能源辉光渐变。
- 按钮：主按钮柠檬黄 + 黑字，点击时 `translateY(2px) scale(.99)` 模拟按压回弹。
- 表单/输入/开关/滑块/进度：统一工业材质；进度条增加柠檬黄辉光；滑块从圆点改为方钮。
- 标签/徽章/键盘：改为大写、加字距、等宽数字；表格表头也走等宽。
- 侧栏/标签/Toast/列表/窗口/时间/角色卡/数字键盘等全部接入金属描边 + 锐利方角。

### 液态玻璃（Liquid Glass）完整重做

- 参考依据：Apple iOS 26 Liquid Glass 材质四要素——半透明（regular glass 24px 模糊 + 1.8× 饱和度）、折射、顶部镜面高光、自适应着色；胶囊控件；SF 风字体、内容优先留白。
- 字体：新增本地托管 `Cathi Glass`（Inter，SF Pro 替代）。
- 圆角：改为 `1.125rem` 基调（18px），按钮/开关/标签/搜索栏走 `999px` 胶囊。
- 玻璃材质：卡片/弹窗/抽屉/下拉/手风琴/Toast/窗口/滚动区等统一用 `hsl(var(--cathi-card) / .62)` + `backdrop-filter: blur(22px) saturate(1.8)` + 顶部镜面高光 `inset 0 1px 0 rgba(255,255,255,.75)`。
- 按钮 sheen 动效：悬停时一道高光从左上扫到右下，模拟玻璃 specular highlight；启用 `prefers-reduced-motion` 降级。
- 表单/开关/滑块：浅色半透明玻璃表面，滑块 thumb 从方形/点改为带投影的圆钮。
- 背景：调为更克制的浅渐变（#eaf3ff / #f1ecff / #e9fff4），让玻璃材质有内容可透。

### 字体本地托管

- 在 `assets/fonts/` 新增 9 个 woff2 文件（Chakra Petch 400/500/600/700、Share Tech Mono 400、Inter 400/500/600/700），通过 `@font-face` 直接写入各自主题 CSS，不依赖任何 CDN。
- 中文仍按字体栈回退到 `PingFang SC` / `Microsoft YaHei` / `system-ui`，保证中文可读性。
- React 子工程构建验证通过：Vite 正确把新增字体打包进 `react/dist/assets/`，并输出含主题选择器的 `index-C_glyizL.css`（90KB）。

### 文档与演示

- `index.html` 无需改动，切换器继续使用 `data-theme="endfield|liquidglass"`；刷新后即可看到新效果。
- 新增本地校验截图脚本 `tools/_preview_themes.mjs`（开发用，不进仓库），可一键生成三主题整页预览。

---

## v4.1 — 2026-09-03

补齐 v4 的「多主题」与「React 适配」两块拼图：cathi-ui 现在是单仓库三主题预设 + 一套可复制的 shadcn 风格 React 组件。

### 主题预设（新）

- 新增 `themes/` 目录，内置 **3 套主题预设**，机制同 shadcn 的 `:root` 变量覆盖——放在 `cathi-ui.css` 之后引入，重写同一组语义 token 即整站换肤：
  - `themes/cozy.css` — 动森（Cozy，默认）：奶油底 + 薄荷绿，治愈圆润
  - `themes/endfield.css` — 终末地（Endfield）：黑底 `24 20% 9%` + 终末地黄 `45 100% 58%`，工业冷峻
  - `themes/liquidglass.css` — 液态玻璃（Liquid Glass）：浅渐变底 + 半透明毛玻璃
- 激活方式：`data-theme="cozy|endfield|liquidglass"` 或 `.cathi-theme-X`（作用域同时支持属性与 class 两种写法）
- 主题预设与「暗色模式」正交：主题决定配色气质，暗色决定明暗，可叠加使用

### 换肤彻底的 Token 修正（破坏性隐患修复）

- 新增 `--cathi-primary-active`：按压态 / 深一档主色，随主题变。原先按钮按压、进度条渐变、Alert 强调色硬编码了 `--cathi-mint-700/500/600`（约 10 处），换肤会失效——已全部改为 `var(--cathi-primary-active)` / `var(--cathi-primary)`，使强调色跟随主题
- 新增 `--cathi-surface-alpha`（默认 `1`）与 `--cathi-glass-blur`（默认 `0px`）：卡片 / 浮层 / 弹窗 / 抽屉用 `hsl(var(--cathi-card) / var(--cathi-surface-alpha))` + `backdrop-filter: blur(var(--cathi-glass-blur))`。液态玻璃设 `alpha:.62` / `blur:18px`，其余主题保持 `1` / `0px` 不受影响

### React 适配（新子工程 `react/`）

- 新增完整 shadcn 风格 React 组件子工程（Vite + React 18 + TypeScript）：组件即源码、可复制进项目，由 cathi-ui 的 class + 语义 token 驱动
- `cn()` 合并 className、`forwardRef` 原语、`data-variant` / `data-size` 映射 cathi-ui class；零 JS 浮层（`<details>` 做 Dropdown / Accordion，原生 `<dialog>` 做 Dialog / Sheet）
- 24 个原语：Button / Card / Input / Textarea / Select / Label / Field / Checkbox / Radio / Option / Switch / Slider / Separator / Badge / Tag / Spinner / Kbd / Skeleton / Alert / Progress / Avatar / AvatarGroup / Empty / Breadcrumb / Tooltip / Table / Toggle / ToggleGroup / Dropdown / Dialog / Sheet / Accordion / Tabs（统一从 `react/src/components/index.ts` 导出）
- `react/src/App.tsx` 演示页含三主题切换（动森 / 终末地 / 液态玻璃 / 暗色）；`react/src/styles.css` 用 `../../` 引入仓库根 CSS 与三主题
- `react/dist/`、`react/node_modules/`、`react/tsconfig.tsbuildinfo` 已在 `.gitignore` 排除，仓库只存源码
- 构建通过：`tsc -b && vite build` 成功，产物 CSS 含全部 cathi-ui 样式 + 3 个 `data-theme` 选择器 + `cathi-glass-blur` 毛玻璃规则

### 文档

- `README.md` / `README-CATHI-UI.md` 新增「三套主题预设」「React 适配」两节 + 更新项目结构树
- 组件清单表格补「主题预设」行（cozy / endfield / liquidglass）

### 验证

- `tools/_verify.mjs` 扩展为对 cozy / endfield / liquidglass 三主题采样关键 `getComputedStyle`（body / btn / card 及 `backdrop-filter`）并截图
- 三主题实测：cozy body `rgb(246,240,224)`、endfield body `rgb(28,22,18)` 按钮 `rgb(255,201,41)`、liquidglass 卡片 `rgba(255,255,255,.62)` + `blur(18px)`，控制台 0 错误

---

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
