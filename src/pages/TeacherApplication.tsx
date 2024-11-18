import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PersonalInfoFields } from "@/components/teacher-application/PersonalInfoFields";
import { ExperienceFields } from "@/components/teacher-application/ExperienceFields";
import { PrivacyField } from "@/components/teacher-application/PrivacyField";
import { TeacherApplicationFormData, teacherApplicationSchema } from "@/components/teacher-application/types";

export default function TeacherApplication() {
  const form = useForm<TeacherApplicationFormData>({
    resolver: zodResolver(teacherApplicationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      whatsapp: "",
      academic_background: "",
      teaching_experience: "",
      video_experience: "",
      motivation: "",
      privacy_accepted: false,
    },
  });

  const onSubmit = async (values: TeacherApplicationFormData) => {
    try {
      // Save to Supabase
      const { error } = await supabase.from("teacher_applications").insert([values]);

      if (error) throw error;

      // Send email notification via Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-teacher-application-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: values.full_name,
            email: values.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email notification");
      }

      toast({
        title: "Inscrição enviada com sucesso!",
        description: "Agradecemos seu interesse. Você receberá um email de confirmação em breve.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Erro ao enviar inscrição",
        description: "Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/unova-logo.png"
            alt="Unova Cursos"
            className="h-16 mb-6"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Formulário de Inscrição para Professor
          </h1>
          <p className="text-gray-400 text-center max-w-2xl">
            Por favor, preencha todas as informações abaixo para se candidatar a professor parceiro da Unova Cursos.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-[#2A2F3C] p-6 rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoFields form={form} />
              <ExperienceFields form={form} />
              <PrivacyField form={form} />

              <Button
                type="submit"
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                disabled={!form.formState.isValid}
              >
                Enviar Inscrição
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}