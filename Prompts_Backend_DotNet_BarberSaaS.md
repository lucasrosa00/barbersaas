# Roadmap Backend — BarberSaaS (.NET 8)

> **Objetivo:** Criar a API REST completa para o frontend React já existente neste repositório.  
> **Público:** Iniciante em backend — siga **uma etapa por vez**, só avance quando a anterior estiver funcionando.  
> **Stack:** .NET 8, ASP.NET Core Web API, Entity Framework Core, PostgreSQL (ou SQL Server), JWT, FluentValidation.

---

## Antes de começar

### O que o frontend já tem (e a API deve espelhar)

| Módulo | Entidades / Dados | Regras importantes |
|--------|-------------------|-------------------|
| Auth | Usuário, Empresa, JWT | Multi-tenant por `empresaId`; roles `owner` e `admin` |
| Clientes | CRUD + busca por nome | Filtrado por empresa |
| Barbeiros | CRUD + especialidades + dias + horários | `horarioFim > horarioInicio` |
| Serviços | CRUD + barbeiros disponíveis | Many-to-many com barbeiros |
| Agenda | CRUD + cancelar | Conflito de horário **por data**; slots de 15 min; duração do serviço |
| Lista de Espera | CRUD + reordenar + converter | Posição sequencial por empresa |
| Histórico | Listagem filtrada | Derivado de agendamentos (ou tabela dedicada) |
| Financeiro | Resumo + gráficos + movimentações | Entrada/saída por empresa |
| Dashboard | KPIs agregados | Combina agenda, financeiro, lista, clientes |
| Configurações | Dados da empresa + horários + preferências | Owner edita dados; admin edita horários/preferências |

### Contas de demonstração (seed obrigatório)

| E-mail | Senha | Empresa | Role |
|--------|-------|---------|------|
| joao@barbeariadojoao.com | 123456 | emp-001 | owner |
| maria@barbeariadojoao.com | 123456 | emp-001 | admin |
| carlos@corteestilo.com | 123456 | emp-002 | owner |

### Estrutura final de pastas (visão geral)

```
c:\Git\
├── sistema-agendamento-empresas\     ← frontend (já existe)
└── barbersaas-api\                   ← backend (você vai criar)
    ├── BarberSaaS.sln
    ├── src\
    │   ├── BarberSaaS.Domain\
    │   ├── BarberSaaS.Application\
    │   ├── BarberSaaS.Infrastructure\
    │   └── BarberSaaS.Api\
    └── tests\
        └── BarberSaaS.Tests\
```

### Arquitetura (Clean Architecture simplificada)

```
Domain        → Entidades, Enums, Interfaces de repositório (sem dependências externas)
Application   → DTOs, Services, Validators, Interfaces de serviços
Infrastructure→ EF Core, DbContext, Repositórios, JWT, Seed
Api           → Controllers, Middleware, Program.cs, Swagger, CORS
```

**Regra de ouro:** Domain não referencia ninguém. Application referencia Domain. Infrastructure referencia Application + Domain. Api referencia Application + Infrastructure.

---

## ETAPA 0 — Pré-requisitos e ambiente

### 0.1 Instalar ferramentas

Instale na ordem:

1. **.NET 8 SDK** — https://dotnet.microsoft.com/download/dotnet/8.0  
   Verifique: `dotnet --version` (deve mostrar 8.x)

2. **PostgreSQL** (recomendado) **OU SQL Server Express**  
   - PostgreSQL: https://www.postgresql.org/download/windows/  
   - Crie usuário/senha e anote: `Host`, `Port`, `Database`, `Username`, `Password`

3. **pgAdmin** ou **Azure Data Studio** (opcional, para ver o banco)

4. **Postman** ou **Insomnia** (testar endpoints)

5. **Git** (já deve ter)

### 0.2 Criar pasta do backend

Abra o terminal na pasta `c:\Git`:

```powershell
cd c:\Git
mkdir barbersaas-api
cd barbersaas-api
```

### 0.3 Criar a solution e os projetos

Execute **um comando por vez** e confira se não deu erro:

```powershell
dotnet new sln -n BarberSaaS

dotnet new classlib -n BarberSaaS.Domain -o src/BarberSaaS.Domain -f net8.0
dotnet new classlib -n BarberSaaS.Application -o src/BarberSaaS.Application -f net8.0
dotnet new classlib -n BarberSaaS.Infrastructure -o src/BarberSaaS.Infrastructure -f net8.0
dotnet new webapi -n BarberSaaS.Api -o src/BarberSaaS.Api -f net8.0 --use-controllers
dotnet new xunit -n BarberSaaS.Tests -o tests/BarberSaaS.Tests -f net8.0

dotnet sln add src/BarberSaaS.Domain
dotnet sln add src/BarberSaaS.Application
dotnet sln add src/BarberSaaS.Infrastructure
dotnet sln add src/BarberSaaS.Api
dotnet sln add tests/BarberSaaS.Tests
```

### 0.4 Configurar referências entre projetos

```powershell
dotnet add src/BarberSaaS.Application reference src/BarberSaaS.Domain
dotnet add src/BarberSaaS.Infrastructure reference src/BarberSaaS.Application
dotnet add src/BarberSaaS.Infrastructure reference src/BarberSaaS.Domain
dotnet add src/BarberSaaS.Api reference src/BarberSaaS.Application
dotnet add src/BarberSaaS.Api reference src/BarberSaaS.Infrastructure
dotnet add tests/BarberSaaS.Tests reference src/BarberSaaS.Application
dotnet add tests/BarberSaaS.Tests reference src/BarberSaaS.Domain
```

### 0.5 Pacotes NuGet (Application + Infrastructure + Api)

**Application:**

```powershell
dotnet add src/BarberSaaS.Application package FluentValidation
dotnet add src/BarberSaaS.Application package FluentValidation.DependencyInjectionExtensions
dotnet add src/BarberSaaS.Application package Microsoft.Extensions.DependencyInjection.Abstractions
```

**Infrastructure:**

```powershell
dotnet add src/BarberSaaS.Infrastructure package Microsoft.EntityFrameworkCore
dotnet add src/BarberSaaS.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add src/BarberSaaS.Infrastructure package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add src/BarberSaaS.Infrastructure package BCrypt.Net-Next
dotnet add src/BarberSaaS.Infrastructure package Microsoft.Extensions.Configuration.Abstractions
```

> Se usar **SQL Server** em vez de PostgreSQL, troque `Npgsql.EntityFrameworkCore.PostgreSQL` por `Microsoft.EntityFrameworkCore.SqlServer`.

**Api:**

```powershell
dotnet add src/BarberSaaS.Api package Microsoft.EntityFrameworkCore.Design
dotnet add src/BarberSaaS.Api package Swashbuckle.AspNetCore
```

**Ferramenta global EF (uma vez no PC):**

```powershell
dotnet tool install --global dotnet-ef
```

### 0.6 Primeiro build

```powershell
dotnet build
```

Deve compilar **sem erros**. Se falhar, corrija antes de continuar.

### 0.7 Checklist ETAPA 0

- [ ] `dotnet --version` = 8.x
- [ ] Banco instalado e credenciais anotadas
- [ ] Solution com 5 projetos criada
- [ ] Referências configuradas
- [ ] `dotnet build` OK

---

## ETAPA 1 — Domain (Entidades e Enums)

> **Prompt para executar:**  
> "Implemente a camada Domain do BarberSaaS conforme ETAPA 1 do Prompts_Backend_DotNet_BarberSaaS.md"

### 1.1 Criar enums em `BarberSaaS.Domain/Enums/`

```csharp
// UserRole.cs
public enum UserRole { Owner = 1, Admin = 2 }

// AgendamentoStatus.cs
public enum AgendamentoStatus
{
    Agendado = 1,
    Confirmado = 2,
    EmAtendimento = 3,
    Finalizado = 4,
    Cancelado = 5
}

// DiaSemana.cs
public enum DiaSemana { Seg = 1, Ter = 2, Qua = 3, Qui = 4, Sex = 5, Sab = 6, Dom = 7 }

// TipoMovimentacao.cs
public enum TipoMovimentacao { Entrada = 1, Saida = 2 }

// IntervaloSlot.cs
public enum IntervaloSlot { Minutos15 = 15, Minutos30 = 30, Minutos60 = 60 }
```

### 1.2 Entidade base multi-tenant

Crie `BarberSaaS.Domain/Common/BaseEntity.cs`:

```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public abstract class TenantEntity : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;
}
```

### 1.3 Entidades principais

Crie em `BarberSaaS.Domain/Entities/`:

| Entidade | Campos principais |
|----------|-------------------|
| `Empresa` | Nome, Logo, Telefone, Endereco, HorarioAbertura, HorarioFechamento, IntervaloSlots, ConfirmacaoManual, PermitirMesmoDia |
| `Usuario` | Nome, Email, PasswordHash, Role, EmpresaId |
| `Cliente` | Nome, Telefone, DataNascimento, Observacoes, EmpresaId |
| `Barbeiro` | Nome, Telefone, HorarioInicio, HorarioFim, EmpresaId |
| `BarbeiroEspecialidade` | BarbeiroId, Nome (string) |
| `BarbeiroDiaTrabalho` | BarbeiroId, Dia (enum) |
| `Servico` | Nome, Valor (decimal), DuracaoMinutos, EmpresaId |
| `ServicoBarbeiro` | ServicoId, BarbeiroId (tabela de junção) |
| `Agendamento` | ClienteId, BarbeiroId, ServicoId, Data (DateOnly), Horario (TimeOnly), Status |
| `ListaEsperaItem` | ClienteId, ServicoId, BarbeiroId? (nullable), DataSolicitada, Posicao |
| `Movimentacao` | Descricao, Data, Valor, Tipo, BarbeiroId?, AgendamentoId? (opcional) |

**Observações importantes:**

- Use `DateOnly` para datas (`data`, `dataSolicitada`, `dataNascimento`)
- Use `TimeOnly` para horários (`horario`, `horarioInicio`, `horarioFim`)
- `ListaEsperaItem.BarbeiroId` pode ser **null** (= sem preferência)
- Agendamentos cancelados **não** entram em conflito de horário

### 1.4 Interfaces de repositório (opcional mas recomendado)

Em `BarberSaaS.Domain/Interfaces/`:

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}
```

Crie interfaces específicas quando precisar de queries customizadas (`IAgendamentoRepository`, `IUsuarioRepository`, etc.).

### 1.5 Checklist ETAPA 1

- [ ] Todos os enums criados
- [ ] Todas as entidades com navegações corretas
- [ ] `dotnet build` OK

---

## ETAPA 2 — Infrastructure (Banco de Dados + EF Core)

> **Prompt:** "Implemente DbContext, configurações EF, migrations e seed conforme ETAPA 2"

### 2.1 Connection string

Em `BarberSaaS.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=barbersaas;Username=postgres;Password=SUA_SENHA"
  },
  "Jwt": {
    "Secret": "BarberSaaS-Super-Secret-Key-Min-32-Chars!!",
    "Issuer": "BarberSaaS",
    "Audience": "BarberSaaS",
    "ExpirationHours": 8
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

> **Nunca** commite senhas reais. Use User Secrets em produção:
> `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..." --project src/BarberSaaS.Api`

### 2.2 DbContext

Crie `BarberSaaS.Infrastructure/Persistence/AppDbContext.cs`:

- `DbSet` para cada entidade
- **Global Query Filter** multi-tenant (exemplo):

```csharp
modelBuilder.Entity<Cliente>()
    .HasQueryFilter(c => c.EmpresaId == _tenantProvider.EmpresaId);
```

> Para entidades tenant, aplique filtro por `EmpresaId` vindo do usuário logado via `ITenantProvider`.

### 2.3 Configurações Fluent API

Em `BarberSaaS.Infrastructure/Persistence/Configurations/`:

- Índice único: `Usuario.Email`
- Índice composto: `Agendamento (EmpresaId, BarbeiroId, Data, Horario)`
- `Servico.Valor` → `decimal(10,2)`
- `BarbeiroEspecialidade` e `BarbeiroDiaTrabalho` → relacionamento 1:N com Barbeiro
- `ServicoBarbeiro` → chave composta `(ServicoId, BarbeiroId)`
- `ListaEsperaItem` → índice `(EmpresaId, Posicao)`

### 2.4 Migration inicial

Na raiz `barbersaas-api`:

```powershell
dotnet ef migrations add InitialCreate --project src/BarberSaaS.Infrastructure --startup-project src/BarberSaaS.Api
dotnet ef database update --project src/BarberSaaS.Infrastructure --startup-project src/BarberSaaS.Api
```

### 2.5 Seed de dados (espelhar mocks do frontend)

Crie `BarberSaaS.Infrastructure/Persistence/Seed/DbSeeder.cs`:

- Empresa `emp-001` → Barbearia do João (use Guid fixo ou mapeie IDs string do front para Guid)
- Usuários João e Maria com senha **BCrypt** de `123456`
- 3–5 clientes, 2 barbeiros, 4 serviços, agendamentos de exemplo
- Movimentações financeiras de exemplo
- Itens na lista de espera

**Dica para iniciante:** use IDs Guid fixos no seed para facilitar debug:

```csharp
public static readonly Guid EmpresaJoaoId = Guid.Parse("11111111-1111-1111-1111-111111111101");
```

### 2.6 Registrar DbContext no Program.cs (Api)

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 2.7 Checklist ETAPA 2

- [ ] Banco criado no PostgreSQL
- [ ] Migration aplicada
- [ ] Seed executado ao iniciar a API (ou comando separado)
- [ ] Tabelas visíveis no pgAdmin

---

## ETAPA 3 — Autenticação JWT e Multi-tenant

> **Prompt:** "Implemente auth JWT, ITenantProvider e middleware conforme ETAPA 3"

### 3.1 DTOs (Application/DTOs/Auth/)

```csharp
public record LoginRequest(string Email, string Password);
public record ForgotPasswordRequest(string Email);
public record AuthResponse(AuthUserDto User, string Token);

public record AuthUserDto(
    Guid Id, string Nome, string Email, Guid EmpresaId,
    string Role, EmpresaDto Empresa);

public record EmpresaDto(Guid Id, string Nome, string Logo);
```

### 3.2 Serviço de autenticação

`IAuthService` / `AuthService`:

1. Buscar usuário por e-mail (case insensitive)
2. Validar senha com `BCrypt.Verify`
3. Gerar JWT com claims:
   - `sub` → UserId
   - `email`
   - `empresaId`
   - `role` → owner | admin
4. Retornar `AuthResponse` igual ao frontend

### 3.3 Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | Não | Login |
| POST | `/api/auth/forgot-password` | Não | Recuperação (mock: só valida se e-mail existe) |
| GET | `/api/auth/me` | Sim | Usuário logado |

### 3.4 ITenantProvider

```csharp
public interface ITenantProvider
{
    Guid EmpresaId { get; }
    Guid UserId { get; }
    string Role { get; }
    bool IsOwner { get; }
}
```

Implementação lê claims do `HttpContext` após autenticação JWT.

### 3.5 Configurar JWT no Program.cs

- `AddAuthentication(JwtBearerDefaults.AuthenticationScheme)`
- `AddAuthorization` com policy `OwnerOnly` para dados da empresa

### 3.6 Testar no Swagger/Postman

```json
POST /api/auth/login
{ "email": "joao@barbeariadojoao.com", "password": "123456" }
```

Deve retornar `token` + `user` com `empresa`.

### 3.7 Checklist ETAPA 3

- [ ] Login funciona
- [ ] Token inválido retorna 401
- [ ] `/api/auth/me` retorna usuário correto
- [ ] Claim `empresaId` presente no token

---

## ETAPA 4 — Módulo Clientes

> **Prompt:** "Implemente CRUD de Clientes conforme ETAPA 4"

### 4.1 Endpoints

Base: `/api/clientes` (todos exigem `[Authorize]`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/clientes?search=` | Lista (filtro opcional por nome) |
| GET | `/api/clientes/{id}` | Detalhe |
| POST | `/api/clientes` | Criar |
| PUT | `/api/clientes/{id}` | Atualizar |
| DELETE | `/api/clientes/{id}` | Excluir |

### 4.2 DTOs

```csharp
public record ClienteDto(Guid Id, string Nome, string Telefone,
    DateOnly DataNascimento, string Observacoes);

public record CreateClienteRequest(string Nome, string Telefone,
    DateOnly DataNascimento, string Observacoes);
```

### 4.3 Validação (FluentValidation)

- Nome obrigatório
- Telefone obrigatório
- DataNascimento obrigatória

### 4.4 Regras

- Todo cliente pertence à `EmpresaId` do token (nunca confie no body)
- Retornar 404 se cliente de outra empresa (ou 403)

### 4.5 Checklist ETAPA 4

- [ ] CRUD completo testado no Postman
- [ ] Busca por nome funciona
- [ ] Usuário de emp-002 não vê clientes de emp-001

---

## ETAPA 5 — Módulo Barbeiros

> **Prompt:** "Implemente CRUD de Barbeiros conforme ETAPA 5"

### 5.1 Endpoints

| Método | Rota |
|--------|------|
| GET | `/api/barbeiros?search=` |
| GET | `/api/barbeiros/{id}` |
| POST | `/api/barbeiros` |
| PUT | `/api/barbeiros/{id}` |
| DELETE | `/api/barbeiros/{id}` |

### 5.2 Request body

```csharp
public record BarbeiroRequest(
    string Nome,
    string Telefone,
    List<string> Especialidades,
    List<DiaSemana> DiasTrabalho,
    TimeOnly HorarioInicio,
    TimeOnly HorarioFim);
```

### 5.3 Validações

- Ao menos 1 especialidade
- Ao menos 1 dia de trabalho
- `HorarioFim > HorarioInicio`

### 5.4 Response

Incluir arrays `especialidades` e `diasTrabalho` como no frontend (`seg`, `ter`, etc. — serializar enum como string minúscula).

### 5.5 Checklist ETAPA 5

- [ ] CRUD OK
- [ ] Especialidades e dias persistidos
- [ ] Validação de horário funciona

---

## ETAPA 6 — Módulo Serviços

> **Prompt:** "Implemente CRUD de Serviços conforme ETAPA 6"

### 6.1 Endpoints

| Método | Rota |
|--------|------|
| GET | `/api/servicos?search=` |
| POST | `/api/servicos` |
| PUT | `/api/servicos/{id}` |
| DELETE | `/api/servicos/{id}` |

### 6.2 Request

```csharp
public record ServicoRequest(
    string Nome,
    decimal Valor,
    int DuracaoMinutos,
    List<Guid> BarbeirosDisponiveis);
```

### 6.3 Validações

- Valor > 0
- Duração >= 5 minutos
- Ao menos 1 barbeiro disponível
- Barbeiros devem pertencer à mesma empresa

### 6.4 Response

```csharp
public record ServicoDto(
    Guid Id, string Nome, decimal Valor,
    int DuracaoMinutos, List<Guid> BarbeirosDisponiveis);
```

### 6.5 Checklist ETAPA 6

- [ ] Many-to-many Servico ↔ Barbeiro funciona
- [ ] Atualizar serviço substitui lista de barbeiros corretamente

---

## ETAPA 7 — Módulo Agenda (Agendamentos)

> **Prompt:** "Implemente Agenda com validação de conflito conforme ETAPA 7"

### 7.1 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/agendamentos?data=2025-06-12` | Lista (filtro data opcional) |
| GET | `/api/agendamentos/{id}` | Detalhe |
| POST | `/api/agendamentos` | Criar |
| PUT | `/api/agendamentos/{id}` | Editar |
| PATCH | `/api/agendamentos/{id}/cancelar` | Cancelar (status = Cancelado) |

### 7.2 Response enriquecido (igual frontend)

```csharp
public record AgendamentoDto(
    Guid Id,
    Guid ClienteId, string ClienteNome,
    Guid BarbeiroId, string BarbeiroNome,
    Guid ServicoId, string ServicoNome,
    DateOnly Data,
    TimeOnly Horario,
    AgendamentoStatus Status,
    int DuracaoMinutos);
```

### 7.3 Regras de negócio (CRÍTICO — copiar do frontend)

Implemente `AgendamentoValidator` / `AgendamentoService`:

1. **Conflito de horário:** dois agendamentos no mesmo barbeiro + mesma data não podem sobrepor horários (considerar duração do serviço)
2. **Ignorar cancelados** na verificação de conflito
3. **Horário dentro do expediente** do barbeiro (`HorarioInicio` — `HorarioFim`)
4. **Serviço** deve estar disponível para o barbeiro (tabela ServicoBarbeiro)
5. Ao editar, excluir o próprio agendamento da verificação de conflito
6. Status enum serializado como snake_case no JSON: `em_atendimento` (configure JsonStringEnumConverter)

### 7.4 Serialização JSON para compatibilidade com React

No `Program.cs`:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower));
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
```

Mapeie status:
- `EmAtendimento` → `"em_atendimento"`
- `Agendado` → `"agendado"`

### 7.5 Checklist ETAPA 7

- [ ] Criar agendamento OK
- [ ] Conflito retorna 400 com mensagem clara
- [ ] Cancelar muda status
- [ ] GET por data filtra corretamente

---

## ETAPA 8 — Módulo Lista de Espera

> **Prompt:** "Implemente Lista de Espera conforme ETAPA 8"

### 8.1 Endpoints

| Método | Rota |
|--------|------|
| GET | `/api/lista-espera` |
| POST | `/api/lista-espera` |
| DELETE | `/api/lista-espera/{id}` |
| PATCH | `/api/lista-espera/{id}/subir` |
| PATCH | `/api/lista-espera/{id}/descer` |

### 8.2 Request

```csharp
public record ListaEsperaRequest(
    Guid ClienteId,
    Guid ServicoId,
    Guid? BarbeiroId,      // null = sem preferência
    DateOnly DataSolicitada);
```

### 8.3 Response (com nomes enriquecidos)

```csharp
public record ListaEsperaDto(
    Guid Id, int Posicao,
    Guid ClienteId, string ClienteNome,
    Guid ServicoId, string ServicoNome,
    Guid? BarbeiroId, string BarbeiroNome,
    DateOnly DataSolicitada);
```

### 8.4 Regras

- Nova entrada recebe `Posicao = max + 1` na empresa
- Ao remover, reordenar posições (1, 2, 3...)
- Subir/descer troca posição com vizinho
- `BarbeiroNome` = "Sem preferência" quando BarbeiroId null

### 8.5 Checklist ETAPA 8

- [ ] Ordem da fila correta
- [ ] Reordenar funciona
- [ ] Remover renumera posições

---

## ETAPA 9 — Módulo Histórico

> **Prompt:** "Implemente Histórico conforme ETAPA 9"

### 9.1 Abordagem recomendada

Histórico = **query** sobre `Agendamentos` enriquecidos com valor do serviço.

Não precisa de tabela separada no MVP.

### 9.2 Endpoint

```
GET /api/historico?clienteId=&barbeiroId=&dataInicio=&dataFim=
```

### 9.3 Response

```csharp
public record HistoricoDto(
    Guid Id,
    Guid ClienteId, string ClienteNome,
    Guid ServicoId, string ServicoNome,
    Guid BarbeiroId, string BarbeiroNome,
    DateOnly Data,
    decimal Valor,
    AgendamentoStatus Status);
```

### 9.4 Regras

- Filtrar por empresa do token
- `Valor` = preço do serviço no momento da consulta
- Endpoint extra opcional: `GET /api/historico/total` → soma de finalizados no período

### 9.5 Checklist ETAPA 9

- [ ] Filtros combinados funcionam
- [ ] Total faturado (finalizados) correto

---

## ETAPA 10 — Módulo Financeiro

> **Prompt:** "Implemente Financeiro conforme ETAPA 10"

### 10.1 Endpoint principal

```
GET /api/financeiro
```

### 10.2 Response (igual frontend)

```csharp
public record FinanceiroResponse(
    ResumoFinanceiroDto Resumo,
    List<DadoGraficoDto> FaturamentoDiario,   // últimos 7 dias
    List<DadoGraficoDto> FaturamentoMensal,   // últimos 6 meses
    List<MovimentacaoDto> Movimentacoes);

public record ResumoFinanceiroDto(
    decimal FaturamentoDia,
    decimal FaturamentoSemana,
    decimal FaturamentoMes);
```

### 10.3 Regras de cálculo

- **Faturamento** = soma de movimentações tipo `Entrada`
- Gráfico diário: últimos 7 dias com label `dd/MM`
- Gráfico mensal: últimos 6 meses com label `MMM/yy`
- Movimentações ordenadas por data desc

### 10.4 Geração automática (opcional avançado)

Ao marcar agendamento como `Finalizado`, criar movimentação de entrada automaticamente.

### 10.5 Checklist ETAPA 10

- [ ] Resumo bate com movimentações do seed
- [ ] Gráficos retornam arrays com 7 e 6 itens

---

## ETAPA 11 — Dashboard e Configurações

> **Prompt:** "Implemente Dashboard e Configurações conforme ETAPA 11"

### 11.1 Dashboard

```
GET /api/dashboard
```

Response:

```csharp
public record DashboardResponse(
    List<AgendamentoDto> AgendamentosHoje,
    int AgendamentosPendentes,
    decimal FaturamentoDia,
    decimal FaturamentoSemana,
    int ListaEspera,
    int TotalClientes,
    List<DadoGraficoDto> FaturamentoDiario,
    ResumoFinanceiroDto Resumo);
```

Agregue chamando lógica dos serviços existentes (não duplique regras).

### 11.2 Configurações da Empresa

```
GET  /api/empresa/config
PUT  /api/empresa/config/dados        → Owner only
PUT  /api/empresa/config/horarios     → Owner + Admin
PUT  /api/empresa/config/preferencias → Owner + Admin
```

Ou um único `PUT /api/empresa/config` com validação por role.

Response compatível com `EmpresaConfig` do frontend:

```csharp
public record EmpresaConfigDto(
    Guid Id, string Nome, string Logo, string Telefone, string Endereco,
    TimeOnly HorarioAbertura, TimeOnly HorarioFechamento,
    IntervaloSlot IntervaloSlots,
    bool ConfirmacaoManual, bool PermitirMesmoDia);
```

### 11.3 Autorização

- `owner` → edita tudo
- `admin` → não edita Nome, Logo, Telefone, Endereco (retorna 403)

### 11.4 Checklist ETAPA 11

- [ ] Dashboard retorna KPIs corretos
- [ ] Admin bloqueado em dados da empresa
- [ ] Owner consegue salvar tudo

---

## ETAPA 12 — API final (CORS, Swagger, Erros, Health)

> **Prompt:** "Finalize API com CORS, Swagger, tratamento de erros e health check conforme ETAPA 12"

### 12.1 CORS (frontend Vite na porta 5173)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

app.UseCors("Frontend");
```

### 12.2 Swagger com JWT

Configure botão "Authorize" com Bearer token no Swagger UI.

### 12.3 Middleware de exceções global

Retorne JSON padronizado:

```json
{ "message": "Horário indisponível — conflito com outro agendamento" }
```

Mapeie:
- `ValidationException` → 400
- `UnauthorizedAccessException` → 403
- `KeyNotFoundException` → 404
- Demais → 500 (sem expor stack trace em produção)

### 12.4 Health check

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString);

app.MapHealthChecks("/health");
```

### 12.5 Executar API

```powershell
cd src/BarberSaaS.Api
dotnet run
```

Acesse: `https://localhost:7xxx/swagger`

### 12.6 Checklist ETAPA 12

- [ ] Swagger abre
- [ ] CORS funciona com frontend
- [ ] `/health` retorna Healthy
- [ ] Erros retornam JSON consistente

---

## ETAPA 13 — Integração com o Frontend React

> **Prompt:** "Conecte o frontend ao backend conforme ETAPA 13"

### 13.1 Variável de ambiente no frontend

Crie `sistema-agendamento-empresas/.env`:

```
VITE_API_URL=https://localhost:7xxx/api
```

(Use a porta real da sua API)

### 13.2 Substituir mocks por API

Em cada `*Service.ts`, descomente/implemente chamadas `apiClient`:

| Service | Endpoints |
|---------|-----------|
| `authService.ts` | POST `/auth/login`, POST `/auth/forgot-password` |
| `useClientes` / service | `/clientes` |
| barbeiros | `/barbeiros` |
| servicos | `/servicos` |
| agendamentoService | `/agendamentos` |
| listaEsperaService | `/lista-espera` |
| financeiroService | `/financeiro` |
| dashboardService | `/dashboard` |
| empresaService | `/empresa/config` |

### 13.3 AuthContext

- Salvar `token` no localStorage (já faz)
- Enviar `Authorization: Bearer {token}` em todas as requests
- Em 401 → logout + redirect `/login`

### 13.4 Teste integrado

1. `dotnet run` na API
2. `npm run dev` no frontend
3. Login com `joao@barbeariadojoao.com` / `123456`
4. Percorrer **todas** as telas

### 13.5 Checklist ETAPA 13

- [ ] Login real funciona
- [ ] CRUD clientes via API
- [ ] Agenda com conflito funciona
- [ ] Dashboard carrega
- [ ] Configurações persistem no banco

---

## ETAPA 14 — Testes e qualidade (recomendado)

> **Prompt:** "Adicione testes unitários conforme ETAPA 14"

### 14.1 Testes prioritários

Em `BarberSaaS.Tests`:

1. **AgendamentoService** — conflito de horário
2. **AgendamentoService** — cancelado não gera conflito
3. **ListaEsperaService** — reordenar posições
4. **AuthService** — login inválido / válido

### 14.2 Executar

```powershell
dotnet test
```

### 14.3 Checklist ETAPA 14

- [ ] Pelo menos 4 testes passando
- [ ] CI local: `dotnet build && dotnet test`

---

## ETAPA 15 — Deploy (quando estiver pronto)

> Opcional — faça só depois que tudo funcionar localmente.

- Docker + docker-compose (Api + PostgreSQL)
- Variáveis de ambiente para JWT Secret e Connection String
- HTTPS obrigatório em produção
- Migrations automáticas ou script de deploy

---

## Referência rápida — Mapa de endpoints

```
POST   /api/auth/login
POST   /api/auth/forgot-password
GET    /api/auth/me

GET    /api/clientes
POST   /api/clientes
PUT    /api/clientes/{id}
DELETE /api/clientes/{id}

GET    /api/barbeiros
POST   /api/barbeiros
PUT    /api/barbeiros/{id}
DELETE /api/barbeiros/{id}

GET    /api/servicos
POST   /api/servicos
PUT    /api/servicos/{id}
DELETE /api/servicos/{id}

GET    /api/agendamentos
POST   /api/agendamentos
PUT    /api/agendamentos/{id}
PATCH  /api/agendamentos/{id}/cancelar

GET    /api/lista-espera
POST   /api/lista-espera
DELETE /api/lista-espera/{id}
PATCH  /api/lista-espera/{id}/subir
PATCH  /api/lista-espera/{id}/descer

GET    /api/historico

GET    /api/financeiro

GET    /api/dashboard

GET    /api/empresa/config
PUT    /api/empresa/config

GET    /health
```

---

## Como usar este documento

1. **Execute uma ETAPA por conversa/sessão** com a IA ou sozinho
2. Cole no início do prompt:  
   > "Estou na ETAPA X do Prompts_Backend_DotNet_BarberSaaS.md. Implemente tudo desta etapa no projeto barbersaas-api."
3. Só avance quando o checklist da etapa estiver 100% marcado
4. Se algo quebrar, volte à etapa anterior — não pule etapas

---

## Ordem sugerida de commits (quando for versionar)

1. `chore: scaffold solution and projects`
2. `feat(domain): add entities and enums`
3. `feat(infra): add ef core, migrations and seed`
4. `feat(auth): jwt login and multi-tenant`
5. `feat: clientes, barbeiros, servicos`
6. `feat: agendamentos with conflict validation`
7. `feat: lista-espera, historico, financeiro`
8. `feat: dashboard and empresa config`
9. `chore: cors, swagger, error handling`
10. `feat(tests): unit tests for core business rules`

---

## Dicas para não errar (iniciante)

1. **Sempre** filtre por `EmpresaId` do token — nunca aceite empresaId do client como fonte da verdade
2. **Sempre** use DTOs na API — nunca exponha entidades EF diretamente
3. **Teste no Swagger** antes de conectar o frontend
4. **Migrations:** se mudar entidade, crie nova migration — nunca edite migration antiga já aplicada
5. **Senhas:** só hash BCrypt no banco — nunca texto puro
6. **Datas:** frontend manda `"2025-06-12"` → backend usa `DateOnly`
7. **Horários:** frontend manda `"09:00"` → backend usa `TimeOnly`
8. Se der erro de CORS, confira ETAPA 12 antes de culpar o frontend

---

*Documento gerado com base no frontend BarberSaaS (`sistema-agendamento-empresas`) e no roadmap original `Prompts_SaaS_Barbearia_Multiempresa.md`.*
