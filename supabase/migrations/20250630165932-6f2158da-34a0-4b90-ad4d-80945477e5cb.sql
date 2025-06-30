
-- ETAPA 2: RECRIAÇÃO MINIMALISTA DAS POLÍTICAS RLS
-- Criar APENAS 2 políticas essenciais com nomes únicos

-- Política 1: Permitir INSERT público/anônimo (para o formulário de inscrição)
CREATE POLICY "clean_public_insert_2025_v1" 
  ON public.teacher_applications 
  FOR INSERT 
  TO public, anon, authenticated
  WITH CHECK (true);

-- Política 2: Permitir SELECT para usuários autenticados (para administração)
CREATE POLICY "clean_auth_select_2025_v1" 
  ON public.teacher_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- VERIFICAÇÃO FINAL: Confirmar que apenas as 2 novas políticas existem
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'teacher_applications'
ORDER BY policyname;

-- Esta consulta deve retornar exatamente 2 linhas com as políticas criadas acima
