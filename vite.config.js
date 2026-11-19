import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Same-origin TMDB proxy. The token lives only in the Node process (.env, no
 * VITE_ prefix) and is injected here, so it never reaches the browser bundle.
 */
function tmdbProxy(token) {
  return {
    '/api/tmdb': {
      target: 'https://api.themoviedb.org',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/tmdb/, '/3'),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = tmdbProxy(env.TMDB_TOKEN)

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
    preview: { proxy: tmdbProxy(env.TMDB_TOKEN) },
  }
})
