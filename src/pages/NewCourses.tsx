import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NewCourse } from "@/components/new-courses/types";
import { NewCourseForm } from "@/components/new-courses/NewCourseForm";
import { NewCourseTable } from "@/components/new-courses/NewCourseTable";
import { NewCourseFilters } from "@/components/new-courses/NewCourseFilters";

export default function NewCourses() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [professorFilter, setProfessorFilter] = useState("");

  const { data: courses = [], refetch } = useQuery({
    queryKey: ["new-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("new_courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NewCourse[];
    },
  });

  const filteredCourses = courses.filter((course) => {
    // Filtro de busca
    const matchesSearch = course.curso
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filtro de status
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = course.status !== "Concluido";
    } else if (statusFilter !== "all") {
      matchesStatus = course.status === statusFilter;
    }

    // Filtro de professor
    const matchesProfessor = professorFilter
      ? course.professor.toLowerCase().includes(professorFilter.toLowerCase())
      : true;

    return matchesSearch && matchesStatus && matchesProfessor;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Novos Cursos</CardTitle>
              <CardDescription>
                Gerencie o pipeline de novos cursos em desenvolvimento
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NewCourseFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            professorFilter={professorFilter}
            onProfessorFilterChange={setProfessorFilter}
          />

          <NewCourseTable courses={filteredCourses} onRefresh={refetch} />

          <div className="text-sm text-muted-foreground">
            Mostrando {filteredCourses.length} de {courses.length} cursos
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Curso</DialogTitle>
          </DialogHeader>
          <NewCourseForm
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              refetch();
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
