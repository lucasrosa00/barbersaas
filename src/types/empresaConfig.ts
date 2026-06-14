export type IntervaloSlot = 15 | 30 | 60

export interface EmpresaConfig {
  id: string
  nome: string
  logo: string
  telefone: string
  endereco: string
  horarioAbertura: string
  horarioFechamento: string
  intervaloSlots: IntervaloSlot
  confirmacaoManual: boolean
  permitirMesmoDia: boolean
}

export type EmpresaConfigFormData = Omit<EmpresaConfig, 'id'>

export interface PreferenciasAgendamento {
  confirmacaoManual: boolean
  permitirMesmoDia: boolean
  intervaloSlots: IntervaloSlot
}

export interface HorariosFuncionamento {
  horarioAbertura: string
  horarioFechamento: string
  intervaloSlots: IntervaloSlot
}
