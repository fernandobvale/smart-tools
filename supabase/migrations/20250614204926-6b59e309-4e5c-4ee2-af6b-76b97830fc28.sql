
-- Atualizar todos os registros da tabela certificates com user_id nulo,
-- atribuindo o user_id informado pelo usuário.

UPDATE public.certificates
SET user_id = '7e4dbf1a-61f7-47b7-99c6-5c4de602dea0'
WHERE user_id IS NULL;
