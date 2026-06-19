export type MetodoPagamento =
  | 'cartao_debito'
  | 'cartao_credito'
  | 'dinheiro'
  | 'pix'

export const METODOS_PAGAMENTO = [
  { value: 'cartao_debito', label: 'Cartão de débito' },
  { value: 'cartao_credito', label: 'Cartão de crédito' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'Pix' },
] as const satisfies { value: MetodoPagamento; label: string }[]

export function getMetodoPagamentoLabel(metodo?: MetodoPagamento | null): string {
  if (!metodo) return '—'
  return METODOS_PAGAMENTO.find((m) => m.value === metodo)?.label ?? metodo
}
