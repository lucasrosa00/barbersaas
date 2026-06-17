import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { ResumoCards } from '@/components/financeiro/ResumoCards'
import { FaturamentoChart } from '@/components/financeiro/FaturamentoChart'
import { MovimentacoesTable } from '@/components/financeiro/MovimentacoesTable'
import { MovimentacaoFormModal } from '@/components/financeiro/MovimentacaoFormModal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { labels } from '@/constants/terminology'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useFinanceiro } from '@/hooks/useFinanceiro'
import { filterFinanceiroByBarbeiro } from '@/utils/financeiro'

export function FinanceiroPage() {
  const { user } = useAuth()
  const empresaId = user?.empresaId ?? ''
  const { data, isLoading, createMovimentacao } = useFinanceiro(empresaId)
  const { barbeiros } = useBarbeiros(empresaId)
  const [formOpen, setFormOpen] = useState(false)
  const [barbeiroId, setBarbeiroId] = useState('')

  const filteredData = useMemo(
    () => (data ? filterFinanceiroByBarbeiro(data, barbeiroId) : null),
    [data, barbeiroId],
  )

  if (!user) return null

  if (isLoading || !data || !filteredData) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm text-neutral-500 sm:max-w-xl">
          Agendamentos finalizados geram entradas automaticamente. Use o botão abaixo
          para registrar receitas ou despesas manuais.
        </p>
        <Button onClick={() => setFormOpen(true)} className="w-full shrink-0 sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova movimentação
        </Button>
      </div>

      {barbeiros.length > 0 && (
        <div className="max-w-xs">
          <Select
            label={labels.professional.one}
            value={barbeiroId}
            onChange={(e) => setBarbeiroId(e.target.value)}
            options={[
              { value: '', label: labels.professional.all },
              ...barbeiros.map((b) => ({ value: b.id, label: b.nome })),
            ]}
          />
        </div>
      )}

      <ResumoCards resumo={filteredData.resumo} />

      <div className="grid gap-4 lg:grid-cols-2">
        <FaturamentoChart
          title="Faturamento — últimos 7 dias"
          data={filteredData.faturamentoDiario}
        />
        <FaturamentoChart
          title="Faturamento — últimos 6 meses"
          data={filteredData.faturamentoMensal}
          color="#525252"
        />
      </div>

      <MovimentacoesTable movimentacoes={filteredData.movimentacoes} />

      <MovimentacaoFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createMovimentacao}
        barbeiros={barbeiros}
      />
    </div>
  )
}
