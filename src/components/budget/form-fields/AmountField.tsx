import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BudgetFormValues } from "../types";
import { NumericFormat } from "react-number-format";

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
            <NumericFormat
              customInput={Input}
              value={field.value}
              onValueChange={(values) => {
                const { formattedValue } = values;
                field.onChange(formattedValue);
                console.log('NumericFormat value:', formattedValue); // Debug log
              }}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}