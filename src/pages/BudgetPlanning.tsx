import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BudgetHeader } from "@/components/budget/BudgetHeader";
import { BudgetTable } from "@/components/budget/BudgetTable";
import { BudgetForm } from "@/components/budget/BudgetForm";

export default function BudgetPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState("12/23");
  const [viewType, setViewType] = useState<"monthly" | "annual">("monthly");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const forecastData = {
    "12/23": {
      faturamento: "R$ 212.643,31",
      impostoPerc: "8,35%",
      impostoRs: "R$ 17.748,90",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 37.550,30",
      opexPerc: "8,71%",
      opexRs: "R$ 18.520,98",
      capexPerc: "26,49%",
      capexRs: "R$ 56.334,96",
      investPerc: "26,12%",
      investRs: "R$ 55.542,46",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 21.264,33",
      lucroPerc: "11,02%",
      lucroRs: "R$ 23.430,28",
    },
    "01/24": {
      faturamento: "R$ 220.000,00",
      impostoPerc: "8,35%",
      impostoRs: "R$ 18.370,00",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 38.852,00",
      opexPerc: "8,71%",
      opexRs: "R$ 19.162,00",
      capexPerc: "26,49%",
      capexRs: "R$ 58.278,00",
      investPerc: "26,12%",
      investRs: "R$ 57.464,00",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 22.000,00",
      lucroPerc: "11,02%",
      lucroRs: "R$ 24.244,00",
    },
    "02/24": {
      faturamento: "R$ 225.000,00",
      impostoPerc: "8,35%",
      impostoRs: "R$ 18.787,50",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 39.735,00",
      opexPerc: "8,71%",
      opexRs: "R$ 19.597,50",
      capexPerc: "26,49%",
      capexRs: "R$ 59.602,50",
      investPerc: "26,12%",
      investRs: "R$ 58.770,00",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 22.500,00",
      lucroPerc: "11,02%",
      lucroRs: "R$ 24.795,00",
    },
    "2024": {
      faturamento: "R$ 2.640.000,00",
      impostoPerc: "8,35%",
      impostoRs: "R$ 220.440,00",
      pessoasPerc: "17,66%",
      pessoasRs: "R$ 466.224,00",
      opexPerc: "8,71%",
      opexRs: "R$ 229.944,00",
      capexPerc: "26,49%",
      capexRs: "R$ 699.336,00",
      investPerc: "26,12%",
      investRs: "R$ 689.568,00",
      dv8Perc: "10,00%",
      dv8Rs: "R$ 264.000,00",
      lucroPerc: "11,02%",
      lucroRs: "R$ 290.928,00",
    },
  };

  const currentData = forecastData[selectedPeriod];

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
          <div className="rounded-lg border bg-card">
            <BudgetTable data={currentData} />
          </div>
        </CardContent>
      </Card>
      <BudgetForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
