-- Create tools table
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  href TEXT NOT NULL,
  external BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  order_index INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own tools and public tools"
  ON public.tools FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert their own tools"
  ON public.tools FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tools"
  ON public.tools FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own tools"
  ON public.tools FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data with existing tools (public tools with user_id = NULL)
INSERT INTO public.tools (name, description, icon, href, external, category, user_id) VALUES
  ('Dashboard', 'Visão geral de todas as ferramentas', 'LayoutDashboard', '/dashboard', false, 'Geral', NULL),
  ('Quebrador de Texto', 'Divida textos longos em partes menores', 'FileText', '/text-splitter', false, 'Produtividade', NULL),
  ('Recibos', 'Gere e gerencie recibos de pagamento', 'Calculator', '/receipts', false, 'Finanças', NULL),
  ('Consulta CPF', 'Busque informações de CPF', 'Search', '/cpf-consulta', false, 'Gestão', NULL),
  ('Gerador SEO', 'Crie conteúdo otimizado para SEO', 'Globe', '/seo-generator', false, 'IA & Automação', NULL),
  ('Editor Markdown', 'Edite textos em formato Markdown', 'Edit3', '/markdown-editor', false, 'Produtividade', NULL),
  ('Notas', 'Gerencie suas anotações', 'StickyNote', '/notes', false, 'Produtividade', NULL),
  ('Certificados', 'Gerencie certificados de cursos', 'Award', '/certificates/manage', false, 'Cursos', NULL),
  ('Lista de Professores', 'Visualize candidaturas de professores', 'Users', '/teacher-list', false, 'Cursos', NULL),
  ('Gerador de Prompts', 'Crie prompts para IA', 'Lightbulb', '/prompt-generator', false, 'IA & Automação', NULL),
  ('Lista de Prompts', 'Veja todos os prompts salvos', 'List', '/prompt-list', false, 'IA & Automação', NULL),
  ('Pagamento de Editores', 'Gerencie pagamentos de editores', 'GraduationCap', '/courses', false, 'Cursos', NULL),
  ('Novos Cursos', 'Gerencie novos cursos', 'BookPlus', '/new-courses', false, 'Cursos', NULL),
  ('Reclamações de Cursos', 'Gerencie reclamações', 'AlertTriangle', '/reclamacoes-curso', false, 'Cursos', NULL),
  ('Sugestões de Curso', 'Visualize sugestões de cursos', 'MessageSquare', '/sugestoes-curso', false, 'Cursos', NULL),
  ('Plano Orçamentário', 'Planeje seu orçamento', 'BarChart3', '/plano-orcamentario', false, 'Finanças', NULL),
  ('Supabase Projects', 'Gerencie projetos Supabase', 'Database', '/supabase', false, 'Gestão', NULL),
  ('Carteira Bitcoin', 'Gerencie suas transações Bitcoin', 'Bitcoin', '/bitcoin-wallet', false, 'Finanças', NULL),
  ('Gerador de Capas', 'Crie capas para cursos', 'Image', '/course-image-generator', false, 'Cursos', NULL),
  ('Ebook', 'Acesse o ebook da plataforma', 'BookOpen', 'https://ebook.aidirectory.com.br', true, 'Gestão', NULL);