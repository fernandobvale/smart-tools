import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "../types";

interface NumberOfLessonsFieldProps {
  form: UseFormReturn<CourseFormValues>;
  onValueChange: (value: number) => void;
}

export function NumberOfLessonsField({ form, onValueChange }: NumberOfLessonsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="numero_aulas"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Número de Aulas</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1"
              {...field} 
              onChange={(e) => {
                field.onChange(e);
                onValueChange(parseInt(e.target.value));
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}