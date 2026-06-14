export interface Cliente {
  id: string
  empresaId: string
  nome: string
  telefone: string
  observacoes: string
}

export type ClienteFormData = Omit<Cliente, 'id' | 'empresaId'>

export type CreateClienteData = ClienteFormData
export type UpdateClienteData = ClienteFormData
