# Formisle Shop Kit · 形屿商城组件扩展

`formisle/` 是「形屿 FORMISLE」治愈风 3D 资产商城的代码化组件层，**构建在 Cat-Island-UI 之上**。
它复用 cathi-ui 的全部设计令牌，仅补充商城场景所需的语义令牌与组件类，自研原创、与 cathi-ui 授权一致。

## 目录
| 文件 | 作用 |
|------|------|
| `formisle-shop.css` | 商城组件样式（作品卡/订单行/退款药丸/进度时间线/表单面板/网格）+ 增量令牌 |
| `demo.html` | 可直接打开的运行示例，证明组件在 cathi-ui 之上正常工作 |
| `COMPONENTS.md` | 组件规范，与 `formisle-shop.css` 一一对应 |
| `EXPERIENCE.md` | 设计系统 + Ardot 出图实战经验（DSL 坑与规避）+ 商城 UI 优化建议 |
| `design-tokens.json` | W3C Design Tokens 标准格式（语义令牌） |
| `tailwind.theme.js` | Tailwind 主题适配器（供 Tailwind 项目） |

## 快速接入
```html
<link rel="stylesheet" href="cathi-ui.css">
<link rel="stylesheet" href="formisle/formisle-shop.css">
<link rel="stylesheet" href="assets/fonts/nunito.css">
<div class="cathi-root formisle-root">
  <article class="formisle-product-card"> ... </article>
</div>
```
**必须先引入 `cathi-ui.css`** —— 本扩展依赖其令牌与基础重置。

## 设计令牌对照
| FORMISLE | 来源 | 值 |
|----------|------|-----|
| 薄荷青主色 | cathi `--cathi-primary` | `#18c2b3`（≈ `#19c8b9`） |
| 奶油米底 | cathi `--cathi-bg` | `#f6f1e1`（≈ `#f8f8f0`） |
| 暖棕文字 | cathi `--cathi-text` | `#574430`（≈ `#6b4423`） |
| 卡片底 | cathi `--cathi-bg-alt` | `#fffdf6` |
| 薄荷浅底 | cathi `--cathi-primary-soft` | `#d7f5f1`（≈ `#e6f7f4`） |
| **价格金** | **formisle 新增** `--formisle-price` | **`#b58a0a`** |

## 预览
直接浏览器打开 `formisle/demo.html`（仓库根目录需保留 `cathi-ui.css` 与 `assets/`）。

## 授权
与 Cat-Island-UI 一致（见仓库 `LICENSE`）。本目录内容为自研原创，未引入任何第三方 UI 资源。
