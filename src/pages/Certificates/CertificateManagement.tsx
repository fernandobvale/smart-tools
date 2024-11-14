import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Certificate = {
  id: string;
  nome_aluno: string;
  email_aluno: string;
  status_envio: string;
  cidade_estado: string;
  codigo_rastreio: string | null;
  numero_pedido: string;
};

export default function CertificateManagement() {
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [trackingCode, setTrackingCode] = useState("");

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

      toast({
        title: "Código de rastreio atualizado",
        description: "Os certificados foram atualizados com sucesso.",
      });

      setTrackingCode("");
      setSelectedCertificates([]);
      refetch();
    } catch (error) {
      console.error("Error updating tracking code:", error);
      toast({
        title: "Erro ao atualizar código de rastreio",
        description: "Ocorreu um erro ao atualizar os certificados.",
        variant: "destructive",
      });
    }
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={selectedCertificates.length === 0}>
                Informar Rastreio
              </Button>
            </DialogTrigger>
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
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Certificados Não Enviados</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Nome do Aluno</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Localização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonShippedCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCertificates.includes(certificate.id)}
                        onCheckedChange={() =>
                          handleCheckboxChange(certificate.id)
                        }
                      />
                    </TableCell>
                    <TableCell>{certificate.nome_aluno}</TableCell>
                    <TableCell>{certificate.email_aluno}</TableCell>
                    <TableCell>{certificate.status_envio}</TableCell>
                    <TableCell>{certificate.cidade_estado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Certificados Enviados</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Aluno</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Código de Rastreio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippedCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{certificate.nome_aluno}</TableCell>
                    <TableCell>{certificate.status_envio}</TableCell>
                    <TableCell>{certificate.cidade_estado}</TableCell>
                    <TableCell>{certificate.codigo_rastreio}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}