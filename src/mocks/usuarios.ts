import type { Usuario } from '@/types/auth'

interface MockUsuario extends Usuario {
  password: string
}

export const mockUsuarios: MockUsuario[] = [
  {
    id: 'usr-001',
    nome: 'João Silva',
    email: 'joao@barbeariadojoao.com',
    empresaId: 'emp-001',
    role: 'owner',
    password: '123456',
  },
  {
    id: 'usr-002',
    nome: 'Maria Santos',
    email: 'maria@barbeariadojoao.com',
    empresaId: 'emp-001',
    role: 'admin',
    password: '123456',
  },
  {
    id: 'usr-003',
    nome: 'Carlos Oliveira',
    email: 'carlos@corteestilo.com',
    empresaId: 'emp-002',
    role: 'owner',
    password: '123456',
  },
  {
    id: 'usr-004',
    nome: 'Ana Costa',
    email: 'ana@navalhapremium.com',
    empresaId: 'emp-003',
    role: 'owner',
    password: '123456',
  },
]
