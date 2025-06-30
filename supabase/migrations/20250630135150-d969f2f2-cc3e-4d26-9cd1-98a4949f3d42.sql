
-- Verificar e remover TODAS as políticas existentes da tabela teacher_applications
DROP POLICY IF EXISTS "Allow anonymous inserts to teacher_applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Allow public teacher application insertion" ON public.teacher_applications;
DROP POLICY IF EXISTS "Authenticated users can view all teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can view their own teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can update their own teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can delete their own teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Allow public certificate insertion" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.teacher_applications;

-- Desabilitar RLS temporariamente para limpeza
ALTER TABLE public.teacher_applications DISABLE ROW LEVEL SECURITY;

-- Reabilitar RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Criar uma única política simples para inserção pública (incluindo usuários anônimos)
CREATE POLICY "Allow public insert teacher applications" 
  ON public.teacher_applications 
  FOR INSERT 
  TO public, anon, authenticated
  WITH CHECK (true);

-- Criar política para leitura apenas por usuários autenticados
CREATE POLICY "Allow authenticated users to view teacher applications" 
  ON public.teacher_applications 
  FOR SELECT 
  TO authenticated
  USING (true);
