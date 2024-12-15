import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 8000
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'data',
          dest: '.'
        }
      ]
    })
  ],
})