import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: { index: './index.html' } }
  },
  server: { port: 3002 },
  resolve: {
    alias: {
      '@axonivy/dataclass-editor': resolve(__dirname, '../../packages/dataclass-editor/src')
    }
  },
  base: './'
});
