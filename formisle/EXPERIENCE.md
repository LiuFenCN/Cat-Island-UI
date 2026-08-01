# 形屿 FORMISLE · 设计经验与优化手册

> 本文档沉淀自「形屿 FORMISLE」治愈风 3D 资产商城的设计与出图全过程，
> 涵盖：**设计系统**、**Ardot 出图实战经验（DSL 坑与规避）**、**3D 资产商城 UI 优化建议**、
> **12 页页面族结构**，以及**接入 Cat-Island-UI 的具体方案**。
> 全部内容为自研，未引用任何第三方 UI 库资源（规避 CC BY-NC 等授权风险）。

---

## 1. 设计系统概览（治愈风）

### 1.1 设计哲学
- **底色**：奶油米 `#f8f8f0` 降低画面攻击性；卡片 `#fffdf6` 近白微暖。
- **信号色**：薄荷青 `#19c8b9` 作为唯一主行动色（按钮、选中、链接），低饱和高明度，治愈且醒目。
- **文字**：暖棕 `#6b4423` 标题、深棕 `#5a4a39` 正文、辅助灰 `#8a7460` 次要，避免纯黑带来的生硬。
- **价格**：金色 `#b58a0a` 仅用于金额，制造"价值感"。
- **形体**：圆角 10/12/16、轻投影、3D 按钮（实色硬投影 `0 5px 0` 而非模糊阴影）营造"可点击的实体感"。

### 1.2 色板
| 名称 | HEX | 用途 |
|------|-----|------|
| cream 奶油米 | `#f8f8f0` | 页面主底 |
| card 卡片 | `#fffdf6` | 卡片底 |
| mint 薄荷青 | `#19c8b9` | 主行动色 |
| mintBg 薄荷青浅底 | `#e6f7f4` | 选中/高亮态 |
| gold 金 | `#b58a0a` | 价格 |
| brown 暖棕 | `#6b4423` | 标题/重点 |
| brownBody 深棕 | `#5a4a39` | 正文 |
| gray 辅助灰 | `#8a7460` | 次要文字 |
| graySoft 浅灰 | `#a89684` | 禁用/占位 |
| border 边框 | `#e6dcc6` | 主边框 |
| borderSoft 浅边框 | `#f1ede1` | 分割线 |
| dotGray 灰点 | `#d9cfba` | 时间线未完成节点 |

### 1.3 字体与尺度
- 中文 `Noto Sans SC`，英文/数字 `Nunito`（数字用 Nunito 更圆润亲和）。
- 字号梯度：12 / 13 / 14 / 15 / 16 / 18 / 24 / 28 / 32。
- 间距（4px 基准）：8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64。
- 圆角：sm 10 / md 12 / lg 16。

---

## 2. Ardot 出图实战经验（batch_edit DSL 坑与规避）

> 适用：通过 Ardot MCP `batch_edit` 操作画布时的高频雷区。**出图验收以 `capture_layout(problemsOnly)` 结构校验为准**（见 2.7）。

### 2.1 单条操作必须"干净收尾"
每个 `I()/U()/C()/M()` 必须是**一条完整、独立**的操作；遗漏收尾 `}` 或对象内误嵌 `)` 会导致**整条 `Failed to parse`**。
- ✅ 正确：`I(19:1,{name:"X", type:"FRAME", height:40})`
- ❌ 错误：`I(19:1,{name:"X", type:"FRAME", height:40)` （缺 `}`）

### 2.2 单条 op 有体积上限（约 3–4KB）
超过上限的整行/整容器插入会反复 `parse failed`。
- **应对**：先建空容器，再**逐子节点**插入（每张卡、每行分别一条 op）。
- 经验阈值：含 3 张卡片的整行（~4.5KB）必失败；单卡（~1.5KB）稳定。

### 2.3 同批内 binding name 不可作父引用
同一 `batch_edit` 里用 `I()` 创建的节点，其 `name` **不能**在该批后续 op 中作为父节点 ID。
- **应对**：先建容器拿回 `nodeID`，下一批再用该 ID 加子节点（"建容器 + 加子节点"拆两批）。

### 2.4 Move 语法
`M(nodeId, "parentId", index)` —— 第三参数是插入位置索引（0 起）。
用于将内容插到 Nav 与 Footer 之间等有序布局场景。

### 2.5 特殊字符触发解析失败
`★` 等 emoji、`#` 作为内容字首会导致整条插入失败（`Skipped unparseable line`）。
- **应对**：评分用「4.9 分」而非「★4.9」；标签去 `#`（如「3D建模」而非「#3D建模」）。

### 2.6 父 frame 高度与裁切
父 frame 若显式 `FIXED` 高度且 `clipsContent:true`，子节点会溢出被裁。
- **应对**：auto-height 用 `RESIZE_TO_FIT_WITH_IMPLICIT_SIZE`。
  - VERTICAL 父 → 设**主轴** `primaryAxisSizingMode`。
  - HORIZONTAL 父 → 设 **counter 轴** `counterAxisSizingMode`。
- 估算高度后建议回写真实高度（如 `height:302`）以消溢出 warning。

### 2.7 effect 必须带 `blendMode` 与 `boundVariables`
`DROP_SHADOW` 写法（缺字段会报 `type/blendMode undefined`）：
```js
effects:[{
  type:"DROP_SHADOW",
  color:{r:0.741,g:0.682,b:0.627,a:1},
  offset:{x:0,y:5}, radius:0, spread:0,
  visible:true, blendMode:"NORMAL",
  showShadowBehindNode:true, boundVariables:{}
}]
```

### 2.8 校验方式
本环境 `capture_screenshot` 产物不可读取，**统一用 `capture_layout(parentId, problemsOnly:true)` 做结构校验**；返回空数组即通过。

---

## 3. 3D 资产商城 UI 优化建议

### 3.1 图片策略
- 缩略图统一 `360×200`、封面 `1440×420`，固定宽高比避免布局抖动。
- 懒加载 + 低质量占位（LQIP）；3D 预览用 `<model-viewer>` 或视频首帧。

### 3.2 性能
- 作品网格用虚拟滚动（窗口化）应对上千件资产。
- `Noto Sans SC` 体积大 → 子集化 / `font-display: swap`；英文数字走 Nunito 减少中文字形加载。

### 3.3 可访问性
- 文字对比度：暖棕 `#6b4423` 配米白底达标（≥4.5:1）。
- 焦点态可见；按钮/可点元素最小触控区 44pt。
- 时间线、进度态明确传达，降低"退款/审核"场景的焦虑感。

### 3.4 状态统一
- 空状态 / 加载中 / 错误 三态跨页一致。
- 表单错误内联提示，避免整页报错。

### 3.5 组件复用
- Nav、Footer、ProductCard、Pill、Timeline、FormField 抽为跨页复用组件，
  保证 12 页视觉一致、维护成本最低。

---

## 4. 页面族结构（12 页，横向排布，间距 1640px）

| # | 页面 | 关键模块 |
|---|------|----------|
| 00 | 个人博客 | 文章列表 / 作者卡 |
| 01 | 商品详情 | 3D 预览 / 规格 / 购买 |
| 02 | 购物车 | 条目 / 合计 / 结算 |
| 03 | 结算 | 地址 / 支付 / 优惠 |
| 04 | 评价 | 评分 / 图文评价 |
| 05 | 后台 | 资产管理 / 数据 |
| 06 | 支付成功 | 结果 / 继续逛 |
| 07 | 我的订单 | 订单列表 / 状态 |
| 08 | 登录注册 | 表单 / 第三方登录 / 协议 |
| 09 | 分类搜索 | 筛选 / 排序 / 结果网格 |
| 10 | 博客文章 | 正文 / 引用 / 评论 |
| 11 | 退款售后 | 订单选择 / 原因 / 进度时间线 / 客服 |

设计文件：`https://ardot.tencent.com/file/702542816554749`

---

## 5. 接入 Cat-Island-UI 的方案（已落地为 `formisle/`）

1. **令牌复用**：cathi-ui 的 `--cathi-*` 已覆盖本设计 95% 的色板（薄荷青/奶油底/暖棕/圆角/阴影/字体），
   仅补充 `--formisle-price`(金) 等少量商城语义令牌，见 `formisle/formisle-shop.css`。
2. **组件扩展**：商城专属组件（作品卡 / 订单行 / 退款药丸 / 进度时间线 / 表单面板）以 `formisle-` 前缀实现，
   不污染 cathi 既有类，见 `COMPONENTS.md` 与 `formisle-shop.css`。
3. **多格式令牌**：`design-tokens.json`（Design Tokens 标准）/ `tailwind.theme.js`（Tailwind 适配器）供不同管线使用。
4. **可运行 Demo**：`demo.html` 直接在 cathi-ui 之上渲染商城组件，打开即可预览。
5. **授权**：本设计为自研原创，已规避 CC BY-NC 类第三方 UI 资源，可自由合入 cathi-ui。
