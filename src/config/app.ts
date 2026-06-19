/** Base path da aplicação (ex.: `/agendamento` em produção). Vite define `import.meta.env.BASE_URL`. */
export function getAppBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return undefined
  return base.replace(/\/$/, '')
}

export const appBasename = getAppBasename()

/** Monta path interno respeitando VITE_BASE_PATH (ex.: `/login` → `/agendamento/login`). */
export function resolveAppPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (base === '/') return normalized
  return `${base.replace(/\/$/, '')}${normalized}`
}

/** Origem pública do app (ex.: `https://site.com`). Usa `VITE_PUBLIC_APP_URL` ou `window.location.origin`. */
export function getPublicAppOrigin(): string {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL?.trim()
  if (configured) {
    try {
      return new URL(configured).origin
    } catch {
      return configured.replace(/\/$/, '')
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return ''
}

/** URL absoluta para a página pública de confirmação de presença. */
export function buildConfirmacaoPublicUrl(token: string): string {
  const origin = getPublicAppOrigin()
  const path = resolveAppPath(`/confirmacao/${encodeURIComponent(token)}`)
  return `${origin}${path}`
}
