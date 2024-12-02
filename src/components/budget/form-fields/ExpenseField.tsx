import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "../types";

interface ExpenseFieldProps {
  form: UseFormReturn<BudgetFormValues>;
  expenses: Array<{ id: string; name: string }>;
  onNewExpense: () => void;
}

export function ExpenseField({ form, expenses, onNewExpense }: ExpenseFieldProps) {
  return (
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
                onClick={onNewExpense}
              >
                + Adicionar nova despesa
              </Button>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}