import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DateFieldProps {
  name: string;
  label: string;
  value?: string;
  onChange?: (date: string) => void;
  form?: UseFormReturn<any>;
  required?: boolean;
}

export function DateField({ 
  name, 
  label, 
  value,
  onChange,
  form,
  required 
}: DateFieldProps) {
  if (form) {
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

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}{required && " *"}
      </label>
      <Input
        type="date"
        id={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}