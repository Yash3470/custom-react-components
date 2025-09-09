import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',   // ✅ simulate browser DOM
    globals: true,           // optional, allows using expect without import
    setupFiles: './setupTests.ts', // optional for setup like jest-dom
  },
})
