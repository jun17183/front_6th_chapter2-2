import { defineConfig } from 'vite'

export default defineConfig({
  base: '/front_6th_chapter2-2/',
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  }
})