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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { BudgetForm } from "./BudgetForm";

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
  categoryId: string;
  onUpdate: () => void;
}

export function BudgetEntriesTable({ entries, onEdit, onDelete, categoryId, onUpdate }: BudgetEntriesTableProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount), 0);

  const handleEditClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsEditDialogOpen(true);
  };

  return (
    <>
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
                    onClick={() => handleEditClick(entry)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lançamento</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <BudgetForm
              categoryId={categoryId}
              initialData={{
                date: selectedEntry.date,
                amount: selectedEntry.amount.toString(),
                expenseId: selectedEntry.id,
              }}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                onUpdate();
              }}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}