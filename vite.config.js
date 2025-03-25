import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    sourceMap: true,
    rollupOptions: {
      output: {
        manualChunks(id, _meta) {
            if (id.includes('node_modules/reveal.js/dist/theme')) {
              return 'revealjs/themes'
            }

            if (id.includes('node_modules/reveal.js/plugin')) {
              return `revealjs/plugins/${id.split('node_modules/reveal.js/plugin/')[1].split('/')[0]}`
            }

            if (id.includes('node_modules/reveal.js')) {
              return 'revealjs/index'
            }

            if (id.includes('node_modules')) {
              return 'vendor'
            }
        },
      },
    },
  },
})
