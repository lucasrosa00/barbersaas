const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export const TOKEN_KEY = 'barbersaas_token'

interface RequestOptions extends RequestInit {
  /** `null` omite o header Authorization; omitir usa o token salvo. */
  token?: string | null
}

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function getStoredToken(): string | undefined {
  return localStorage.getItem(TOKEN_KEY) ?? undefined
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options
  const resolvedToken = token !== undefined ? token : getStoredToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const apiMessage = (data as { message?: string } | null)?.message

    if (response.status === 401 && onUnauthorized) {
      onUnauthorized()
    }

    const fallbackMessage =
      response.status === 404
        ? 'Recurso não encontrado na API. Publique a versão mais recente do backend.'
        : `Erro na requisição (${response.status})`

    throw new ApiError(apiMessage ?? fallbackMessage, response.status, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
