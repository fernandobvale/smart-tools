import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface CategoryCardProps {
  category: string;
  period: string;
}

export function CategoryCard({ category, period }: CategoryCardProps) {
  const navigate = useNavigate();
  
  const { data: entries, isLoading } = useQuery({
    queryKey: ["budget-entries", category, period],
    queryFn: async () => {
      console.log(`Iniciando busca para ${category} no período ${period}`);
      
      const [month, year] = period.split("/");
      const fullYear = year.length === 2 ? '20' + year : year;
      const paddedMonth = month.padStart(2, '0');
      
      // Criar data inicial (primeiro dia do mês)
      const startDate = new Date(Number(fullYear), Number(month) - 1, 1);
      // Criar data final (último dia do mesmo mês)
      const endDate = new Date(Number(fullYear), Number(month), 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      console.log('Período de busca:', {
        startDate: startDateStr,
        endDate: endDateStr,
      });

      // Buscar categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("name", category)
        .single();

      console.log("Dados da categoria:", categoryData);
      
      if (categoryError || !categoryData) {
        console.error(`Categoria ${category} não encontrada:`, categoryError);
        return { entries: [], total: 0 };
      }

      // Se for DV8, primeiro buscar o faturamento
      if (category === "DV8") {
        const { data: faturamentoCategory } = await supabase
          .from("budget_categories")
          .select("*")
          .eq("name", "FATURAMENTO")
          .single();

        if (faturamentoCategory) {
          const { data: faturamentoExpenses } = await supabase
            .from("budget_expenses")
            .select("id")
            .eq("category_id", faturamentoCategory.id);

          if (faturamentoExpenses && faturamentoExpenses.length > 0) {
            const faturamentoExpenseIds = faturamentoExpenses.map(exp => exp.id);
            
            const { data: faturamentoEntries } = await supabase
              .from("budget_entries")
              .select("*")
              .in("expense_id", faturamentoExpenseIds)
              .gte("date", startDateStr)
              .lte("date", endDateStr);

            if (faturamentoEntries && faturamentoEntries.length > 0) {
              const faturamentoTotal = faturamentoEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);
              const dv8Value = faturamentoTotal * 0.1; // 10% do faturamento

              // Buscar ou criar a despesa DV8
              const { data: dv8Expense } = await supabase
                .from("budget_expenses")
                .select("*")
                .eq("category_id", categoryData.id)
                .eq("name", "DV8 Automático")
                .single();

              let dv8ExpenseId;
              if (!dv8Expense) {
                const { data: newDv8Expense } = await supabase
                  .from("budget_expenses")
                  .insert({ category_id: categoryData.id, name: "DV8 Automático" })
                  .select()
                  .single();
                
                if (newDv8Expense) {
                  dv8ExpenseId = newDv8Expense.id;
                }
              } else {
                dv8ExpenseId = dv8Expense.id;
              }

              if (dv8ExpenseId) {
                // Inserir ou atualizar o lançamento do DV8
                const { data: existingDv8Entry } = await supabase
                  .from("budget_entries")
                  .select("*")
                  .eq("expense_id", dv8ExpenseId)
                  .gte("date", startDateStr)
                  .lte("date", endDateStr)
                  .single();

                if (existingDv8Entry) {
                  await supabase
                    .from("budget_entries")
                    .update({ amount: dv8Value })
                    .eq("id", existingDv8Entry.id);
                } else {
                  await supabase
                    .from("budget_entries")
                    .insert({
                      expense_id: dv8ExpenseId,
                      date: startDateStr,
                      amount: dv8Value
                    });
                }

                return {
                  entries: [{ id: "dv8-auto", amount: dv8Value, date: startDateStr }],
                  total: dv8Value
                };
              }
            }
          }
        }
      }

      // Buscar despesas da categoria
      const { data: expenses, error: expensesError } = await supabase
        .from("budget_expenses")
        .select("*")
        .eq("category_id", categoryData.id);

      console.log(`Despesas encontradas para ${category}:`, expenses);
      
      if (expensesError || !expenses || expenses.length === 0) {
        console.error(`Nenhuma despesa encontrada para ${category}:`, expensesError);
        return { entries: [], total: 0 };
      }

      const expenseIds = expenses.map(expense => expense.id);
      console.log(`IDs das despesas para ${category}:`, expenseIds);

      // Buscar lançamentos
      const { data: entriesData, error: entriesError } = await supabase
        .from("budget_entries")
        .select("*")
        .in("expense_id", expenseIds)
        .gte("date", startDateStr)
        .lte("date", endDateStr);

      console.log(`Query de lançamentos para ${category}:`, {
        expenseIds,
        startDate: startDateStr,
        endDate: endDateStr,
        results: entriesData
      });

      if (entriesError) {
        console.error(`Erro ao buscar lançamentos para ${category}:`, entriesError);
        return { entries: [], total: 0 };
      }

      const total = entriesData?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;
      console.log(`Total calculado para ${category}:`, total);

      return {
        entries: entriesData || [],
        total,
      };
    },
  });

  const categoryColors = {
    FATURAMENTO: "border-green-400",
    OPEX: "border-blue-400",
    PESSOAS: "border-green-400",
    CAPEX: "border-purple-400",
    IMPOSTOS: "border-red-400",
    ANÚNCIOS: "border-yellow-400",
    DV8: "border-indigo-400",
  };

  const handleClick = () => {
    if (category === "DV8") return;
    const [month, year] = period.split("/");
    const formattedMonth = month?.padStart(2, '0') || "01";
    navigate(`/budget-planning/${category}/${formattedMonth}/${year}`);
  };

  return (
    <Card 
      className={`border-l-4 ${categoryColors[category as keyof typeof categoryColors]} ${category !== "DV8" ? "cursor-pointer hover:bg-accent/50" : ""} transition-colors`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : entries?.entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há lançamentos para este mês
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-2xl font-bold">
              {formatCurrency(entries?.total || 0)}
            </p>
            {entries?.entries.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {entries.entries.length} lançamento{entries.entries.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}