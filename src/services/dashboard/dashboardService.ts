import { apiClient } from '@/services/api/client'
import type { AgendamentoEnriquecido, AgendamentoStatus } from '@/types/agendamento'
import type { DadoGrafico, ResumoFinanceiro } from '@/types/financeiro'

interface DashboardApiResponse {
  agendamentosHoje: Array<{
    id: string
    clienteId: string
    clienteNome: string
    barbeiroId: string
    barbeiroNome: string
    servicoIds: string[]
    servicoNome: string
    data: string
    horario: string
    status: AgendamentoStatus
    duracaoMinutos: number
  }>
  agendamentosPendentes: number
  faturamentoDia: number
  faturamentoSemana: number
  listaEspera: number
  totalClientes: number
  faturamentoDiario: DadoGrafico[]
  resumo: ResumoFinanceiro
}

export interface DashboardData {
  agendamentosHoje: AgendamentoEnriquecido[]
  agendamentosPendentes: number
  faturamentoDia: number
  faturamentoSemana: number
  listaEspera: number
  totalClientes: number
  faturamentoDiario: DadoGrafico[]
  resumo: ResumoFinanceiro
}

function mapAgendamento(
  dto: DashboardApiResponse['agendamentosHoje'][number],
  empresaId: string,
): AgendamentoEnriquecido {
  return {
    id: dto.id,
    empresaId,
    clienteId: dto.clienteId,
    barbeiroId: dto.barbeiroId,
    servicoIds: dto.servicoIds,
    data: dto.data,
    horario: dto.horario,
    status: dto.status,
    clienteNome: dto.clienteNome,
    barbeiroNome: dto.barbeiroNome,
    servicoNome: dto.servicoNome,
    duracaoMinutos: dto.duracaoMinutos,
  }
}

export const dashboardService = {
  async getData(empresaId: string): Promise<DashboardData> {
    const data = await apiClient<DashboardApiResponse>('/dashboard')

    return {
      agendamentosHoje: data.agendamentosHoje.map((item) =>
        mapAgendamento(item, empresaId),
      ),
      agendamentosPendentes: data.agendamentosPendentes,
      faturamentoDia: Number(data.faturamentoDia),
      faturamentoSemana: Number(data.faturamentoSemana),
      listaEspera: data.listaEspera,
      totalClientes: data.totalClientes,
      faturamentoDiario: data.faturamentoDiario.map((item) => ({
        label: item.label,
        valor: Number(item.valor),
      })),
      resumo: {
        faturamentoDia: Number(data.resumo.faturamentoDia),
        faturamentoSemana: Number(data.resumo.faturamentoSemana),
        faturamentoMes: Number(data.resumo.faturamentoMes),
      },
    }
  },
}
