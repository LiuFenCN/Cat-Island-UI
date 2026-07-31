# 🐱 Cat Island UI (cathi-ui)

**自研治愈系（cozy）UI 设计系统** — 纯手写 CSS 组件库，MIT 授权，可商用。

> 灵感来自温暖、圆润、治愈的视觉风格。所有代码 100% 手写，不依赖任何第三方 UI 库源码。

## ✨ 特性

- **32+ 类组件**：按钮 / 卡片 / 标签 / 头像 / 输入框 / 进度条 / 开关 / 窗口框架 / 时间显示 / 条纹进度 / 药丸单选 / 图标网格 / 雷达图 / 角色卡 / 数字键盘 / 侧边导航 / 标签页 / 任务项 / 设置面板 / 波浪分隔线 / 搜索栏 / 操作按钮组 / 关系进度条 …（另含暗色主题 / iOS 设置列表 / 角标 / Toast / 底部 Tab Bar）
- **CSS 变量驱动**：改 `:root` token 就能整体换肤
- **框架无关**：纯 CSS，HTML/React/Vue/Svelte 都能直接用
- **零依赖**：不需要 JS 框架、不需要构建工具
- **MIT 授权**：可商用、可修改、可分发

## 🎨 设计 Token

| 类别 | 变量 | 值 | 说明 |
|------|------|-----|------|
| 主色 | `--cathi-primary` | `#18c2b3` | 薄荷绿 |
| 辅助-琥珀 | `--cathi-amber` | `#ffb454` | 暖黄 |
| 辅助-樱粉 | `--cathi-pink` | `#ff8fab` | 粉红 |
| 辅助-天蓝 | `--cathi-sky` | `#6cc6ef` | 天空蓝 |
| 辅助-葡萄 | `--cathi-grape` | `#b08bf8` | 葡萄紫 |
| 背景 | `--cathi-bg` | `#f6f1e1` | 奶油纸 |
| 文字 | `--cathi-text` | `#574430` | 可可棕 |
| 圆角-lg | `--cathi-r-lg` | `24px` | 大圆角 |
| 字体 | `--cathi-font` | Nunito, ... | 圆润无衬线 |

## 🚀 快速使用

```html
<link rel="stylesheet" href="cathi-ui.css">
<!-- 或从 CDN 引入 -->

<div class="cathi-root">
  <button class="cathi-btn">主按钮</button>
  <div class="cathi-card">
    <h3 class="cathi-card__title">卡片标题</h3>
    <p>内容…</p>
  </div>
</div>
```

## 📦 组件清单

### 基础（v1）
- `.cathi-btn` — 3D 按压感按钮（5 色 + 幽灵 + 尺寸变体）
- `.cathi-card` — 卡片（flat / soft / pop / dotted 波点）
- `.cathi-ribbon` — 燕尾 Ribbon 标题
- `.cathi-tag` — 标签徽章（5 色 + 描边）
- `.cathi-avatar` — 头像（round / sm / lg）
- `.cathi-input` / `.cathi-textarea` / `.cathi-select` — 表单
- `.cathi-progress` — 进度条（条纹变体 + 百分比标签）
- `.cathi-switch` — iOS 风格开关
- `.cathi-note` — 提示便签

### 增强（v2）
- `.cathi-window` — macOS/iOS 窗口框架（traffic lights）
- `.cathi-time-display` — 时间日期显示
- `.cathi-radio-pills` — 药丸单选组（Splatoon 标签页风格）
- `.cathi-icon-grid` — 图标网格（NookPhone 快捷入口）
- `.cathi-radar` — 五维雷达图（性格卡，SVG 精确渲染 + 过渡动画）
- `.cathi-char-card` — 角色卡（6 种性格色彩主题）
- `.cathi-keypad` — 彩色数字键盘（游戏答题风格）
- `.cathi-sidebar-nav` — 侧边导航（个人站风格）
- `.cathi-tabs` — 标签页面板
- `.cathi-task-item` — 任务列表项
- `.cathi-settings-panel` — 设置面板
- `.cathi-wave-divider` — 波浪分隔线
- `.cathi-search-bar` — 圆角搜索栏
- `.cathi-action-bar` — 操作按钮组
- `.cathi-relation-bar` — 关系进度条

### 增强（v3）
- `.cathi-theme-dark` — 暗色主题（加在 `.cathi-root` 即可整站换肤）
- `.cathi-list` — iOS 风格设置列表项（图标 + 标题 + 副标题 + 右侧开关/箭头）
- `.cathi-badge` — 数字角标（头像/图标右上角未读数、纯色点）
- `.cathi-toast` — Toast 通知（success / warn / error，自带轻量 JS）
- `.cathi-tabbar` — 移动端底部 Tab Bar（NookPhone 风格）
- `.cathi-radar` 重做为 SVG（修复旧 clip-path 顶点误差，支持平滑过渡）

## 🏗️ 项目结构

```
cathi-ui/
├── cathi-ui.css      # 完整设计系统（~1000 行）
├── index.html        # 交互式演示页
├── LICENSE           # MIT
└── README.md         # 本文件
```

## 🔧 自定义

```css
:root {
  --cathi-primary: #your-color;    /* 换主色 */
  --cathi-r-lg: 16px;              /* 改圆角 */
  --cathi-font: "Your Font", ...;  /* 换字体 */
}
```

## 📄 License

MIT — 见 [LICENSE](LICENSE) 文件。
