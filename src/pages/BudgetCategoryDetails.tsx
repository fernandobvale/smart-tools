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
  const { category, period } = useParams();
  
  console.log("Parâmetros recebidos:", { category, period });

  // Extrair mês e ano do parâmetro period
  const [month, year] = (period || "").split("/");

  const { data, isLoading, error } = useQuery({
    queryKey: ["budget-details", category, month, year],
    queryFn: async () => {
      if (!category || !month || !year) {
        throw new Error("Parâmetros obrigatórios ausentes");
      }

      // Criar datas para o início e fim do mês
      const startDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(2000 + parseInt(year), parseInt(month), 0);

      console.log("Buscando dados para:", {
        category,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Primeiro, buscar a categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from("budget_categories")
        .select("id")
        .eq("name", category.toUpperCase())
        .single();

      if (categoryError) {
        console.error("Erro ao buscar categoria:", categoryError);
        throw categoryError;
      }

      console.log("Dados da categoria:", categoryData);

      if (!categoryData) {
        console.error("Categoria não encontrada");
        return { entries: [], total: 0 };
      }

      // Depois, buscar as despesas da categoria
      const { data: expenses, error: expensesError } = await supabase
        .from("budget_expenses")
        .select("id, name")
        .eq("category_id", categoryData.id);

      if (expensesError) {
        console.error("Erro ao buscar despesas:", expensesError);
        throw expensesError;
      }

      console.log("Despesas encontradas:", expenses);

      if (!expenses || expenses.length === 0) {
        console.log("Nenhuma despesa encontrada para a categoria");
        return { entries: [], total: 0 };
      }

      const expenseIds = expenses.map((expense) => expense.id);

      // Por fim, buscar os lançamentos
      const { data: entriesData, error: entriesError } = await supabase
        .from("budget_entries")
        .select("*, expense:budget_expenses(name)")
        .in("expense_id", expenseIds)
        .gte("date", startDate.toISOString().split('T')[0])
        .lte("date", endDate.toISOString().split('T')[0]);

      if (entriesError) {
        console.error("Erro ao buscar lançamentos:", entriesError);
        throw entriesError;
      }

      console.log("Lançamentos encontrados:", entriesData);

      const total = entriesData?.reduce((sum, entry) => {
        return sum + Number(entry.amount);
      }, 0) || 0;

      console.log("Total calculado:", total);

      return {
        entries: entriesData || [],
        total,
      };
    },
    enabled: !!category && !!period,
  });

  if (error) {
    console.error("Erro na query:", error);
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Erro ao carregar os dados: {error.message}</p>
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
          Detalhes de {category} - {period}
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