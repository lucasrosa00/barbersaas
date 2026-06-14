import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Em produção na VPS: VITE_BASE_PATH=/barbearia/ (com barra final)
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    preview: {
      port: 7756,
      strictPort: true,
      host: '127.0.0.1',
      allowedHosts: env.VITE_PREVIEW_ALLOWED_HOSTS
        ? env.VITE_PREVIEW_ALLOWED_HOSTS.split(',').map((host) => host.trim()).filter(Boolean)
        : true,
    },
  }
})
