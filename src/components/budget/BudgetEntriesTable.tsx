import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface Entry {
  id: string;
  date: string;
  amount: number;
  expense: {
    name: string;
  };
}

interface BudgetEntriesTableProps {
  entries: Entry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BudgetEntriesTable({ entries, onEdit, onDelete }: BudgetEntriesTableProps) {
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount), 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Despesa</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{format(new Date(entry.date), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{entry.expense.name}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(entry.amount)}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(entry.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">{formatCurrency(total)}</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}