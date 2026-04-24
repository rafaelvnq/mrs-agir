-- ==========================================
-- AGIR: COMPLEMENTO DE TABELAS PARAMÉTRICAS
-- ==========================================

-- 1. Criação das Tabelas Faltantes
CREATE TABLE IF NOT EXISTS public.aux_severidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.aux_probabilidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Ativar RLS
ALTER TABLE public.aux_severidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aux_probabilidades ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
CREATE POLICY "Leitura de auxiliares para todos" ON public.aux_severidades FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura de auxiliares para todos" ON public.aux_probabilidades FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin: tudo em aux_severidades" ON public.aux_severidades FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));
CREATE POLICY "Admin: tudo em aux_probabilidades" ON public.aux_probabilidades FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));

-- 4. Inserção de Dados sugeridos (Opcional, mas ajuda no início)
INSERT INTO public.aux_severidades (nome) VALUES ('Insignificante'), ('Pequena'), ('Média'), ('Crítica'), ('Catastrófica') ON CONFLICT DO NOTHING;
INSERT INTO public.aux_probabilidades (nome) VALUES ('Rara'), ('Remota'), ('Improvável'), ('Possível'), ('Provável') ON CONFLICT DO NOTHING;
