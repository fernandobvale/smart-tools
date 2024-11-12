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
import { generateReceiptPDF } from "@/utils/pdfGenerator";

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!payee) {
        throw new Error("Dados do beneficiário não encontrados");
      }

      const success = await generateReceiptPDF({
        ...values,
        payee,
      });

      if (!success) {
        throw new Error("Erro ao gerar o PDF do recibo");
      }

      toast({
        title: "Recibo gerado com sucesso!",
        description: "O recibo foi gerado e baixado automaticamente.",
      });
      
      navigate("/receipts");
    } catch (error) {
      console.error("Erro ao gerar recibo:", error);
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