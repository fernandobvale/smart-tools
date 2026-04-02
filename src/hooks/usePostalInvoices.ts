import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { format, startOfMonth } from "date-fns";

export interface PostalInvoice {
  id: string;
  user_id: string;
  reference_month: string;
  status: string;
  total_amount: number;
  closed_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostalEntry {
  id: string;
  invoice_id: string;
  user_id: string;
  entry_date: string;
  amount: number;
  description: string | null;
  created_at: string;
}

export function usePostalInvoices() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const invoicesQuery = useQuery({
    queryKey: ["postal-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("postal_invoices")
        .select("*")
        .order("reference_month", { ascending: false });
      if (error) throw error;
      return data as PostalInvoice[];
    },
    enabled: !!userId,
  });

  const entriesQuery = (invoiceId: string | undefined) =>
    useQuery({
      queryKey: ["postal-entries", invoiceId],
      queryFn: async () => {
        if (!invoiceId) return [];
        const { data, error } = await supabase
          .from("postal_entries")
          .select("*")
          .eq("invoice_id", invoiceId)
          .order("entry_date", { ascending: true });
        if (error) throw error;
        return data as PostalEntry[];
      },
      enabled: !!invoiceId,
    });

  const getOrCreateInvoice = useMutation({
    mutationFn: async (monthDate: Date) => {
      const refMonth = format(startOfMonth(monthDate), "yyyy-MM-dd");
      // Check if exists
      const { data: existing } = await supabase
        .from("postal_invoices")
        .select("*")
        .eq("reference_month", refMonth)
        .maybeSingle();
      if (existing) return existing as PostalInvoice;
      // Create
      const { data, error } = await supabase
        .from("postal_invoices")
        .insert({ user_id: userId!, reference_month: refMonth })
        .select()
        .single();
      if (error) throw error;
      return data as PostalInvoice;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["postal-invoices"] }),
  });

  const addEntry = useMutation({
    mutationFn: async (params: { invoiceId: string; entryDate: string; amount: number; description?: string }) => {
      const { data, error } = await supabase
        .from("postal_entries")
        .insert({
          invoice_id: params.invoiceId,
          user_id: userId!,
          entry_date: params.entryDate,
          amount: params.amount,
          description: params.description || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["postal-entries", vars.invoiceId] });
      recalcTotal.mutate(vars.invoiceId);
      toast.success("Lançamento adicionado!");
    },
    onError: () => toast.error("Erro ao adicionar lançamento"),
  });

  const deleteEntry = useMutation({
    mutationFn: async (params: { id: string; invoiceId: string }) => {
      const { error } = await supabase.from("postal_entries").delete().eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["postal-entries", vars.invoiceId] });
      recalcTotal.mutate(vars.invoiceId);
      toast.success("Lançamento removido!");
    },
  });

  const recalcTotal = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { data: entries } = await supabase
        .from("postal_entries")
        .select("amount")
        .eq("invoice_id", invoiceId);
      const total = (entries || []).reduce((sum, e: any) => sum + Number(e.amount), 0);
      const { error } = await supabase
        .from("postal_invoices")
        .update({ total_amount: total })
        .eq("id", invoiceId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["postal-invoices"] }),
  });

  const updateInvoiceStatus = useMutation({
    mutationFn: async (params: { id: string; status: string }) => {
      const updates: any = { status: params.status };
      if (params.status === "fechada") updates.closed_at = new Date().toISOString();
      if (params.status === "paga") updates.paid_at = new Date().toISOString();
      if (params.status === "aberta") {
        updates.closed_at = null;
        updates.paid_at = null;
      }
      const { error } = await supabase.from("postal_invoices").update(updates).eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postal-invoices"] });
      toast.success("Status atualizado!");
    },
  });

  return {
    invoicesQuery,
    entriesQuery,
    getOrCreateInvoice,
    addEntry,
    deleteEntry,
    updateInvoiceStatus,
  };
}
