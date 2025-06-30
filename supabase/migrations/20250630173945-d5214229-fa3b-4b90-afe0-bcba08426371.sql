
-- LIMPEZA SUPER AGRESSIVA FINAL - DINÂMICA E COMPLETA
-- Esta migração vai descobrir e remover TODAS as políticas existentes dinamicamente

-- Primeiro, vamos ver exatamente quais políticas existem
SELECT 
    policyname,
    schemaname,
    tablename,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'teacher_applications'
ORDER BY policyname;

-- Agora vamos remover TODAS as políticas existentes dinamicamente
-- Usando um bloco PL/pgSQL para iterar sobre todas as políticas

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Loop através de todas as políticas da tabela teacher_applications
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'teacher_applications' 
          AND schemaname = 'public'
    LOOP
        -- Executar DROP POLICY para cada política encontrada
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.teacher_applications', 
                      policy_record.policyname);
        RAISE NOTICE 'Política removida: %', policy_record.policyname;
    END LOOP;
END $$;

-- Verificação 1: Confirmar que TODAS as políticas foram removidas
SELECT 
    COUNT(*) as total_politicas_restantes
FROM pg_policies 
WHERE tablename = 'teacher_applications';

-- Desabilitar e reabilitar RLS para garantir limpeza completa
ALTER TABLE public.teacher_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- RECRIAÇÃO LIMPA: Apenas 2 políticas com nomes únicos nunca usados
CREATE POLICY "ultimate_public_insert_final_2025" 
  ON public.teacher_applications 
  FOR INSERT 
  TO public, anon, authenticated
  WITH CHECK (true);

CREATE POLICY "ultimate_auth_select_final_2025" 
  ON public.teacher_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Verificação final: Deve mostrar exatamente 2 políticas
SELECT 
    policyname,
    cmd,
    roles,
    permissive
FROM pg_policies 
WHERE tablename = 'teacher_applications'
ORDER BY policyname;

-- Esta query deve retornar exatamente 2 linhas com as novas políticas
