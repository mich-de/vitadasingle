import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    fs: {
      strict: false
    },
    // Forza il refresh quando ci sono cambiamenti
    hmr: {
      overlay: true
    },
    // Add proxy for API requests to avoid CORS issues
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Ottimizzazioni per evitare problemi di import
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: []
  }
})
