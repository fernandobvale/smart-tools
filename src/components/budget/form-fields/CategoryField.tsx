import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "../types";

interface CategoryFieldProps {
  form: UseFormReturn<BudgetFormValues>;
  categories: Array<{ id: string; name: string }>;
}

export function CategoryField({ form, categories }: CategoryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              // Reset expense-related fields when category changes
              form.setValue("expenseId", undefined);
              form.setValue("newExpenseName", undefined);
            }}
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
  );
}