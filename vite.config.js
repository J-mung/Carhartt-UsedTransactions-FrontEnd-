import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['cookie', 'set-cookie-parser', 'pica'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, './src/shared/styles'),
    },
  },
  build: {
    rollupOptions: {
      external: ['set-cookie-parser'],
    },
  },
});
