import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wallet, Receipt, Users, Computer, Calculator, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BudgetCategory {
  id: string;
  name: string;
  total?: number;
}

const BudgetPlanning = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["budget-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_categories")
        .select("*");
      
      if (error) throw error;
      return data as BudgetCategory[];
    }
  });

  const getIconForCategory = (categoryName: string) => {
    switch (categoryName) {
      case "FATURAMENTO":
        return <Building2 className="w-8 h-8 text-[#9b87f5]" />;
      case "DV8":
        return <Wallet className="w-8 h-8 text-[#7E69AB]" />;
      case "OPEX":
        return <Receipt className="w-8 h-8 text-[#6E59A5]" />;
      case "PESSOAS":
        return <Users className="w-8 h-8 text-[#9b87f5]" />;
      case "CAPEX":
        return <Computer className="w-8 h-8 text-[#7E69AB]" />;
      case "IMPOSTOS":
        return <Calculator className="w-8 h-8 text-[#6E59A5]" />;
      case "ANÚNCIOS":
        return <Target className="w-8 h-8 text-[#9b87f5]" />;
      default:
        return <Receipt className="w-8 h-8 text-[#7E69AB]" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Plano Orçamentário</h1>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
          Novo Lançamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <Card 
            key={category.id}
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-[#9b87f5]/30"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
              {getIconForCategory(category.name)}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#6E59A5]">
                {formatCurrency(category.total || 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total acumulado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BudgetPlanning;