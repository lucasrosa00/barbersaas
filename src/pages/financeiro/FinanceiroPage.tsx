import { ResumoCards } from '@/components/financeiro/ResumoCards'
import { FaturamentoChart } from '@/components/financeiro/FaturamentoChart'
import { MovimentacoesTable } from '@/components/financeiro/MovimentacoesTable'
import { useAuth } from '@/hooks/useAuth'
import { useFinanceiro } from '@/hooks/useFinanceiro'

export function FinanceiroPage() {
  const { user } = useAuth()
  const { data, isLoading } = useFinanceiro(user?.empresaId ?? '')

  if (!user) return null

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ResumoCards resumo={data.resumo} />

      <div className="grid gap-4 lg:grid-cols-2">
        <FaturamentoChart
          title="Faturamento — últimos 7 dias"
          data={data.faturamentoDiario}
        />
        <FaturamentoChart
          title="Faturamento — últimos 6 meses"
          data={data.faturamentoMensal}
          color="#525252"
        />
      </div>

      <MovimentacoesTable movimentacoes={data.movimentacoes} />
    </div>
  )
}
