import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/types": path.resolve(__dirname, "./types"),
      "@/data": path.resolve(__dirname, "./data"),
    },
  },
  server: {
    allowedHosts: ['9e9eaf0cb6ac.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})