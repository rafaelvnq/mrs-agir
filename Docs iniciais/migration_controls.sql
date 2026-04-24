-- ==========================================
-- AGIR: PARAMETROS ADICIONAIS PARA CONTROLES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.aux_status_controles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    cor TEXT, -- Para badges dinâmicos
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.aux_frequencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.aux_status_controles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aux_frequencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura para todos" ON public.aux_status_controles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura para todos" ON public.aux_frequencias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin tudo" ON public.aux_status_controles FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));
CREATE POLICY "Admin tudo" ON public.aux_frequencias FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.aux_usuarios WHERE id = auth.uid() AND nivel_acesso = 'Gestor'));

INSERT INTO public.aux_status_controles (nome, cor) VALUES 
('Em vigor', '#10b981'), 
('Pendente', '#f59e0b'), 
('Obsoleto', '#ef4444'), 
('Em revisão', '#3b82f6') 
ON CONFLICT (nome) DO NOTHING;

INSERT INTO public.aux_frequencias (nome) VALUES 
('Diário'), ('Semanal'), ('Mensal'), ('Trimestral'), ('Semestral'), ('Anual'), ('Bienal') 
ON CONFLICT (nome) DO NOTHING;
