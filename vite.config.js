import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Pac-Rat/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
