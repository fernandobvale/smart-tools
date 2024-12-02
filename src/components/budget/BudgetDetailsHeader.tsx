import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface BudgetDetailsHeaderProps {
  category: string;
  month: string;
  year: string;
  total: number;
  onBack: () => void;
}

export function BudgetDetailsHeader({ category, month, year, total, onBack }: BudgetDetailsHeaderProps) {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <h1 className="text-2xl font-bold mb-2">
        Detalhes de {category} - {month}/{year}
      </h1>
      <p className="text-muted-foreground mb-4">
        Total: {formatCurrency(total)}
      </p>
    </div>
  );
}