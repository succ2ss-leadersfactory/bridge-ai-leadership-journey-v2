import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
