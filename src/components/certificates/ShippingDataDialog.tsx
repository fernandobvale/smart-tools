import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Certificate {
  id: string;
  nome_aluno: string;
  email_aluno: string;
  endereco: string;
  complemento: string | null;
  bairro: string;
  cidade_estado: string;
  cep: string;
  numero_pedido: string;
  site_referencia: string;
}

interface ShippingDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: Certificate | null;
}

export function ShippingDataDialog({
  open,
  onOpenChange,
  certificate,
}: ShippingDataDialogProps) {
  const [formData, setFormData] = useState<Partial<Certificate>>(certificate || {});

  if (!certificate) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("certificates")
        .update({
          nome_aluno: formData.nome_aluno,
          email_aluno: formData.email_aluno,
          endereco: formData.endereco,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade_estado: formData.cidade_estado,
          cep: formData.cep,
          site_referencia: formData.site_referencia,
        })
        .eq("id", certificate.id);

      if (error) throw error;

      toast.success("Dados atualizados com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating shipping data:", error);
      toast.error("Erro ao atualizar dados");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dados de Envio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_aluno">Nome do Aluno</Label>
              <Input
                id="nome_aluno"
                name="nome_aluno"
                value={formData.nome_aluno}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_aluno">E-mail</Label>
              <Input
                id="email_aluno"
                name="email_aluno"
                type="email"
                value={formData.email_aluno}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                name="complemento"
                value={formData.complemento || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade_estado">Cidade/Estado</Label>
              <Input
                id="cidade_estado"
                name="cidade_estado"
                value={formData.cidade_estado}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_referencia">Site de Referência</Label>
              <Input
                id="site_referencia"
                name="site_referencia"
                value={formData.site_referencia}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}