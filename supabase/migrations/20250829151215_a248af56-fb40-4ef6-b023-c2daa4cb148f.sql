
-- 1) Adicionar coluna de observação/resposta
alter table public.course_complaints
  add column if not exists feedback text;

-- 2) Conceder papel 'admin' ao seu usuário (baseado no user_id visto nos logs)
-- Se a linha já existir, não faz nada.
insert into public.user_roles (user_id, role)
values ('7e4dbf1a-61f7-47b7-99c6-5c4de602dea0', 'admin')
on conflict (user_id, role) do nothing;
