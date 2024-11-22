import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Certificate {
  id: string;
  nome_aluno: string;
  email_aluno: string;
  status_envio: string;
  cidade_estado: string;
  codigo_rastreio: string | null;
  numero_pedido: string;
  endereco: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  site_referencia: string;
}

interface CertificateTableProps {
  certificates: Certificate[];
  selectedCertificates: string[];
  onCheckboxChange: (id: string) => void;
  showCheckboxes?: boolean;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export const CertificateTable = ({
  certificates,
  selectedCertificates,
  onCheckboxChange,
  showCheckboxes = true,
  onEdit,
  onDelete,
}: CertificateTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showCheckboxes && <TableHead className="w-12"><Checkbox /></TableHead>}
          <TableHead>Nome do Aluno</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Localização</TableHead>
          <TableHead>Código de Rastreio</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {certificates.map((certificate) => (
          <TableRow key={certificate.id}>
            {showCheckboxes && (
              <TableCell>
                <Checkbox
                  checked={selectedCertificates.includes(certificate.id)}
                  onCheckedChange={() => onCheckboxChange(certificate.id)}
                />
              </TableCell>
            )}
            <TableCell>{certificate.nome_aluno}</TableCell>
            <TableCell>{certificate.email_aluno}</TableCell>
            <TableCell>{certificate.status_envio}</TableCell>
            <TableCell>{certificate.cidade_estado}</TableCell>
            <TableCell>{certificate.codigo_rastreio || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(certificate)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(certificate.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};