import type {
  FinanceiroData,
  Movimentacao,
  DadoGrafico,
  ResumoFinanceiro,
} from '@/types/financeiro'
import { toISODate } from '@/utils/timeSlots'

function parseDate(iso: string): Date {
  return new Date(iso + 'T12:00:00')
}

function isSameDay(a: string, b: string): boolean {
  return a === b
}

function isSameWeek(dateIso: string, ref: Date): boolean {
  const date = parseDate(dateIso)
  const start = getWeekStart(ref)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return date >= start && date <= end
}

function isSameMonth(dateIso: string, ref: Date): boolean {
  const date = parseDate(dateIso)
  return (
    date.getFullYear() === ref.getFullYear() &&
    date.getMonth() === ref.getMonth()
  )
}

function getWeekStart(ref: Date): Date {
  const d = new Date(ref)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(12, 0, 0, 0)
  return d
}

function sumEntradas(movimentacoes: Movimentacao[]): number {
  return movimentacoes
    .filter((m) => m.tipo === 'entrada')
    .reduce((sum, m) => sum + m.valor, 0)
}

export function calcularResumo(
  movimentacoes: Movimentacao[],
  ref: Date = new Date(),
): ResumoFinanceiro {
  const hoje = toISODate(ref)

  return {
    faturamentoDia: sumEntradas(
      movimentacoes.filter((m) => isSameDay(m.data, hoje)),
    ),
    faturamentoSemana: sumEntradas(
      movimentacoes.filter((m) => isSameWeek(m.data, ref)),
    ),
    faturamentoMes: sumEntradas(
      movimentacoes.filter((m) => isSameMonth(m.data, ref)),
    ),
  }
}

export function calcularFaturamentoDiario(
  movimentacoes: Movimentacao[],
  dias = 7,
  ref: Date = new Date(),
): DadoGrafico[] {
  const result: DadoGrafico[] = []

  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(ref)
    d.setDate(d.getDate() - i)
    const iso = toISODate(d)
    const label = d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
    })

    const valor = sumEntradas(movimentacoes.filter((m) => m.data === iso))
    result.push({ label, valor })
  }

  return result
}

export function calcularFaturamentoMensal(
  movimentacoes: Movimentacao[],
  meses = 6,
  ref: Date = new Date(),
): DadoGrafico[] {
  const result: DadoGrafico[] = []

  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1, 12)
    const label = d.toLocaleDateString('pt-BR', {
      month: 'short',
      year: '2-digit',
    })

    const valor = sumEntradas(
      movimentacoes.filter((m) => {
        const md = parseDate(m.data)
        return (
          md.getFullYear() === d.getFullYear() &&
          md.getMonth() === d.getMonth()
        )
      }),
    )

    result.push({ label, valor })
  }

  return result
}

export function filterFinanceiroByBarbeiro(
  data: FinanceiroData,
  barbeiroId: string,
): FinanceiroData {
  if (!barbeiroId) return data

  const movimentacoes = data.movimentacoes.filter(
    (m) => m.barbeiroId === barbeiroId,
  )

  return {
    resumo: calcularResumo(movimentacoes),
    faturamentoDiario: calcularFaturamentoDiario(movimentacoes),
    faturamentoMensal: calcularFaturamentoMensal(movimentacoes),
    movimentacoes,
  }
}
