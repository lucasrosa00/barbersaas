import { apiClient, TOKEN_KEY } from '@/services/api/client'
import type {
  AuthResponse,
  AuthUser,
  Empresa,
  LoginCredentials,
} from '@/types/auth'

const USER_KEY = 'barbersaas_user'

function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))

    return response
  },

  async logout(): Promise<void> {
    clearSession()
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  getStoredSession(): { user: AuthUser; token: string } | null {
    const token = localStorage.getItem(TOKEN_KEY)
    const userJson = localStorage.getItem(USER_KEY)

    if (!token || !userJson) return null

    try {
      const user = JSON.parse(userJson) as AuthUser
      return { user, token }
    } catch {
      return null
    }
  },

  updateStoredUserEmpresa(empresaPartial: Partial<Empresa>): AuthUser | null {
    const session = this.getStoredSession()
    if (!session) return null

    const user: AuthUser = {
      ...session.user,
      empresa: { ...session.user.empresa, ...empresaPartial },
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  },

  clearSession,
}
