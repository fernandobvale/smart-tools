import { z } from "zod";

export const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  expenseId: z.string().optional(),
  newExpenseName: z.string().optional(),
  date: z.string().min(1, "Data é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export type BudgetFormMode = "create" | "edit";