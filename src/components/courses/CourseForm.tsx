import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { calculateValue } from "@/utils/courseCalculations";
import { EditorSelect } from "./EditorSelect";
import { DateField } from "./DateField";
import { CourseFormValues, courseFormSchema } from "./types";
import { useQuery } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";

interface CourseFormProps {
  initialData?: CourseFormValues & { id: string };
  onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const { data: editors = [], refetch: refetchEditors } = useQuery({
    queryKey: ["editors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editores")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData || {
      nome_curso: "",
      numero_aulas: 0,
      data_entrega: format(new Date(), "yyyy-MM-dd"),
      valor: 0,
      data_pagamento: "",
      status_pagamento: "",
      nome_editor: "",
    },
  });

  const handleNumberOfLessonsChange = (value: number) => {
    form.setValue("numero_aulas", value);
    form.setValue("valor", calculateValue(value));
  };

  const onSubmit = async (values: CourseFormValues) => {
    try {
      const courseData = {
        nome_curso: values.nome_curso,
        numero_aulas: values.numero_aulas,
        data_entrega: values.data_entrega,
        valor: values.valor,
        data_pagamento: values.data_pagamento || null,
        status_pagamento: values.status_pagamento,
        nome_editor: values.nome_editor,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("cursos")
          .update(courseData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("cursos")
          .insert([courseData]);

        if (error) throw error;
        toast.success("Lançamento criado com sucesso!");
      }

      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Erro ao salvar o lançamento. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  onChange={(e) => handleNumberOfLessonsChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DateField 
          form={form} 
          name="data_entrega" 
          label="Data de Entrega"
          required
        />

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

        <DateField 
          form={form} 
          name="data_pagamento" 
          label="Data do Pagamento"
        />

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

        <EditorSelect 
          form={form} 
          editors={editors} 
          onEditorAdded={() => refetchEditors()} 
        />

        <Button type="submit">
          {initialData ? "Atualizar Lançamento" : "Criar Lançamento"}
        </Button>
      </form>
    </Form>
  );
}