
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PersonalInfoFields } from "@/components/teacher-application/PersonalInfoFields";
import { ExperienceFields } from "@/components/teacher-application/ExperienceFields";
import { PrivacyField } from "@/components/teacher-application/PrivacyField";
import { TeacherApplicationFormData, teacherApplicationSchema } from "@/components/teacher-application/types";
import { useState } from "react";

export default function TeacherApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting form data:", values);
      
      // First save to database
      const { data, error: dbError } = await supabase
        .from("teacher_applications")
        .insert([{
          full_name: values.full_name,
          email: values.email,
          whatsapp: values.whatsapp.replace(/\D/g, ""), // Ensure only numbers
          academic_background: values.academic_background,
          teaching_experience: values.teaching_experience,
          video_experience: values.video_experience,
          motivation: values.motivation,
          privacy_accepted: values.privacy_accepted
        }])
        .select();

      if (dbError) {
        console.error("Database error:", dbError);
        // Check if the error is due to duplicate email
        if (dbError.code === '23505' && dbError.message.includes('teacher_applications_email_key')) {
          toast.error("Este email já está cadastrado em nossa base de dados. Se você não recebeu uma confirmação, por favor entre em contato conosco.");
          setIsSubmitting(false);
          return;
        }
        throw dbError;
      }

      console.log("Teacher application saved to database successfully:", data);

      // Try to send email notification, but don't block the submission if it fails
      try {
        const { error: functionError } = await supabase.functions.invoke('send-teacher-application-email', {
          body: {
            name: values.full_name,
            email: values.email,
          },
        });

        if (functionError) {
          console.error("Email notification failed:", functionError);
          // Show a success message but mention that email might be delayed
          toast.success(
            "Inscrição enviada com sucesso! Você receberá um email de confirmação em breve (pode haver um pequeno atraso)."
          );
        } else {
          toast.success("Inscrição enviada com sucesso! Você receberá um email de confirmação em breve.");
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Still show success but mention the email delay
        toast.success(
          "Inscrição enviada com sucesso! Você receberá um email de confirmação em breve (pode haver um pequeno atraso)."
        );
      }

      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
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
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
