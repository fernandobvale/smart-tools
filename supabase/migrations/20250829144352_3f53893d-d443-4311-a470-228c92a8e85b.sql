
-- 1) Criar tabela de Reclamações de Curso
create table if not exists public.course_complaints (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  complaint_date date not null,           -- Data da Reclamação
  course text not null,                   -- Curso
  school text not null,                   -- Escola
  complaint text not null,                -- Reclamação
  analyst text,                           -- Responsável pela Análise (opcional)
  action_taken text,                      -- Ação Tomada (opcional)
  status text not null default 'Aberta'   -- Status (Aberta/Em Análise/Resolvida/Não Procede)
);

-- 2) Índice para ordenação eficiente por data de criação
create index if not exists idx_course_complaints_created_at
  on public.course_complaints (created_at desc);

-- 3) Habilitar RLS
alter table public.course_complaints enable row level security;

-- 4) Políticas RLS
-- Permitir leitura pública (página é pública e precisa listar as reclamações)
drop policy if exists "Public can select course_complaints" on public.course_complaints;
create policy "Public can select course_complaints"
  on public.course_complaints
  for select
  using (true);

-- Permitir criação pública (formulário sem login)
drop policy if exists "Public can insert course_complaints" on public.course_complaints;
create policy "Public can insert course_complaints"
  on public.course_complaints
  for insert
  with check (true);

-- Observação: não criar políticas de UPDATE/DELETE por enquanto
-- para evitar alterações/remoções públicas.

-- 5) Trigger para updated_at
drop trigger if exists course_complaints_set_updated_at on public.course_complaints;
create trigger course_complaints_set_updated_at
  before update on public.course_complaints
  for each row
  execute function public.update_updated_at_column();
