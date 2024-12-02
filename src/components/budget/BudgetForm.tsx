import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryField } from "./form-fields/CategoryField";
import { ExpenseField } from "./form-fields/ExpenseField";
import { BudgetFormValues, budgetFormSchema } from "./types";

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetForm({ open, onOpenChange }: BudgetFormProps) {
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
    defaultValues: {
      categoryId: "",
      expenseId: undefined,
      newExpenseName: undefined,
      date: "",
      amount: "",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      let expenseId = data.expenseId;

      // If it's a new expense, create it first
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

      // Create the budget entry
      const { error: entryError } = await supabase
        .from("budget_entries")
        .insert({
          expense_id: expenseId,
          date: data.date,
          amount: parseFloat(data.amount.replace(/[^0-9.-]+/g, "")),
        });

      if (entryError) throw entryError;

      toast.success("Lançamento criado com sucesso!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Erro ao criar lançamento");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
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

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const formattedValue = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(value) / 100);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}