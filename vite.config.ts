import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue(),
    tailwindcss(),
  ],
  build: {
    target: 'es2015',
    lib: {
      entry: path.resolve(__dirname, 'lib/index.tsx'),
      name: 'LikeCoinEVMWalletConnector',
      fileName: (format) => `likecoin-evm-wallet-connector.${format}.js`,
      cssFileName: 'likecoin-evm-wallet-connector',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
