import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'just-try-it'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repo}/` : '/',
  plugins: [vue()],
  server: { host: '0.0.0.0', port: 5173 }
})
