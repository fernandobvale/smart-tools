import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "../types";

interface DateFieldProps {
  form: UseFormReturn<BudgetFormValues>;
}

export function DateField({ form }: DateFieldProps) {
  return (
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
  );
}