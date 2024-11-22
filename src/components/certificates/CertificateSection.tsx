import { CertificateTable } from "./CertificateTable";
import { SearchInput } from "./SearchInput";
import { useState } from "react";

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

interface CertificateSectionProps {
  title: string;
  certificates: Certificate[];
  selectedCertificates: string[];
  onCheckboxChange: (id: string) => void;
  showCheckboxes?: boolean;
  showSearch?: boolean;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export const CertificateSection = ({
  title,
  certificates,
  selectedCertificates,
  onCheckboxChange,
  showCheckboxes = true,
  showSearch = false,
  onEdit,
  onDelete,
}: CertificateSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCertificates = searchTerm
    ? certificates.filter(
        (cert) =>
          cert.nome_aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.email_aluno.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : certificates;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {showSearch && (
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome ou e-mail..."
        />
      )}
      <div className="border rounded-lg">
        <CertificateTable
          certificates={filteredCertificates}
          selectedCertificates={selectedCertificates}
          onCheckboxChange={onCheckboxChange}
          showCheckboxes={showCheckboxes}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};