import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BudgetFormValues, budgetFormSchema } from "../types";
import { parseCurrencyToNumber } from "@/utils/currencyUtils";

interface UseBudgetFormProps {
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: {
    date: string;
    amount: string;
    expenseId: string;
    id?: string;
  };
  categoryId?: string;
  mode?: 'create' | 'edit';
}

export function useBudgetForm({ 
  onOpenChange, 
  onSuccess, 
  initialData,
  categoryId,
  mode = 'create' 
}: UseBudgetFormProps) {
  const queryClient = useQueryClient();
  
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

  const resetForm = () => {
    form.reset({
      categoryId: categoryId || "",
      expenseId: undefined,
      newExpenseName: undefined,
      date: new Date().toISOString().split('T')[0],
      amount: "",
    });
  };

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      let expenseId = data.expenseId;

      if (!expenseId && data.newExpenseName) {
        console.log('Verificando existência da despesa:', {
          categoryId: data.categoryId,
          name: data.newExpenseName
        });

        const { data: existingExpense, error: searchError } = await supabase
          .from("budget_expenses")
          .select("id")
          .eq("category_id", data.categoryId)
          .eq("name", data.newExpenseName)
          .single();

        if (searchError && searchError.code !== 'PGRST116') {
          console.error('Erro ao buscar despesa:', searchError);
          throw searchError;
        }

        if (existingExpense) {
          console.log('Despesa encontrada:', existingExpense);
          expenseId = existingExpense.id;
        } else {
          console.log('Criando nova despesa');
          const { data: newExpense, error: createError } = await supabase
            .from("budget_expenses")
            .insert({
              category_id: data.categoryId,
              name: data.newExpenseName,
            })
            .select()
            .single();

          if (createError) {
            console.error('Erro ao criar despesa:', createError);
            throw createError;
          }

          console.log('Nova despesa criada:', newExpense);
          expenseId = newExpense.id;
        }
      }

      if (!expenseId) {
        toast.error("Selecione ou crie uma despesa");
        return;
      }

      console.log('Prosseguindo com expense_id:', expenseId);

      const numericAmount = parseCurrencyToNumber(data.amount);

      if (mode === 'edit' && initialData?.id) {
        console.log('Atualizando lançamento existente');
        const { error: updateError } = await supabase
          .from("budget_entries")
          .update({
            expense_id: expenseId,
            date: data.date,
            amount: numericAmount,
          })
          .eq('id', initialData.id);

        if (updateError) {
          console.error('Erro ao atualizar lançamento:', updateError);
          throw updateError;
        }
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        console.log('Criando novo lançamento');
        const { error: insertError } = await supabase
          .from("budget_entries")
          .insert({
            expense_id: expenseId,
            date: data.date,
            amount: numericAmount,
          });

        if (insertError) {
          console.error('Erro ao criar lançamento:', insertError);
          throw insertError;
        }
        toast.success("Lançamento criado com sucesso!");
      }

      await queryClient.invalidateQueries({ queryKey: ["budget-entries"] });
      await queryClient.invalidateQueries({ queryKey: ["budget-details"] });
      await queryClient.invalidateQueries({ queryKey: ["budget-categories"] });

      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess();
      resetForm();
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(mode === 'edit' ? "Erro ao atualizar lançamento" : "Erro ao criar lançamento");
    }
  };

  return {
    form,
    onSubmit,
    resetForm
  };
}