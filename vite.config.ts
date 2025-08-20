import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isElectron = process.env.ELECTRON === 'true'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173
  },
  plugins: [react(), tailwindcss()],
  base: isElectron ? './' : '/',
})
