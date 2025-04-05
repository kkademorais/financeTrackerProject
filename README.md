# FinTracker - Aplicativo de Gerenciamento Financeiro

Um aplicativo completo de rastreamento financeiro construído com tecnologias modernas para ajudar na gestão e visualização das suas finanças pessoais.

## Tecnologias Utilizadas

- **Frontend**: Next.js 14 com App Router, Tailwind CSS, React-Hook-Form, Zod, SWR
- **Backend**: Next.js API Routes com middlewares de segurança
- **Banco de Dados**: PostgreSQL com Prisma como ORM
- **Autenticação**: NextAuth.js com provedores de e-mail/senha e OAuth

## Funcionalidades

- Homepage com resumo visual dos gastos recentes
- Calendário interativo para visualização de gastos por período
- Sistema de extrato com filtros avançados e visualização em gráficos
- Formulário otimizado para inserção rápida de gastos com categorização
- Dashboard de análise comparativa entre períodos diferentes
- Perfil e configurações do usuário
- Sistema de temas (claro/escuro)
- Design responsivo

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (para ambiente local)
- npm ou yarn

### Configuração do Banco de Dados

#### Opção 1: Banco de Dados Local (PostgreSQL)

1. Instale o PostgreSQL em sua máquina
2. Crie um banco de dados chamado `fintracker`
3. Certifique-se de que o usuário `postgres` com senha `postgres` existe
4. Execute o script `init-db-no-seed.cmd` para inicializar o banco de dados

#### Opção 2: Banco de Dados Neon (PostgreSQL na nuvem)

1. Certifique-se de que a URL do banco de dados Neon está configurada no arquivo `.env`
2. Execute o script `init-db-neon.cmd` para inicializar o banco de dados

#### Alternando entre Bancos de Dados

Para alternar entre o banco de dados local e o Neon, execute o script `switch-db.cmd`.

### Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` (se necessário)
   - Ajuste as variáveis conforme necessário

## Executando a Aplicação

### Ambiente de Desenvolvimento

Para executar a aplicação em ambiente de desenvolvimento:

```
npm run dev
```

Ou use o script:

```
start-dev.cmd
```

### Ambiente de Produção

Para executar a aplicação em ambiente de produção:

```
npm run build
npm run start
```

Ou use o script:

```
start-prod.cmd
```

## Acessando a Aplicação

- Ambiente de desenvolvimento: http://localhost:3000
- Ambiente de produção: http://localhost:3000 (quando executado localmente)

## Comandos Úteis

- `npm run db:push` - Aplica as migrações ao banco de dados
- `npm run db:studio` - Abre o Prisma Studio para visualizar o banco de dados
- `npm run db:seed` - Popula o banco de dados com dados iniciais (opcional)

## Estrutura do Projeto

O projeto segue uma estrutura organizada por features/módulos e utiliza o padrão de design atômico para componentes:

- `/src/app`: Rotas e páginas da aplicação (Next.js App Router)
- `/src/components`: Componentes React organizados seguindo o padrão de design atômico
  - `/atoms`: Componentes básicos (botões, inputs, etc.)
  - `/molecules`: Combinação de componentes atômicos
  - `/organisms`: Componentes mais complexos como seções de páginas
  - `/templates`: Layouts de página completos
- `/src/hooks`: Hooks React personalizados
- `/src/lib`: Bibliotecas e utilitários
- `/src/services`: Serviços para comunicação com APIs
- `/src/contexts`: Contextos React para gerenciamento de estado global
- `/src/types`: Tipos TypeScript
- `/src/middleware`: Middlewares para API Routes
- `/src/styles`: Estilos globais
- `/prisma`: Configuração e schema do Prisma

## Recursos Técnicos

- Sistema de cache otimizado para dados financeiros com SWR
- Validação rigorosa dos dados no cliente e servidor com Zod
- Proteção de rotas baseada em autenticação
- Medidas de segurança para proteção de dados financeiros
- Code splitting e lazy loading para otimização de performance
- Design system consistente com componentes reutilizáveis

## Licença

Este projeto está licenciado sob a licença MIT. 