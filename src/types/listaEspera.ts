export interface ListaEsperaItem {
  id: string
  empresaId: string
  posicao: number
  clienteId: string
  clienteNome: string
  servicoId: string
  servicoNome: string
  barbeiroId: string
  barbeiroNome: string
  dataSolicitada: string
}

export type ListaEsperaFormData = Omit<
  ListaEsperaItem,
  'id' | 'empresaId' | 'posicao' | 'clienteNome' | 'servicoNome' | 'barbeiroNome'
>
