
-- Permitir leitura pública das sugestões
create policy "Public can select course_suggestions"
on public.course_suggestions
for select
using (true);

-- Permitir que administradores atualizem qualquer sugestão
create policy "Admins can update any course suggestion"
on public.course_suggestions
for update
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'::app_role
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'::app_role
  )
);
