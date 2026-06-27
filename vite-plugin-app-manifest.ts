import type { Plugin } from 'vite'

function resolveAssetUrl(env: Record<string, string>, fileName: string): string {
  if (fileName === 'logo.png' && env.VITE_APP_LOGO_URL) {
    return env.VITE_APP_LOGO_URL
  }
  if (fileName === 'logo-transparent.png' && env.VITE_APP_FAVICON_URL) {
    return env.VITE_APP_FAVICON_URL
  }

  const base = env.VITE_BASE_PATH || '/'
  return base === '/' ? `/${fileName}` : `${base}${fileName}`
}

export function appManifestPlugin(env: Record<string, string>): Plugin {
  const logoUrl = resolveAssetUrl(env, 'logo.png')

  function buildManifest(): string {
    return JSON.stringify(
      {
        name: 'Agenda Fácil',
        short_name: 'Agenda Fácil',
        description: 'Agendamentos, equipe e clientes em um só lugar.',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#6d28d9',
        lang: 'pt-BR',
        icons: [
          {
            src: logoUrl,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: logoUrl,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      null,
      2,
    )
  }

  return {
    name: 'app-manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.endsWith('/manifest.webmanifest')) {
          next()
          return
        }

        res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8')
        res.end(buildManifest())
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: buildManifest(),
      })
    },
  }
}

export function resolveBrandingAssetUrls(env: Record<string, string>) {
  return {
    logoUrl: resolveAssetUrl(env, 'logo.png'),
    faviconUrl: resolveAssetUrl(env, 'logo-transparent.png'),
  }
}
