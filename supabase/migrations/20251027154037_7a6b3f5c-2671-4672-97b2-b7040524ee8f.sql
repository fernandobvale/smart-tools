-- Criar tabela new_courses
CREATE TABLE public.new_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Novo', 'Atualizar', 'Atualizando', 'Concluido')),
  professor TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.new_courses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem visualizar seus próprios cursos"
  ON public.new_courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios cursos"
  ON public.new_courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios cursos"
  ON public.new_courses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios cursos"
  ON public.new_courses FOR DELETE
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_new_courses_updated_at
  BEFORE UPDATE ON public.new_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Popular tabela com dados iniciais (sem user_id para que o admin possa atribuir depois)
INSERT INTO public.new_courses (curso, status, professor, user_id) VALUES
  ('Machine Learning', 'Novo', 'Lucas', NULL),
  ('Fundamentos da IA para gestores', 'Novo', 'Lucas', NULL),
  ('Ciência de Dados', 'Novo', 'Lucas', NULL),
  ('Python Básico', 'Novo', 'Lucas', NULL),
  ('Excel Avançado e Automação', 'Novo', 'Lucas', NULL),
  ('PowerBI', 'Novo', 'Lucas', NULL),
  ('Engenharia de Prompt', 'Novo', 'Lucas', NULL),
  ('Cibersegurança', 'Novo', 'Lucas', NULL),
  ('Marketing Digital Prático', 'Novo', 'Lucas', NULL),
  ('Gestor de Tráfego', 'Novo', 'Lucas', NULL),
  ('Social Media', 'Novo', 'Lucas', NULL),
  ('E-Commerce e Gestão de Marketplaces', 'Novo', 'Lucas', NULL),
  ('Data Analytics com SQL para negócios', 'Novo', 'Lucas', NULL),
  ('Modelagem Financeira', 'Novo', 'Lucas', NULL),
  ('Automação Industrial', 'Novo', 'Lucas', NULL),
  ('Edição de Vídeo', 'Novo', 'Lucas', NULL),
  ('Proteção de Dados', 'Novo', 'Lucas', NULL),
  ('Comunicação e Oratória', 'Novo', 'Lucas', NULL),
  ('Sustentabilidade e ESG', 'Novo', 'Lucas', NULL),
  ('Forense Digital / Investigação em TI', 'Novo', 'Lucas', NULL),
  ('Copywriting e Marketing de Conteúdo', 'Novo', 'Lucas', NULL),
  ('Auxiliar de RH', 'Novo', 'Lucas', NULL),
  ('Gestão de Pessoas', 'Novo', 'Lucas', NULL),
  ('Análise de Pessoas e Recrutamento Digital', 'Novo', 'Lucas', NULL),
  ('Auxiliar de Contabilidade', 'Novo', 'Lucas', NULL),
  ('Auxiliar de Serviços Jurídicos', 'Novo', 'Lucas', NULL),
  ('Biotecnologia', 'Novo', 'Lucas', NULL),
  ('Conhecimentos em Fintechs', 'Novo', 'Lucas', NULL),
  ('Rotinas Contábeis', 'Novo', 'Lucas', NULL),
  ('Imposto de Renda', 'Novo', 'Lucas', NULL),
  ('Gestão de Riscos Financeiros e Planejamento', 'Novo', 'Lucas', NULL),
  ('Segurança Hospitalar e Controle de Acesso', 'Novo', 'Lucas', NULL),
  ('Segurança no Transporte de Cargas e Valores', 'Novo', 'Lucas', NULL),
  ('Segurança para Escolas e Instituições de Ensino', 'Novo', 'Lucas', NULL),
  ('Lei Brasielira de Inclusão (Lei n° 13.146/2015)', 'Novo', 'Lucas', NULL),
  ('Lei de Responsabilidade Fiscal (LRF - LC n° 101/2000)', 'Novo', 'Lucas', NULL),
  ('Agronomia: Culturas Específicas', 'Novo', 'Lucas', NULL),
  ('Estatudo da Pessoa Idosa (Lei n° 10.704/2003)', 'Novo', 'Lucas', NULL),
  ('Neurociências e Psicologia', 'Novo', 'Lucas', NULL),
  ('Finanças Comportamentais / Psicologia Financeira', 'Novo', 'Lucas', NULL),
  ('Gestão e Planejamento Rural', 'Novo', 'Lucas', NULL);