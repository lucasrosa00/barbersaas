import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResumoCards } from '@/components/financeiro/ResumoCards'
import { FaturamentoChart } from '@/components/financeiro/FaturamentoChart'
import { MovimentacoesTable } from '@/components/financeiro/MovimentacoesTable'
import { MovimentacaoFormModal } from '@/components/financeiro/MovimentacaoFormModal'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Select } from '@/components/ui/Select'
import { labels } from '@/constants/terminology'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useFinanceiro } from '@/hooks/useFinanceiro'
import type { Movimentacao } from '@/types/financeiro'

export function FinanceiroPage() {
  const { user } = useAuth()
  const empresaId = user?.empresaId ?? ''
  const {
    data,
    isLoading,
    page,
    pageSize,
    setPage,
    barbeiroId,
    setBarbeiroId,
    createMovimentacao,
    deleteMovimentacao,
  } = useFinanceiro(empresaId)
  const { barbeiros } = useBarbeiros(empresaId)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingMovimentacao, setDeletingMovimentacao] = useState<Movimentacao>()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirmDelete() {
    if (!deletingMovimentacao) return

    setIsDeleting(true)
    try {
      await deleteMovimentacao(deletingMovimentacao.id)
      setDeletingMovimentacao(undefined)
    } finally {
      setIsDeleting(false)
    }
  }

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
        <div className="w-full sm:max-w-xs">
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

      <MovimentacoesTable
        movimentacoes={data.movimentacoes.items}
        page={page}
        pageSize={pageSize}
        total={data.movimentacoes.total}
        onPageChange={setPage}
        onDelete={setDeletingMovimentacao}
      />

      <MovimentacaoFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createMovimentacao}
        barbeiros={barbeiros}
      />

      <ConfirmDialog
        open={!!deletingMovimentacao}
        onClose={() => setDeletingMovimentacao(undefined)}
        onConfirm={handleConfirmDelete}
        title="Excluir movimentação"
        description={`Tem certeza que deseja excluir "${deletingMovimentacao?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={isDeleting}
      />
    </div>
  )
}
