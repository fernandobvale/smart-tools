
-- Atualizar todos os registros da tabela editores com o user_id nulo,
-- atribuindo o user_id informado pelo usuário.

ALTER TABLE public.editores
ADD COLUMN IF NOT EXISTS user_id uuid;

UPDATE public.editores
SET user_id = '7e4dbf1a-61f7-47b7-99c6-5c4de602dea0'
WHERE user_id IS NULL;

-- (Opcional) Se desejar tornar user_id obrigatório futuramente:
-- ALTER TABLE public.editores ALTER COLUMN user_id SET NOT NULL;
