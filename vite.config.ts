import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/revpar-lab/' : '/',
  test: { include: ['src/**/*.test.ts'] },
})
