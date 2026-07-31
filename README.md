# Cat Island UI

Cat Island（猫岛）系设计系统与 Flarum 论坛扩展集合。全部 **MIT 授权、可商用**，不含任何第三方商标或闭源代码。

## 目录结构
- `cathi-ui/` —— 自研治愈系 CSS 组件库（28+ 组件，零依赖，MIT）
- `flarum-linkage/` —— Flarum 2.0 论坛联动系统扩展（猫猫币 / 等级 / 装饰商城）
- `flarum-theme-cozy/` —— Flarum 2.0 治愈系论坛主题

## 设计说明
- 配色、圆角、字体均为全新设计，参考动森风格但完全手写复刻。
- 未使用 `animal-island-ui` 任何源码（其许可证为 CC BY-NC 4.0 禁止商用）。
- 未使用任天堂 / 动物森友会任何商标。
- 界面字体使用 **Nunito**（SIL Open Font License，可商用）。

## 部署提示
- `cathi-ui/` 为纯静态资源，直接引入 `cathi-ui.css` 即可。
- `flarum-linkage` / `flarum-theme-cozy` 为 Flarum 扩展，部署时复制至 `flarum/extensions/<name>/`，注册到 `composer/installed.json`，启用并 `php flarum assets:publish`。
