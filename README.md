# Field Report

Ferramenta digital para equipes de ar-condicionado. Do checklist em campo até o relatório final — seja em manutenção preventiva, corretiva, instalação ou inspeção.

Técnicos registram a ordem de serviço, preenchem checklists específicos por tipo de serviço, fazem upload de fotos e ao final geram um relatório completo para o cliente ou gestor.

## Stack

- **Runtime:** Node.js 20 + Express
- **Linguagem:** TypeScript (strict mode)
- **Banco de dados:** PostgreSQL 16 + Drizzle ORM
- **Autenticação:** JWT (access token 15min + refresh token 7d)
- **Validação:** Zod
- **Upload de arquivos:** Cloudinary
- **Testes:** Jest + ts-jest
- **Gerenciador de pacotes:** pnpm workspaces (monorepo)

## Estrutura do Monorepo

```
field-report/
├── apps/
│   ├── backend/          # API REST (Node.js + Express)
│   └── frontend/         # (em desenvolvimento)
├── packages/
│   └── shared/           # Tipos e schemas Zod compartilhados
├── docker-compose.yml
├── .env.example
└── README.md
```

## Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- pnpm 9+

## Como Rodar

### 1. Clonar e instalar dependências

```bash
git clone <repo-url>
cd field-report
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example apps/backend/.env
# Edite apps/backend/.env com seus valores reais
```

### 3. Subir o banco de dados

```bash
docker-compose up -d
```

### 4. Rodar as migrations

```bash
pnpm migrate
```

### 5. Popular o banco com dados de exemplo

```bash
pnpm seed
```

Isso criará:

- 4 usuários (1 admin + 3 técnicos) - senha: `123456`
- 14 serviços (8 finalizados + 6 em aberto)
- Checklists, fotos e relatórios completos

### 6. Rodar o backend em desenvolvimento

```bash
pnpm dev:backend
# ou dentro de apps/backend:
pnpm dev
```

## Variáveis de Ambiente

| Variável                | Descrição                           |
| ----------------------- | ----------------------------------- |
| `DATABASE_URL`          | URL de conexão PostgreSQL           |
| `JWT_SECRET`            | Segredo para assinar access tokens  |
| `JWT_REFRESH_SECRET`    | Segredo para assinar refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary         |
| `CLOUDINARY_API_KEY`    | Chave de API do Cloudinary          |
| `CLOUDINARY_API_SECRET` | Segredo de API do Cloudinary        |
| `PORT`                  | Porta do servidor (padrão: 3001)    |

## Credenciais de Acesso (após seed)

Todos os usuários criados pelo seed têm a senha: **`123456`**

| Email                            | Role    | Nome           |
| -------------------------------- | ------- | -------------- |
| `admin@fieldreport.com`          | Admin   | Administrador  |
| `joao.silva@fieldreport.com`     | Técnico | João Silva     |
| `maria.santos@fieldreport.com`   | Técnico | Maria Santos   |
| `pedro.oliveira@fieldreport.com` | Técnico | Pedro Oliveira |

## Endpoints da API

### Health

| Método | Rota      | Descrição          |
| ------ | --------- | ------------------ |
| GET    | `/health` | Status do servidor |

### Auth (públicos)

| Método | Rota             | Body                        | Descrição            |
| ------ | ---------------- | --------------------------- | -------------------- |
| POST   | `/auth/register` | `{ name, email, password }` | Registrar usuário    |
| POST   | `/auth/login`    | `{ email, password }`       | Login                |
| POST   | `/auth/refresh`  | `{ refreshToken }`          | Renovar access token |

### Services (requer JWT)

| Método | Rota            | Descrição                            |
| ------ | --------------- | ------------------------------------ |
| POST   | `/services`     | Criar serviço + checklist automático |
| GET    | `/services`     | Listar serviços do usuário           |
| GET    | `/services/:id` | Detalhe com checklist e fotos        |
| PATCH  | `/services/:id` | Atualizar serviço                    |
| DELETE | `/services/:id` | Remover serviço                      |

### Photos (requer JWT)

| Método | Rota                   | Descrição                            |
| ------ | ---------------------- | ------------------------------------ |
| POST   | `/services/:id/photos` | Upload de foto (multipart/form-data) |

### Reports (requer JWT)

| Método | Rota                   | Descrição          |
| ------ | ---------------------- | ------------------ |
| POST   | `/services/:id/report` | Criar relatório    |
| GET    | `/services/:id/report` | Relatório completo |

## Testes

```bash
pnpm test:backend
```

## Fluxo do Técnico

O técnico usa a aplicação em campo, registrando cada atendimento do início ao fim — do checklist até o relatório final.

1. Acessa `/login` com email e senha
2. No dashboard, visualiza todas as suas ordens de serviço (abertas e finalizadas)
3. Cria um novo serviço em `/services/new`, selecionando o tipo do atendimento
4. Um checklist específico é gerado automaticamente conforme o tipo escolhido
5. Durante o atendimento, marca os itens do checklist conforme conclui cada etapa
6. Faz upload das fotos do equipamento diretamente pela tela do serviço
7. Finaliza o serviço quando todas as etapas estiverem concluídas
8. Gera o relatório final, que reúne dados do serviço, checklist, fotos e responsável

## Fluxo do Admin

O administrador tem visão completa da operação, sem interferir nos atendimentos dos técnicos.

1. Acessa `/admin/login` com credenciais de nível admin
2. No dashboard, visualiza métricas gerais: total de serviços, distribuição por tipo e status, total de técnicos
3. Navega pela listagem completa de serviços de todos os técnicos em `/admin/services`
4. Filtra serviços por tipo ou por status conforme necessário
5. Acessa o detalhe de qualquer serviço para ver checklist e fotos (somente leitura)
6. Visualiza o relatório completo de qualquer atendimento
7. Consulta a listagem de técnicos cadastrados em `/admin/technicians`

## Formulários e Validações

**Registro**

| Campo | Regra                            |
| ----- | -------------------------------- |
| Nome  | Obrigatório                      |
| Email | Obrigatório, formato válido      |
| Senha | Obrigatório, mínimo 6 caracteres |

**Login**

| Campo | Regra                       |
| ----- | --------------------------- |
| Email | Obrigatório, formato válido |
| Senha | Obrigatório                 |

**Novo serviço**

| Campo       | Regra                                                               |
| ----------- | ------------------------------------------------------------------- |
| Tipo        | Obrigatório — `preventiva`, `corretiva`, `instalação` ou `inspeção` |
| Observações | Opcional                                                            |

**Upload de foto**

| Campo   | Regra                                                   |
| ------- | ------------------------------------------------------- |
| Arquivo | Obrigatório, extensões aceitas: `.jpg`, `.jpeg`, `.png` |

**Relatório**

| Campo               | Regra       |
| ------------------- | ----------- |
| Nome do responsável | Obrigatório |
| Observações         | Opcional    |
