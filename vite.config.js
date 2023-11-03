import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, '/src') }
    ]
  },
  build: {
    lib: {
      name: 'VueProgressBar',
      entry: path.resolve(__dirname, 'src/index.js'),
      fileName: 'vue-progressbar',
    },
    rollupOptions: {
      external: ['vue',],
      output: {
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
})
