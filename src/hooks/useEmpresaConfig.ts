import { useCallback, useEffect, useState } from 'react'
import { empresaService } from '@/services/empresa/empresaService'
import type { EmpresaConfig, EmpresaConfigFormData } from '@/types/empresaConfig'
import type { DadosForm } from '@/components/configuracoes/EmpresaDadosForm'
import type { HorariosForm } from '@/components/configuracoes/HorariosConfigForm'
import type { PreferenciasForm } from '@/components/configuracoes/PreferenciasConfigForm'

export function useEmpresaConfig() {
  const [config, setConfig] = useState<EmpresaConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await empresaService.get()
      setConfig(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const saveDados = useCallback(async (data: DadosForm) => {
    setIsSaving(true)
    try {
      const updated = await empresaService.updateDados(data)
      setConfig(updated)
      return updated
    } finally {
      setIsSaving(false)
    }
  }, [])

  const saveHorarios = useCallback(async (data: HorariosForm) => {
    setIsSaving(true)
    try {
      const updated = await empresaService.updateHorarios({
        horarioAbertura: data.horarioAbertura,
        horarioFechamento: data.horarioFechamento,
        intervaloSlots: Number(data.intervaloSlots) as EmpresaConfig['intervaloSlots'],
      })
      setConfig(updated)
      return updated
    } finally {
      setIsSaving(false)
    }
  }, [])

  const savePreferencias = useCallback(async (data: PreferenciasForm) => {
    setIsSaving(true)
    try {
      const updated = await empresaService.updatePreferencias(data)
      setConfig(updated)
      return updated
    } finally {
      setIsSaving(false)
    }
  }, [])

  const save = useCallback(
    async (data: EmpresaConfigFormData) => {
      setIsSaving(true)
      try {
        await empresaService.updateDados({
          nome: data.nome,
          logo: data.logo,
          telefone: data.telefone,
          endereco: data.endereco,
        })
        await empresaService.updateHorarios({
          horarioAbertura: data.horarioAbertura,
          horarioFechamento: data.horarioFechamento,
          intervaloSlots: data.intervaloSlots,
        })
        const updated = await empresaService.updatePreferencias({
          confirmacaoManual: data.confirmacaoManual,
          enviarLinkConfirmacaoWhatsApp: data.enviarLinkConfirmacaoWhatsApp,
          permitirMesmoDia: data.permitirMesmoDia,
        })
        setConfig(updated)
        return updated
      } finally {
        setIsSaving(false)
      }
    },
    [],
  )

  return {
    config,
    isLoading,
    isSaving,
    save,
    saveDados,
    saveHorarios,
    savePreferencias,
    reload: load,
  }
}
