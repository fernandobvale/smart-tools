
-- Limpeza completa e agressiva de TODAS as políticas da tabela teacher_applications
-- Incluindo políticas em português e inglês que podem estar causando conflitos

-- Remover todas as políticas conhecidas (em inglês)
DROP POLICY IF EXISTS "Allow anonymous inserts to teacher_applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Allow public teacher application insertion" ON public.teacher_applications;
DROP POLICY IF EXISTS "Allow public insert teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Authenticated users can view all teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Allow authenticated users to view teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can view their own teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can update their own teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can delete their own teacher applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Allow public certificate insertion" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.teacher_applications;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.teacher_applications;

-- Remover políticas em português que podem existir
DROP POLICY IF EXISTS "Permitir inserções anônimas em teacher_applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Permitir inserção pública de aplicações de professor" ON public.teacher_applications;
DROP POLICY IF EXISTS "Usuários autenticados podem ver todas as aplicações de professor" ON public.teacher_applications;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias aplicações de professor" ON public.teacher_applications;

-- Desabilitar RLS temporariamente para garantir limpeza completa
ALTER TABLE public.teacher_applications DISABLE ROW LEVEL SECURITY;

-- Aguardar um momento para garantir que as mudanças sejam aplicadas
SELECT pg_sleep(1);

-- Reabilitar RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Criar APENAS as políticas necessárias com nomes únicos e claros
CREATE POLICY "public_insert_teacher_apps_2025" 
  ON public.teacher_applications 
  FOR INSERT 
  TO public, anon, authenticated
  WITH CHECK (true);

CREATE POLICY "auth_select_teacher_apps_2025" 
  ON public.teacher_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'teacher_applications';
