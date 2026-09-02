# Cat Island UI

自研治愈系 CSS 组件库。**CC BY-NC 4.0 许可（非商业用途），零外部依赖。**

引入一个 CSS 文件即可使用全部组件。

[→ 在线预览 Demo](./index.html)

## 快速开始

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="assets/fonts/nunito.css">

<div class="cathi-root">
  <button class="cathi-btn">Hello</button>
</div>
```

所有组件必须放在 `.cathi-root` 内（它定义了 Design Token）。启用暗色：

```html
<body class="cathi-root cathi-dark"> ... </body>
<!-- 或 -->
<body class="cathi-root" data-theme="dark"> ... </body>
```

## v4 新版重点

- **shadcn 风格 Token 架构**（HSL 通道值 + 透明度修饰符 + 单一圆角基准）
- **`@layer` 级联层**，业务未分层 CSS 自动胜出
- **18 个 shadcn 对齐新组件**：Separator / Skeleton / Spinner / Alert / Checkbox / Radio / Slider / Table / Kbd / Tooltip / Dialog / Sheet / Accordion / Breadcrumb / Empty / Toggle / DropdownMenu / ScrollArea …
- **data 属性 API**（`data-variant` / `data-size` / `data-state`）与 BEM 类并存
- **a11y**：统一 focus ring / `:disabled` / `aria-invalid` / `prefers-reduced-motion`
- 完整组件清单与 v3→v4 迁移见 [`README-CATHI-UI.md`](./README-CATHI-UI.md)

## 组件清单

| 分类 | 组件 | 说明 |
|------|------|------|
| 基础 | `.cathi-btn` | 按钮（5 色 + 5 variant + 3 尺寸，含 data-variant API） |
| 基础 | `.cathi-card` | 圆角卡片（4 variant + header / body / footer 插槽） |
| 基础 | `.cathi-tag` | 标签（7 variant + 描边） |
| 基础 | `.cathi-avatar` / `.cathi-avatar-group` | 头像 / 头像组 |
| 表单 | `.cathi-input` / `.cathi-textarea` / `.cathi-select` | 表单（带 aria-invalid 态） |
| 表单 | `.cathi-checkbox` / `.cathi-radio` | 复选 / 单选（含 `:indeterminate`） |
| 表单 | `.cathi-slider` | 滑块（跨浏览器） |
| 表单 | `.cathi-switch` | 开关（iOS 风格） |
| 表单 | `.cathi-radio-pills` | 药丸单选组 |
| 表单 | `.cathi-numpad` | 数字键盘 |
| 表单 | `.cathi-icon-grid` | 图标网格选择器 |
| 表单 | `.cathi-search-bar` | 搜索栏 |
| 反馈 | `.cathi-alert` | 提示条（5 语义 variant） |
| 反馈 | `.cathi-progress` | 进度条（直线 / 条纹） |
| 反馈 | `.cathi-toast` | Toast 通知 |
| 反馈 | `.cathi-badge` | 数字角标 / 状态点 |
| 反馈 | `.cathi-skeleton` / `.cathi-spinner` | 骨架屏 / 加载圈 |
| 反馈 | `.cathi-separator` | 分隔线（横 / 竖） |
| 反馈 | `.cathi-kbd` | 键盘按键 |
| 浮层 | `.cathi-tooltip` | 气泡（4 side，纯 CSS） |
| 浮层 | `.cathi-dropdown` | 下拉（details，零 JS） |
| 浮层 | `.cathi-dialog` / `.cathi-sheet` | 对话框 / 抽屉（原生 `<dialog>`） |
| 浮层 | `.cathi-accordion` | 手风琴（details） |
| 浮层 | `.cathi-toggle` / `.cathi-toggle-group` | 切换按钮组 |
| 数据 | `.cathi-table` | 表格（含 thead / tfoot / hover） |
| 数据 | `.cathi-radar` | SVG 五维雷达图 |
| 数据 | `.cathi-relation-bar` | 关系进度条 |
| 数据 | `.cathi-breadcrumb` | 面包屑 |
| 数据 | `.cathi-empty` | 空状态 |
| 展示 | `.cathi-char-card` | 角色卡（6 色性格，含雷达图） |
| 展示 | `.cathi-ribbon` | 燕尾 Ribbon 角标 |
| 展示 | `.cathi-note` | 便签纸（4 色） |
| 展示 | `.cathi-window` | 窗口框架（macOS 风格标题栏） |
| 展示 | `.cathi-time-display` | 时间显示（数字时钟） |
| 展示 | `.cathi-scroll-area` / `.cathi-aspect-ratio` | 滚动区 / 比例容器 |
| 导航 | `.cathi-sidebar` | 侧边导航栏 |
| 导航 | `.cathi-tabs` | 标签页切换 |
| 导航 | `.cathi-tabbar` | 移动端底部 Tab Bar |
| 布局 | `.cathi-task-item` | 任务项（勾选状态） |
| 布局 | `.cathi-settings-panel` | 设置面板分组 |
| 布局 | `.cathi-action-group` | 操作按钮组 |
| 布局 | `.cathi-list` | iOS 风格设置列表项 |
| 主题 | `.cathi-dark` / `.cathi-theme-dark` / `data-theme="dark"` | 暗色主题（任选其一） |

## Design Token

v4 改用三层架构（原始色板 → 语义 token → 组件），完整列表与自定义示例见 [`README-CATHI-UI.md`](./README-CATHI-UI.md#-设计-tokenv4-语义层)。

快速换主色（HSL 通道值）：

```css
:root, .cathi-root {
  --cathi-primary: 280 80% 55%;   /* 紫色 */
  --cathi-mint-500: 280 80% 55%;
  --cathi-mint-700: 280 90% 38%;
  --cathi-ring: 280 80% 55%;
}
```

## 字体

默认使用 **Nunito**（SIL Open Font License，已随仓库本地托管于 `assets/fonts/`）。无需任何外部 CDN：

```html
<link rel="stylesheet" href="assets/fonts/nunito.css">
```

## 浏览器支持

现代浏览器（Chrome / Firefox / Safari / Edge 近两个版本）。雷达图组件依赖 SVG。

## 商城扩展（Formisle Shop Kit）

`formisle/` 是「形屿 FORMISLE」治愈风 3D 资产商城的组件扩展层，**构建在 Cat-Island-UI 之上**：
复用本库全部设计令牌，仅补充商城场景的语义令牌与组件类（作品卡 / 订单行 / 退款药丸 /
进度时间线 / 表单面板等）。含可运行 `demo.html`、组件规范 `COMPONENTS.md`、经验手册
`EXPERIENCE.md` 与多格式令牌（`design-tokens.json` / `tailwind.theme.js`）。

```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="formisle/formisle-shop.css">
<div class="cathi-root formisle-root"> ... </div>
```

详见 [`formisle/README.md`](./formisle/README.md)。

## License

CC BY-NC 4.0（署名 — 非商业性使用）。**禁止将本组件库用于任何商业目的。** 完整条款见仓库 `LICENSE` 文件与 https://creativecommons.org/licenses/by-nc/4.0/
