import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CategoryField } from "./form-fields/CategoryField";
import { ExpenseField } from "./form-fields/ExpenseField";
import { BudgetFormValues, budgetFormSchema } from "./types";

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetForm({ open, onOpenChange }: BudgetFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
    queryKey: ["budget-expenses", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const { data, error } = await supabase
        .from("budget_expenses")
        .select("*")
        .eq("category_id", selectedCategory)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory,
  });

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: "",
      expenseId: "",
      date: "",
      amount: "",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      const { error } = await supabase.from("budget_entries").insert([{
        expense_id: data.expenseId,
        date: data.date,
        amount: parseFloat(data.amount.replace(/[^0-9.-]+/g, "")),
      }]);

      if (error) throw error;

      toast.success("Lançamento criado com sucesso!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Erro ao criar lançamento");
      console.error(error);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("categoryId", value);
    form.setValue("expenseId", "");
  };

  const handleNewExpense = async () => {
    if (!selectedCategory) return;

    const expenseName = window.prompt("Digite o nome da nova despesa:");
    if (!expenseName) return;

    try {
      const { data, error } = await supabase
        .from("budget_expenses")
        .insert([{
          category_id: selectedCategory,
          name: expenseName,
        }])
        .select()
        .single();

      if (error) throw error;

      form.setValue("expenseId", data.id);
      refetchExpenses();
      toast.success("Nova despesa criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar nova despesa");
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
              onCategoryChange={handleCategoryChange}
            />

            {selectedCategory && (
              <ExpenseField
                form={form}
                expenses={expenses}
                onNewExpense={handleNewExpense}
              />
            )}

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