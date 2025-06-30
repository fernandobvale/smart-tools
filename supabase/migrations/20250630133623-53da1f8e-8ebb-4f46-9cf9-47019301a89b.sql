
-- Remover todas as políticas existentes da tabela teacher_applications
DROP POLICY IF EXISTS "Allow public certificate insertion" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.teacher_applications;

-- Criar política limpa para permitir inserção pública
CREATE POLICY "Allow public teacher application insertion" 
  ON public.teacher_applications 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política para permitir que usuários autenticados vejam todas as aplicações (para administração)
CREATE POLICY "Authenticated users can view all teacher applications" 
  ON public.teacher_applications 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Garantir que RLS está habilitado
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
