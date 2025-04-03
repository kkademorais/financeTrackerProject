# Finance Tracker

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

## Requisitos

- Node.js 18+
- PostgreSQL 13+

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/finance-tracker.git
cd finance-tracker
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas configurações

4. Configure o banco de dados
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

6. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

## Recursos Técnicos

- Sistema de cache otimizado para dados financeiros com SWR
- Validação rigorosa dos dados no cliente e servidor com Zod
- Proteção de rotas baseada em autenticação
- Medidas de segurança para proteção de dados financeiros
- Code splitting e lazy loading para otimização de performance
- Design system consistente com componentes reutilizáveis

## Licença

Este projeto está licenciado sob a licença MIT. 