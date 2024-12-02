import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryField } from "./form-fields/CategoryField";
import { ExpenseField } from "./form-fields/ExpenseField";
import { AmountField } from "./form-fields/AmountField";
import { BudgetFormValues, budgetFormSchema } from "./types";
import { parseCurrencyToNumber } from "@/utils/currencyUtils";

interface BudgetFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  categoryId?: string;
  initialData?: {
    date: string;
    amount: string;
    expenseId: string;
  };
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export function BudgetForm({ 
  open, 
  onOpenChange,
  categoryId,
  initialData,
  onSuccess,
  mode = 'create'
}: BudgetFormProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["budget-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["budget-expenses", categories],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_expenses")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: initialData || {
      categoryId: categoryId || "",
      expenseId: undefined,
      newExpenseName: undefined,
      date: "",
      amount: "",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      let expenseId = data.expenseId;

      if (data.newExpenseName) {
        const { data: newExpense, error: expenseError } = await supabase
          .from("budget_expenses")
          .insert({
            category_id: data.categoryId,
            name: data.newExpenseName,
          })
          .select()
          .single();

        if (expenseError) throw expenseError;
        expenseId = newExpense.id;
      }

      if (!expenseId) {
        toast.error("Selecione ou crie uma despesa");
        return;
      }

      // Convert amount string to number using the updated utility function
      const numericAmount = parseCurrencyToNumber(data.amount);
      console.log('Form submission - Original amount:', data.amount);
      console.log('Form submission - Converted amount:', numericAmount);

      if (mode === 'edit' && initialData?.expenseId) {
        const { error: updateError } = await supabase
          .from("budget_entries")
          .update({
            expense_id: expenseId,
            date: data.date,
            amount: numericAmount,
          })
          .eq('expense_id', initialData.expenseId);

        if (updateError) throw updateError;
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        const { error: entryError } = await supabase
          .from("budget_entries")
          .insert({
            expense_id: expenseId,
            date: data.date,
            amount: numericAmount,
          });

        if (entryError) throw entryError;
        toast.success("Lançamento criado com sucesso!");
      }

      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      toast.error(mode === 'edit' ? "Erro ao atualizar lançamento" : "Erro ao criar lançamento");
      console.error('Error details:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar' : 'Novo'} Lançamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CategoryField
              form={form}
              categories={categories}
            />

            <ExpenseField
              form={form}
              expenses={expenses.filter(expense => 
                expense.category_id === form.watch("categoryId")
              )}
            />

            <AmountField form={form} />

            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}