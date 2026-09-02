/**
 * cn —— 轻量 className 合并器（shadcn 用 clsx + tailwind-merge；
 * cathi-ui 是纯 class 字符串，所以这里只做 falsy 过滤 + 拼接）。
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
