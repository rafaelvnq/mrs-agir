# Quadro de Tarefas Micro-Segmentadas para Modelos Ágeis (Flash)

> **Instrução para uso com o Flash:** Ao iniciar uma sessão Flash, copie e cole APENAS a próxima Micro-Task (MT). O Flash executará o código baseando-se nas regras contidas apenas naquela MT e nada mais. Não o deixe sobrecarregar as Views ou o Supabase de uma vez. Mantenha-o focado.

## ✅ Fases 1 e 2: Concluídas
* Banco de Dados criado (RLS, Perfis, Bowtie).
* Boilerplate Next.js criado (Tailwind 4, Design System).
* App Shell e Sidebar implementados.

---

## FASE 3: Motor de Autenticação e Rotas (SSR)
**MT 3.1 - Supabase SSR Clients.** ( Arquivos: `src/lib/supabase/client.ts`, `server.ts` e `middleware.ts`). Implementar métodos oficiais SSR e middleware para redirect protegendo app (não logado vai p/ `/login`).

**MT 3.2 - UI da Página de Login.** (Arquivos: `src/app/login/page.tsx`, `actions.ts`). Card `#1B3255` contendo form RHF+Zod. Server action com `supabase.auth.signInWithPassword`. Toast de erro/ok.

**MT 3.3 - Layout / Forçar Troca de Senha e Redirecionar.** (Arquivos: `src/app/change-password/page.tsx`, layout raiz). O layout valida se `aux_usuarios.senha_alterada === false`. Travar navegação e exibir Formulário de troca usando `supabase.auth.updateUser`.

**-> 🛑 PAUSA OBRIGATÓRIA PARA TESTES E RETIFICAÇÕES: Homologação do Login.**

---

## ✅ FASE 4: Backoffice Administrativo - Concluída
* **MT 4.1 - Serveless Route de Bypass.** Concluído.
* **MT 4.2 - Gestão de Usuários (UI).** Concluído (com Reset e Exclusão).
* **MT 4.3 - Backoffice Paramétrico.** Concluído (Perigos, Temas, Categorias e Unidades).

---

## FASE 5: App Shell de Risco & Modais DRY (Regras de Negocio estritas)

---

## FASE 5: App Shell de Risco & Modais DRY (Regras de Negocio estritas)
**MT 5.1 - Header Global de Seleção de Risco.** (`src/components/organisms/AppHeader.tsx`). O Documento PRD dita um **Header Fixo** com um Select global de todos os Riscos cadastrados para trocar instanteamente qual diagrama carregar. Construir botao "Novo Risco".

**MT 5.2 - Molécula de Seleção Baseada na SSOT.** (`src/components/molecules/GlobalSelectBox.tsx`). Construir Fetch assíncrono para buscar Listas de Tema/Origem do DB (cadastradas na MT 4.3) e servir ao formulário.

**MT 5.3 - O "EntityForm" (Modal Único).** (`src/components/organisms/forms/BowtieEntityForm.tsx`). Formulários de Criação/Edicao controlados se a role é Gestor (liberado) ou Dono (somente visualizar e atualizar, sem deletar). Se deletar, o PRD dita: **Avisar que todos Nodes Secundários serão apagados.**

**MT 5.4 - Integração de Schemas (Prontos do PRD).** Injetar no Form de Risco: Nome, Perigo FK, Dono FK, Origem FK, Class. FK, Referencias, Severidade, Probabilidade). Causa/Consec: (Nome, Desc Longa, Tema FK). Controle: (Nome, Desc, Categoria FK, Dono FK, Status, Freq., Ultima Ver., Plano Ver.). 

**-> 🛑 PAUSA OBRIGATÓRIA PARA TESTES E RETIFICAÇÕES: Validar Todos os Formularios (Modais) localmente.**

---

## FASE 6: Engine Visual e Layout React Flow (O BOWTIE)
**MT 6.1 - O Palco Vue.** (`src/app/(dashboard)/bowtie/page.tsx`). Subir o `<ReactFlowProvider>` ligado à state derivada do "Dropdown Header". Ligar o scroll, pan e arraste (Requisito do PRD contra estouro de limites).

**MT 6.2 - Nós Customizados e Algoritmo de 5 Colunas.** (`src/components/organisms/nodes/...`). Implementar layout fixo rígido obrigatório do Módulo MRS: 
- Causa (X=100) 
- Prev. (X=400) 
- Centro Risco+Perigo (X=700) 
- Mitigat. (X=1000) 
- Conseq. (X=1300).

**MT 6.3 - Botões [ + ] Invisíveis (Hover Dinâmico do PRD).** Estilizar `:hover` com opacidade no CustomNode para mostrar botões laterais de Add: 
- Risco: `+` esquerda (cria causa), `+` direita (cria conseq). 
- Causa: `+` direta (cria controle pref). 
- Conseq: `+` esq (cria controle Mitig).

**MT 6.4 - Ligação Dinâmica (Edges e DB Intercept).** Quando clicar em um `+` no Node A, abrir o MT 5.3 EntityModal e salvar no banco amarrando a FK associada e gerar a "Edge Line Dinâmica" instantânea interligando `<Handle>` a `<Handle>` seguindo a topologia (Causa -> Prev -> Risco -> Mitig -> Conseq).

**-> 🛑 HOMOLOGAÇÃO FIAL: Testar o Arrastar Visual do Bowtie. Confirmar exclusão em cascatas. Deploy Vercel Oficial.**
