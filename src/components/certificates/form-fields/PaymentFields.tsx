import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface PaymentFieldsProps {
  form: UseFormReturn<any>;
}

export function PaymentFields({ form }: PaymentFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="status_pagamento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status do Pagamento</FormLabel>
            <Select 
              defaultValue={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dados_confirmados"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmação dos Dados</FormLabel>
            <Select 
              defaultValue={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Confirme os dados" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Confirmado</SelectItem>
                <SelectItem value="false">Não Confirmado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}