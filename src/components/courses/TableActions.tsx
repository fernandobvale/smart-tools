import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { BulkActions } from "./BulkActions";
import { generatePDFReport } from "@/utils/pdfReport";
import { Course } from "./types";

interface TableActionsProps {
  selectedIds: string[];
  courses: Course[];
  onMarkAsPaid: (date: string) => void;
}

export function TableActions({ selectedIds, courses, onMarkAsPaid }: TableActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <BulkActions
        selectedIds={selectedIds}
        onMarkAsPaid={onMarkAsPaid}
      />
      <Button
        variant="outline"
        onClick={() => generatePDFReport(courses)}
        disabled={courses.length === 0}
      >
        <FileDown className="h-4 w-4 mr-2" />
        Baixar Relatório
      </Button>
    </div>
  );
}