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
      <div className="flex justify-center py-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhuma consulta encontrada
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px] px-2 sm:px-4">CPF</TableHead>
            <TableHead className="px-2 sm:px-4">Nome</TableHead>
            <TableHead className="w-[100px] px-2 sm:px-4">Saldo</TableHead>
            <TableHead className="hidden sm:table-cell">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium px-2 sm:px-4 text-xs sm:text-sm">
                {formatCPF(item.cpf)}
              </TableCell>
              <TableCell className="max-w-[150px] sm:max-w-[200px] truncate px-2 sm:px-4 text-xs sm:text-sm">
                {item.nome}
              </TableCell>
              <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                {item.saldo}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
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