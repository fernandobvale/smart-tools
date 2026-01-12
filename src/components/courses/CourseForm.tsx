
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { calculateValue } from "@/utils/courseCalculations";
import { EditorSelect } from "./EditorSelect";
import { DateField } from "./DateField";
import { CourseFormValues, courseFormSchema } from "./types";
import { useQuery } from "@tanstack/react-query";
import { CourseNameField } from "./FormFields/CourseNameField";
import { NumberOfLessonsField } from "./FormFields/NumberOfLessonsField";
import { ValueField } from "./FormFields/ValueField";
import { PaymentStatusField } from "./FormFields/PaymentStatusField";
import { useAuth } from "@/components/auth/AuthProvider";

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

      if (error) {
        console.error("Error fetching editors:", error);
        throw error;
      }
      return data;
    },
  });

  // Pega usuário autenticado
  const { user } = useAuth();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData || {
      nome_curso: "",
      numero_aulas: 0,
      data_entrega: format(new Date(), "yyyy-MM-dd"),
      valor: 0,
      data_pagamento: "",
      status_pagamento: "Pendente",
      nome_editor: "",
    },
  });

  const handleNumberOfLessonsChange = (value: number) => {
    form.setValue("numero_aulas", value);
    form.setValue("valor", calculateValue(value));
  };

  const onSubmit = async (values: CourseFormValues) => {
    try {
      console.log("Submitting form with values:", values);

      const courseData = {
        nome_curso: values.nome_curso,
        numero_aulas: values.numero_aulas,
        data_entrega: values.data_entrega,
        valor: values.valor,
        data_pagamento: values.data_pagamento || null,
        status_pagamento: values.status_pagamento,
        nome_editor: values.nome_editor,
        user_id: user?.id ?? null, // agora preenche também o user_id
      };

      console.log("Prepared course data:", courseData);

      if (initialData?.id) {
        const { error } = await supabase
          .from("cursos")
          .update(courseData)
          .eq("id", initialData.id);

        if (error) {
          console.error("Error updating course:", error);
          throw error;
        }
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("cursos")
          .insert([courseData]);

        if (error) {
          console.error("Error creating course:", error);
          throw error;
        }
        toast.success("Lançamento criado com sucesso!");
      }

      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving course:", error);
      if (error instanceof Error) {
        toast.error(`Erro ao salvar o lançamento: ${error.message}`);
      } else {
        toast.error("Erro ao salvar o lançamento. Tente novamente.");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CourseNameField form={form} />
        <NumberOfLessonsField form={form} onValueChange={handleNumberOfLessonsChange} />
        <DateField form={form} name="data_entrega" label="Data de Entrega" required />
        <ValueField form={form} />
        <DateField form={form} name="data_pagamento" label="Data do Pagamento" />
        <PaymentStatusField form={form} />
        <EditorSelect form={form} editors={editors} onEditorAdded={() => refetchEditors()} />
        <Button type="submit">
          {initialData ? "Atualizar Lançamento" : "Criar Lançamento"}
        </Button>
      </form>
    </Form>
  );
}
