import { useState, useEffect } from "react";
import { format, startOfMonth, subMonths, addMonths, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Plus, Trash2, Lock, CheckCircle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePostalInvoices, PostalInvoice } from "@/hooks/usePostalInvoices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  aberta: { label: "Aberta", variant: "outline" },
  fechada: { label: "Fechada", variant: "secondary" },
  paga: { label: "Paga", variant: "default" },
};

export default function PostalInvoices() {
  const { session } = useAuth();
  const { invoicesQuery, getOrCreateInvoice, addEntry, deleteEntry, updateInvoiceStatus } = usePostalInvoices();
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [currentInvoice, setCurrentInvoice] = useState<PostalInvoice | null>(null);
  const [entryDate, setEntryDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [entryAmount, setEntryAmount] = useState("");
  const [entryDescription, setEntryDescription] = useState("");

  // Load/create invoice for selected month
  useEffect(() => {
    if (session?.user?.id) {
      getOrCreateInvoice.mutate(selectedMonth, {
        onSuccess: (invoice) => setCurrentInvoice(invoice),
      });
    }
  }, [selectedMonth, session?.user?.id]);

  // Update current invoice when invoices refresh
  useEffect(() => {
    if (invoicesQuery.data && currentInvoice) {
      const updated = invoicesQuery.data.find((i) => i.id === currentInvoice.id);
      if (updated) setCurrentInvoice(updated);
    }
  }, [invoicesQuery.data]);

  // Entries for current invoice
  const entriesQuery = useQuery({
    queryKey: ["postal-entries", currentInvoice?.id],
    queryFn: async () => {
      if (!currentInvoice?.id) return [];
      const { data, error } = await supabase
        .from("postal_entries")
        .select("*")
        .eq("invoice_id", currentInvoice.id)
        .order("entry_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!currentInvoice?.id,
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice || !entryAmount) return;
    addEntry.mutate(
      {
        invoiceId: currentInvoice.id,
        entryDate,
        amount: parseFloat(entryAmount),
        description: entryDescription,
      },
      {
        onSuccess: () => {
          setEntryAmount("");
          setEntryDescription("");
        },
      }
    );
  };

  const isInvoiceLocked = currentInvoice?.status !== "aberta";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faturas dos Correios</h1>
          <p className="text-muted-foreground">Controle de postagens e faturas mensais</p>
        </div>
      </div>

      <Tabs defaultValue="lancamentos">
        <TabsList>
          <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
        </TabsList>

        <TabsContent value="lancamentos" className="space-y-4">
          {/* Month selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <p className="text-lg font-semibold capitalize">
                    {format(selectedMonth, "MMMM yyyy", { locale: ptBR })}
                  </p>
                  {currentInvoice && (
                    <Badge variant={statusConfig[currentInvoice.status]?.variant || "outline"}>
                      {statusConfig[currentInvoice.status]?.label || currentInvoice.status}
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="icon" onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Entry form */}
          {!isInvoiceLocked && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Novo Lançamento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEntry} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label htmlFor="entry-date">Data</Label>
                    <Input
                      id="entry-date"
                      type="date"
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="entry-amount">Valor (R$)</Label>
                    <Input
                      id="entry-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0,00"
                      value={entryAmount}
                      onChange={(e) => setEntryAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="entry-desc">Descrição (opcional)</Label>
                    <Input
                      id="entry-desc"
                      placeholder="Ex: Sedex, PAC..."
                      value={entryDescription}
                      onChange={(e) => setEntryDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={addEntry.isPending}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Entries table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Lançamentos do Mês</CardTitle>
              <span className="text-lg font-bold text-primary">
                Total: {formatCurrency(currentInvoice?.total_amount || 0)}
              </span>
            </CardHeader>
            <CardContent>
              {entriesQuery.data && entriesQuery.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      {!isInvoiceLocked && <TableHead className="w-12" />}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entriesQuery.data.map((entry: any) => (
                      <TableRow key={entry.id}>
                        <TableCell>{format(new Date(entry.entry_date + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{entry.description || "—"}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(entry.amount))}</TableCell>
                        {!isInvoiceLocked && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEntry.mutate({ id: entry.id, invoiceId: currentInvoice!.id })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum lançamento neste mês.</p>
              )}
            </CardContent>
          </Card>

          {/* Invoice actions */}
          {currentInvoice && (
            <div className="flex gap-3 justify-end">
              {currentInvoice.status === "aberta" && (
                <Button
                  variant="secondary"
                  onClick={() => updateInvoiceStatus.mutate({ id: currentInvoice.id, status: "fechada" })}
                >
                  <Lock className="h-4 w-4 mr-1" /> Fechar Fatura
                </Button>
              )}
              {currentInvoice.status === "fechada" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => updateInvoiceStatus.mutate({ id: currentInvoice.id, status: "aberta" })}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Reabrir
                  </Button>
                  <Button
                    onClick={() => updateInvoiceStatus.mutate({ id: currentInvoice.id, status: "paga" })}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Marcar como Paga
                  </Button>
                </>
              )}
              {currentInvoice.status === "paga" && (
                <Button
                  variant="outline"
                  onClick={() => updateInvoiceStatus.mutate({ id: currentInvoice.id, status: "fechada" })}
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Desfazer Pagamento
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="faturas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesQuery.data && invoicesQuery.data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês de Referência</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead>Fechada em</TableHead>
                      <TableHead>Paga em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoicesQuery.data.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="capitalize font-medium">
                          {format(new Date(inv.reference_month + "T12:00:00"), "MMMM yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[inv.status]?.variant || "outline"}>
                            {statusConfig[inv.status]?.label || inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(Number(inv.total_amount))}
                        </TableCell>
                        <TableCell>
                          {inv.closed_at ? format(new Date(inv.closed_at), "dd/MM/yyyy") : "—"}
                        </TableCell>
                        <TableCell>
                          {inv.paid_at ? format(new Date(inv.paid_at), "dd/MM/yyyy") : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhuma fatura encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
