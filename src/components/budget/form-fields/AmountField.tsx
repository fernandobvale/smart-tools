import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "../types";

interface AmountFieldProps {
  form: UseFormReturn<BudgetFormValues>;
}

export function AmountField({ form }: AmountFieldProps) {
  return (
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
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 2) {
                  value = value.slice(0, -2) + "," + value.slice(-2);
                }
                if (value.length > 6) {
                  value = value.slice(0, -6) + "." + value.slice(-6);
                }
                if (value) {
                  field.onChange(`R$ ${value}`);
                } else {
                  field.onChange("");
                }
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}