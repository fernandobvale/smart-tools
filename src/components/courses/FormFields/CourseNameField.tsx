import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "../types";

interface CourseNameFieldProps {
  form: UseFormReturn<CourseFormValues>;
}

export function CourseNameField({ form }: CourseNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="nome_curso"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Curso</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}