-- Create bitcoin_transactions table
CREATE TABLE public.bitcoin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('compra', 'venda')),
  amount_btc NUMERIC(18, 8) NOT NULL CHECK (amount_btc > 0),
  amount_brl NUMERIC(18, 2) NOT NULL CHECK (amount_brl > 0),
  price_per_btc NUMERIC(18, 2) NOT NULL CHECK (price_per_btc > 0),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.bitcoin_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transactions"
ON public.bitcoin_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
ON public.bitcoin_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON public.bitcoin_transactions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON public.bitcoin_transactions
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bitcoin_transactions_updated_at
BEFORE UPDATE ON public.bitcoin_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_bitcoin_transactions_user_id ON public.bitcoin_transactions(user_id);
CREATE INDEX idx_bitcoin_transactions_transaction_date ON public.bitcoin_transactions(transaction_date DESC);