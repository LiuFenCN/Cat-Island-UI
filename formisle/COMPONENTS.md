# 形屿 FORMISLE · 可复用组件规范（Cat-Island-UI 集成版）

> 与 `formisle-shop.css` 一一对应。颜色/字体/间距均引用 cathi-ui 令牌（`--cathi-*`）
> 与商城增量令牌（`--formisle-*`）。类名统一 `formisle-` 前缀，避免与 cathi 冲突。

---

## ProductCard 作品卡 `.formisle-product-card`
| 部件 | 类 | 说明 |
|------|-----|------|
| 容器 | `.formisle-product-card` | 列布局，圆角 `--cathi-r-lg`(24)，边框 `--cathi-border`，hover 上浮 |
| 缩略图 | `__thumb` | 宽 100%，比例 360:200，`object-fit:cover` |
| 主体 | `__body` | padding 16，纵向 gap 8 |
| 标题 | `__title` | 16px bold `--cathi-text` |
| 作者行 | `__author` / `__avatar` | 头像 28 圆，薄荷浅底；作者名 14 `--cathi-text-soft` |
| 价格行 | `__price-row` | space-between：金额 + 评分 |
| 金额 | `.formisle-price` | 18px bold `--formisle-price`(金) |
| 评分 | `.formisle-rating` | 14px `--cathi-text-soft`，文字「4.9 分」**不用 ★** |

## OrderRow 订单行 `.formisle-order-row`
- 横向 flex：缩略图 72×72（圆角 12）→ 信息列（名 16 bold + 元信息 13 soft）→ 金额（金 18 bold，右对齐）。
- 用于：购物车、我的订单、退款订单选择。

## RefundPills 退款药丸 `.formisle-pills` / `.formisle-pill`
- 纵向排列，gap 12。
- 默认：底 `--cathi-bg-alt`，边框 `--cathi-border`，文字 `--cathi-text`。
- 选中：`.formisle-pill--selected` → 底 `--formisle-mint-bg`，边框 1.5px `--cathi-primary`，文字 bold `--cathi-primary-dark`。

## Timeline 进度时间线 `.formisle-timeline`
- 纵向 flex，每步：圆点 12（radius 6）+ 文本列（标题 14 + 时间 12）。
- 完成/当前：`.formisle-timeline__dot--done`（点 `--cathi-primary`；标题 bold `--cathi-text`）。
- 未完成：点 `--cathi-border-strong`；标题 `--cathi-text-soft`。

## Panel 表单面板 `.formisle-panel`
- 卡片容器（圆角 24，边框，padding 24，纵向 gap 16）。
- 内含 `.formisle-panel__label`（16 bold）与 `.formisle-field input/textarea`（底白，边框，圆角 12，focus 变薄荷青）。

## Grid 作品网格 `.formisle-grid`
- `repeat(auto-fill, minmax(280px, 1fr))`，gap 24，响应式。

## 复用 cathi-ui 基元
按钮用 `.cathi-btn`（主色即薄荷青，3D 硬投影）；图标/标签/头像可复用 `.cathi-tag`、`.cathi-avatar`。
