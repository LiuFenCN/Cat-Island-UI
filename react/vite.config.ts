import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// cathi-ui 的样式直接引用仓库根目录的源文件（单一事实来源，避免复制漂移）
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
