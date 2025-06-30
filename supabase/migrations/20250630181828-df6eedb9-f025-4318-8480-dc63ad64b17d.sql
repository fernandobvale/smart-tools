
-- Criar política de DELETE para teacher_applications
-- Permitir que usuários autenticados excluam registros
CREATE POLICY "auth_delete_teacher_apps_2025" 
  ON public.teacher_applications 
  FOR DELETE 
  TO authenticated
  USING (true);
