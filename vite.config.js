import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'assets': path.resolve(__dirname, './src/assets'),
      'examples': path.resolve(__dirname, './src/examples')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ecopharm.csoc.bg',
        changeOrigin: true,
        secure: false,
      }
    },
    cors: {
      origin: ['http://localhost:5173', 'https://ecopharm.csoc.bg', 'https://omnigate.csoc.bg'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
      credentials: true
    }
  }
})
