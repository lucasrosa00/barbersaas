import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import type { EmpresaConfig } from '@/types/empresaConfig'
import {
  WHATSAPP_CONFIRMACAO_PLACEHOLDERS,
  WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO,
  getConfirmacaoWhatsAppTemplateForEdit,
} from '@/utils/whatsappConfirmacaoTemplate'

interface PreferenciasForm {
  confirmacaoManual: boolean
  enviarLinkConfirmacaoWhatsApp: boolean
  mensagemConfirmacaoWhatsApp: string
  permitirMesmoDia: boolean
}

interface PreferenciasConfigFormProps {
  config: EmpresaConfig
  isSaving?: boolean
  onSubmit: (data: PreferenciasForm) => void | Promise<void>
}

export function PreferenciasConfigForm({
  config,
  isSaving = false,
  onSubmit,
}: PreferenciasConfigFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<PreferenciasForm>({
    defaultValues: {
      confirmacaoManual: config.confirmacaoManual,
      enviarLinkConfirmacaoWhatsApp: config.enviarLinkConfirmacaoWhatsApp,
      mensagemConfirmacaoWhatsApp: getConfirmacaoWhatsAppTemplateForEdit(
        config.mensagemConfirmacaoWhatsApp,
      ),
      permitirMesmoDia: config.permitirMesmoDia,
    },
  })

  const enviarLink = watch('enviarLinkConfirmacaoWhatsApp')
  const mensagemAtual = watch('mensagemConfirmacaoWhatsApp')
  const mensagemEhPadrao = mensagemAtual.trim() === WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO

  function handleRestoreDefaultMessage() {
    setValue('mensagemConfirmacaoWhatsApp', WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO, {
      shouldDirty: true,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-neutral-400 bg-white text-neutral-900 focus:ring-neutral-400"
          {...register('confirmacaoManual')}
        />
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Exigir confirmação manual
          </p>
          <p className="text-xs text-neutral-500">
            Novos agendamentos ficam como &quot;Agendado&quot; até confirmação.
          </p>
        </div>
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-neutral-400 bg-white text-neutral-900 focus:ring-neutral-400"
          {...register('enviarLinkConfirmacaoWhatsApp')}
        />
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Incluir link de confirmação no WhatsApp
          </p>
          <p className="text-xs text-neutral-500">
            Use o placeholder{' '}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-[11px]">
              {'{link}'}
            </code>{' '}
            na mensagem para posicionar o link gerado pelo sistema.
          </p>
        </div>
      </label>

      <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">
              Mensagem de confirmação no WhatsApp
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              A mensagem padrão já vem preenchida abaixo. Edite o texto da sua
              empresa; o link é inserido onde você colocar{' '}
              <code className="rounded bg-neutral-100 px-1 py-0.5 text-[11px]">
                {'{link}'}
              </code>
              .
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2.5 text-xs"
              onClick={handleRestoreDefaultMessage}
              disabled={mensagemEhPadrao}
            >
              Restaurar padrão
            </Button>
          </div>
        </div>

        <Textarea
          label="Texto da mensagem"
          rows={12}
          className="font-mono text-xs leading-relaxed"
          {...register('mensagemConfirmacaoWhatsApp')}
        />

        <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
          <p className="mb-2 text-xs font-medium text-neutral-700">
            Placeholders disponíveis
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {WHATSAPP_CONFIRMACAO_PLACEHOLDERS.map(({ token, description }) => (
              <li key={token} className="text-xs text-neutral-600">
                <code className="rounded bg-white px-1 py-0.5 text-[11px] text-neutral-900">
                  {token}
                </code>{' '}
                — {description}
              </li>
            ))}
          </ul>
          {enviarLink && (
            <p className="mt-2 text-xs text-amber-700">
              Com o link ativo, inclua{' '}
              <code className="rounded bg-white px-1 py-0.5 text-[11px]">
                {'{link}'}
              </code>{' '}
              na mensagem para o cliente receber o endereço de confirmação.
            </p>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-neutral-400 bg-white text-neutral-900 focus:ring-neutral-400"
          {...register('permitirMesmoDia')}
        />
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Permitir agendamento no mesmo dia
          </p>
          <p className="text-xs text-neutral-500">
            Clientes podem agendar para o dia atual.
          </p>
        </div>
      </label>

      <div className="flex justify-stretch sm:justify-end">
        <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
          Salvar preferências
        </Button>
      </div>
    </form>
  )
}

export type { PreferenciasForm }
