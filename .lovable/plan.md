

## Fatura dos Correios — Plano de Implementação

### O que será construído

Uma página para registrar postagens diárias nos Correios (data + valor), agrupadas por mês em "faturas". Cada fatura mensal pode ser fechada, conferida e marcada como paga.

### Estrutura do banco de dados

**Tabela `postal_invoices`** (faturas mensais):
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL)
- `reference_month` (date) — primeiro dia do mês de referência (ex: 2026-04-01)
- `status` (text, default 'aberta') — valores: `aberta`, `fechada`, `paga`
- `total_amount` (numeric, default 0) — valor total calculado
- `closed_at` (timestamptz, nullable)
- `paid_at` (timestamptz, nullable)
- `notes` (text, nullable)
- `created_at`, `updated_at`
- RLS: usuário vê/edita/deleta apenas seus próprios registros

**Tabela `postal_entries`** (lançamentos diários):
- `id` (uuid, PK)
- `invoice_id` (uuid, FK → postal_invoices)
- `user_id` (uuid, NOT NULL)
- `entry_date` (date, NOT NULL)
- `amount` (numeric, NOT NULL)
- `description` (text, nullable)
- `created_at`
- RLS: usuário vê/edita/deleta apenas seus próprios registros

### Componentes e páginas

1. **`src/pages/PostalInvoices.tsx`** — Página principal com duas abas:
   - **Lançamentos**: formulário para adicionar data + valor, selecionar mês de referência; tabela dos lançamentos do mês selecionado com total parcial
   - **Faturas**: lista de faturas mensais com status (aberta/fechada/paga), valor total, botões para fechar e marcar como paga

2. **`src/hooks/usePostalInvoices.ts`** — Hook com queries e mutations para ambas as tabelas

3. **Rota**: `/postal-invoices` (protegida, dentro do DashboardLayout)

4. **Menu/Card**: Inserir registro na tabela `tools` com categoria "Financeiro" e ícone `Mail`

### Fluxo do usuário

1. Acessa a página, seleciona o mês atual (ou cria automaticamente a fatura do mês se não existir)
2. Lança data e valor de cada postagem diária
3. Vê o total acumulado em tempo real
4. No fim do mês, clica "Fechar Fatura" — status muda para `fechada`
5. Após conferir com a fatura dos Correios e pagar, clica "Marcar como Paga"
6. Histórico de faturas anteriores visível na aba Faturas

### Passos de implementação

1. Criar migração com as duas tabelas + políticas RLS
2. Criar hook `usePostalInvoices`
3. Criar página `PostalInvoices.tsx`
4. Adicionar rota no `App.tsx`
5. Inserir ferramenta na tabela `tools` via insert

