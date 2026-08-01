/**
 * Tailwind 主题适配器（FORMISLE 商城）
 * 将 cathi-ui 令牌与商城增量映射为 Tailwind 主题扩展。
 * 用法：在 tailwind.config.js 中 spread 本对象到 theme.extend。
 */
module.exports = {
  colors: {
    cream:   "#f8f8f0",
    card:    "#fffdf6",
    mint:    "#19c8b9",
    "mint-bg": "#e6f7f4",
    gold:    "#b58a0a",
    "gold-soft": "#fbf3d8",
    brown:   "#6b4423",
    "brown-body": "#5a4a39",
    gray:    "#8a7460",
    "gray-soft": "#a89684",
    border:  "#e6dcc6",
    "border-soft": "#f1ede1",
    "dot-gray": "#d9cfba",
  },
  borderRadius: {
    sm: "10px",
    md: "12px",
    lg: "16px",
  },
  boxShadow: {
    "3d": "0 5px 0 rgba(87,68,48,0.16), 0 10px 18px rgba(87,68,48,0.12)",
    card: "0 4px 0 rgba(87,68,48,0.14), 0 8px 16px rgba(87,68,48,0.12)",
  },
  fontFamily: {
    cn: ["Noto Sans SC", "sans-serif"],
    num: ["Nunito", "sans-serif"],
  },
  spacing: {
    1: "8px", 2: "12px", 3: "16px", 4: "20px", 5: "24px",
    6: "28px", 7: "32px", 8: "40px", 9: "48px", 10: "56px", 11: "64px",
  },
};
