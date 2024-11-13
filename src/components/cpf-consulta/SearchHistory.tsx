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
    saldo: string;
    created_at: string;
  }>;
  isLoading: boolean;
}

const SearchHistory = ({ data, isLoading }: SearchHistoryProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">CPF</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-[100px]">Saldo</TableHead>
            <TableHead className="hidden sm:table-cell">Data da Consulta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{formatCPF(item.cpf)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{item.nome}</TableCell>
              <TableCell>{item.saldo}</TableCell>
              <TableCell className="hidden sm:table-cell">
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