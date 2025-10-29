import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useBitcoinTransactions } from "@/hooks/useBitcoinTransactions";
import { format } from "date-fns";

const formSchema = z.object({
  transaction_type: z.enum(["compra", "venda"]),
  amount_btc: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantidade deve ser maior que zero",
  }),
  amount_brl: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser maior que zero",
  }),
  transaction_date: z.string(),
  notes: z.string().optional(),
});

export const TransactionForm = () => {
  const { createTransaction } = useBitcoinTransactions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_type: "compra",
      amount_btc: "",
      amount_brl: "",
      transaction_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTransaction.mutate({
      transaction_type: values.transaction_type,
      amount_btc: Number(values.amount_btc),
      amount_brl: Number(values.amount_brl),
      transaction_date: new Date(values.transaction_date).toISOString(),
      notes: values.notes,
    });
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nova Transação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="compra">Compra</SelectItem>
                      <SelectItem value="venda">Venda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount_btc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade (BTC)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.00000001" placeholder="0.00000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount_brl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="transaction_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Transação</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas sobre a transação..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
              {createTransaction.isPending ? "Adicionando..." : "Adicionar Transação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
