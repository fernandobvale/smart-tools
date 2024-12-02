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
      // Criar data inicial do mês (dia 1)
      const startDate = new Date(`20${year}-${month}-01`);
      // Criar data final do mês (último dia)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      console.log('Período de busca:', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      // Buscar categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("name", category)
        .single();

      console.log("Dados da categoria:", categoryData);
      console.log("Erro ao buscar categoria:", categoryError);

      if (categoryError || !categoryData) {
        console.error(`Categoria ${category} não encontrada`);
        return { entries: [], total: 0 };
      }

      // Buscar despesas da categoria
      const { data: expenses, error: expensesError } = await supabase
        .from("budget_expenses")
        .select("*")
        .eq("category_id", categoryData.id);

      console.log(`Despesas encontradas para ${category}:`, expenses);
      console.log("Erro ao buscar despesas:", expensesError);

      if (expensesError || !expenses || expenses.length === 0) {
        console.error(`Nenhuma despesa encontrada para ${category}`);
        return { entries: [], total: 0 };
      }

      const expenseIds = expenses.map(expense => expense.id);

      // Buscar lançamentos
      const { data: entriesData, error: entriesError } = await supabase
        .from("budget_entries")
        .select("*")
        .in("expense_id", expenseIds)
        .gte("date", startDate.toISOString().split('T')[0])
        .lte("date", endDate.toISOString().split('T')[0]); // Mudado de lt para lte para incluir o último dia

      console.log(`Lançamentos encontrados para ${category}:`, entriesData);
      console.log("Erro ao buscar lançamentos:", entriesError);

      if (entriesError) {
        console.error(`Erro ao buscar lançamentos para ${category}`);
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