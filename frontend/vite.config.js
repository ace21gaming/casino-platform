import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirect all /api requests to the backend
      '/api': 'http://localhost:5000',
    },
  },
});
