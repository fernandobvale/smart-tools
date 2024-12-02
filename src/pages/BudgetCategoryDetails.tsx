import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default function BudgetCategoryDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const category = params.category;
  const month = params.period?.split('/')[0];
  const year = params.period?.split('/')[1];

  const { data, isLoading } = useQuery({
    queryKey: ["budget-details", category, month, year],
    queryFn: async () => {
      if (!category || !month || !year) {
        throw new Error("Missing required parameters");
      }

      console.log("Fetching data for:", { category, month, year });
      
      // Convert strings to numbers using parseInt with radix 10
      const startDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const endDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10), 0); // Last day of the month
      
      console.log("Date range:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const { data: categoryData } = await supabase
        .from("budget_categories")
        .select("id")
        .eq("name", category)
        .single();

      console.log("Category data:", categoryData);

      if (!categoryData) return { entries: [], total: 0 };

      const { data: expenses } = await supabase
        .from("budget_expenses")
        .select("id, name")
        .eq("category_id", categoryData.id);

      console.log("Expenses:", expenses);

      if (!expenses || expenses.length === 0) return { entries: [], total: 0 };

      const expenseIds = expenses.map((expense) => expense.id);

      const { data: entriesData } = await supabase
        .from("budget_entries")
        .select("*, expense:budget_expenses(name)")
        .in("expense_id", expenseIds)
        .gte("date", startDate.toISOString().split('T')[0])
        .lt("date", endDate.toISOString().split('T')[0]);

      console.log("Entries data:", entriesData);

      const total = entriesData?.reduce((sum, entry) => {
        return sum + Number(entry.amount);
      }, 0) || 0;

      return {
        entries: entriesData || [],
        total,
        expenses,
      };
    },
    enabled: !!category && !!month && !!year, // Only run query when all parameters are available
  });

  if (!category || !month || !year) {
    return (
      <div className="container mx-auto p-6">
        <p>Parâmetros inválidos</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold mb-2">
          Detalhes de {category} - {month}/{year}
        </h1>
        <p className="text-muted-foreground mb-4">
          Total: {formatCurrency(data?.total || 0)}
        </p>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : data?.entries.length === 0 ? (
        <p>Nenhum lançamento encontrado para este período.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Despesa</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{entry.expense.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(entry.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}