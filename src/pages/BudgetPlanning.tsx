import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2 } from "lucide-react";
import { BudgetHeader } from "@/components/budget/BudgetHeader";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { CategoryCard } from "@/components/budget/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function BudgetPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState("12/23");
  const [viewType, setViewType] = useState<"monthly" | "annual">("monthly");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: faturamentoTotal = 0 } = useQuery({
    queryKey: ["faturamento-total", selectedPeriod],
    queryFn: async () => {
      const [month, year] = selectedPeriod.split("/");
      const startDate = new Date(
        month ? `20${year}-${month}-01` : `${year}-01-01`
      );
      const endDate = new Date(startDate);
      
      if (month) {
        endDate.setMonth(startDate.getMonth() + 1);
      } else {
        endDate.setFullYear(startDate.getFullYear() + 1);
      }
      endDate.setDate(endDate.getDate() - 1);

      const { data: categoryData } = await supabase
        .from("budget_categories")
        .select("id")
        .eq("name", "FATURAMENTO")
        .single();

      if (!categoryData) return 0;

      const { data: expenses } = await supabase
        .from("budget_expenses")
        .select("id")
        .eq("category_id", categoryData.id);

      if (!expenses || expenses.length === 0) return 0;

      const expenseIds = expenses.map((expense) => expense.id);

      const { data: entriesData } = await supabase
        .from("budget_entries")
        .select("amount")
        .in("expense_id", expenseIds)
        .gte("date", startDate.toISOString())
        .lt("date", endDate.toISOString());

      const total = entriesData?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;
      return total;
    },
  });

  const handleViewTypeChange = (value: "monthly" | "annual") => {
    setViewType(value);
    if (value === "annual") {
      setSelectedPeriod("2024");
    } else {
      setSelectedPeriod("12/23");
    }
  };

  const categories = ["FATURAMENTO", "OPEX", "PESSOAS", "CAPEX", "IMPOSTOS", "ANÚNCIOS", "DV8"];

  return (
    <div className="container mx-auto p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">Plano Orçamentário</h1>
            <BarChart2 className="h-8 w-8 text-[#9b87f5]" />
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Forecast {viewType === "annual" ? "Anual" : "Mensal"}
          </p>
          <div className="flex items-center justify-between">
            <BudgetHeader
              viewType={viewType}
              selectedPeriod={selectedPeriod}
              onViewTypeChange={handleViewTypeChange}
              onPeriodChange={setSelectedPeriod}
            />
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                period={selectedPeriod}
                faturamentoTotal={category === "DV8" ? faturamentoTotal : undefined}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <BudgetForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}