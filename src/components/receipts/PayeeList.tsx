import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PayeeForm from "./PayeeForm";
import { useState } from "react";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPayees = payees?.filter((payee) =>
    payee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payee.cpf.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {!filteredPayees?.length ? (
        <div className="text-center p-4 sm:p-8">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Nenhum beneficiário encontrado com os termos da busca."
              : "Nenhum beneficiário cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredPayees.map((payee) => (
            <div
              key={payee.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent transition-colors gap-3 sm:gap-4"
            >
              <div>
                <h3 className="font-medium text-sm sm:text-base">{payee.full_name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">CPF: {payee.cpf}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Banco: {payee.bank_name}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Beneficiário</DialogTitle>
                    </DialogHeader>
                    <PayeeForm 
                      payee={payee} 
                      mode="edit" 
                      onClose={() => setEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o beneficiário {payee.full_name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(payee.id)}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  onClick={() => navigate(`/receipts/new/${payee.id}`)}
                  variant="outline"
                  className="text-xs sm:text-sm h-8"
                >
                  Gerar Recibo
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayeeList;