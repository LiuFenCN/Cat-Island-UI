import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// cathi-ui 的样式直接引用仓库根目录的源文件（单一事实来源，避免复制漂移）
export default defineConfig({
  plugins: [react()],
  root: '.',
  // 相对路径 base：让 dist 可作为静态文件直接打开（file:// 或任意子路径服务器预览）
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
