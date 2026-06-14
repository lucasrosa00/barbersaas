const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export const TOKEN_KEY = 'barbersaas_token'

interface RequestOptions extends RequestInit {
  token?: string
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
  const { token = getStoredToken(), headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    if (response.status === 401 && onUnauthorized) {
      onUnauthorized()
    }

    throw new ApiError(
      (data as { message?: string } | null)?.message ?? 'Erro na requisição',
      response.status,
      data,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
