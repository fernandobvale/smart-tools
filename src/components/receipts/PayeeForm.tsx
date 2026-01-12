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
import { supabase } from "@/integrations/supabase/client";
import { PatternFormat } from "react-number-format";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  pix_key: z.string().min(1, "Chave PIX é obrigatória"),
  bank_name: z.string().min(1, "Nome do banco é obrigatório"),
});

interface PayeeFormProps {
  payee?: {
    id: string;
    full_name: string;
    cpf: string;
    pix_key: string;
    bank_name: string;
  };
  mode?: "create" | "edit";
  onClose?: () => void;
  onSuccess?: () => void;
}

const PayeeForm = ({ payee, mode = "create", onClose, onSuccess }: PayeeFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: payee?.full_name || "",
      cpf: payee?.cpf || "",
      pix_key: payee?.pix_key || "",
      bank_name: payee?.bank_name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === "edit" && payee) {
        const { error } = await supabase
          .from("payees")
          .update(values)
          .eq("id", payee.id);

        if (error) {
          if (error.code === "23505") {
            throw new Error("Este CPF já está cadastrado para outro beneficiário.");
          }
          throw error;
        }

        toast({
          title: "Beneficiário atualizado",
          description: "Os dados do beneficiário foram atualizados com sucesso!",
        });
      } else {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Você precisa estar autenticado para cadastrar um beneficiário.");
        }

        const { error } = await supabase.from("payees").insert({
          full_name: values.full_name,
          cpf: values.cpf,
          pix_key: values.pix_key,
          bank_name: values.bank_name,
          user_id: user.id
        });

        if (error) {
          if (error.code === "23505") {
            throw new Error("Este CPF já está cadastrado para outro beneficiário.");
          }
          throw error;
        }

        toast({
          title: "Beneficiário cadastrado",
          description: "O beneficiário foi cadastrado com sucesso!",
        });

        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      }

      queryClient.invalidateQueries({ queryKey: ["payees"] });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o beneficiário.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <PatternFormat
                  customInput={Input}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  placeholder="Digite o CPF"
                  format="###.###.###-##"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pix_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave PIX</FormLabel>
              <FormControl>
                <Input placeholder="Digite a chave PIX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Banco</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do banco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {mode === "edit" ? "Salvar Alterações" : "Cadastrar Beneficiário"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PayeeForm;