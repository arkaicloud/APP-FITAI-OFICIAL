# FIT.AI

Aplicação mobile-first de acompanhamento fitness com planos de treino personalizados e um Coach AI. O usuário informa seu perfil, recebe um plano semanal, registra os treinos e acompanha sua evolução em um único lugar.

> Projeto em desenvolvimento. As integrações de autenticação, banco de dados e IA dependem da configuração do ambiente de execução.

## Funcionalidades

- Login social por meio do Replit Auth, com suporte a provedores como Google e GitHub.
- Onboarding com objetivo, peso, altura, idade, percentual de gordura e gênero.
- Trial gratuito de 7 dias e indicação do plano premium.
- Dashboard com treino do dia e acompanhamento de consistência.
- Planos semanais com dias de treino, descanso, exercícios, séries, repetições e intervalo.
- Registro de sessões e histórico de treinos.
- Tela de evolução com sequência de treinos e indicadores de consistência.
- Coach AI para tirar dúvidas e criar planos personalizados.

## Stack

- React 18 + TypeScript + Vite
- Express.js + TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- TanStack React Query e wouter
- PostgreSQL + Drizzle ORM
- OpenAI para o Coach AI
- Replit Auth via OpenID Connect

## Pré-requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL
- Credenciais do Replit Auth
- Credenciais de uma integração compatível com a API da OpenAI, para habilitar o Coach AI

## Instalação

```bash
git clone https://github.com/arkaicloud/APP-FITAI-OFICIAL.git
cd APP-FITAI-OFICIAL
npm install
```

Configure as variáveis de ambiente. No mínimo, o servidor exige:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fitai
SESSION_SECRET=uma-chave-secreta
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
AI_INTEGRATIONS_OPENAI_API_KEY=sua-chave-da-api
```

As variáveis adicionais de autenticação devem ser configuradas conforme o ambiente Replit/OIDC utilizado pelo projeto.

## Banco de dados

Sincronize o schema do Drizzle com o PostgreSQL:

```bash
npm run db:push
```

O schema inclui perfis de usuário, planos, dias e exercícios de treino, sessões e histórico de atividades.

## Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, a aplicação é servida na porta `5000`. Para usar outra porta:

```bash
PORT=3000 npm run dev
```

## Build e produção

```bash
npm run build
npm start
```

Valide os tipos TypeScript com:

```bash
npm run check
```

## Principais rotas da aplicação

| Rota | Descrição |
| --- | --- |
| `/` | Login |
| `/onboarding` | Cadastro do perfil fitness |
| `/trial` | Oferta do trial e plano premium |
| `/home` | Dashboard |
| `/treino-hoje` | Treino do dia |
| `/plano` | Plano semanal |
| `/dia/:day` | Exercícios de um dia específico |
| `/evolucao` | Progresso e consistência |
| `/ai` | Chat com o Coach AI |
| `/perfil` | Perfil do usuário |

## Principais endpoints da API

- `GET /api/auth/user` — usuário autenticado atual
- `GET|POST /api/profile` — consultar ou salvar o perfil
- `GET /api/trial-status` — status do trial/assinatura
- `GET|POST /api/workout-plans` — consultar ou criar planos
- `GET /api/workout-plans/today` — treino do dia
- `GET /api/workout-days/:id` — detalhes de um dia de treino
- `POST /api/workout-sessions` — iniciar uma sessão
- `PUT /api/workout-sessions/:id/complete` — concluir uma sessão
- `POST /api/workouts/log` — registrar treino
- `GET /api/workouts/history` — histórico de treinos
- `POST /api/ai/chat` — conversar com o Coach AI
- `GET /api/login` e `GET /api/logout` — autenticação

## Estrutura do projeto

```text
client/
  src/pages/       # telas da aplicação
  src/components/  # componentes compartilhados e UI
  src/hooks/       # hooks personalizados
  src/lib/         # cliente de queries e utilitários
server/
  index.ts         # entrada do servidor Express
  routes.ts        # autenticação e endpoints da API
  db.ts            # conexão PostgreSQL
  storage.ts       # camada de persistência
  vite.ts           # integração do Vite em desenvolvimento
shared/
  schema.ts        # schema e tipos compartilhados
  models/          # modelos de autenticação e chat
```

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Executa frontend e backend em desenvolvimento |
| `npm run build` | Gera os bundles de frontend e backend |
| `npm start` | Inicia a versão compilada |
| `npm run check` | Verifica os tipos TypeScript |
| `npm run db:push` | Atualiza o schema do banco |

## Licença

Este projeto está licenciado sob a licença MIT.

