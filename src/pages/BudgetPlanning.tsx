import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2 } from "lucide-react";
import { BudgetHeader } from "@/components/budget/BudgetHeader";
import { BudgetForm } from "@/components/budget/BudgetForm";

export default function BudgetPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState("12/23");
  const [viewType, setViewType] = useState<"monthly" | "annual">("monthly");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleViewTypeChange = (value: "monthly" | "annual") => {
    setViewType(value);
    if (value === "annual") {
      setSelectedPeriod("2024");
    } else {
      setSelectedPeriod("12/23");
    }
  };

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
          {/* Content will be replaced with new implementation */}
        </CardContent>
      </Card>
      <BudgetForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}