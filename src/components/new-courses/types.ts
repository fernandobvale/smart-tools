import { z } from "zod";

export interface NewCourse {
  id: string;
  curso: string;
  status: "Novo" | "Atualizar" | "Atualizando" | "Concluido";
  professor: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export const newCourseFormSchema = z.object({
  curso: z.string().min(1, "Nome do curso é obrigatório"),
  status: z.enum(["Novo", "Atualizar", "Atualizando", "Concluido"], {
    required_error: "Status é obrigatório",
  }),
  professor: z.string().min(1, "Nome do professor é obrigatório"),
});

export type NewCourseFormValues = z.infer<typeof newCourseFormSchema>;
