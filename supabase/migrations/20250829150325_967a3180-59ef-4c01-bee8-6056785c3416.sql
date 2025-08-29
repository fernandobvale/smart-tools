
-- Garantir que RLS esteja habilitado (já deve estar, mas sem problemas repetir)
ALTER TABLE public.course_complaints ENABLE ROW LEVEL SECURITY;

-- Permitir UPDATE apenas para usuários com papel 'admin'
-- (usa a tabela public.user_roles com enum app_role = 'admin')
CREATE POLICY "Admins can update course complaints"
ON public.course_complaints
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  )
);

-- Trigger para manter updated_at sempre atualizado
DROP TRIGGER IF EXISTS trg_course_complaints_updated_at ON public.course_complaints;

CREATE TRIGGER trg_course_complaints_updated_at
BEFORE UPDATE ON public.course_complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índice para melhorar ordenação/consulta por created_at
CREATE INDEX IF NOT EXISTS idx_course_complaints_created_at
ON public.course_complaints (created_at);
