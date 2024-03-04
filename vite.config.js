import { resolve } from 'path';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
// import react from "@vitejs/plugin-react";
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [UnoCSS(), preact()],
  root: resolve(__dirname, 'app'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'app/index.html'),
      },
    },
  },
});
