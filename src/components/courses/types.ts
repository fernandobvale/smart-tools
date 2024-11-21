import { z } from "zod";

export const courseFormSchema = z.object({
  nome_curso: z.string().min(1, "Nome do curso é obrigatório"),
  numero_aulas: z.coerce.number().min(1, "Número de aulas é obrigatório"),
  data_entrega: z.string().min(1, "Data de entrega é obrigatória"),
  valor: z.coerce.number().min(0, "Valor é obrigatório"),
  data_pagamento: z.string().optional(),
  status_pagamento: z.string().min(1, "Status de pagamento é obrigatório"),
  nome_editor: z.string().min(1, "Nome do editor é obrigatório"),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;