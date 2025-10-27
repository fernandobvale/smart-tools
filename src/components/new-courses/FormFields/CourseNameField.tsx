import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NewCourseFormValues } from "../types";

interface CourseNameFieldProps {
  form: UseFormReturn<NewCourseFormValues>;
}

export function CourseNameField({ form }: CourseNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="curso"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Curso</FormLabel>
          <FormControl>
            <Input placeholder="Digite o nome do curso" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
