import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  nome_curso: z.string().min(1, "Nome do curso é obrigatório"),
  numero_aulas: z.coerce.number().min(1, "Número de aulas é obrigatório"),
  data_entrega: z.string().min(1, "Data de entrega é obrigatória"),
  valor: z.coerce.number().min(0, "Valor é obrigatório"),
  data_pagamento: z.string().optional(),
  status_pagamento: z.string().min(1, "Status de pagamento é obrigatório"),
  nome_editor: z.string().min(1, "Nome do editor é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: FormValues & { id: string };
  onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome_curso: "",
      numero_aulas: 0,
      data_entrega: "",
      valor: 0,
      data_pagamento: "",
      status_pagamento: "",
      nome_editor: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
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
        toast.success("Curso atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("cursos")
          .insert(courseData);

        if (error) throw error;
        toast.success("Curso criado com sucesso!");
      }

      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Erro ao salvar o curso. Tente novamente.");
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
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_entrega"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Entrega</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do Pagamento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status do Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="nome_editor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Editor</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Atualizar Curso" : "Criar Curso"}
        </Button>
      </form>
    </Form>
  );
}