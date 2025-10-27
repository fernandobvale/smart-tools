import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NewCourse } from "./types";
import { NewCourseForm } from "./NewCourseForm";
import { format } from "date-fns";

interface NewCourseTableProps {
  courses: NewCourse[];
  onRefresh: () => void;
}

export function NewCourseTable({ courses, onRefresh }: NewCourseTableProps) {
  const [editingCourse, setEditingCourse] = useState<NewCourse | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "Atualizar":
        return "bg-yellow-500 text-black hover:bg-yellow-600";
      case "Atualizando":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "Concluido":
        return "bg-green-500 text-white hover:bg-green-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const handleDelete = async () => {
    if (!deletingCourseId) return;

    try {
      const { error } = await supabase
        .from("new_courses")
        .delete()
        .eq("id", deletingCourseId);

      if (error) throw error;

      toast.success("Curso excluído com sucesso!");
      onRefresh();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast.error("Erro ao excluir curso. Tente novamente.");
    } finally {
      setDeletingCourseId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Curso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Professor</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum curso encontrado
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.curso}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(course.status)}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.professor}</TableCell>
                  <TableCell>{format(new Date(course.created_at), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCourseId(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <NewCourseForm
              course={editingCourse}
              onSuccess={() => {
                setEditingCourse(null);
                onRefresh();
              }}
              onCancel={() => setEditingCourse(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCourseId} onOpenChange={() => setDeletingCourseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
