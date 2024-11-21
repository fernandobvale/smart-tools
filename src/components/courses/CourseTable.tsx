import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDown, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CourseForm } from "./CourseForm";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { BulkActions } from "./BulkActions";
import { generatePDFReport } from "@/utils/pdfReport";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  nome_curso: string;
  numero_aulas: number;
  data_entrega: string;
  valor: number;
  data_pagamento: string | null;
  status_pagamento: "Pendente" | "Pago" | "Cancelado";
  nome_editor: string;
}

interface CourseTableProps {
  courses: Course[];
  onUpdate: () => void;
}

export function CourseTable({ courses, onUpdate }: CourseTableProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleDelete = async () => {
    if (!deletingCourse) return;

    try {
      const { error } = await supabase
        .from("cursos")
        .delete()
        .eq("id", deletingCourse.id);

      if (error) throw error;

      toast.success("Curso excluído com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Erro ao excluir o curso. Tente novamente.");
    } finally {
      setDeletingCourse(null);
    }
  };

  const handleMarkAsPaid = async (date: string) => {
    try {
      const { error } = await supabase
        .from("cursos")
        .update({
          status_pagamento: "Pago",
          data_pagamento: date,
        })
        .in("id", selectedIds);

      if (error) throw error;

      toast.success("Cursos atualizados com sucesso!");
      setSelectedIds([]);
      onUpdate();
    } catch (error) {
      console.error("Error updating courses:", error);
      toast.error("Erro ao atualizar os cursos. Tente novamente.");
    }
  };

  const totalValue = courses.reduce((sum, course) => sum + Number(course.valor), 0);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <BulkActions
          selectedIds={selectedIds}
          onMarkAsPaid={handleMarkAsPaid}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length === courses.length && courses.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds(courses.map(course => course.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Nome do Curso</TableHead>
              <TableHead>Número de Aulas</TableHead>
              <TableHead>Data de Entrega</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data do Pagamento</TableHead>
              <TableHead>Status de Pagamento</TableHead>
              <TableHead>Editor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(course.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds([...selectedIds, course.id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== course.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{course.nome_curso}</TableCell>
                <TableCell>{course.numero_aulas}</TableCell>
                <TableCell>{new Date(course.data_entrega).toLocaleDateString()}</TableCell>
                <TableCell>R$ {Number(course.valor).toFixed(2)}</TableCell>
                <TableCell>
                  {course.data_pagamento
                    ? new Date(course.data_pagamento).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{course.status_pagamento}</TableCell>
                <TableCell>{course.nome_editor}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingCourse(course)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Curso</DialogTitle>
                        </DialogHeader>
                        {editingCourse && (
                          <CourseForm
                            initialData={editingCourse}
                            onSuccess={() => {
                              setIsEditDialogOpen(false);
                              onUpdate();
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletingCourse(course)}
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
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell>R$ {totalValue.toFixed(2)}</TableCell>
              <TableCell colSpan={4} />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <AlertDialog open={!!deletingCourse} onOpenChange={() => setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}