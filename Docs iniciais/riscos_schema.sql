-- ==========================================
-- AGIR - MÓDULO BOWTIE: SCHEMA DE RISCOS E DIAGRAMA
-- ==========================================

-- 1. Tabelas Auxiliares Faltantes (Paramétricas)
CREATE TABLE IF NOT EXISTS public.aux_origens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.aux_classificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Tabela de Riscos (Central do Bowtie)
CREATE TABLE IF NOT EXISTS public.riscos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    codigo_ref SERIAL,
    nome TEXT NOT NULL,
    perigo_id UUID REFERENCES public.aux_perigos(id),
    dono_id UUID REFERENCES public.aux_usuarios(id),
    origem_id UUID REFERENCES public.aux_origens(id),
    classificacao_id UUID REFERENCES public.aux_classificacoes(id),
    referencias TEXT,
    severidade TEXT,
    probabilidade TEXT
);

-- 3. Tabela de Nós do Bowtie (Lógica Unificada DRY)
CREATE TABLE IF NOT EXISTS public.bowtie_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risco_id UUID REFERENCES public.riscos(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'causa', 'consequencia', 'controle'
    
    -- Dados do Nó
    nome TEXT NOT NULL,
    descricao_longa TEXT,
    
    -- Campos da Entidade Consequência
    tema_id UUID REFERENCES public.aux_temas_risco(id),
    
    -- Campos da Entidade Controle
    categoria_id UUID REFERENCES public.aux_categorias_controle(id),
    dono_id UUID REFERENCES public.aux_usuarios(id),
    status TEXT, -- 'Em vigor', 'Pendente', etc.
    frequencia TEXT, 
    ultima_verificacao DATE,
    plano_verificacao TEXT,
    
    -- Posicionamento no React Flow
    pos_x FLOAT NOT NULL DEFAULT 0,
    pos_y FLOAT NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Tabela de Conexões (Edges)
CREATE TABLE IF NOT EXISTS public.bowtie_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risco_id UUID REFERENCES public.riscos(id) ON DELETE CASCADE,
    source_id UUID REFERENCES public.bowtie_nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.bowtie_nodes(id) ON DELETE CASCADE,
    source_handle TEXT,
    target_handle TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.riscos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bowtie_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bowtie_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aux_origens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aux_classificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
-- Gestores: Acesso Total
CREATE POLICY "Gestores: acesso total em riscos" ON public.riscos
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));

CREATE POLICY "Gestores: acesso total em nodes" ON public.bowtie_nodes
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));

CREATE POLICY "Gestores: acesso total em edges" ON public.bowtie_edges
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));

-- Donos: Visualização e Edição Limitada (Conforme RN do PRD)
-- MT 5.3 detalhará melhor estas permissões de edição
CREATE POLICY "Donos: visualizam seus riscos" ON public.riscos
    FOR SELECT TO authenticated
    USING (dono_id = auth.uid() OR EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));

CREATE POLICY "Donos: visualizam nodes do seu risco" ON public.bowtie_nodes
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.riscos WHERE id = bowtie_nodes.risco_id AND (dono_id = auth.uid() OR EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'))));

CREATE POLICY "Donos: visualizam edges do seu risco" ON public.bowtie_edges
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.riscos WHERE id = bowtie_edges.risco_id AND (dono_id = auth.uid() OR EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'))));

-- Auxiliares: Leitura para todos Logados
CREATE POLICY "Leitura de auxiliares para todos" ON public.aux_origens FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura de auxiliares para todos" ON public.aux_classificacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin: tudo em aux_origens" ON public.aux_origens FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));
CREATE POLICY "Admin: tudo em aux_classificacoes" ON public.aux_classificacoes FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));
