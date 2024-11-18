import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TeacherApplicationForm } from "@/components/teacher-application/TeacherApplicationForm";
import type { TeacherApplicationForm as TeacherApplicationFormType } from "@/types/teacher-application";

export default function TeacherApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: TeacherApplicationFormType) => {
    try {
      setIsSubmitting(true);

      // Save to Supabase
      const { error: dbError } = await supabase
        .from("teacher_applications")
        .insert(values);

      if (dbError) throw dbError;

      // Send email notification
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-teacher-application-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            applicantName: values.full_name,
            applicantEmail: values.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email notification");
      }

      toast.success("Inscrição enviada com sucesso!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Erro ao enviar inscrição. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
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

        <div className="max-w-2xl mx-auto bg-[#222632] p-6 rounded-lg shadow-lg">
          <TeacherApplicationForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}