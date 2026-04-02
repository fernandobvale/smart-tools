
-- Tabela de faturas mensais dos Correios
CREATE TABLE public.postal_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reference_month DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'aberta',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  closed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, reference_month)
);

ALTER TABLE public.postal_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own postal invoices"
  ON public.postal_invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own postal invoices"
  ON public.postal_invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own postal invoices"
  ON public.postal_invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own postal invoices"
  ON public.postal_invoices FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_postal_invoices_updated_at
  BEFORE UPDATE ON public.postal_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de lançamentos diários
CREATE TABLE public.postal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.postal_invoices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.postal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own postal entries"
  ON public.postal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own postal entries"
  ON public.postal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own postal entries"
  ON public.postal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own postal entries"
  ON public.postal_entries FOR DELETE
  USING (auth.uid() = user_id);
