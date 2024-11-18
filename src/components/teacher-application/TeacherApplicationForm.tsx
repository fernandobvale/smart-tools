import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "./form-fields/PersonalInfoFields";
import { ExperienceFields } from "./form-fields/ExperienceFields";
import { PrivacyField } from "./form-fields/PrivacyField";
import type { TeacherApplicationFormProps, TeacherApplicationForm as FormValues } from "@/types/teacher-application";

const formSchema = z.object({
  full_name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z
    .string()
    .min(1, "WhatsApp é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido"),
  academic_background: z.string().min(1, "Formação acadêmica é obrigatória"),
  teaching_experience: z.string().min(1, "Experiência como professor é obrigatória"),
  video_experience: z.string().min(1, "Selecione uma opção"),
  motivation: z.string().min(1, "Motivação é obrigatória"),
  privacy_accepted: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar a política de privacidade",
  }),
});

export const TeacherApplicationForm = ({ onSubmit, isSubmitting }: TeacherApplicationFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privacy_accepted: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <ExperienceFields form={form} />
        <PrivacyField form={form} />

        <Button
          type="submit"
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
        </Button>
      </form>
    </Form>
  );
};