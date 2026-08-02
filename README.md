# Cat Island UI

自研治愈系 CSS 组件库。**CC BY-NC 4.0 许可（非商业用途），零外部依赖。**

引入一个 CSS 文件即可使用全部组件。

[→ 在线预览 Demo](./index.html)

## 快速开始

```html
<link rel="stylesheet" href="cathi-ui.css">
<div class="cathi-root">
  <button class="cathi-btn cathi-btn--primary">Hello</button>
</div>
```

所有组件必须放在 `.cathi-root` 内（它定义了 Design Token）。

## 组件清单（v3）

| 分类 | 组件 | 说明 |
|------|------|------|
| 基础 | `.cathi-btn` | 按钮（实心/轮廓/幽灵/禁用 + 5 色 + 3 尺寸） |
| 基础 | `.cathi-card` | 圆角卡片（带 header / body / footer 插槽） |
| 基础 | `.cathi-tag` | 标签（圆角/点状/可关闭） |
| 基础 | `.cathi-avatar` | 头像（圆/圆角/带状态点/带角标） |
| 基础 | `.cathi-input` | 输入框（文本/搜索/文本域 + 图标插槽） |
| 反馈 | `.cathi-progress` | 进度条（直线/条纹/不定） |
| 反馈 | `.cathi-switch` | 开关（iOS 风格） |
| 反馈 | `.cathi-badge` | 数字角标 / 状态点 |
| 反馈 | `.cathi-toast` | Toast 通知（success / warn / error） |
| 数据 | `.cathi-radar` | SVG 五维雷达图（性格卡风格，JS 渲染） |
| 数据 | `.cathi-relation-bar` | 关系进度条 |
| 展示 | `.cathi-char-card` | 角色卡（6 色性格，含雷达图） |
| 展示 | `.cathi-ribbon` | 燕尾 Ribbon 角标 |
| 展示 | `.cathi-note` | 便签纸（4 色） |
| 展示 | `.cathi-window` | 窗口框架（macOS 风格标题栏） |
| 展示 | `.cathi-time-display` | 时间显示（数字时钟） |
| 导航 | `.cathi-sidebar` | 侧边导航栏 |
| 导航 | `.cathi-tabs` | 标签页切换 |
| 导航 | `.cathi-tabbar` | 移动端底部 Tab Bar |
| 导航 | `.cathi-breadcrumb` | 面包屑导航 |
| 表单 | `.cathi-radio-pills` | 药丸单选组 |
| 表单 | `.cathi-numpad` | 数字键盘（NookPhone 风格） |
| 表单 | `.cathi-icon-grid` | 图标网格选择器 |
| 表单 | `.cathi-search-bar` | 搜索栏 |
| 布局 | `.cathi-task-item` | 任务项（勾选状态） |
| 布局 | `.cathi-settings-panel` | 设置面板分组 |
| 布局 | `.cathi-action-group` | 操作按钮组 |
| 布局 | `.cathi-list` | iOS 风格设置列表项 |
| 分隔 | `.cathi-wave-divider` | 波浪分隔线 |
| 主题 | `.cathi-theme-dark` | 暗色主题（加在 .cathi-root 上即生效） |

## Design Token

在 `.cathi-root` 上覆盖 CSS 变量即可全局换色：

```css
:root {
  --cathi-primary: #18c2b3;    /* 主色 */
  --cathi-amber:  #ffb454;     /* 琥珀 */
  --cathi-pink:   #ff8fab;     /* 粉 */
  --cathi-sky:    #6cc6ef;     /* 天蓝 */
  --cathi-grape:  #b08bf8;     /* 葡萄紫 */
  --cathi-bg:     #f6f1e1;     /* 奶油底 */
  --cathi-text:   #574430;     /* 可可文字 */
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
