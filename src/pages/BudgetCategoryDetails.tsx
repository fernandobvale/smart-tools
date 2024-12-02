import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function BudgetCategoryDetails() {
  const navigate = useNavigate();
  const { category, month, year } = useParams();
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  
  console.log("Parâmetros recebidos:", { category, month, year });

  const { data, isLoading, error, refetch } = useQuery({
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
        .eq("name", category)
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

      return {
        entries: entriesData || [],
        total,
      };
    },
    enabled: !!category && !!month && !!year,
  });

  const handleDelete = async () => {
    if (!entryToDelete) return;

    try {
      const { error } = await supabase
        .from("budget_entries")
        .delete()
        .eq("id", entryToDelete);

      if (error) throw error;

      toast.success("Lançamento excluído com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
      toast.error("Erro ao excluir lançamento");
    } finally {
      setEntryToDelete(null);
    }
  };

  const handleEdit = (entryId: string) => {
    // Por enquanto apenas mostra um toast, implementaremos a edição depois
    toast.info("Funcionalidade de edição em desenvolvimento");
  };

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
              <TableHead className="w-[100px]">Ações</TableHead>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(entry.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEntryToDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}