import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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
}

export const CertificateTable = ({
  certificates,
  selectedCertificates,
  onCheckboxChange,
  showCheckboxes = true,
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
          {!showCheckboxes && <TableHead>Código de Rastreio</TableHead>}
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
            {!showCheckboxes && <TableCell>{certificate.codigo_rastreio}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};