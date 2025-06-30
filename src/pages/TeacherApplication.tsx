
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
      console.log("=== TEACHER APPLICATION SUBMISSION START ===");
      console.log("Form data:", values);
      
      // Prepare clean data for insertion
      const applicationData = {
        full_name: values.full_name.trim(),
        email: values.email.trim().toLowerCase(),
        whatsapp: values.whatsapp.replace(/\D/g, ""), // Remove non-digits
        academic_background: values.academic_background.trim(),
        teaching_experience: values.teaching_experience.trim(),
        video_experience: values.video_experience,
        motivation: values.motivation.trim(),
        privacy_accepted: values.privacy_accepted
      };

      console.log("Clean application data:", applicationData);
      console.log("Attempting to insert into teacher_applications table...");
      
      const { data, error: dbError } = await supabase
        .from("teacher_applications")
        .insert([applicationData])
        .select();

      if (dbError) {
        console.error("=== DATABASE ERROR ===");
        console.error("Error code:", dbError.code);
        console.error("Error message:", dbError.message);
        console.error("Error details:", dbError.details);
        console.error("Error hint:", dbError.hint);
        
        // Check for specific error types
        if (dbError.code === '23505') {
          if (dbError.message.includes('teacher_applications_email_key')) {
            toast.error("Este email já está cadastrado em nossa base de dados. Se você não recebeu uma confirmação, por favor entre em contato conosco.");
            return;
          }
        }
        
        // Generic error handling
        toast.error("Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente.");
        throw dbError;
      }

      console.log("=== DATABASE SUCCESS ===");
      console.log("Teacher application saved successfully:", data);

      // Try to send email notification
      try {
        console.log("Attempting to send email notification...");
        const { error: functionError } = await supabase.functions.invoke('send-teacher-application-email', {
          body: {
            name: values.full_name,
            email: values.email,
          },
        });

        if (functionError) {
          console.error("Email notification error:", functionError);
          toast.success(
            "Inscrição enviada com sucesso! Você receberá um email de confirmação em breve (pode haver um pequeno atraso)."
          );
        } else {
          console.log("Email sent successfully");
          toast.success("Inscrição enviada com sucesso! Você receberá um email de confirmação em breve.");
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        toast.success(
          "Inscrição enviada com sucesso! Você receberá um email de confirmação em breve (pode haver um pequeno atraso)."
        );
      }

      console.log("=== FORM RESET ===");
      form.reset();
      console.log("=== TEACHER APPLICATION SUBMISSION END ===");
    } catch (error) {
      console.error("=== GENERAL ERROR ===");
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
