# Roadmap SaaS de Agendamento para Barbearias (Multiempresa)

## Tecnologias
- React
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- React Hook Form
- Zod
- Lucide React
- Recharts

---

# ETAPA 0 - Autenticação e Multiempresa

Você é um desenvolvedor Front-End Senior especialista em React, TypeScript, UX/UI e sistemas SaaS.

Vamos iniciar um sistema SaaS Multiempresa para Barbearias utilizando React + TypeScript.

IMPORTANTE:

O sistema será vendido para múltiplas empresas.

Portanto toda a arquitetura deve ser preparada para multi-tenant.

Neste momento ainda não existe backend.

Utilizar apenas dados mockados.

Estruture o projeto para futura integração com autenticação JWT e banco de dados.

Criar:

- Tela de Login
- Tela de Recuperação de Senha
- Layout Público
- Layout Privado

Criar Context de Autenticação mockado.

Criar mock de usuários:

Empresa:
- id
- nome
- logo

Usuário:
- id
- nome
- email
- empresaId
- role

Roles:
- owner
- admin

Ao efetuar login, armazenar usuário logado no contexto.

Proteger rotas privadas.

Criar redirecionamento automático para login caso não esteja autenticado.

Criar estrutura preparada para futura integração com API.

Explique toda a arquitetura criada.

---

# ETAPA 1 - Layout Base

Crie apenas a estrutura visual do sistema.

Requisitos:

- Sidebar fixa à esquerda.
- Header superior.
- Área principal de conteúdo.
- Menu lateral com:
  - Dashboard
  - Clientes
  - Barbeiros
  - Serviços
  - Agenda
  - Histórico
  - Financeiro
  - Configurações da Empresa

Utilize React Router.

Crie páginas vazias para cada rota.

Não implemente funcionalidades ainda.

Crie componentes reutilizáveis para:
- Sidebar
- Header
- Layout Principal

Explique toda a estrutura criada.

---

# ETAPA 2 - Módulo Clientes

Agora implemente apenas o módulo Clientes.

Utilize dados mockados.

Cada cliente possui:

- id
- nome
- telefone
- dataNascimento
- observacoes

Funcionalidades:

- Listagem em tabela
- Campo de busca por nome
- Botão Novo Cliente
- Modal de cadastro
- Modal de edição
- Exclusão com confirmação

Crie:

- Tipagem TypeScript
- Arquivo mock
- Componentes reutilizáveis

Não conecte API.

Explique toda a estrutura criada.

---

# ETAPA 3 - Módulo Barbeiros

Agora implemente o módulo Barbeiros.

Dados mockados:

- id
- nome
- telefone
- especialidades
- diasTrabalho
- horarioInicio
- horarioFim

Funcionalidades:

- Listagem
- Cadastro
- Edição
- Exclusão

Exibir card com informações do barbeiro.

Utilizar os mesmos padrões visuais do módulo Clientes.

Não criar backend.

Explique toda a estrutura criada.

---

# ETAPA 4 - Serviços

Agora implemente o módulo Serviços.

Dados:

- id
- nome
- valor
- duracaoMinutos
- barbeirosDisponiveis

Funcionalidades:

- Cadastro
- Edição
- Exclusão
- Listagem

Exibir:
- Nome
- Valor
- Duração

Preparar estrutura para futura integração com API.

Explique toda a estrutura criada.

---

# ETAPA 5 - Agenda

Agora implemente o módulo Agenda.

Dados mockados:

Clientes
Barbeiros
Serviços

Criar visual semelhante a agenda de salão/barbearia.

Layout:

Colunas:
- Cada barbeiro é uma coluna

Linhas:
- Horários de atendimento

Exemplo:

09:00
10:00
11:00

Dentro dos horários exibir:

- Cliente
- Serviço
- Status

Status:

- Agendado
- Confirmado
- Em atendimento
- Finalizado
- Cancelado

Funcionalidades:

- Criar agendamento
- Editar agendamento
- Cancelar agendamento

Utilizar modal.

Não utilizar bibliotecas complexas de calendário.

Criar estrutura própria utilizando React.

Explicar toda a implementação.

---

# ETAPA 6 - Histórico

Implementar módulo Histórico.

Dados:

- Cliente
- Serviço
- Barbeiro
- Data
- Valor
- Status

Funcionalidades:

- Tabela
- Filtro por cliente
- Filtro por barbeiro
- Filtro por período

Dados mockados.

Explicar toda a estrutura criada.

---

# ETAPA 7 - Financeiro

Implementar módulo Financeiro.

Dados mockados.

Exibir:

- Faturamento do dia
- Faturamento da semana
- Faturamento do mês

Criar gráficos utilizando Recharts.

Criar:

- Cards de resumo
- Tabela de movimentações

Preparar estrutura para futura API.

Explicar toda a implementação.

---

# ETAPA 8 - Lista de Espera

Implementar módulo Lista de Espera.

Dados:

- Cliente
- Serviço desejado
- Barbeiro preferencial
- Data solicitada

Funcionalidades:

- Adicionar cliente na fila
- Remover cliente da fila
- Alterar posição
- Converter para agendamento

Utilizar dados mockados.

Preparar para integração futura com API.

Explicar toda a implementação.
