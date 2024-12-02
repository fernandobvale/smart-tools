import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryField } from "./form-fields/CategoryField";
import { ExpenseField } from "./form-fields/ExpenseField";
import { AmountField } from "./form-fields/AmountField";
import { DateField } from "./form-fields/DateField";
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
    id?: string;
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
  const queryClient = useQueryClient();

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
      date: new Date().toISOString().split('T')[0],
      amount: "",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      let expenseId = data.expenseId;

      // Se não tiver expenseId e tiver newExpenseName, precisamos criar ou obter a despesa
      if (!expenseId && data.newExpenseName) {
        // Primeiro, verificar se já existe uma despesa com o mesmo nome na categoria
        const { data: existingExpense, error: searchError } = await supabase
          .from("budget_expenses")
          .select("id")
          .eq("category_id", data.categoryId)
          .eq("name", data.newExpenseName)
          .single();

        if (searchError && searchError.code !== 'PGRST116') { // PGRST116 é o código para "não encontrado"
          throw searchError;
        }

        if (existingExpense) {
          // Se a despesa já existe, usar o ID dela
          expenseId = existingExpense.id;
        } else {
          // Se não existe, criar nova despesa
          const { data: newExpense, error: createError } = await supabase
            .from("budget_expenses")
            .insert({
              category_id: data.categoryId,
              name: data.newExpenseName,
            })
            .select()
            .single();

          if (createError) throw createError;
          expenseId = newExpense.id;
        }
      }

      if (!expenseId) {
        toast.error("Selecione ou crie uma despesa");
        return;
      }

      const numericAmount = parseCurrencyToNumber(data.amount);

      // Agora que temos certeza que temos um expenseId válido, podemos criar/atualizar o lançamento
      if (mode === 'edit' && initialData?.id) {
        const { error: updateError } = await supabase
          .from("budget_entries")
          .update({
            expense_id: expenseId,
            date: data.date,
            amount: numericAmount,
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        const { error: insertError } = await supabase
          .from("budget_entries")
          .insert({
            expense_id: expenseId,
            date: data.date,
            amount: numericAmount,
          });

        if (insertError) throw insertError;
        toast.success("Lançamento criado com sucesso!");
      }

      await queryClient.invalidateQueries({ queryKey: ["budget-entries"] });
      await queryClient.invalidateQueries({ queryKey: ["budget-details"] });
      await queryClient.invalidateQueries({ queryKey: ["budget-categories"] });

      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error(mode === 'edit' ? "Erro ao atualizar lançamento" : "Erro ao criar lançamento");
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

            <DateField form={form} />
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