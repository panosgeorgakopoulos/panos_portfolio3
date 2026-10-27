import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', 
  plugins: [react()],
  // three.js ships in its own lazily loaded chunk for the 3D hero.
  build: { chunkSizeWarningLimit: 650 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});