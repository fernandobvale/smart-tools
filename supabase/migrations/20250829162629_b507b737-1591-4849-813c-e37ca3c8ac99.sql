
-- Permitir que qualquer visitante crie uma sugestão:
-- - Se estiver logado: deve inserir com user_id = auth.uid()
-- - Se estiver anônimo: deve inserir com user_id = NULL

create policy "Public (anon) can insert course suggestions with null user_id"
on public.course_suggestions
for insert
with check (
  (auth.uid() is null and user_id is null)
  or (auth.uid() = user_id)
);
