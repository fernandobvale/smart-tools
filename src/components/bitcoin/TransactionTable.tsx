import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, History } from "lucide-react";
import { formatCurrency, formatCurrencyUSD } from "@/lib/utils";
import { useBitcoinTransactions } from "@/hooks/useBitcoinTransactions";
import { useUsdBrlRate } from "@/hooks/useUsdBrlRate";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Badge } from "@/components/ui/badge";

export const TransactionTable = () => {
  const { transactions, isLoading, deleteTransaction } = useBitcoinTransactions();
  const { data: usdBrlData } = useUsdBrlRate();

  if (isLoading) {
    return <div>Carregando transações...</div>;
  }

  const usdBrlRate = usdBrlData?.rate ?? 1;

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhuma transação registrada ainda. Adicione sua primeira transação acima!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico de Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Quantidade (BTC)</TableHead>
              <TableHead className="text-right">Valor (R$)</TableHead>
              <TableHead className="text-right">Valor (US$)</TableHead>
              <TableHead className="text-right">Preço/BTC</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.transaction_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.transaction_type === "compra" ? "default" : "secondary"}>
                    {transaction.transaction_type === "compra" ? "Compra" : "Venda"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {Number(transaction.amount_btc).toFixed(8)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(transaction.amount_brl))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrencyUSD(Number(transaction.amount_brl) / usdBrlRate)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(transaction.price_per_btc))}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.notes || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTransaction.mutate(transaction.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
