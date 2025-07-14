import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3090,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Points to your Python backend
        changeOrigin: true,
      },
    },
  },
});
