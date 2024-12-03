import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DateFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: keyof T;
  label: string;
  required?: boolean;
}

export function DateField<T extends Record<string, any>>({ 
  form, 
  name, 
  label, 
  required 
}: DateFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && " *"}</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}