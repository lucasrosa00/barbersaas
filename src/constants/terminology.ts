/** Rótulos genéricos exibidos na interface (API interna mantém nomes legados). */

export const branding = {
  appName: 'Agenda Fácil',
  description:
    'Agendamentos, equipe e clientes em um só lugar. Multiempresa, pronto para escalar.',
  themeColor: '#6d28d9',
} as const

export const appLogoUrl = `${import.meta.env.BASE_URL}logo.png`

export const ROUTES = {
  professionals: '/profissionais',
} as const

export const labels = {
  appName: branding.appName,

  professional: {
    one: 'Profissional',
    many: 'Profissionais',
    oneLower: 'profissional',
    manyLower: 'profissionais',
    select: 'Selecione o profissional',
    selectRequired: 'Selecione um profissional',
    preferred: 'Profissional preferencial',
    all: 'Todos os profissionais',
    noneRegistered: 'Nenhum profissional cadastrado',
    noneRegisteredInCompany: 'Nenhum profissional cadastrado nesta empresa.',
    noneFound: 'Nenhum profissional encontrado.',
    noneForAgenda: 'Nenhum profissional cadastrado para exibir a agenda.',
    new: 'Novo Profissional',
    edit: 'Editar Profissional',
    deleteTitle: 'Excluir profissional',
    registeredCount: (total: number) =>
      total === 1 ? 'profissional cadastrado' : 'profissionais cadastrados',
    available: 'Profissionais disponíveis',
    optional: 'Profissional',
    optionalNone: 'Nenhum (opcional)',
    selectWithService: 'Selecione profissional e serviço',
    noSlots:
      'Nenhum horário disponível para este profissional com a duração do serviço selecionado.',
    selectAtLeastOne: 'Selecione ao menos um profissional',
    showingAgenda: (name: string) => `Exibindo a agenda de ${name}`,
  },

  specialties: {
    label: 'Especialidades',
    placeholder: 'Atendimento, Consultoria, Suporte',
    hint: 'Separe as especialidades por vírgula',
    required: 'Informe ao menos uma especialidade',
  },

  service: {
    namePlaceholder: 'Ex: Consulta, Sessão, Atendimento',
  },

  movement: {
    descriptionPlaceholder: 'Ex: Compra de materiais, serviço avulso...',
  },

  public: {
    headline: 'Gerencie sua empresa com inteligência',
    subheadline: branding.description,
  },
} as const
