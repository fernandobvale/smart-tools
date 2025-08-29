import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Course } from "./types";
import { TableActions } from "./TableActions";
import { TableRowActions } from "./TableRowActions";
import { CourseDetailsModal } from "./CourseDetailsModal";
import CustomPagination from "@/components/cpf-consulta/CustomPagination";
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

interface CourseTableProps {
  courses: Course[];
  onUpdate: () => void;
}

const ITEMS_PER_PAGE = 20;

export function CourseTable({ courses, onUpdate }: CourseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailsCourse, setDetailsCourse] = useState<Course | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = courses.slice(startIndex, endIndex);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(parseISO(dateString), 'dd/MM/yyyy');
  };

  const handleRowClick = (course: Course) => {
    setDetailsCourse(course);
    setIsDetailsModalOpen(true);
  };

  const totalValue = currentCourses.reduce((sum, course) => sum + Number(course.valor), 0);

  return (
    <>
      <TableActions
        selectedIds={selectedIds}
        courses={courses}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length === currentCourses.length && currentCourses.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds(currentCourses.map(course => course.id));
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
            {currentCourses.map((course) => (
              <TableRow 
                key={course.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(course)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowClick(course);
                  }
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                <TableCell>{formatDate(course.data_entrega)}</TableCell>
                <TableCell>R$ {Number(course.valor).toFixed(2)}</TableCell>
                <TableCell>{formatDate(course.data_pagamento)}</TableCell>
                <TableCell>{course.status_pagamento}</TableCell>
                <TableCell>{course.nome_editor}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <TableRowActions
                    course={course}
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    onUpdate={onUpdate}
                    onDeleteClick={setDeletingCourse}
                  />
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

      {totalPages > 1 && (
        <div className="mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <CourseDetailsModal
        course={detailsCourse}
        open={isDetailsModalOpen}
        onOpenChange={(open) => {
          setIsDetailsModalOpen(open);
          if (!open) {
            setDetailsCourse(null);
          }
        }}
      />

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