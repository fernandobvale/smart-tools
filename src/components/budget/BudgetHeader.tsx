import { BarChart2 } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetHeaderProps {
  viewType: "monthly" | "annual";
  selectedPeriod: string;
  onViewTypeChange: (value: "monthly" | "annual") => void;
  onPeriodChange: (value: string) => void;
}

export function BudgetHeader({
  viewType,
  selectedPeriod,
  onViewTypeChange,
  onPeriodChange,
}: BudgetHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BarChart2 className="h-8 w-8 text-[#9b87f5]" />
        <div>
          <CardTitle className="text-2xl font-bold">Plano Orçamentário</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Forecast {viewType === "annual" ? "Anual" : "Mensal"} - 2024
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <Select
          value={viewType}
          onValueChange={(value: "monthly" | "annual") => onViewTypeChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione a visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Visualização Mensal</SelectItem>
            <SelectItem value="annual">Visualização Anual</SelectItem>
          </SelectContent>
        </Select>

        {viewType === "monthly" && (
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12/23">Dezembro/2023</SelectItem>
              <SelectItem value="01/24">Janeiro/2024</SelectItem>
              <SelectItem value="02/24">Fevereiro/2024</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}