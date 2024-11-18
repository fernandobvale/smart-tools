import { z } from "zod";

export const teacherApplicationSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z
    .string()
    .min(11, "WhatsApp inválido")
    .max(11, "WhatsApp inválido")
    .regex(/^\d+$/, "Apenas números são permitidos"),
  academic_background: z.string().min(10, "Por favor, forneça mais detalhes sobre sua formação"),
  teaching_experience: z.string().min(10, "Por favor, forneça mais detalhes sobre sua experiência"),
  video_experience: z.string().min(1, "Selecione uma opção"),
  motivation: z.string().min(10, "Por favor, forneça mais detalhes sobre sua motivação"),
  privacy_accepted: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar a política de privacidade",
  }),
});

export type TeacherApplicationFormData = z.infer<typeof teacherApplicationSchema>;