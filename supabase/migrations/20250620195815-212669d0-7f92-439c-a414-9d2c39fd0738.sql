
-- Remover a política existente de SELECT
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.certificates;

-- Criar nova política que permite ver certificados próprios E certificados públicos
CREATE POLICY "Users can view their own and public certificates" 
  ON public.certificates 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    (auth.uid() = user_id OR user_id IS NULL)
  );
