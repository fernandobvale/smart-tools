import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const budgetFormSchema = z.object({
  periodo: z.string().min(1, "Período é obrigatório"),
  faturamento: z.string().min(1, "Faturamento é obrigatório"),
  impostoPerc: z.string().min(1, "Percentual de impostos é obrigatório"),
  pessoasPerc: z.string().min(1, "Percentual de pessoas é obrigatório"),
  opexPerc: z.string().min(1, "Percentual de OPEX é obrigatório"),
  capexPerc: z.string().min(1, "Percentual de CAPEX é obrigatório"),
  investPerc: z.string().min(1, "Percentual de investimentos é obrigatório"),
  dv8Perc: z.string().min(1, "Percentual DV8 é obrigatório"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetForm({ open, onOpenChange }: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      periodo: "",
      faturamento: "",
      impostoPerc: "",
      pessoasPerc: "",
      opexPerc: "",
      capexPerc: "",
      investPerc: "",
      dv8Perc: "",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      // TODO: Implementar a lógica de salvar os dados
      console.log(data);
      toast.success("Lançamento criado com sucesso!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Erro ao criar lançamento");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="periodo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período (MM/AA)</FormLabel>
                  <FormControl>
                    <Input placeholder="01/24" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faturamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faturamento</FormLabel>
                  <FormControl>
                    <Input placeholder="R$ 0,00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="impostoPerc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual de Impostos</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pessoasPerc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual de Pessoas</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="opexPerc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual de OPEX</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capexPerc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual de CAPEX</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investPerc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual de Investimentos</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dv8Perc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual DV8</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}