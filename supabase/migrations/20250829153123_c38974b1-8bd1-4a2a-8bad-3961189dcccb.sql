
-- Tabela de sugestões de curso
create table if not exists public.course_suggestions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  suggestion_date date not null,
  suggested_course text not null,
  school text not null,
  attendant text not null,
  observations text,
  internet_searches text not null,
  course_created boolean not null default false
);

-- RLS
alter table public.course_suggestions enable row level security;

-- Qualquer usuário (inclusive não autenticado) pode visualizar
create policy if not exists "Public can select course_suggestions"
  on public.course_suggestions
  for select
  using (true);

-- Qualquer usuário pode inserir (sugestões públicas)
create policy if not exists "Public can insert course_suggestions"
  on public.course_suggestions
  for insert
  with check (true);

-- Apenas admin pode atualizar
create policy if not exists "Admins can update course_suggestions"
  on public.course_suggestions
  for update
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = 'admin'::app_role
    )
  )
  with check (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = 'admin'::app_role
    )
  );

-- Trigger para updated_at
drop trigger if exists update_course_suggestions_updated_at on public.course_suggestions;
create trigger update_course_suggestions_updated_at
before update on public.course_suggestions
for each row execute procedure public.update_updated_at_column();

-- Índice útil para ordenação por data da sugestão
create index if not exists course_suggestions_suggestion_date_idx
  on public.course_suggestions (suggestion_date desc);
