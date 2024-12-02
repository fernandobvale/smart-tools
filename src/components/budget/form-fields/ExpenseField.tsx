import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "../types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

interface ExpenseFieldProps {
  form: UseFormReturn<BudgetFormValues>;
  expenses: Array<{ id: string; name: string }>;
}

export function ExpenseField({ form, expenses }: ExpenseFieldProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (!form.watch("categoryId")) {
    return null;
  }

  return (
    <FormItem className="space-y-4">
      <FormLabel>Despesa</FormLabel>
      
      {!isAddingNew ? (
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="expenseId"
            render={({ field }) => (
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
                </SelectContent>
              </Select>
            )}
          />
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsAddingNew(true);
              form.setValue("expenseId", undefined);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="newExpenseName"
            render={({ field }) => (
              <FormControl>
                <Input placeholder="Digite o nome da nova despesa" {...field} />
              </FormControl>
            )}
          />
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsAddingNew(false);
              form.setValue("newExpenseName", undefined);
            }}
          >
            Selecionar Despesa Existente
          </Button>
        </div>
      )}
    </FormItem>
  );
}