
-- CORREÇÃO FINAL DAS POLÍTICAS RLS - ROLES CORRETOS
-- Remover as políticas problemáticas e recriar com roles corretos

-- Remover as políticas atuais que estão causando problema
DROP POLICY IF EXISTS "ultimate_public_insert_final_2025" ON public.teacher_applications;
DROP POLICY IF EXISTS "ultimate_auth_select_final_2025" ON public.teacher_applications;

-- Criar política de INSERT corrigida - permitindo especificamente anon e authenticated
CREATE POLICY "anon_insert_teacher_apps_2025_fixed" 
  ON public.teacher_applications 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Criar política de SELECT mantendo apenas para authenticated
CREATE POLICY "auth_select_teacher_apps_2025_fixed" 
  ON public.teacher_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Verificação final: Confirmar que as políticas estão corretas
SELECT 
    policyname,
    cmd,
    roles,
    permissive
FROM pg_policies 
WHERE tablename = 'teacher_applications'
ORDER BY policyname;

-- Esta query deve mostrar:
-- 1. anon_insert_teacher_apps_2025_fixed | INSERT | {anon,authenticated}
-- 2. auth_select_teacher_apps_2025_fixed | SELECT | {authenticated}
