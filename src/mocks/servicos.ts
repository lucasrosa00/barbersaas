import type { Servico } from '@/types/servico'

export const mockServicos: Servico[] = [
  {
    id: 'srv-001',
    empresaId: 'emp-001',
    nome: 'Corte Masculino',
    valor: 45,
    duracaoMinutos: 30,
    barbeirosDisponiveis: ['bar-001', 'bar-002'],
  },
  {
    id: 'srv-002',
    empresaId: 'emp-001',
    nome: 'Barba Completa',
    valor: 35,
    duracaoMinutos: 25,
    barbeirosDisponiveis: ['bar-001', 'bar-003'],
  },
  {
    id: 'srv-003',
    empresaId: 'emp-001',
    nome: 'Corte + Barba',
    valor: 70,
    duracaoMinutos: 50,
    barbeirosDisponiveis: ['bar-001', 'bar-002', 'bar-003'],
  },
  {
    id: 'srv-004',
    empresaId: 'emp-002',
    nome: 'Corte Degradê',
    valor: 55,
    duracaoMinutos: 40,
    barbeirosDisponiveis: ['bar-004', 'bar-005'],
  },
  {
    id: 'srv-005',
    empresaId: 'emp-002',
    nome: 'Barba com Navalha',
    valor: 40,
    duracaoMinutos: 30,
    barbeirosDisponiveis: ['bar-004'],
  },
  {
    id: 'srv-006',
    empresaId: 'emp-003',
    nome: 'Tratamento Capilar',
    valor: 80,
    duracaoMinutos: 60,
    barbeirosDisponiveis: ['bar-006'],
  },
]
