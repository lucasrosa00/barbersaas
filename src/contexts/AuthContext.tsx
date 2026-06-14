import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setUnauthorizedHandler } from '@/services/api/client'
import { authService } from '@/services/auth/authService'
import type { AuthUser, Empresa, LoginCredentials } from '@/types/auth'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updateEmpresa: (empresa: Partial<Empresa>) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setToken(null)
  }, [])

  useEffect(() => {
    const session = authService.getStoredSession()
    if (session) {
      setUser(session.user)
      setToken(session.token)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      authService.clearSession()
      setUser(null)
      setToken(null)
      window.location.href = '/login'
    })

    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    setUser(response.user)
    setToken(response.token)
  }, [])

  const updateEmpresa = useCallback((empresa: Partial<Empresa>) => {
    const updated = authService.updateStoredUserEmpresa(empresa)
    if (updated) setUser(updated)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      updateEmpresa,
    }),
    [user, token, isLoading, login, logout, updateEmpresa],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
