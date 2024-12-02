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
      console.log("Fetching data for category:", category, "period:", period);
      
      const [month, year] = period.split("/");
      const startDate = new Date(`20${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);

      // Primeiro, buscar o ID da categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from("budget_categories")
        .select("id")
        .eq("name", category)
        .single();

      console.log("Category data:", categoryData, "Error:", categoryError);

      if (categoryError || !categoryData) {
        console.error("Error fetching category:", categoryError);
        return { entries: [], total: 0 };
      }

      // Depois, buscar as despesas dessa categoria
      const { data: expenses, error: expensesError } = await supabase
        .from("budget_expenses")
        .select("id")
        .eq("category_id", categoryData.id);

      console.log("Expenses data:", expenses, "Error:", expensesError);

      if (expensesError || !expenses || expenses.length === 0) {
        console.error("Error fetching expenses:", expensesError);
        return { entries: [], total: 0 };
      }

      const expenseIds = expenses.map((expense) => expense.id);

      // Finalmente, buscar os lançamentos do período
      const { data: entriesData, error: entriesError } = await supabase
        .from("budget_entries")
        .select("*")
        .in("expense_id", expenseIds)
        .gte("date", startDate.toISOString())
        .lt("date", endDate.toISOString());

      console.log("Entries data:", entriesData, "Error:", entriesError);

      if (entriesError) {
        console.error("Error fetching entries:", entriesError);
        return { entries: [], total: 0 };
      }

      const total = entriesData?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;

      return {
        entries: entriesData || [],
        total: total,
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