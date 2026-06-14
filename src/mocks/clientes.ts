import type { Cliente } from '@/types/cliente'

export const mockClientes: Cliente[] = [
  {
    id: 'cli-001',
    empresaId: 'emp-001',
    nome: 'Pedro Almeida',
    telefone: '(11) 98765-4321',
    observacoes: 'Prefere corte degradê.',
  },
  {
    id: 'cli-002',
    empresaId: 'emp-001',
    nome: 'Rafael Costa',
    telefone: '(11) 91234-5678',
    observacoes: '',
  },
  {
    id: 'cli-003',
    empresaId: 'emp-001',
    nome: 'Lucas Ferreira',
    telefone: '(11) 99876-5432',
    observacoes: 'Cliente frequente, vem toda quinzena.',
  },
  {
    id: 'cli-004',
    empresaId: 'emp-002',
    nome: 'Bruno Martins',
    telefone: '(21) 97654-3210',
    observacoes: 'Alérgico a determinados produtos capilares.',
  },
  {
    id: 'cli-005',
    empresaId: 'emp-002',
    nome: 'Diego Souza',
    telefone: '(21) 96543-2109',
    observacoes: '',
  },
  {
    id: 'cli-006',
    empresaId: 'emp-003',
    nome: 'Felipe Rocha',
    telefone: '(31) 95432-1098',
    observacoes: 'Agenda preferencialmente às sextas.',
  },
]
