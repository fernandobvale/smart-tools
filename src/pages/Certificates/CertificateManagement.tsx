import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CertificateSection } from "@/components/certificates/CertificateSection";
import { ShippingDataDialog } from "@/components/certificates/ShippingDataDialog";

interface Certificate {
  id: string;
  nome_aluno: string;
  email_aluno: string;
  canal_contato: string;
  status_pagamento: string;
  dados_confirmados: boolean;
  status_envio: string;
  cidade_estado: string;
  codigo_rastreio: string | null;
  numero_pedido: string;
  endereco: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  site_referencia: string;
  quantidade: number;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export default function CertificateManagement() {
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [trackingCode, setTrackingCode] = useState("");
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [isShippingDataDialogOpen, setIsShippingDataDialogOpen] = useState(false);

  const { data: certificates, refetch } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    },
  });

  const nonShippedCertificates = certificates?.filter(
    (cert) => !cert.codigo_rastreio
  ) || [];
  const shippedCertificates = certificates?.filter(
    (cert) => cert.codigo_rastreio
  ) || [];

  const handleCheckboxChange = (certificateId: string) => {
    setSelectedCertificates((prev) =>
      prev.includes(certificateId)
        ? prev.filter((id) => id !== certificateId)
        : [...prev, certificateId]
    );
  };

  const handleViewCertificates = () => {
    const selectedIds = selectedCertificates
      .map((id) => {
        const cert = certificates?.find((c) => c.id === id);
        return cert?.numero_pedido;
      })
      .filter(Boolean)
      .join(",");

    window.open(
      `https://www.unovacursos.com.br/admin/pedidos/certificados_selecionados/${selectedIds}`,
      "_blank"
    );
  };

  const handleViewLabels = () => {
    const selectedIds = selectedCertificates
      .map((id) => {
        const cert = certificates?.find((c) => c.id === id);
        return cert?.numero_pedido;
      })
      .filter(Boolean)
      .join(",");

    window.open(
      `https://www.unovacursos.com.br/admin/pedidos/etiquetas_selecionados/${selectedIds}`,
      "_blank"
    );
  };

  const handleTrackingSubmit = async () => {
    try {
      const { error } = await supabase
        .from("certificates")
        .update({ codigo_rastreio: trackingCode })
        .in("id", selectedCertificates);

      if (error) throw error;

      toast.success("Código de rastreio atualizado");
      setTrackingCode("");
      setSelectedCertificates([]);
      setIsTrackingDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating tracking code:", error);
      toast.error("Erro ao atualizar código de rastreio");
    }
  };

  const selectedCertificate = certificates?.find(
    (cert) => cert.id === selectedCertificates[0]
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Certificados</h1>
        <div className="space-x-2">
          <Button
            onClick={handleViewCertificates}
            disabled={selectedCertificates.length === 0}
          >
            Ver Certificados
          </Button>
          <Button
            onClick={handleViewLabels}
            disabled={selectedCertificates.length === 0}
          >
            Ver Etiquetas
          </Button>
          <Button
            onClick={() => setIsTrackingDialogOpen(true)}
            disabled={selectedCertificates.length === 0}
          >
            Informar Rastreio
          </Button>
          <Button
            onClick={() => setIsShippingDataDialogOpen(true)}
            disabled={selectedCertificates.length !== 1}
          >
            Dados de Envio
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <CertificateSection
          title="Certificados Não Enviados"
          certificates={nonShippedCertificates}
          selectedCertificates={selectedCertificates}
          onCheckboxChange={handleCheckboxChange}
          showCheckboxes={true}
          showSearch={false}
        />

        <CertificateSection
          title="Certificados Enviados"
          certificates={shippedCertificates}
          selectedCertificates={selectedCertificates}
          onCheckboxChange={handleCheckboxChange}
          showCheckboxes={false}
          showSearch={true}
        />
      </div>

      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informar Código de Rastreio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Digite o código de rastreio"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <Button onClick={handleTrackingSubmit} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShippingDataDialog
        open={isShippingDataDialogOpen}
        onOpenChange={setIsShippingDataDialogOpen}
        certificate={selectedCertificate}
      />
    </div>
  );
}