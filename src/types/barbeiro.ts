import type { DiaSemana } from '@/constants/diasSemana'

export interface Barbeiro {
  id: string
  empresaId: string
  nome: string
  telefone: string
  especialidades: string[]
  diasTrabalho: DiaSemana[]
  horarioInicio: string
  horarioFim: string
}

export type BarbeiroFormData = Omit<Barbeiro, 'id' | 'empresaId'>
