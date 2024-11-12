import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PayeeForm from "./PayeeForm";

interface Payee {
  id: string;
  full_name: string;
  cpf: string;
  pix_key: string;
  bank_name: string;
}

const PayeeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: payees, isLoading } = useQuery({
    queryKey: ["payees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payees")
        .select("*")
        .order("full_name");

      if (error) throw error;
      return data as Payee[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("payees").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Beneficiário excluído",
        description: "O beneficiário foi excluído com sucesso.",
      });

      // Refresh the payees list
      queryClient.invalidateQueries({ queryKey: ["payees"] });
    } catch (error) {
      console.error("Error deleting payee:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o beneficiário.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!payees?.length) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">
          Nenhum beneficiário cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payees.map((payee) => (
        <div
          key={payee.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <div>
            <h3 className="font-medium">{payee.full_name}</h3>
            <p className="text-sm text-muted-foreground">CPF: {payee.cpf}</p>
            <p className="text-sm text-muted-foreground">
              Banco: {payee.bank_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Beneficiário</DialogTitle>
                </DialogHeader>
                <PayeeForm payee={payee} mode="edit" />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(payee.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate(`/receipts/new/${payee.id}`)}
              variant="outline"
            >
              Gerar Recibo
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayeeList;