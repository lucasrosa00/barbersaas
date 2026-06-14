export type UserRole = 'owner' | 'admin'

export interface Empresa {
  id: string
  nome: string
  logo: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  empresaId: string
  role: UserRole
}

export interface AuthUser extends Usuario {
  empresa: Empresa
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
