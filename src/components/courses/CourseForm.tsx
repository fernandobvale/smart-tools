import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nome_curso: z.string().min(1, "Nome do curso é obrigatório"),
  numero_aulas: z.number().min(1, "Número de aulas deve ser maior que zero"),
  data_entrega: z.string().min(1, "Data de entrega é obrigatória"),
  nome_editor: z.string().min(1, "Nome do editor é obrigatório"),
  status_pagamento: z.string().min(1, "Status de pagamento é obrigatório"),
  data_pagamento: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  onSuccess: () => void;
  initialData?: FormValues;
}

export function CourseForm({ onSuccess, initialData }: CourseFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome_curso: "",
      numero_aulas: 0,
      data_entrega: "",
      nome_editor: "",
      status_pagamento: "",
      data_pagamento: "",
    },
  });

  const calculateValue = (numberOfLessons: number) => {
    if (numberOfLessons <= 15) {
      return numberOfLessons * 10;
    }
    return numberOfLessons * 8;
  };

  async function onSubmit(values: FormValues) {
    try {
      const valor = calculateValue(values.numero_aulas);
      
      const { error } = await supabase.from("cursos").insert({
        nome_curso: values.nome_curso,
        numero_aulas: values.numero_aulas,
        data_entrega: values.data_entrega,
        nome_editor: values.nome_editor,
        status_pagamento: values.status_pagamento,
        data_pagamento: values.data_pagamento || null,
        valor,
      });

      if (error) throw error;

      toast.success("Curso salvo com sucesso!");
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error("Erro ao salvar o curso. Tente novamente.");
    }
  }

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
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
              {field.value > 0 && (
                <div className="text-sm text-muted-foreground">
                  Valor calculado: R$ {calculateValue(field.value).toFixed(2)}
                </div>
              )}
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

        <FormField
          control={form.control}
          name="status_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Sim">Pago</SelectItem>
                  <SelectItem value="Não">Não Pago</SelectItem>
                </SelectContent>
              </Select>
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

        <Button type="submit" className="w-full">
          Salvar Curso
        </Button>
      </form>
    </Form>
  );
}