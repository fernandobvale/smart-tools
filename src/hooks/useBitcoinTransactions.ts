import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BitcoinTransaction {
  id: string;
  user_id: string;
  transaction_type: "compra" | "venda";
  amount_btc: number;
  amount_brl: number;
  price_per_btc: number;
  transaction_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewTransaction {
  transaction_type: "compra" | "venda";
  amount_btc: number;
  amount_brl: number;
  transaction_date: string;
  notes?: string;
}

export const useBitcoinTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["bitcoin-transactions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("bitcoin_transactions")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      return data as BitcoinTransaction[];
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (newTransaction: NewTransaction) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const price_per_btc = newTransaction.amount_brl / newTransaction.amount_btc;

      const { data, error } = await supabase
        .from("bitcoin_transactions")
        .insert({
          user_id: user.id,
          ...newTransaction,
          price_per_btc,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bitcoin-transactions"] });
      toast.success("Transação adicionada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar transação: " + error.message);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bitcoin_transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bitcoin-transactions"] });
      toast.success("Transação deletada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar transação: " + error.message);
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction,
    deleteTransaction,
  };
};
