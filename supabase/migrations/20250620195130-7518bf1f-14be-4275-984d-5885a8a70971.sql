
-- Criar política para permitir inserção pública de certificados
CREATE POLICY "Allow public certificate insertion" 
  ON public.certificates 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política para permitir que usuários autenticados vejam seus próprios certificados
CREATE POLICY "Users can view their own certificates" 
  ON public.certificates 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Criar política para permitir que usuários autenticados atualizem seus próprios certificados
CREATE POLICY "Users can update their own certificates" 
  ON public.certificates 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Criar política para permitir que usuários autenticados excluam seus próprios certificados
CREATE POLICY "Users can delete their own certificates" 
  ON public.certificates 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Habilitar RLS na tabela certificates (caso não esteja habilitado)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
