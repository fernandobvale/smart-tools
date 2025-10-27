-- Atualizar política de SELECT para permitir visualizar cursos públicos (user_id NULL)
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios cursos" ON public.new_courses;

CREATE POLICY "Usuários podem visualizar seus próprios cursos e cursos públicos"
  ON public.new_courses FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Atualizar política de UPDATE para permitir editar cursos públicos
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios cursos" ON public.new_courses;

CREATE POLICY "Usuários podem atualizar seus próprios cursos e cursos públicos"
  ON public.new_courses FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Atualizar política de DELETE para permitir excluir cursos públicos
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios cursos" ON public.new_courses;

CREATE POLICY "Usuários podem deletar seus próprios cursos e cursos públicos"
  ON public.new_courses FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);