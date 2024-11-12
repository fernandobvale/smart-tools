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
import extenso from "extenso";

const formSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  reference: z.string().min(1, "Referência é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};

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
    
    // Adicionar logo
    const logoWidth = 50;
    const logoHeight = 25;
    const img = new Image();
    img.src = '/unova-logo.png';
    doc.addImage(img, 'PNG', 20, 20, logoWidth, logoHeight);
    
    // Configurações do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    
    // Título
    doc.text("RECIBO DE PAGAMENTO", 105, 30, { align: "center" });
    
    // Valor em destaque
    doc.setFontSize(14);
    doc.text(`R$ ${values.amount}`, 105, 45, { align: "center" });
    
    // Converter valor numérico para extenso
    const numericValue = parseFloat(values.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    const valueInWords = extenso(numericValue, { mode: 'currency' });
    
    // Texto principal
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const text = `Recebi(emos) de `;
    doc.text(text, 20, 65);
    
    // Empresa em negrito
    doc.setFont("helvetica", "bold");
    doc.text("Escola Web Unova Cursos Ltda", 20 + doc.getTextWidth(text), 65);
    
    // Continuar com CNPJ
    doc.setFont("helvetica", "normal");
    doc.text(` - CNPJ nº: 12.301.010/0001-46, a importância de `, 20 + doc.getTextWidth(text + "Escola Web Unova Cursos Ltda"), 65);
    
    // Valor por extenso em negrito
    doc.setFont("helvetica", "bold");
    doc.text(valueInWords, 20, 75);
    
    // Referência
    doc.setFont("helvetica", "normal");
    doc.text(" referente ", 20 + doc.getTextWidth(valueInWords), 75);
    
    // Referência em negrito
    doc.setFont("helvetica", "bold");
    doc.text(values.reference, 20 + doc.getTextWidth(valueInWords + " referente "), 75);
    
    // Segundo parágrafo
    doc.setFont("helvetica", "normal");
    doc.text("Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos,", 20, 95);
    doc.text("dando plena, rasa e irrevogável quitação, pelo valor recebido.", 20, 105);
    
    // Informações do beneficiário
    if (payee) {
      doc.text("Pagamento recebido por: ", 20, 125);
      doc.setFont("helvetica", "bold");
      doc.text(payee.full_name, 20 + doc.getTextWidth("Pagamento recebido por: "), 125);
      
      doc.setFont("helvetica", "normal");
      doc.text(" chave PIX: ", 20, 135);
      doc.setFont("helvetica", "bold");
      doc.text(payee.pix_key, 20 + doc.getTextWidth(" chave PIX: "), 135);
      
      doc.setFont("helvetica", "normal");
      doc.text(" - ", 20 + doc.getTextWidth(" chave PIX: " + payee.pix_key), 135);
      doc.setFont("helvetica", "bold");
      doc.text(payee.bank_name, 20 + doc.getTextWidth(" chave PIX: " + payee.pix_key + " - "), 135);
    }
    
    // Data
    doc.setFont("helvetica", "normal");
    doc.text(`Goiânia, ${formatDate(values.date)}`, 20, 155);
    
    // Linha de assinatura
    doc.line(20, 185, 190, 185);
    if (payee) {
      doc.setFont("helvetica", "bold");
      doc.text(payee.full_name, 105, 195, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(payee.cpf, 105, 205, { align: "center" });
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