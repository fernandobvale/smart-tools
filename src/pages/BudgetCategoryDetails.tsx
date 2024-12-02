import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { BudgetDetailsHeader } from "@/components/budget/BudgetDetailsHeader";
import { BudgetEntriesTable } from "@/components/budget/BudgetEntriesTable";

export default function BudgetCategoryDetails() {
  const navigate = useNavigate();
  const { category, month, year } = useParams();
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

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
    toast.info("Funcionalidade de edição em desenvolvimento");
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Erro ao carregar os dados: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <BudgetDetailsHeader
        category={category || ""}
        month={month || ""}
        year={year || ""}
        total={data?.total || 0}
        onBack={() => navigate(-1)}
      />

      {isLoading ? (
        <p>Carregando...</p>
      ) : data?.entries.length === 0 ? (
        <p>Nenhum lançamento encontrado para este período.</p>
      ) : (
        <BudgetEntriesTable
          entries={data?.entries || []}
          onEdit={handleEdit}
          onDelete={setEntryToDelete}
        />
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
