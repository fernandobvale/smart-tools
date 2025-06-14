
-- Habilite RLS para todas as tabelas relevantes 
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpf_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE payees ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE editores ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;

-- Remova políticas permissivas e antigas, caso existam
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON certificates;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON cursos;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON cpf_searches;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON payees;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON notes;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON editores;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON teacher_applications;
DROP POLICY IF EXISTS "allow_insert" ON certificates;

-- Adicione a coluna user_id onde necessário para vincular registros ao usuário
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE cpf_searches ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE payees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Políticas: Só o dono pode visualizar, inserir, atualizar e deletar
-- POLICY para certificates
CREATE POLICY "Usuário pode visualizar seus próprios certificados"
  ON certificates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir seus próprios certificados"
  ON certificates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus próprios certificados"
  ON certificates
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus próprios certificados"
  ON certificates
  FOR DELETE
  USING (auth.uid() = user_id);

-- POLICY para cursos
CREATE POLICY "Usuário pode visualizar seus próprios cursos"
  ON cursos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir seus próprios cursos"
  ON cursos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus próprios cursos"
  ON cursos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus próprios cursos"
  ON cursos
  FOR DELETE
  USING (auth.uid() = user_id);

-- POLICY para cpf_searches
CREATE POLICY "Usuário pode visualizar suas próprias buscas CPF"
  ON cpf_searches
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir suas próprias buscas CPF"
  ON cpf_searches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar suas próprias buscas CPF"
  ON cpf_searches
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar suas próprias buscas CPF"
  ON cpf_searches
  FOR DELETE
  USING (auth.uid() = user_id);

-- POLICY para payees
CREATE POLICY "Usuário pode visualizar seus próprios beneficiários"
  ON payees
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir seus próprios beneficiários"
  ON payees
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus próprios beneficiários"
  ON payees
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus próprios beneficiários"
  ON payees
  FOR DELETE
  USING (auth.uid() = user_id);

-- POLICY para prompts
CREATE POLICY "Usuário pode visualizar seus próprios prompts"
  ON prompts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir seus próprios prompts"
  ON prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus próprios prompts"
  ON prompts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus próprios prompts"
  ON prompts
  FOR DELETE
  USING (auth.uid() = user_id);

-- POLICY para notes
CREATE POLICY "Usuário pode visualizar suas próprias notas"
  ON notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir suas próprias notas"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar suas próprias notas"
  ON notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar suas próprias notas"
  ON notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- POLICY para profiles (apenas visualizar/atualizar seu próprio perfil)
CREATE POLICY "Usuário pode visualizar seu próprio perfil"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuário pode atualizar seu próprio perfil"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- editores e teacher_applications podem ser abertos conforme necessidade, mas recomenda-se RLS mínima
ALTER TABLE editores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editor pode visualizar" ON editores FOR SELECT USING (true);

ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Candidaturas podem ser inseridas por qualquer um" ON teacher_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Candidato pode ver sua própria candidatura" ON teacher_applications FOR SELECT USING (email = current_setting('request.jwt.claim.email', true));
