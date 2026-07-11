import type { Servico } from '@/types/servico'

export function getServicosSelecionados(
  servicos: Servico[],
  servicoIds: string[],
): Servico[] {
  const ids = new Set(servicoIds)
  return servicos.filter((servico) => ids.has(servico.id))
}

export function sumServicosDuracao(servicosSelecionados: Servico[]): number {
  return servicosSelecionados.reduce((total, servico) => total + servico.duracaoMinutos, 0)
}

export function sumServicosValor(servicosSelecionados: Servico[]): number {
  return servicosSelecionados.reduce((total, servico) => total + servico.valor, 0)
}

export function joinServicosNomes(servicosSelecionados: Servico[]): string {
  return servicosSelecionados.map((servico) => servico.nome).join(', ')
}
