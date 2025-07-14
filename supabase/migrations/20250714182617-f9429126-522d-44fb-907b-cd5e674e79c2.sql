-- Corrigir políticas RLS para permitir manipulação de certificados públicos (user_id NULL)

-- Remover políticas existentes conflitantes
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.certificates;

-- Criar novas políticas que permitem manipular certificados próprios E públicos (user_id NULL)
CREATE POLICY "Users can update their own and public certificates" 
ON public.certificates 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR user_id IS NULL)
);

CREATE POLICY "Users can delete their own and public certificates" 
ON public.certificates 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR user_id IS NULL)
);

-- Criar trigger para automaticamente atualizar status_envio quando codigo_rastreio é preenchido
CREATE OR REPLACE FUNCTION public.update_certificate_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Se código de rastreio foi preenchido e status ainda é pendente, atualizar para enviado
  IF NEW.codigo_rastreio IS NOT NULL AND NEW.codigo_rastreio != '' AND NEW.status_envio = 'pendente' THEN
    NEW.status_envio = 'enviado';
  END IF;
  
  -- Se código de rastreio foi removido, voltar status para pendente
  IF (NEW.codigo_rastreio IS NULL OR NEW.codigo_rastreio = '') AND OLD.codigo_rastreio IS NOT NULL AND OLD.codigo_rastreio != '' THEN
    NEW.status_envio = 'pendente';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que executa antes de UPDATE
CREATE TRIGGER update_certificate_status_trigger
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_certificate_status();

-- Limpeza de dados existentes: atualizar certificados que têm rastreio mas status pendente
UPDATE public.certificates 
SET status_envio = 'enviado' 
WHERE codigo_rastreio IS NOT NULL 
  AND codigo_rastreio != '' 
  AND status_envio = 'pendente';