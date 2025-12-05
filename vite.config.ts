import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // IMPORTANT: Replace 'panos_portfolio3' with your EXACT repository name
  base: '/panos_portfolio3/', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});