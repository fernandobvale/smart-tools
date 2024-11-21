import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "../types";

interface PaymentStatusFieldProps {
  form: UseFormReturn<CourseFormValues>;
}

export function PaymentStatusField({ form }: PaymentStatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="status_pagamento"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status do Pagamento</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}