import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://optexeg.me/',
        changeOrigin: true,
        secure: true,
        ws: true,
      }
    }
  }
})
