export interface Servico {
  id: string
  empresaId: string
  nome: string
  valor: number
  duracaoMinutos: number
  barbeirosDisponiveis: string[]
}

export type ServicoFormData = Omit<Servico, 'id' | 'empresaId'>
