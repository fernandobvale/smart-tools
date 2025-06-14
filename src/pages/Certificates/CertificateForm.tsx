
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { ContactFields } from "@/components/certificates/form-fields/ContactFields";
import { PaymentFields } from "@/components/certificates/form-fields/PaymentFields";
import { AddressFields } from "@/components/certificates/form-fields/AddressFields";
import { ShippingFields } from "@/components/certificates/form-fields/ShippingFields";
import { useAuth } from "@/components/auth/AuthProvider";

const formSchema = z.object({
  email_aluno: z.string().email("Email inválido"),
  canal_contato: z.string().min(1, "Selecione um canal de contato"),
  status_pagamento: z.string().min(1, "Selecione o status do pagamento"),
  dados_confirmados: z.string().min(1, "Confirme os dados"),
  nome_aluno: z.string().min(1, "Nome é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade_estado: z.string().min(1, "Cidade e Estado são obrigatórios"),
  cep: z.string().min(8, "CEP inválido"),
  status_envio: z.string().min(1, "Selecione o status do envio"),
  site_referencia: z.string().min(1, "Selecione o site de referência"),
  numero_pedido: z.string().min(1, "Número do pedido é obrigatório"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
  observacoes: z.string().optional(),
});

export default function CertificateForm() {
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantidade: 1,
      email_aluno: "",
      canal_contato: "",
      status_pagamento: "",
      dados_confirmados: "",
      nome_aluno: "",
      endereco: "",
      complemento: "",
      bairro: "",
      cidade_estado: "",
      cep: "",
      status_envio: "",
      site_referencia: "",
      numero_pedido: "",
      observacoes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!user) {
        toast.error("Você precisa estar logado para enviar certificados.");
        return;
      }

      // Fix: map fields to correct types/values
      const mappedValues = {
        ...values,
        user_id: user.id,
        // "dados_confirmados" should be boolean, compare string to "Sim"
        dados_confirmados: values.dados_confirmados === "Sim",
        quantidade: Number(values.quantidade),
      };

      // All fields needed by Supabase are present in "values"

      const { error } = await supabase.from("certificates").insert(mappedValues);

      if (error) throw error;

      toast.success("Certificado registrado com sucesso!", {
        description: "Entre em contato com o Fernando Vale para dar continuidade ao processo!"
      });

      form.reset();

    } catch (error) {
      console.error("Error submitting certificate:", error);
      toast.error("Erro ao registrar certificado. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Send className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold text-center">
            Formulário Envio de Certificado
          </h1>
        </div>
        <Separator className="mb-8" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Informações de Contato</h2>
              <ContactFields form={form} />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Informações de Pagamento</h2>
              <PaymentFields form={form} />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Endereço</h2>
              <AddressFields form={form} />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Informações de Envio</h2>
              <ShippingFields form={form} />
            </div>

            <Button type="submit" className="w-full mt-8">
              Informar Dados
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
