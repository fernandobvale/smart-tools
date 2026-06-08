# Consulta de CEP

## API escolhida
**ViaCEP** (https://viacep.com.br) — gratuita, sem necessidade de chave, sem limite prático, retorna JSON com rua, bairro, cidade, estado, etc.

Endpoint: `https://viacep.com.br/ws/{cep}/json/`

Resposta:
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP"
}
```

Como é uma API pública sem chave, a chamada será feita direto do frontend (sem edge function / sem secret).

## O que será criado

1. **Nova página `/cep-consulta`** (`src/pages/CepConsulta.tsx`)
   - Campo de input com máscara `00000-000`
   - Botão "Consultar"
   - Card com resultado: CEP, Logradouro, Bairro, Cidade, Estado
   - Botão para copiar o endereço completo
   - Tratamento de erros (CEP inválido / não encontrado)
   - Histórico opcional em memória da sessão (sem persistência — não foi solicitada)

2. **Rota** em `src/App.tsx` dentro do bloco protegido por `RequireAuth`:
   - `/cep-consulta` → `CepConsulta`

3. **Menu lateral** (`src/components/ui/sidebar.tsx`)
   - Novo item "Consulta CEP" com ícone `MapPin`

4. **Command Menu** (`src/components/CommandMenu.tsx`)
   - Adicionar atalho "Consulta CEP"

5. **Dashboard** (`src/pages/Dashboard.tsx`)
   - Adicionar card linkando para `/cep-consulta` (segue padrão dinâmico de tools se aplicável)

## Fora de escopo
- Persistência de histórico em banco (pode ser adicionada depois se quiser)
- Edge function (não necessária — API pública sem chave)
