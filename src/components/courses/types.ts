import { z } from "zod";

export const courseFormSchema = z.object({
  nome_curso: z.string().min(1, "Nome do curso é obrigatório"),
  numero_aulas: z.coerce.number().min(1, "Número de aulas é obrigatório"),
  data_entrega: z.string().min(1, "Data de entrega é obrigatória"),
  valor: z.coerce.number().min(0, "Valor é obrigatório"),
  data_pagamento: z.string().optional(),
  status_pagamento: z.enum(["Pendente", "Pago", "Cancelado"], {
    required_error: "Status de pagamento é obrigatório",
    invalid_type_error: "Status de pagamento inválido",
  }),
  nome_editor: z.string().min(1, "Nome do editor é obrigatório"),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;