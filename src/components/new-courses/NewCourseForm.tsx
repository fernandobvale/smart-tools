import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NewCourseFormValues, newCourseFormSchema, NewCourse } from "./types";
import { CourseNameField } from "./FormFields/CourseNameField";
import { StatusField } from "./FormFields/StatusField";
import { ProfessorField } from "./FormFields/ProfessorField";

interface NewCourseFormProps {
  course?: NewCourse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewCourseForm({ course, onSuccess, onCancel }: NewCourseFormProps) {
  const form = useForm<NewCourseFormValues>({
    resolver: zodResolver(newCourseFormSchema),
    defaultValues: {
      curso: course?.curso || "",
      status: course?.status || "Novo",
      professor: course?.professor || "",
    },
  });

  const onSubmit = async (data: NewCourseFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para realizar esta ação");
        return;
      }

      if (course) {
        // Atualizar curso existente
        const { error } = await supabase
          .from("new_courses")
          .update({
            curso: data.curso,
            status: data.status,
            professor: data.professor,
          })
          .eq("id", course.id);

        if (error) throw error;
        toast.success("Curso atualizado com sucesso!");
      } else {
        // Criar novo curso
        const { error } = await supabase
          .from("new_courses")
          .insert({
            curso: data.curso,
            status: data.status,
            professor: data.professor,
            user_id: user.id,
          });

        if (error) throw error;
        toast.success("Curso criado com sucesso!");
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast.error("Erro ao salvar curso. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CourseNameField form={form} />
        <StatusField form={form} />
        <ProfessorField form={form} />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {course ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
