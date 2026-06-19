import { useState } from 'react'
import { Building2, Clock, Settings, User } from 'lucide-react'
import { EmpresaDadosForm } from '@/components/configuracoes/EmpresaDadosForm'
import type { DadosForm } from '@/components/configuracoes/EmpresaDadosForm'
import { HorariosConfigForm } from '@/components/configuracoes/HorariosConfigForm'
import type { HorariosForm } from '@/components/configuracoes/HorariosConfigForm'
import { PreferenciasConfigForm } from '@/components/configuracoes/PreferenciasConfigForm'
import type { PreferenciasForm } from '@/components/configuracoes/PreferenciasConfigForm'
import { ContaSection } from '@/components/configuracoes/ContaSection'
import { useAuth } from '@/hooks/useAuth'
import { useEmpresaConfig } from '@/hooks/useEmpresaConfig'
import type { IntervaloSlot } from '@/types/empresaConfig'

interface ConfigSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  description?: string
}

function ConfigSection({ title, icon, children, description }: ConfigSectionProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
          {icon}
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900">{title}</h2>
          {description && (
            <p className="text-xs text-neutral-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

export function ConfiguracoesPage() {
  const { user, updateEmpresa } = useAuth()
  const { config, isLoading, isSaving, saveDados, saveHorarios, savePreferencias } =
    useEmpresaConfig()
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const isOwner = user?.role === 'owner'

  async function handleDadosSubmit(data: DadosForm) {
    const updated = await saveDados(data)
    updateEmpresa({ nome: updated.nome, logo: updated.logo })
    setSavedMessage('Dados da empresa salvos!')
    setTimeout(() => setSavedMessage(null), 3000)
  }

  async function handleHorariosSubmit(data: HorariosForm) {
    await saveHorarios({
      ...data,
      intervaloSlots: Number(data.intervaloSlots) as IntervaloSlot,
    })
    setSavedMessage('Horários salvos!')
    setTimeout(() => setSavedMessage(null), 3000)
  }

  async function handlePreferenciasSubmit(data: PreferenciasForm) {
    await savePreferencias(data)
    setSavedMessage('Preferências salvas!')
    setTimeout(() => setSavedMessage(null), 3000)
  }

  if (!user) return null

  if (isLoading || !config) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {savedMessage && (
        <div className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-neutral-900">
          {savedMessage}
        </div>
      )}

      {!isOwner && (
        <div className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
          Como administrador, você pode alterar horários e preferências. Apenas
          o proprietário pode editar os dados da empresa.
        </div>
      )}

      <ConfigSection
        title="Dados da empresa"
        description="Informações exibidas no sistema e relatórios"
        icon={<Building2 className="h-5 w-5" />}
      >
        <EmpresaDadosForm
          key={`dados-${config.nome}-${config.telefone}`}
          config={config}
          disabled={!isOwner}
          isSaving={isSaving}
          onSubmit={handleDadosSubmit}
        />
      </ConfigSection>

      <ConfigSection
        title="Horário de funcionamento"
        description="Define a janela de agendamentos na agenda"
        icon={<Clock className="h-5 w-5" />}
      >
        <HorariosConfigForm
          key={`horarios-${config.horarioAbertura}`}
          config={config}
          isSaving={isSaving}
          onSubmit={handleHorariosSubmit}
        />
      </ConfigSection>

      <ConfigSection
        title="Preferências de agendamento"
        icon={<Settings className="h-5 w-5" />}
      >
        <PreferenciasConfigForm
          key={`pref-${config.confirmacaoManual}-${config.enviarLinkConfirmacaoWhatsApp}`}
          config={config}
          isSaving={isSaving}
          onSubmit={handlePreferenciasSubmit}
        />
      </ConfigSection>

      <ConfigSection title="Conta" icon={<User className="h-5 w-5" />}>
        <ContaSection />
      </ConfigSection>
    </div>
  )
}
