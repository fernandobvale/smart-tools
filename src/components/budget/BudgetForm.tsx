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
      let finalExpenseId = data.expenseId;

      // Se tiver um novo nome de despesa, criar primeiro
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
        finalExpenseId = newExpense.id;
      }

      if (!finalExpenseId) {
        toast.error("Selecione ou crie uma despesa");
        return;
      }

      const numericAmount = parseCurrencyToNumber(data.amount);

      // Aqui está a correção principal - usando snake_case para o nome da coluna
      const entryData = {
        expense_id: finalExpenseId,
        date: data.date,
        amount: numericAmount,
      };

      console.log('Dados a serem inseridos:', entryData);

      if (mode === 'edit' && initialData?.id) {
        const { error: updateError } = await supabase
          .from("budget_entries")
          .update(entryData)
          .eq('id', initialData.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        const { data: insertedData, error: entryError } = await supabase
          .from("budget_entries")
          .insert([entryData])
          .select();

        console.log('Resposta do insert:', { data: insertedData, error: entryError });

        if (entryError) {
          console.error('Insert error:', entryError);
          throw entryError;
        }
        toast.success("Lançamento criado com sucesso!");
      }

      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ["budget-entries"] });
      await queryClient.invalidateQueries({ queryKey: ["budget-details"] });
      await queryClient.invalidateQueries({ queryKey: ["budget-categories"] });

      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error details:', error);
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