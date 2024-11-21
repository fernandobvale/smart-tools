import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "../types";
import { NumericFormat } from "react-number-format";

interface ValueFieldProps {
  form: UseFormReturn<CourseFormValues>;
}

export function ValueField({ form }: ValueFieldProps) {
  return (
    <FormField
      control={form.control}
      name="valor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor</FormLabel>
          <FormControl>
            <NumericFormat
              customInput={Input}
              value={field.value}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              className="bg-muted"
              readOnly
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}