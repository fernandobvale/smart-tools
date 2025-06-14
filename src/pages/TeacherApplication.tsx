
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherApplicationSchema, TeacherApplicationFormData } from "@/components/teacher-application/types";
import { PersonalInfoFields } from "@/components/teacher-application/PersonalInfoFields";
import { ExperienceFields } from "@/components/teacher-application/ExperienceFields";
import { PrivacyField } from "@/components/teacher-application/PrivacyField";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const initialValues: TeacherApplicationFormData = {
  full_name: "",
  email: "",
  whatsapp: "",
  academic_background: "",
  teaching_experience: "",
  video_experience: "",
  motivation: "",
  privacy_accepted: false,
};

export default function TeacherApplication() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<TeacherApplicationFormData>({
    resolver: zodResolver(teacherApplicationSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: TeacherApplicationFormData) {
    try {
      // Build insert object with all required fields (no extra property like privacy_accepted twice)
      const insertObject = {
        full_name: values.full_name,
        email: values.email,
        whatsapp: values.whatsapp,
        academic_background: values.academic_background,
        teaching_experience: values.teaching_experience,
        video_experience: values.video_experience,
        motivation: values.motivation,
        privacy_accepted: !!values.privacy_accepted,
      };

      const { error } = await supabase
        .from("teacher_applications")
        .insert(insertObject);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Candidatura enviada!", {
        description: "Recebemos sua candidatura com sucesso. Entraremos em contato por email ou WhatsApp caso você avance para a próxima etapa.",
      });
      form.reset(initialValues);
    } catch (err) {
      console.error("Erro ao enviar candidatura:", err);
      toast.error("Erro ao enviar candidatura.", {
        description: "Por favor, tente novamente mais tarde.",
      });
    }
  }

  if (submitted) {
    return (
      <div className="container max-w-xl mx-auto py-12 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-4">Candidatura Enviada!</h1>
        <p className="text-center text-muted-foreground mb-8">
          Obrigado por se candidatar a professor(a)! 
          Em caso de dúvidas, envie um email para <a className="underline text-blue-600" href="mailto:contato@unovacursos.com.br">contato@unovacursos.com.br</a>.
        </p>
        <Button onClick={() => setSubmitted(false)}>Enviar outra candidatura</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-2 text-center">Candidatura para Professor(a)</h1>
      <p className="mb-6 text-center text-muted-foreground">
        Preencha o formulário abaixo para se candidatar a uma vaga de professor(a) da Unova Cursos.
        Seus dados serão analisados cuidadosamente pela nossa equipe.
      </p>
      <Separator className="mb-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} />
          <ExperienceFields form={form} />

          <PrivacyField form={form} />

          <Button type="submit" className="w-full mt-4">
            Enviar Candidatura
          </Button>
        </form>
      </Form>
    </div>
  );
}
