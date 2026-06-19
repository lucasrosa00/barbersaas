import { CalendarClock, Pencil, Repeat, Trash2 } from 'lucide-react'
import { getDiaLabel } from '@/constants/diasSemana'
import { getTipoBloqueioLabel } from '@/constants/tipoBloqueio'
import type { BloqueioHorario } from '@/types/bloqueioHorario'
import { formatDateBR } from '@/utils/timeSlots'

interface BloqueiosListProps {
  bloqueios: BloqueioHorario[]
  onEdit: (bloqueio: BloqueioHorario) => void
  onDelete: (bloqueio: BloqueioHorario) => void
}

function periodoLabel(bloqueio: BloqueioHorario) {
  if (bloqueio.tipo === 'fixo' && bloqueio.dia) {
    return `Toda ${getDiaLabel(bloqueio.dia).toLowerCase()}`
  }
  if (bloqueio.data) {
    return formatDateBR(bloqueio.data)
  }
  return '—'
}

export function BloqueiosList({
  bloqueios,
  onEdit,
  onDelete,
}: BloqueiosListProps) {
  if (bloqueios.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <CalendarClock className="mx-auto mb-3 h-8 w-8 text-neutral-400" />
        <p className="text-sm text-neutral-500">
          Nenhum bloqueio cadastrado para os filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {bloqueios.map((bloqueio) => (
          <article
            key={bloqueio.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{bloqueio.barbeiroNome}</p>
                <p className="mt-0.5 text-sm text-neutral-600">{bloqueio.motivo}</p>
              </div>
              <span
                className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  bloqueio.tipo === 'fixo'
                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                    : 'border-slate-300 bg-slate-100 text-slate-800'
                }`}
              >
                {bloqueio.tipo === 'fixo' ? (
                  <Repeat className="h-3 w-3" />
                ) : (
                  <CalendarClock className="h-3 w-3" />
                )}
                {getTipoBloqueioLabel(bloqueio.tipo)}
              </span>
            </div>

            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Quando</dt>
                <dd className="text-right text-neutral-700">{periodoLabel(bloqueio)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Horário</dt>
                <dd className="text-neutral-700">
                  {bloqueio.horarioInicio} — {bloqueio.horarioFim}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(bloqueio)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(bloqueio)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-neutral-200 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">Profissional</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Tipo</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Quando</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Horário</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Motivo</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {bloqueios.map((bloqueio) => (
                <tr key={bloqueio.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {bloqueio.barbeiroNome}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        bloqueio.tipo === 'fixo'
                          ? 'border-amber-200 bg-amber-50 text-amber-900'
                          : 'border-slate-300 bg-slate-100 text-slate-800'
                      }`}
                    >
                      {bloqueio.tipo === 'fixo' ? (
                        <Repeat className="h-3 w-3" />
                      ) : (
                        <CalendarClock className="h-3 w-3" />
                      )}
                      {getTipoBloqueioLabel(bloqueio.tipo)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{periodoLabel(bloqueio)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                    {bloqueio.horarioInicio} — {bloqueio.horarioFim}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-neutral-600">
                    {bloqueio.motivo}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(bloqueio)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                        aria-label={`Editar bloqueio de ${bloqueio.barbeiroNome}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(bloqueio)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-600"
                        aria-label={`Excluir bloqueio de ${bloqueio.barbeiroNome}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
