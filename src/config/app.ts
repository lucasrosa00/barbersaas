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
