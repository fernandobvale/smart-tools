import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { BudgetHeader } from "@/components/budget/BudgetHeader";
import { CategoryCard } from "@/components/budget/CategoryCard";

export default function BudgetPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState("01/24");
  const [viewType, setViewType] = useState<"monthly" | "annual">("monthly");

  const handleViewTypeChange = (value: "monthly" | "annual") => {
    setViewType(value);
    if (value === "annual") {
      setSelectedPeriod("2024");
    } else {
      setSelectedPeriod("01/24");
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                period={selectedPeriod}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}