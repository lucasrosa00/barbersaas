/** Base path da aplicação (ex.: `/barbearia` em produção). Vite define `import.meta.env.BASE_URL`. */
export function getAppBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return undefined
  return base.replace(/\/$/, '')
}

export const appBasename = getAppBasename()
