
-- 1. Criar tabela para armazenar projetos Supabase de cada usuário
CREATE TABLE public.supabase_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_password_hash TEXT,
  supabase_url TEXT NOT NULL,
  anon_key TEXT NOT NULL,
  service_role_key TEXT NOT NULL,
  project_id TEXT NOT NULL,
  dashboard_url TEXT NOT NULL,
  db_host TEXT NOT NULL,
  db_port INTEGER NOT NULL DEFAULT 5432,
  db_user TEXT NOT NULL,
  db_password TEXT NOT NULL,
  db_name TEXT NOT NULL DEFAULT 'postgres',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE public.supabase_projects ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para permitir que apenas o dono gerencie seus projetos

-- Visualizar
CREATE POLICY "Usuário pode visualizar seus próprios projetos Supabase"
  ON public.supabase_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Criar
CREATE POLICY "Usuário pode criar projetos Supabase para si mesmo"
  ON public.supabase_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Atualizar
CREATE POLICY "Usuário pode editar seus próprios projetos Supabase"
  ON public.supabase_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Deletar
CREATE POLICY "Usuário pode deletar seus próprios projetos Supabase"
  ON public.supabase_projects
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_supabase_projects_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_supabase_projects_updated_at
BEFORE UPDATE ON public.supabase_projects
FOR EACH ROW
EXECUTE PROCEDURE public.update_supabase_projects_updated_at_column();

