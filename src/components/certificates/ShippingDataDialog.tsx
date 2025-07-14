import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Certificate {
  id: string;
  nome_aluno: string;
  email_aluno: string;
  canal_contato: string;
  status_pagamento: string;
  dados_confirmados: boolean;
  endereco: string;
  complemento: string | null;
  bairro: string;
  cidade_estado: string;
  cep: string;
  status_envio: string;
  site_referencia: string;
  numero_pedido: string;
  codigo_rastreio: string | null;
  quantidade: number;
  observacoes: string | null;
}

interface ShippingDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: Certificate | null;
  onSuccess?: () => void;
}

export function ShippingDataDialog({
  open,
  onOpenChange,
  certificate,
  onSuccess,
}: ShippingDataDialogProps) {
  const [formData, setFormData] = useState<Partial<Certificate>>({});

  useEffect(() => {
    if (certificate) {
      setFormData(certificate);
    }
  }, [certificate]);

  if (!certificate) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          canal_contato: formData.canal_contato,
          status_pagamento: formData.status_pagamento,
          endereco: formData.endereco,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade_estado: formData.cidade_estado,
          cep: formData.cep,
          status_envio: formData.status_envio,
          site_referencia: formData.site_referencia,
          numero_pedido: formData.numero_pedido,
          codigo_rastreio: formData.codigo_rastreio,
          quantidade: formData.quantidade,
          observacoes: formData.observacoes,
        })
        .eq("id", certificate.id);

      if (error) throw error;

      toast.success("Dados atualizados com sucesso!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating shipping data:", error);
      toast.error("Erro ao atualizar dados");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                value={formData.nome_aluno || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_aluno">E-mail</Label>
              <Input
                id="email_aluno"
                name="email_aluno"
                type="email"
                value={formData.email_aluno || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canal_contato">Canal de Contato</Label>
              <Input
                id="canal_contato"
                name="canal_contato"
                value={formData.canal_contato || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status_pagamento">Status do Pagamento</Label>
              <Input
                id="status_pagamento"
                name="status_pagamento"
                value={formData.status_pagamento || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco || ""}
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
                value={formData.bairro || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade_estado">Cidade/Estado</Label>
              <Input
                id="cidade_estado"
                name="cidade_estado"
                value={formData.cidade_estado || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status_envio">Status do Envio</Label>
              <Input
                id="status_envio"
                name="status_envio"
                value={formData.status_envio || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_referencia">Site de Referência</Label>
              <Input
                id="site_referencia"
                name="site_referencia"
                value={formData.site_referencia || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_pedido">Número do Pedido</Label>
              <Input
                id="numero_pedido"
                name="numero_pedido"
                value={formData.numero_pedido || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo_rastreio">Código de Rastreio</Label>
              <Input
                id="codigo_rastreio"
                name="codigo_rastreio"
                value={formData.codigo_rastreio || ""}
                onChange={handleInputChange}
                placeholder="Informe o código de rastreio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                value={formData.quantidade || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes || ""}
              onChange={handleInputChange}
            />
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