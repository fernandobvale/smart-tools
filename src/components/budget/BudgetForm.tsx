import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  expenseId: z.string().min(1, "Despesa é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

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

  const { data: expenses = [] } = useQuery({
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

  const handleNewExpense = async (expenseName: string) => {
    if (!selectedCategory) return;

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
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleCategoryChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {selectedCategory && (
              <FormField
                control={form.control}
                name="expenseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Despesa</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione ou adicione uma despesa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenses.map((expense) => (
                          <SelectItem key={expense.id} value={expense.id}>
                            {expense.name}
                          </SelectItem>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            const name = window.prompt("Digite o nome da nova despesa:");
                            if (name) handleNewExpense(name);
                          }}
                        >
                          + Adicionar nova despesa
                        </Button>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
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