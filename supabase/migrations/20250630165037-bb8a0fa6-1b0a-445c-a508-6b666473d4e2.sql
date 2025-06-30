
-- ETAPA 1: LIMPEZA AGRESSIVA DE TODAS AS POLÍTICAS RLS
-- Remover TODAS as políticas conhecidas da tabela teacher_applications (em inglês e português)

-- Políticas em inglês
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
DROP POLICY IF EXISTS "public_insert_teacher_apps_2025" ON public.teacher_applications;
DROP POLICY IF EXISTS "auth_select_teacher_apps_2025" ON public.teacher_applications;

-- Políticas em português
DROP POLICY IF EXISTS "Permitir inserções anônimas em teacher_applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Permitir inserção pública de aplicações de professor" ON public.teacher_applications;
DROP POLICY IF EXISTS "Usuários autenticados podem ver todas as aplicações de professor" ON public.teacher_applications;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias aplicações de professor" ON public.teacher_applications;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias aplicações de professor" ON public.teacher_applications;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias aplicações de professor" ON public.teacher_applications;

-- Desabilitar RLS temporariamente para garantir limpeza completa
ALTER TABLE public.teacher_applications DISABLE ROW LEVEL SECURITY;

-- Aguardar para garantir que as mudanças sejam aplicadas
SELECT pg_sleep(2);

-- Reabilitar RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- VERIFICAÇÃO: Consultar políticas existentes (deve retornar vazio)
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd 
FROM pg_policies 
WHERE tablename = 'teacher_applications'
ORDER BY policyname;

-- Se a consulta acima retornar linhas, ainda há políticas que precisam ser removidas
