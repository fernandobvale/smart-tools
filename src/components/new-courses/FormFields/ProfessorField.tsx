import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NewCourseFormValues } from "../types";

interface ProfessorFieldProps {
  form: UseFormReturn<NewCourseFormValues>;
}

export function ProfessorField({ form }: ProfessorFieldProps) {
  return (
    <FormField
      control={form.control}
      name="professor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Professor</FormLabel>
          <FormControl>
            <Input placeholder="Digite o nome do professor" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
