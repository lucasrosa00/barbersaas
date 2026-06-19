import { apiClient } from '@/services/api/client'
import type {
  EmpresaConfig,
  EmpresaConfigFormData,
  IntervaloSlot,
} from '@/types/empresaConfig'

interface EmpresaConfigApiDto {
  id: string
  nome: string
  logo: string
  telefone: string
  endereco: string
  horarioAbertura: string
  horarioFechamento: string
  intervaloSlots: IntervaloSlot
  confirmacaoManual: boolean
  enviarLinkConfirmacaoWhatsApp: boolean
  permitirMesmoDia: boolean
}

function mapConfig(dto: EmpresaConfigApiDto): EmpresaConfig {
  return {
    id: dto.id,
    nome: dto.nome,
    logo: dto.logo,
    telefone: dto.telefone,
    endereco: dto.endereco,
    horarioAbertura: dto.horarioAbertura,
    horarioFechamento: dto.horarioFechamento,
    intervaloSlots: Number(dto.intervaloSlots) as IntervaloSlot,
    confirmacaoManual: dto.confirmacaoManual,
    enviarLinkConfirmacaoWhatsApp: dto.enviarLinkConfirmacaoWhatsApp,
    permitirMesmoDia: dto.permitirMesmoDia,
  }
}

export const empresaService = {
  async get(): Promise<EmpresaConfig> {
    const data = await apiClient<EmpresaConfigApiDto>('/empresa/config')
    return mapConfig(data)
  },

  async updateDados(data: Pick<EmpresaConfigFormData, 'nome' | 'logo' | 'telefone' | 'endereco'>) {
    const updated = await apiClient<EmpresaConfigApiDto>('/empresa/config/dados', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return mapConfig(updated)
  },

  async updateHorarios(
    data: Pick<
      EmpresaConfigFormData,
      'horarioAbertura' | 'horarioFechamento' | 'intervaloSlots'
    >,
  ) {
    const updated = await apiClient<EmpresaConfigApiDto>('/empresa/config/horarios', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return mapConfig(updated)
  },

  async updatePreferencias(
    data: Pick<
      EmpresaConfigFormData,
      'confirmacaoManual' | 'enviarLinkConfirmacaoWhatsApp' | 'permitirMesmoDia'
    >,
  ) {
    const updated = await apiClient<EmpresaConfigApiDto>(
      '/empresa/config/preferencias',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    )
    return mapConfig(updated)
  },
}
