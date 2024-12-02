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

      const startDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(2000 + parseInt(year), parseInt(month), 0);

      const { data: categoryData } = await supabase
        .from("budget_categories")
        .select("id")
        .eq("name", category)
        .single();

      if (!categoryData) {
        return { entries: [], total: 0, categoryId: null };
      }

      const { data: expenses } = await supabase
        .from("budget_expenses")
        .select("id, name")
        .eq("category_id", categoryData.id);

      if (!expenses || expenses.length === 0) {
        return { entries: [], total: 0, categoryId: categoryData.id };
      }

      const expenseIds = expenses.map((expense) => expense.id);

      const { data: entriesData } = await supabase
        .from("budget_entries")
        .select("*, expense:budget_expenses(name)")
        .in("expense_id", expenseIds)
        .gte("date", startDate.toISOString().split('T')[0])
        .lte("date", endDate.toISOString().split('T')[0]);

      const total = entriesData?.reduce((sum, entry) => {
        return sum + Number(entry.amount);
      }, 0) || 0;

      return {
        entries: entriesData || [],
        total,
        categoryId: categoryData.id
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
          onEdit={() => {}}
          onDelete={setEntryToDelete}
          categoryId={data?.categoryId || ""}
          onUpdate={refetch}
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