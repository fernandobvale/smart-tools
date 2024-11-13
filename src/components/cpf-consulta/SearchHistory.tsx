import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { formatCPF } from "@/lib/cpf-utils";

interface SearchHistoryProps {
  data: Array<{
    id: string;
    cpf: string;
    nome: string;
    result: string;
    created_at: string;
  }>;
  isLoading: boolean;
}

const SearchHistory = ({ data, isLoading }: SearchHistoryProps) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CPF</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead>Data da Consulta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{formatCPF(item.cpf)}</TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.result}</TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchHistory;