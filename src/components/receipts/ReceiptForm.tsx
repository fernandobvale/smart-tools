import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { NumericFormat } from "react-number-format";
import { jsPDF } from "jspdf";

const formSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  reference: z.string().min(1, "Referência é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
});

const ReceiptForm = () => {
  const { payeeId } = useParams();
  const navigate = useNavigate();

  const { data: payee, isLoading } = useQuery({
    queryKey: ["payee", payeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payees")
        .select("*")
        .eq("id", payeeId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      reference: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const generatePDF = async (values: z.infer<typeof formSchema>) => {
    const doc = new jsPDF();
    
    // Configurações do PDF
    doc.setFont("helvetica");
    doc.setFontSize(16);
    
    // Título
    doc.text("RECIBO DE PAGAMENTO", 105, 20, { align: "center" });
    
    // Valor
    doc.setFontSize(14);
    doc.text(`R$ ${values.amount}`, 105, 40, { align: "center" });
    
    // Texto principal
    doc.setFontSize(12);
    const text = `Recebemos da empresa Unova, CNPJ: XX.XXX.XXX/0001-XX, a quantia de ${values.amount} reais, referente a ${values.reference}.`;
    doc.text(text, 20, 60, { maxWidth: 170 });
    
    // Declaração
    doc.text("Para maior clareza firmamos o presente recibo dando plena, rasa e irrevogável quitação.", 20, 90);
    
    // Informações do beneficiário
    if (payee) {
      doc.text(`Nome: ${payee.full_name}`, 20, 120);
      doc.text(`Chave PIX: ${payee.pix_key}`, 20, 130);
      doc.text(`Banco: ${payee.bank_name}`, 20, 140);
      doc.text(`CPF: ${payee.cpf}`, 20, 150);
    }
    
    // Data e Local
    doc.text(`Goiânia, ${values.date}`, 20, 180);
    
    // Linha de assinatura
    doc.line(20, 200, 190, 200);
    if (payee) {
      doc.text(payee.full_name, 105, 210, { align: "center" });
      doc.text(payee.cpf, 105, 220, { align: "center" });
    }
    
    // Download do PDF
    doc.save("recibo.pdf");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await generatePDF(values);
      
      toast({
        title: "Recibo gerado com sucesso!",
        description: "O recibo foi gerado e baixado automaticamente.",
      });
      
      navigate("/receipts");
    } catch (error) {
      toast({
        title: "Erro ao gerar recibo",
        description: "Ocorreu um erro ao gerar o recibo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando dados do beneficiário...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  placeholder="Digite o valor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referência</FormLabel>
              <FormControl>
                <Input placeholder="Digite a referência do pagamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Gerar Recibo
        </Button>
      </form>
    </Form>
  );
};

export default ReceiptForm;