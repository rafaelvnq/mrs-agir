# **Guia de Estilo e Padronização de Design (PRD) - Ecossistema MRS Logística**

Este documento estabelece as diretrizes de design e os padrões de interface (UI/UX) para as aplicações da MRS Logística, garantindo consistência visual e funcional em todo o ecossistema de ferramentas corporativas.

## 

## **1. Identidade Visual e Paleta de Cores**

A composição cromática deve seguir rigorosamente o manual da marca, utilizando o azul marinho como cor institucional predominante e o amarelo para destaques e ações principais.

A aplicação deve ser em tema claro, é dispensável o "dark theme" em qualquer parte da aplicação.

### **1.1. Paleta Primária**

**As cores principais da MRS são as que aparecem no logo da companhia. São as mais diretamente reconhecíveis e relacionadas à identidade da marca, definindo e marcando presença de forma intensa em todo o seu sistema de identidade visual.**



\#1B3255: Sidebars, headers, botões primários e textos institucionais

\#FFCC00: Logotipos, ícones de destaque

\#FFED00: Destaques secundários e variações de marca

### **1.2. Paleta de Apoio**

As cores da paleta secundária servem como apoio ao sistema de identidade visual. Devem ser utilizadas de forma não predominante, para auxiliar em criações hierárquicas e composições estéticas. O cinza cool gray 10C (e suas representações em outros sistemas de cor) é indicado para a aplicação em textos.



Cores da paleta de apoio:

\#D66013, #954F15, #643512, #6B5D20, #566223, #95941F, #0093D3, #00498E, #6C6D70, #E5E6E7



## **2. Estrutura de Layout e Navegação**

### **2.1. Menu Lateral (Sidebar)**

* **Cor de Fundo:** Azul Marinho (#1B3255).
* **Estado Ativo:** Background com leve transparência azul claro ou azul real (#00498E) e borda lateral de destaque.
* **Tipografia:** Ícones lineares seguidos de rótulos em fonte sans-serif clara (branco ou cinza muito claro).
* **Logo da MRS:** Deve estar no topo da sidebar

### **2.2. Cabeçalho (Top Bar)**

* **Título da Página:** Em caixa alta, negrito, utilizando a cor #1B3255.
* **Área de Perfil:** Nome do usuário e nível de acesso no canto superior direito, com foto circular.

## 

## **3. Componentes de Interface**

### **3.1. Cards de Indicadores (KPIs)**

* **Estética:** Fundo branco, cantos arredondados (8px) e sombra suave (box-shadow: 0px 4px 6px rgba(0,0,0,0.05)).

### 

### **3.2. Filtros e Controles**

* **Posicionamento:** Alinhados à direita no topo da área de conteúdo.
* **Estilo:** Selects com bordas arredondadas e labels discretos.

## 

## **4. Tipografia**

* **Família de Fontes:** Utilizar fontes sans-serif modernas (ex: Google Sans, Roboto ou Arial).
* **Escalabilidade:**

  * Títulos Principais: 24px - 28px (Bold).
  * Subtítulos de Seção: 18px - 20px (Bold).
  * Corpo de Texto/Labels: 12px - 14px (Regular/Medium).

## 

## **5. Diretrizes para Novas Aplicações**

Para manter a consistência, cada nova aplicação deve:

* Utilizar o sistema de grid 12 colunas.
* Manter o espaçamento interno (padding) constante em 24px para áreas principais.
* Garantir que a logo da MRS esteja sempre visível no canto superior esquerdo (sobre o fundo azul da sidebar).

