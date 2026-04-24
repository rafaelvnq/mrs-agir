# Plano de Implementação: AGIR - Módulo Bowtie (Com Auth & RLS)

O objetivo é desenvolver o módulo de visualização e edição de diagramas para a aplicação AGIR (MRS Logística). O projeto basear-se-á em segurança de dados com perfis de acesso, uso imutável do **Supabase RLS**, e interatividade via **React Flow**.

## Escopo e Arquitetura 
- **Framework OBRIGATÓRIO (Next.js):** Como foi exigido um painel Administrador (Gestor) e criação de contas onde a "senha é o e-mail" sem afetar a sessão de quem está logado, uma Single Page Application estática (como Vite) não consegue invocar comandos Admin no Supabase sem expor a chave de segurança mestra. Utilizaremos **Next.js (App Router)** para termos apis seguras `/api/admin/create-user` que executem os métodos administrativos.
- **Segurança de Acesso (Personas):**
  - **Gestor:** Autenticado, visualiza tudo, edita tudo, apaga tudo. Restaura senhas.
  - **Dono do Risco:** Autenticado, visualiza SOMENTE as redes do diagrama onde ele está designado em `dono_id`, não apaga nós, apenas preenche e insere feedbacks nos formulários dos cartões a qual está ligado.
- **Autenticação de 2 Passos:** Se for o primeiro acesso (`senha_alterada = false`), interceptaremos a UI para uma página de "Crie sua Senha Definitiva" travando o sistema subjacente.
- **ZERO Hardcoding (Backoffice Inteligente):** Absolutamente as listagens contidas nos dropdowns (Perigos, Temas, Categorias, Origens e Classificações) NÃO existirão estaticamente no código e estarão submetidas às tabelas já modeladas em banco de dados (`aux_...`). A aplicação terá uma página de Configuração Exclusiva para o Gestor fazer a manutenção/cadastro (Add/Edit/Delete) dos insumos em suas respectivas listas.

## Metodologias de Engenharia de Frontend Aplicadas
Para garantir aderência impecável às diretrizes e confiabilidade técnica corporativa, o projeto é suportado pelas seguintes metodologias estritas:
- **SDD (Spec-Driven Development):** Estamos operando sob o rigor do SDD. Nenhuma linha de aplicação será produzida antes das especificações técnicas (Este plano, os diagramas DDL de banco e o mapeamento de Tasks) estarem 100% esgotadas em dúvidas e validadas pelo gestor. A documentação (PRD) precede o código. Se a regra mudar, a Especificação muda primeiro (como fizemos agora com os requisitos de Auth RLS) e o código a segue.
- **SSOT (Single Source of Truth):** O Estado da aplicação (Diagrama, Modais e Listas) terá uma e apenas uma fonte de verdade. O Supabase (Sincronizado via cache server-side no Next.js) ditará a regra de leitura e alteração.
- **Atomic Design:** A separação de pastas e lógica espelhará a metologia de *Átomos* (Inputs simples, labels, ícones), *Moléculas* (Combos de Form-groups, botões acoplados a ícones, cards base), *Organismos* (O Custom Node em si do Bowtie, a Sidebar inteira, o Modal Modal base de CRUD), *Templates e Páginas*.
- **Engenharia Seca (DRY):** Arquitetura centralizada de Modais e Componentes de Formulário (usando React Hook Form + Zod) onde os cenários Inclusão (Create) e Atualização (Update) compartilham a exata mesma arvore de subcomponentes.

## Fases do Projeto

### Fase 1: Banco de Dados, RLS e Chaves de Acesso
- Geração completa do script SQL com as tabelas, as restrições e, crucialmente, as **Policies de RLS** (Row Level Security) protegendo os itens de cada _Dono_.
- Criação dos gatilhos (Triggers) no BD vinculando a tabela `auth.users` à nossa `aux_usuarios` para mapeamento de booleano `senha_alterada`.
- Obtenção da String de conexão.

### Fase 2: Instalação e Arquitetura UI Base (App Shell & Next.js)
- Configuração do projeto Next.js com Tailwind e as pastas estruturadas sob *Atomic Design*.
- Configuração dos Wrappers do Supabase em Server Components e Client Components (SSOT de Sessão).
- **>> Pausa para seu Teste Local <<**

### Fase 3: Telas de Autenticação e Gestão
- `Página de Login` e lógica de intercepção do `Forçar Troca de Senha`.
- `Dashboard Administrativo` onde o Gestor lista os usuários e tem botões "Resetar Senha" ou "Criar Usuário".
- **>> Pausa para seu Teste Local (Você testará se logar e interagir com as travas) <<**

### Fase 4: CRUD DRY e App Shell
- Criação do Header, Sidebar e construção dos modais DRY padronizados, com campos variando se ele for Gestor (tudo aberto) ou Dono do Risco (só editando meta-dados associados).
- **>> Pausa para seu Teste Local <<**

### Fase 5: O Canvas do React Flow Genérico (Engine Visual)
- Renderização do painel Flow com os nós customizados nas colunas corretas.
- **>> Pausa para seu Teste Local <<**

### Fase 6: Dinâmica e SSOT Interligado (Final)
- Ao clicar em `[+]`, gravar e vincular as IDs na base. RLS barrando gravação indevida. 
- Disparo dos Toasts pós-gravação de persistência.
- **>> Deploy Vercel <<**
