import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Course } from "./types";

interface CourseDetailsModalProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailsModal({ course, open, onOpenChange }: CourseDetailsModalProps) {
  if (!course) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(parseISO(dateString), 'dd/MM/yyyy');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Curso</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Nome:</label>
            <div className="col-span-3 text-sm">{course.nome_curso}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Aulas:</label>
            <div className="col-span-3 text-sm">{course.numero_aulas}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Entrega:</label>
            <div className="col-span-3 text-sm">{formatDate(course.data_entrega)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Valor:</label>
            <div className="col-span-3 text-sm">{formatCurrency(Number(course.valor))}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Pagamento:</label>
            <div className="col-span-3 text-sm">{formatDate(course.data_pagamento)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Status:</label>
            <div className="col-span-3 text-sm">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                course.status_pagamento === 'Pago' 
                  ? 'bg-green-100 text-green-800' 
                  : course.status_pagamento === 'Cancelado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.status_pagamento}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Editor:</label>
            <div className="col-span-3 text-sm">{course.nome_editor}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}